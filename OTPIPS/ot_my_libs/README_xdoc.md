# Table of Contents

* [ot\_my\_libs](#ot_my_libs)
* [ot\_my\_libs.ArgsParse](#ot_my_libs.ArgsParse)
* [ot\_my\_libs.PlugsHelperTest\_plug2\_a](#ot_my_libs.PlugsHelperTest_plug2_a)
* [ot\_my\_libs.PlugsHelperTest\_plug1\_a](#ot_my_libs.PlugsHelperTest_plug1_a)
* [ot\_my\_libs.example](#ot_my_libs.example)
  * [benchmarkTimer](#ot_my_libs.example.benchmarkTimer)
  * [mdb](#ot_my_libs.example.mdb)
  * [dbHelperExample](#ot_my_libs.example.dbHelperExample)
  * [PlugsHelperExampleTest](#ot_my_libs.example.PlugsHelperExampleTest)
  * [testRunAll](#ot_my_libs.example.testRunAll)
* [ot\_my\_libs.myMqttClient](#ot_my_libs.myMqttClient)
* [ot\_my\_libs.myLoger](#ot_my_libs.myLoger)
* [ot\_my\_libs.MyCalculate](#ot_my_libs.MyCalculate)
* [ot\_my\_libs.XMLHelper](#ot_my_libs.XMLHelper)
* [ot\_my\_libs.myFastPlot](#ot_my_libs.myFastPlot)
* [ot\_my\_libs.FileActions](#ot_my_libs.FileActions)
  * [FileActions](#ot_my_libs.FileActions.FileActions)
    * [getHomeDirectoryForApp](#ot_my_libs.FileActions.FileActions.getHomeDirectoryForApp)
    * [loadFile](#ot_my_libs.FileActions.FileActions.loadFile)
    * [join](#ot_my_libs.FileActions.FileActions.join)
    * [t](#ot_my_libs.FileActions.FileActions.t)
* [ot\_my\_libs.TimeHelper](#ot_my_libs.TimeHelper)
* [ot\_my\_libs.mysql\_helper](#ot_my_libs.mysql_helper)
  * [mysql\_helper](#ot_my_libs.mysql_helper.mysql_helper)
    * [is\_connected](#ot_my_libs.mysql_helper.mysql_helper.is_connected)
    * [\_\_init\_\_](#ot_my_libs.mysql_helper.mysql_helper.__init__)
    * [connect](#ot_my_libs.mysql_helper.mysql_helper.connect)
    * [one\_value](#ot_my_libs.mysql_helper.mysql_helper.one_value)
    * [one\_row](#ot_my_libs.mysql_helper.mysql_helper.one_row)
    * [select](#ot_my_libs.mysql_helper.mysql_helper.select)
    * [insert](#ot_my_libs.mysql_helper.mysql_helper.insert)
    * [insertMulti](#ot_my_libs.mysql_helper.mysql_helper.insertMulti)
* [ot\_my\_libs.PlugsHelper](#ot_my_libs.PlugsHelper)
  * [PlugsHelper](#ot_my_libs.PlugsHelper.PlugsHelper)
    * [\_\_init\_\_](#ot_my_libs.PlugsHelper.PlugsHelper.__init__)
    * [dirPlugs](#ot_my_libs.PlugsHelper.PlugsHelper.dirPlugs)
    * [lookForDrivers](#ot_my_libs.PlugsHelper.PlugsHelper.lookForDrivers)
  * [PlugsHelperExample](#ot_my_libs.PlugsHelper.PlugsHelperExample)
* [ot\_my\_libs.PlugsHelperTest\_plug3\_a](#ot_my_libs.PlugsHelperTest_plug3_a)
* [ot\_my\_libs.db\_helper](#ot_my_libs.db_helper)

<a id="ot_my_libs"></a>

# ot\_my\_libs

<a id="ot_my_libs.ArgsParse"></a>

# ot\_my\_libs.ArgsParse

<a id="ot_my_libs.PlugsHelperTest_plug2_a"></a>

# ot\_my\_libs.PlugsHelperTest\_plug2\_a

<a id="ot_my_libs.PlugsHelperTest_plug1_a"></a>

# ot\_my\_libs.PlugsHelperTest\_plug1\_a

<a id="ot_my_libs.example"></a>

# ot\_my\_libs.example

<a id="ot_my_libs.example.benchmarkTimer"></a>

#### benchmarkTimer

```python
def benchmarkTimer()
```

**TimeHelper** as benchmark timer ...

<a id="ot_my_libs.example.mdb"></a>

## mdb Objects

```python
class mdb(dbh)
```

**db_helper** needs - overiting ours data structure and types

<a id="ot_my_libs.example.dbHelperExample"></a>

#### dbHelperExample

```python
def dbHelperExample()
```

**db_helper** example use case: from init, to inser, more inserts, some selections ...

<a id="ot_my_libs.example.PlugsHelperExampleTest"></a>

#### PlugsHelperExampleTest

```python
def PlugsHelperExampleTest()
```

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

<a id="ot_my_libs.example.testRunAll"></a>

#### testRunAll

```python
def testRunAll()
```

will run them all so you can see it in action

<a id="ot_my_libs.myMqttClient"></a>

# ot\_my\_libs.myMqttClient

<a id="ot_my_libs.myLoger"></a>

# ot\_my\_libs.myLoger

<a id="ot_my_libs.MyCalculate"></a>

# ot\_my\_libs.MyCalculate

<a id="ot_my_libs.XMLHelper"></a>

# ot\_my\_libs.XMLHelper

<a id="ot_my_libs.myFastPlot"></a>

# ot\_my\_libs.myFastPlot

<a id="ot_my_libs.FileActions"></a>

# ot\_my\_libs.FileActions

<a id="ot_my_libs.FileActions.FileActions"></a>

## FileActions Objects

```python
class FileActions()
```

File Actions and operations helper set

<a id="ot_my_libs.FileActions.FileActions.getHomeDirectoryForApp"></a>

#### getHomeDirectoryForApp

```python
def getHomeDirectoryForApp(appName, platform='pc')
```

To make home directory for your app fast on pc / python-for-android. It will look and if not exist `make directory` for your app.

__Arguments__

- __**appName** _string___: name of your app 
- __**values** _json___: look format multi ..

__Returns __

  __string__ `path` to your app directory
  **or**
  None on error

<a id="ot_my_libs.FileActions.FileActions.loadFile"></a>

#### loadFile

```python
def loadFile(filePath)
```

__Arguments__

- __**filePath** _string___: path to file to load

__Returns __

  __array__ content of loaded file line by line
  **or**
  None on error

<a id="ot_my_libs.FileActions.FileActions.join"></a>

#### join

```python
def join(adr0, adr1)
```

path join solvs `/` **or** `\` problem using os library

__Arguments__

- __**adr0** _string___: more to root path 
- __**adr1** _string___: deeper path

__Returns __

  __string__ `path` joind
  **or**
  None on error

<a id="ot_my_libs.FileActions.FileActions.t"></a>

#### t

```python
def t(path)
```

is to convert `~/` to full path
__Arguments__

- __**path** _string___: path to make safe

__Returns __

  __string__ `safe` path

<a id="ot_my_libs.TimeHelper"></a>

# ot\_my\_libs.TimeHelper

<a id="ot_my_libs.mysql_helper"></a>

# ot\_my\_libs.mysql\_helper

<a id="ot_my_libs.mysql_helper.mysql_helper"></a>

## mysql\_helper Objects

```python
class mysql_helper()
```

Is to do mysql operation fast. Couple of lines and you can go ... 
## import library 
  ```python
  from ot_my_libs.mysql_helper import mysql_helper as mhd
  ```

<a id="ot_my_libs.mysql_helper.mysql_helper.is_connected"></a>

#### is\_connected

**is_connected**: __boolean__ - if connected to mysql

<a id="ot_my_libs.mysql_helper.mysql_helper.__init__"></a>

#### \_\_init\_\_

```python
def __init__(config=None)
```

__Arguments__

- __**client** _json___: connecting to mysql by `config`

## config example
  ```json
  config = {
- __'host'__: '192.168.43.1',
- __'port'__: 3306,
- __'user'__: 'ykpu',
- __'passwd'__: 'pimpimpampam',
- __'database'__: 'svoiysh',
- __'maxBuf'__: 1024
  }        
  db = mhd(config)
  ```

**db** __mysql_helper__ now is to your disposition with functions. After init it will `self.connect()`

<a id="ot_my_libs.mysql_helper.mysql_helper.connect"></a>

#### connect

```python
def connect()
```

To connect if you lost connection

<a id="ot_my_libs.mysql_helper.mysql_helper.one_value"></a>

#### one\_value

```python
def one_value(table_name, what, where="1")
```

To get one value from one record.
__Arguments__

- __**table_name** _string___: name of table to work on
- __**what** _string___: to put in place of `SELECT XXX FROM ...`
- __**where** _string___: to use it it where section 
*all cap with ` ... LIMIT 1;`*

__Returns __

  __string__ | __int__ | __float__

<a id="ot_my_libs.mysql_helper.mysql_helper.one_row"></a>

#### one\_row

```python
def one_row(table_name, where="1")
```

To get one record.

__Arguments__

- __**table_name** _string___: name of table to work on
- __**where** _string___: to use it it where section 

*all cap with ` ... LIMIT 1;`*

__Returns __

`__json__ with your data **example** `{'id'`: 1487658, 'msg': '34.7', 'entryDate': 1684009661}`

<a id="ot_my_libs.mysql_helper.mysql_helper.select"></a>

#### select

```python
def select(table_name, what="*", where="1")
```

To do `SELECT` on mysql

__Arguments__

- __**table_name** _string___: name of table to work on
- __**what** _string___: to put in place of `SELECT XXX FROM ...`
- __**where** _string___: to use it it where section 

*all cap with ` ... LIMIT 1;`*

__Returns __

  __cursor__.fetchall()

<a id="ot_my_libs.mysql_helper.mysql_helper.insert"></a>

#### insert

```python
def insert(table_name, values)
```

To **insert** to table

__Arguments__

- __**table_name** _string___: name of table to work on
- __**values** _json___: look format multi ..

__Returns __

  __int__ of inserted `id`

<a id="ot_my_libs.mysql_helper.mysql_helper.insertMulti"></a>

#### insertMulti

```python
def insertMulti(tableName, data)
```

To **insert** to table

__Arguments__

- __**table_name** _string___: name of table to work on
- __**data** _json___: look format multi ..

__data example__

  ```json
  data = {
    'head':['fName0', 'fName1, ....],
    'data':[
      [1 , 2, ...],
      [11, 12, ..],
      ....
      ]
    }
  ```

<a id="ot_my_libs.PlugsHelper"></a>

# ot\_my\_libs.PlugsHelper

<a id="ot_my_libs.PlugsHelper.PlugsHelper"></a>

## PlugsHelper Objects

```python
class PlugsHelper()
```

To play with plugins idea fast ...

__returns__ by default _array_ of _json_
```json
[
    {
        "o": `_def_` or _object_,
        "type": "driver",
        "cname": `_str_` string,
        "name": `_str_` string name
    }, ...
]
```

<a id="ot_my_libs.PlugsHelper.PlugsHelper.__init__"></a>

#### \_\_init\_\_

```python
def __init__(oAsInitObject=False, args=None, conf=None)
```

**oAsInitObject** _bool_ _default_ False - return ['o'] as init object with args,conf as argument or as definition to init
**args** - to pass to your plugin
**conf** - to pass to your plugin

<a id="ot_my_libs.PlugsHelper.PlugsHelper.dirPlugs"></a>

#### dirPlugs

```python
def dirPlugs(pPrefix, pDiffThen, extraPaths=None)
```

To look for library like by mache prefix and different then ...
**pPrefix** _str_ - need to mache to go to list
**pDiffThen** _str_|_filter_function - string is exact mache then no. If filter function arg as `name` is pass and your function need to return _bool_ on add it
**extraPaths** _array_ of _str_ - to add extra paths to look for

<a id="ot_my_libs.PlugsHelper.PlugsHelper.lookForDrivers"></a>

#### lookForDrivers

```python
def lookForDrivers(pPrefix, pSufix, pDiffThen, extraPaths=None)
```

To look for files in current library or paths by maching ...
**pPrefix** _str_ - need to mache to go to list
**pSufix** _str_ - need to mache to go to list
**pDiffThen** _str_|_filter_function - string is exact mache then no. If filter function arg as `name` is pass and your function need to return _bool_ on add it
**extraPaths** _array_ of _str_ - to add extra paths to look for

<a id="ot_my_libs.PlugsHelper.PlugsHelperExample"></a>

#### PlugsHelperExample

```python
def PlugsHelperExample()
```

**PlugsHelperExample** example use look up for files / dirs to load as plugins ...

<a id="ot_my_libs.PlugsHelperTest_plug3_a"></a>

# ot\_my\_libs.PlugsHelperTest\_plug3\_a

<a id="ot_my_libs.db_helper"></a>

# ot\_my\_libs.db\_helper

