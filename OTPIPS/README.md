# oiyshTerminal - OTPIPS

  Set of function libraries tools pack using pip idea

Packages on pip:

* [ot_my_libs](ot_my_libs/README.md) {{ pack.pyproj.description }}

## development of package - base line

  In directory of project to deploy `tree ../OTPIPS -L 1 --dirsfirst -v`

```shell
../OTPIPS
├── REPOPIPS
├── ot_blank
├── ot_my_libs
├── ...
├── README.md
├── Repo.json
├── build.sh -> ./otdmBuild.sh
├── repoUpdate.py -> ./otdmRepoUpdate.py
├── otdmBuild.sh
├── otdmRepoUpdate.py
├── otdmUpload2Pip.sh
├── otdmVenvIt.sh
└── venv.sh -> ./otdmVenvIt.sh
```

## tool chain for otpips

  To make otpip as deploy pip package using this we need to

- [x] **./otdmInitNew.sh ot_hello_world** - make new project `ot_hello_world` **or** use `ot_blank` as a template

- [ ] set up all variables in `ot_hello_world/pyproject.toml`

- [ ] do / move your code to `ot_hello_world/src/ot_hello_world/`

- [ ] to test in `venv` run **./otdmVenvIt.sh ot_hello_world** if it's working use
  
    ```bash
    $ ./otdmVenvIt.sh ot_hello_world
    $ source ./ot_hello_world/venv/bin/activate
    $ cd ot_hello_world/src/
    $ python3
    python version 0.18 on top of Python 3.8.10 /usr/bin/python3
    >>> import ot_hello_world
    >>> ot_hello_world.ot_hello_world()
    ,,,,,......
    exit()
    
    $ deactivate
    ```

- [x] **./otdmMakeDocsMd.sh ot_hello_world** - to build nice docs to your readme xdoc's'is 

- [x] **./otdmBuild.sh ot_hello_world** - we know it's working in `venv` so lets  

- [ ] we can test it localy by

  `pip3 install ot_hello_world/dist/ot_hello_world-X.X.X.tar.gz` or do same thing in `otdmVenvIt.sh`

  **or**

  *in `ot_hello_world` directory run*
  `pip3 install .`


- [x] **./otdmUpload2Pip.sh** - to upload it to pypip

- [x] update / download to local repo / reindex`./REPOPIPS/pips.json` with list
  
  - [x] to upload ready package to repository
    **./otdmRepoDown_byWhl.sh [pack/dist/pack-x.x.x-.....whl]** 

  - [x] to reindex repository run
    **/otdmRepoCreateIndex.sh**

*so .sh / .py tool chain for pip bilding*

---

## otpips.py


## offline python package build 
  
  Use `pip3` as having files in directory:
  ```bash
  pip3 install --no-index --find-links /path/to/download/dir/ -r requirements.txt
  ```
  **or**
  ```bash
  pip3 wheel --no-cache-dir -r requirements.txt -w /path/to/download/dir
  ```


### return example

* **chkIt** is to aggregate all known data for to know what is going on with not only pyproject.toml, but repo related, build, venv, ....
  in python by running in my case for project `ot_my_libs` is
  
  ```python
  import TODO
  o = otpip('ot_my_libs')
  res = o.chkIt()
  print(res)
  ```
  
  **return** result of chkIt in form of __json__
  
  ```json
  {
    "exists": true,
    "venv": {   "exists": true    },
    "src": {    "exists": true    },
    "readme": { "exists": true    },
    "xdoc": {   "exists": true    },
    "repo": {   "inRepo": false, "ver": "0.0.7" },
    "dist": {
      "exists": true,
      "build": {
        "whl": { "exists": false, "name": "ot_my_libs-0.0.9-py3-none-any.whl" },
        "tar": { "exists": false, "name": "ot_my_libs-0.0.9.tar.gz" }
      }
    },
    "pyproject": {
      "exists": true,
      "data": {
        "project": {
          "name": "ot_my_libs",
          "version": "0.0.9",
          "authors": [{  "name": "Bartlomiej Ceglik", "email": "yoyoek@wp.pl" } ],
          "description": "oiyshTerminal my basic libs: myLoger | FileActions | MyCalculate | db_helper | mysql_helper | ...",
          "readme": "README.md",
          "requires-python": ">=3.7",
          "dependencies": [
            "pymysql",
            "paho-mqtt==1.5.0"
          ],
          "classifiers": [
            "Development Status :: 3 - Alpha",
            "Programming Language :: Python :: 3",
            "License :: OSI Approved :: MIT License"
          ],
          "urls": {
            "Homepage": "https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTPIPS/ot_my_libs",
            "Bug Tracker": "https://github.com/yOyOeK1/oiyshTerminal/labels/ot_my_libs"
          }
        }
      }
    }
  }
  ```
  
  Thing wrong / TODO:  
  
  - [x] Nice
  - [ ] otpips not existing as pypi
  - [ ] solver to know what can we do with current status





More will come ...

---

If you see that this makes sense [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS) | [Master repository](https://github.com/yOyOeK1/oiyshTerminal) | [About SvOiysh](https://www.youtube.com/@svoiysh)
