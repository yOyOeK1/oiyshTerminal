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

  The newest on you can get by `otdmTools.py -serviceIt ?` it will spit all it have now at your system. Plugins will extend your list on your instance. So check it out or this is a build in set ...

### list of `SAPIS` it otdmSTS

  This is a list of `sapis` it's like function / task / set / formater / parser / extractor / result
  use in String To Sentence system. Current options:
    * `help` (0)x`/` - **Return** _raw_/_string_ this help :)
    * `getConfig` (0)x`/` - **Return** _json_ current known config of otdm
    * `clipLimit` (1)x`/` - **Return** otdm cliper last `arg0` entrys
    * `sum` (2)x`/` - **Return** sume _float_ as sum of `arg0` ,`arg1`
    * `divPipe` (1)x`/` - **Return** division _float_ incomming `pipe` by `arg0`
    * `div` (2)x`/` - **Return** division _float of `arg0` by `arg1`
    * `getKey` (1)x`/` - **Return** value from incomming pipe where `key` of json is =  `arg0`
    * `getKeyInAr` (1)x`/` - **Return** _array_ of _values_ form array of jsons with set key to get
    * `getKeyInArEq` (2)x`/` -
    * `packitsoQ` (1)x`/` - ?|lsWork|yes to interact with `-packitso [action]`
    * `packitsoLsAll` (1)x`/` - `arg0` _string_ _.lsWork=>keyWord_ as from where / what worker
    * `packitsoGET` (2)x`/` - as get data from worker. `arg0` _string_ _keyWord_ to set worker `arg1` _string_ ident use to identyfy work peas
    * `packitsoPOST` (2)x`/` - TODO `arg0` _string_ keyWord, `arg1` _json_ data to POST
    * `otdmTools` (1)x`/` - **Return** result from otdmTools.py `args...`
    * `ping` (0)x`/` - **Return** `pong`
    * `echo` (1)x`/` - **Return** given argument back as echo
    * `waitFor` (1)x`/` - **Return** current otdmTools.py time but with delay in sec from `arg0`
    * `infoPipe` (0)x`/` - xxxxx**Return** info about pipe
    * `.json` (0)x`/` - **Return** _json_ from `pipe`
    * `.raw` (0)x`/` - **Return** _raw_/_string_ from `pipe`
    * `.html` (0)x`/` - **Return** _raw_/_string_ from `pipe` to wrapt `html`
