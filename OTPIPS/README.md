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

- [ ] **TODO ./otdmInitNew.sh ot_hello_world** - make new project `ot_hello_world` 

- [ ] set up all variables in `ot_hello_world/pyproject.toml`

- [ ] do / move your code to `ot_hello_world/src/ot_hello_wold/`

- [ ] to test if it's working use
  
  ```bash
  $ ./otdmVenvIt.sh ot_hello_wold
  $ source ./ot_hello_wold/venv/bin/activate
  $ cd ot_my_libs/src/
  $ python3
  python version 0.18 on top of Python 3.8.10 /usr/bin/python3
  >>> import ot_hello_wold
  >>> ot_hello_wold.ot_hello_wold()
  ,,,,,......
  exit()
  
  $ deactivate
  ```

- [ ] **./otdmBuild.sh ot_hello_world** - we know it's working in `venv` so lets  

- [ ] we can test it localy `pip3 install ot_hello_world/dist/ot_hello_world-X.X.X.tar.gz` or do same thing in `otdmVenvIt.sh`

- [ ] **./otdmUpload2Pip.sh** - to upload it to pypip

- [ ] **./otdmRepoUpdate.py** - to update / rebuild `./REPOPIPS/pips.json` with list
  

More will come ...

---

If you see that this makes sense [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS) | [Master repository](https://github.com/yOyOeK1/oiyshTerminal) | [About SvOiysh](https://www.youtube.com/@svoiysh)
