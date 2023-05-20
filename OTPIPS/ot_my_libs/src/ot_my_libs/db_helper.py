from ot_my_libs.myLoger import myLoger as mlog
import sqlite3
import os
from ot_my_libs.FileActions import *

class db_helper:
    
    def __init__(self, pathToDb = None):
        
        try:
            a = self.log.silenc
        except:
            self.log = mlog( "db_helper", 
                silenc={
                    'info': True,
                    'debug': True,
                    'error': True,
                    'critical': True
                    })
    
        
        print("pathToDB is [{}]".format(pathToDb))
        if pathToDb:
            print("pathTo{}".format(pathToDb))
            self.db_at_file = pathToDb
        else:
            self.db_at_file = self.get_filePath()
            print("no path so use{}".format(self.db_at_file))
        
        self.fa = FileActions()
        self.struct = []
        self.conn = None
        
        self.set_struct()
        self.init_table()
        
    # shoud be overrite
    def get_filePath(self):
        self.log.info("get_filePath ~/db_helper.db" )
        return self.fa.t("~/db_helper.db")
    
    # shoud be overrite    
    def set_struct(self):
        print("db_helper is def overrit it !")
        exampleCanBe="""
        self.struct = {
            'wiki' : {
                      'lat':     "float",
                      'lon':     "float",
                      'title':   "text",
                      'summary': "text",
                      'url':     "text",
                      'rank':    "int"                      
                      }
            }

    """
    
    
    
    
    
    
    
    
    
    
    
    
    
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
        c = self.connect()
        res = c.execute(q)
        col_name_list = [tuple[0] for tuple in c.description]
        tr = []
        for row in res:
            a = {}
            for i,col in enumerate(col_name_list):
                a[col] = row[i]
            tr.append(a)
        self.close(c)            
        return tr
    
    def insert(self,table_name, values):
        vNames = []
        val = []
        qu = []
        
        for v in values:
            vNames.append( v )
            val.append(values[v])
            qu.append( "?" )            
    
        q0 = "insert into %s (%s) values (%s)" % (
                    table_name,
                    ",".join(vNames),
                    ",".join(qu)
                    )
        self.query(q0, val)
        return self.one_value(table_name, "id", "1 order by id desc")
    
    def query(self,q0,q1=None):
        c = self.connect()
        if q1 == None:
            res = c.execute(q0)
        else:
            res = c.execute(q0,q1)
        self.conn.commit()        
        self.close(c)
        
    def connect(self):
        self.conn = sqlite3.connect(self.db_at_file)
        return self.conn.cursor()
    
    def close(self,c):
        c.close()
        
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
        
        
        
        
    
