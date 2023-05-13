from ot_my_libs.myLoger import myLoger
from ot_my_libs.TimeHelper import *
import pymysql
import os
import time

class mysql_helper:

    def __init__(self, config = None):

        if config == None:
            config = {
                'host': 'nex7',
                'port': 3306,
                'user': 'ykpu',
                'passwd': 'pimpimpampam',
                'database': 'svoiysh',
                'maxBuf': 1024
                }

        self.conf = config
        #self.myl = myLoger( "mysql_helper", config.loger)
        self.myl = myLoger( "mysql_helper", {
                'info': True,
                'debug': True,
                'error': True,
                'critical': True
                } )

        self.struct = []
        self.con = None
        self.kur = None
        self.is_connected = False

        self.connect()


    def connect(self):
        self.myl.i("connecting...")
        self.con = pymysql.connect(
            host = self.conf['host'],
            user = self.conf['user'],
            password = self.conf['passwd'],
            db = self.conf['database'],
            cursorclass = pymysql.cursors.DictCursor
            )
        self.myl.i("connected :)")
        self.is_connected = True



    def one_value(self,table_name,what,where="1"):
        tr = self.select(table_name, what, "%s LIMIT 1" % where)
        if len(tr)>0:
            return tr[0][what]
        else:
            return None

    def one_row(self, table_name,where="1"):
        tr = self.select(table_name, "*", "%s LIMIT 1"%where)
        if len(tr)>0:
            return tr[0]
        else:
            return None

    def select(self, table_name, what="*", where="1"):
        q = "select %s from %s where %s" % ( what, table_name, where)
        c = self.con.cursor()
        c.execute(q)
        return c.fetchall()

    def insert(self,table_name, values):
        vNames = []
        val = []
        qu = []

        for v in values:
            vNames.append( f"`{v}`" )
            val.append(values[v])
            qu.append( '%s' )

        q0 = "insert into `%s` (%s) values (%s)" % (
                    table_name,
                    ",".join(vNames),
                    ",".join(qu)
                    )
        self.query(q0, val)
        return self.one_value(table_name, "id", "1 order by id desc")

    def insertMulti(self, tableName, data):
        '''
        data = {
            'head':['fName0', 'fName1, ....],
            'data':[
                [1 , 2, ...],
                [11, 12, ..],
                ....
                ]
            }
        '''
        vals = []
        valq = []
        for v in data['head']:
            vals.append(f"`{v}`")
            valq.append('%s')
        vals = ",".join(vals)
        valq = ",".join(valq)
        q = f"INSERT INTO `{tableName}` ({vals}) VALUES ({valq})"
        self.executemany(q, data['data'])


    def query(self,q0,q1=None):
        c = self.con.cursor()
        if q1 == None:
            res = c.execute(q0)
        else:
            res = c.execute(q0,q1)
        self.con.commit()

    def executemany(self, q0, q1):
        c = self.con.cursor()
        res = c.executemany(q0,q1)
        self.con.commit()
        return res


    def init_table(self):
        if len(self.struct) == 0:
            self.log.critical("you need to overwrite set_struct")
            return False

        for table in self.struct:
            tName = table
            item = self.struct[tName]
            fields = ["id INTEGER PRIMARY KEY"]
            for col in item:
                fields.append( "%s %s" % (col, item[col]) )

            q = "create table %s (%s)" % (tName, ",".join(fields))
            try:
                self.query(q)
            except:
                pass


'''
CREATE TABLE `dbSpeed` (
    `id` int(11) NOT NULL AUTO_INCREMENT,

    `v0` varchar(255) COLLATE utf8_bin NOT NULL,
    `v1` varchar(255) COLLATE utf8_bin NOT NULL,
    `v2` varchar(255) COLLATE utf8_bin NOT NULL,

    `entryDate` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
AUTO_INCREMENT=1 ;

'''


if __name__ == "__main__":
    import random

		if 0 :
	    mysql = {
        'host': 'nex7',
        'port': 3306,
        'user': 'ykpu',
        'passwd': 'pimpimpampam',
        'database': 'svoiysh',
        'maxBuf': 1024,
        'tableName': 'dbSpeed'
        }
    if 1 :
    	mysql = {
        'host': 'hu',
        'port': 3306,
        'user': 'ykpu',
        'passwd': 'pimpimpampam',
        'database': 'svoiysh',
        'maxBuf': 1024,
        'tableName': 'dbSpeed'
        }

    th = TimeHelper()
    db = mysql_helper(mysql)


    print('''what to do ?
1. - test insert speed one by one
2. - test insert speed one by one
    ''')

    print("enter action no:")
    act = input()
    #act = "2"
    print(f"got[{act}]")
    print("clean db first....")
    db.query(f"delete from {mysql['tableName']} where 1;")
    print("    done")
    count = 1000


    if act == '1' or act == '2':
        if act == '1':
            print(f"making test insert speed one by one {count} records")
        elif act == '2':
            print(f"making test insert speed one by one {count} records")

        print("starting test ....")
        bs = th.benStart()
        bsInAvg = 0.0

        if act == '1':
            for r in range(count):
                bsR = th.benStart()

                db.insert(mysql['tableName'], {
                    'v0': random.randrange(0,100),
                    'v1': random.randrange(0,100),
                    'v2': random.randrange(0,100),
                    'entryDate': int(time.time())
                    })

                bsInAvg+= th.benDone(bsR,onlyTime=True)

        elif act == '2':
            dta = {
                'head': ['v0', 'v1', 'v2','entryDate'],
                'data': []
                }

            bsDp = th.benStart()
            d = []
            for r in range(count):
                d.append( [
                    str(random.randrange(0,100)),
                    str(random.randrange(0,100)),
                    str(random.randrange(0,100)),
                    int(time.time())
                    ])
            dta['data'] = d
            bsDp = th.benDone(bsDp, onlyTime=True)

            bQp = th.benStart()
            vals = []
            valq = []
            for v in dta['head']:
                vals.append(f"`{v}`")
                valq.append('%s')
            vals = ",".join(vals)
            valq = ",".join(valq)
            q = f"INSERT INTO `{mysql['tableName']}` ({vals}) VALUES ({valq})"
            bQp = th.benDone(bQp, onlyTime=True)

            bsQe = th.benStart()
            db.executemany(q, dta['data'])
            bsQe = th.benDone(bsQe, onlyTime=True)

            print(f"data preparation {bsDp}")
            print(f"query preparation {bQp}")
            print(f"query {bsQe}")
            bsInAvg = 1.0


        th.benDone(bs, desc="total time", printIt=True)
        avgq = bsInAvg/count
        print(f"avg per query {avgq}")
        print("class test....")
        print("make the same but from mysql_helper")
        b = th.benStart()
        db.insertMulti(mysql['tableName'], dta)
        th.benDone(b, desc="from class", printIt=True)
