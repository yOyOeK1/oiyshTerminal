


# using TimeHelper as benchmark timer ...
from ot_my_libs.TimeHelper import TimeHelper as thd
import time


def benchmarkTimer():
    """
    **TimeHelper** as benchmark timer ...
    """

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
    """
    **db_helper** needs - overiting ours data structure and types
    """
    ## set your structure of db / table
    def set_struct(self):
        self.struct = {
            'tableA' : {
                      'lat':     "float",
                      'lon':     "float",
                      }
            }


def dbHelperExample():
    """
    **db_helper** example use case: from init, to inser, more inserts, some selections ...
    """

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

# using PlugsHelper
from ot_my_libs.PlugsHelper import *
def PlugsHelperExampleTest():
    """
    **PlugsHelperExample** example use look up for files / dirs to load as plugins ...

    ## with filter
      To have custom filter on what not to ...
      ```python3
      def phYesNo( nameTest ):
          if nameTest == "otdmDriverManager.py":
              return False
          elif nameTest[-8:] == "Proto.py":
              return False
          else:
              return True

      ph = PlugsHelper()
      plugs = ph.lookForDrivers( "otdmDriver", ".py", phYesNo ):
      ```
    """
    PlugsHelperExample()


def testRunAll():
    """
    will run them all so you can see it in action
    """

    print("can show some examples .....")
    print("- benchmarkTimer")
    benchmarkTimer()
    print("- db_helper making instance of db ...")
    PlugsHelperExampleTest()
    print("- PlugsHelper test run ...")
    PlugsHelperExample()

if __name__ == "__main__":
    testRunAll()
