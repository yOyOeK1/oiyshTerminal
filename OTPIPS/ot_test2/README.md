# oiyshTerminal - ot_test2 at pip / python3 installable

## ot_test2
  It's a test package of oiyshTerminal family to pip system
  It's a test how can I do it!

  So fare research ....

## development of package - base line
  In directory of project to deploy
  ```shell
  tree ./
  ./
  ├── dist
  │   ├── ot_test2-0.0.....
  .....
  │   └── ot_test2-0.0.2.tar.gz
  ├── LICENSE.txt
  ├── twistUploadForceProxy.sh
  ├── pyproject.toml
  ├── README.md
  └── src
      └── ot_test2
          ├── example.py
          └── __init__.py
  ```

## in pyproject
  * looking for https://pypi.org/classifiers/


## when developing code, test, deploy
  `./` is home of this ot_test2

  * test local development version
    ```shell
    cd ./src
    echo -e "from ot_test2 import example \nexample.test()" | python3
    ```

  * build .tar.gz and .whl
    ```shell
    python3 -m build
    ```    

  * install and fast test from local
  	```shell
    pip3 install ./dist/ot_test2-0.0.2-py3-none-any.whl
    echo -e "from ot_test2 import example \nexample.test()" | python3
    ```

  * testing it when installed
    ```python3
    >>> from ot_test2 import *
    >>> ot_test2()
    (from init) oiyshTerminal - at pip, test 2 in version:0.0.3
    ```
    **or** one liner
    ```shell
    echo -e "from ot_test2 import example \nexample.test()" | python3
    ```

  * uninstalling it
    ```shell
    pip3 uninstall ot_test2
    ```

  * upload / deploy - target repository is `testpypi`
    ```shell
    python3 -m twine upload --verbose --repository testpypi dist/ot_test2-0.0.2*
    ```

  * install from test repository
    ```shell
    pip3 install --index-url https://test.pypi.org/simple/ --no-deps ot-test2
    ```
