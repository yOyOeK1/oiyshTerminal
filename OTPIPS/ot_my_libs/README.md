# oiyshTerminal (pypips) -  ot_my_libs

  Set of function to speed up things like:

  * ArgsParse - to parse argument pass to app returns json
  * MyCalculate - trigonometry and other maths
  * db_helper - sqlite3 helper
  * myFastPlot - fast plot data with kivy
  * TimeHelper - to do operation on time 
  * myLoger - logging unifide 
  * XMLHelper
  * FileActions - file/dirs/path operations helper
  * myMqttClient
  * mysql_helper - mysql helper
  * example - use case of:
    * benchmarking - from TimeHelper
    * sqlite3 - from db_helper
    
  **important** - some of subs will want more dependencies then default so look for logs if there is any pip missing ( myFastPlot )
  
## check example

  In directory of library in my case is `/usr/lib/python3.8/site-packages`
    
  ```bash
  python3 ot_my_libs/example.py
  ```
  *this will run example use of bencharking uning `ot_my_libs.TimeHelper` and `sqlite3` using `ot_my_libs.db_helper` from the example to get you going :)*
	
  **or**
	
  [xdocs - more in depth](https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTPIPS/ot_my_libs/README_xdoc.md)


### example 
  
  **TimeHelper** use case as benchmarking tool

  ```python3
  from ot_my_libs.TimeHelper import TimeHelper as thd
  import time

  def benchmarkTimer():
      th = thd()
      bKey = th.benStart()
      print("making test run ...")
      time.sleep(1)
      th.benDone(
          bKey,
          f"Result of benStart / benDone [run at:{th.getNiceShortDate()}]", 
          printIt=True 
          )
  ```
  
  **db_helper** use case as fast sqlite3 init_table and CRUDish
  
  ```python3
  from ot_my_libs.db_helper import db_helper as dbh
  
  class mdb ( dbh ):
      ## set your structure of db / table
      def set_struct(self):
          self.struct = {
              'tableA' : { # your table name
                        'lat':     "float", # field 1 - name: lat type: float
                        'lon':     "float", # field 2 - name: lat type: float
                        }
              }
              
    db = mdb('/tmp/mdbTest1.db')

    # yes no initing strate to insert or ...
    print("inserting ....")
    insertRecordId = db.insert('tableA', {"lat":1.1,"lon":1.11} )

    print("select tableA ...")
    resA = db.select('tableA')
    print( resA )

    db.insert( 'tableA', {"lat":2.1,"lon":1.1} )
    print("select id,lat,lon from tableA where id=2 .....")
    # yes `id` column autoincremental is added automaticly 
    resB = db.select('tableA','id,lat,lon', 'id=2')
    print( resB )

    print("delete all ...")
    db.query('delete from tableA where 1')
    print("after delete ... select tableA")
    resC = db.select('tableA')
    print( resC )

  ```

## development of package - base line

  In directory of project to deploy `tree ot_my_libs`

  ```shell
  ot_my_libs
  ├── __init__.py
  ├── ArgsParse.py
  ├── example.py
  ├── db_helper.py
  ├── FileActions.py
  ├── MyCalculate.py
  ├── myFastPlot.py
  ├── myLoger.py
  ├── myMqttClient.py
  ├── mysql_helper.py
  ├── TimeHelper.py
  └── XMLHelper.py
  ```

### uninstalling it

  ```shell
  pip3 uninstall ot_my_libs
  ```

### TODO 
  
  - [ ] more examples
  - [ ] more def xdoc descriptions

### change log

 * 0.0.11
   - fix some README errors parsing and ... 

 * 0.0.10
   - ArgsParse to parse argument comming at start of app
   - myLoger have more colors to select and new `defColor` argument
   - add `change log` in README :)
    
    

---

If you see that this makes sense [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS) | [Master repository](https://github.com/yOyOeK1/oiyshTerminal) | [About SvOiysh](https://www.youtube.com/@svoiysh)

