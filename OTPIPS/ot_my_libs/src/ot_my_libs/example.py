


# using TimeHelper as benchmark timer ...
from ot_my_libs.TimeHelper import TimeHelper as thd
import time


def benchmarkTimer():

    th = thd()

    bKey = th.benStart()

    print("making test run ...")
    time.sleep(1)

    th.benDone(
        bKey,
        f"Result of benStart / benDone [run at:{th.getNiceShortDate()}]", printIt=True )


# using db_helper
from ot_my_libs.db_helper import db_helper as dbh
class mdb ( dbh ):
    ## set your structure of db / table
    def set_struct(self):
        self.struct = {
            'tableA' : {
                      'lat':     "float",
                      'lon':     "float",
                      }
            }
def dbHelperExample():
    db = mdb('/tmp/mdbTest1.db')

    print("select tableA ... ")
    print( db.select('tableA') )

    print("inserting ....")
    insertRecordId = db.insert('tableA', {"lat":1.1,"lon":1.1} )

    print("select tableA ...")
    resA = db.select('tableA')
    print(resA)

    db.insert( 'tableA', {"lat":2.1,"lon":1.1} )
    print("select id,lat,lon from tableA where id=2 .....")
    print(db.select('tableA','id,lat,lon', 'id=2'))

    print("delete all ...")
    db.query('delete from tableA where 1')
    print("after delete ... select tableA")
    print(db.select('tableA'))


def testRunAll():
    print("can show some examples .....")
    print("- benchmarkTimer")
    benchmarkTimer()
    print("- db_helper making instance of db ...")
    dbHelperExample()

if __name__ == "__main__":
    testRunAll()
