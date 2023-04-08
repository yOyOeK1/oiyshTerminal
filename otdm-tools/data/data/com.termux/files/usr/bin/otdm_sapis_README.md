# otdmTools - sapis system

  To make it fast! Chain base mechanism. It pass one data to next sapi with arguments. It's some sort of programming language where by staccking sapi with argument is chains you can build data you want. Or make some action.
  It's used now in `otdmTools.py -serviceIt http` it start HTTP API at :1990 port
  By sending `url` requests on paths it's validate your request using commands piping system.

## example

  * to get help, over http I'm using `curl` as my choice ...
    ```bash
    curl http://192.168.43.220:1990/help/.html
    ```
    - `help` as input is getting nothing it's firs. It's generating on the fly local help of instance then return it to `pipe`
    - `.html` gets `pipe` and wrap it in `<html><body># otdmTools.py - serviceIt...` of _raw_/_string_

  * Url in http address using `curl` as my choice ...
    ```bash
    curl http://192.168.43.220:1990/echo/Hello%20world/.json
    ```
    - `echo` in takes one argument `Hello%20world` as a input `pipe` it
    - `.json` gets `pipe` and wrap it in REST'ish API format of _json_
    **Returns** _json_ and http statusCode `200`
    ```json
    {"code": 200, "status": "success", "msg": "Hello world"}
    ```



## list

  This a list of sapis
  - `help` - need 0 arguments. **Return** _raw_/_string_ this help :)
  - `infoPipe` - need 0 arguments. **Return** info about pipe
  - `ping` - need 0 arguments. **Return** `pong`
  - `echo` - need 1 arguments. **Return** given argument back as echo
  - `sum` - need 2 arguments. **Return** sume _float_ as sum of `arg0` ,`arg1`
  - `divPipe` - need 1 arguments. **Return** division _float_ incomming `pipe` by `arg0`
  - `div` - need 2 arguments. **Return** division _float of `arg0` by `arg1`
  - `getKey` - need 1 arguments. **Return** value from incomming pipe where `key` of json is =  `arg0`
  - `otdmTools` - need 1 arguments. **Return** result from otdmTools.py `args...`
  - `.json` - need 0 arguments. **Return** _json_ from `pipe`
  - `.raw` - need 0 arguments. **Return** _raw_/_string_ from `pipe`
  - `.html` - need 0 arguments. **Return** _raw_/_string_ from `pipe` to wrapt `html`
