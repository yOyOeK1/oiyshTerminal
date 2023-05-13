# oiyshTerminal - pypip ot_my_libs

  Set of function to speed up things like:

  in example.py
  [benchmarking](#benchmarking) | sqlite3 
  can do: myLoger | FileActions | MyCalculate | myFastPlot | myMqttClient | ...

## check example

  In directory of library in my case is `/usr/lib/python3.8/site-packages`
    
  ```bash
  python3 ot_my_libs/example.py
  ```
	
	**or**
	[xdocs](https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTPIPS/ot_my_libs/README_xdoc.md)

### benchmarking

  **TimeHelper** use case as benchmarking tool

```python
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

## development of package - base line

  In directory of project to deploy `tree ot_my_libs`

```shell
ot_my_libs
├── db_helper.py
├── example.py
├── FileActions.py
├── __init__.py
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

---

If you see that this makes sense [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS) | [Master repository](https://github.com/yOyOeK1/oiyshTerminal) | [About SvOiysh](https://www.youtube.com/@svoiysh)
