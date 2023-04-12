# otdmTools.py -serviceIt
 
  `-serviceIt` is an argument for otdmTools witch starts various service layers: http, mqtt,... These layers will allow you to request an action from otdmTools using a communication method prefered for your situation.

## status

  working ... but still in progress

## to list your instance's skill set (sapis) and serviceIts

  The newest skill set you can get by `otdmTools.py -serviceIt ?` it will spit everything available on your system. Additional plugins will extend your instance's list. So check it out ...

### serviceIts to start as demons in foreground

  By using `-serviceIt [args,..]` you can use ...
  - `mqtt`- arg can be used to start ...mqtt
  - `http`- arg can be used to start ...http
  - `ws`- arg can be used to start ...ws
  - `xmlrpc`- arg can be used to start ...xmlrpc

  With all the services there is a way to use otdmSTS system. Which will allow you to build tasks for otdmTools by sending in
  `http` url a certain structure.  For more details look in README.md

### list of `SAPIS` in otdmSTS

  This is a list of `sapis` they can be a function / task / set / formater / parser / extractor / result
   in String To Sentence system. Current options:
  - `help` (0)x`/` - **Return** _raw_/_string_ this help :)
  - `getConfig` (0)x`/` - **Return** _json_ current known config of otdm
  - `clipLimit` (1)x`/` - **Return** otdm cliper's last `arg0` entrys
  - `sum` (2)x`/` - **Return** sum of _float_  `arg0`  and _float_ `arg1`
  - `divPipe` (1)x`/` - **Return** division _float_ incomming `pipe` by `arg0`
  - `div` (2)x`/` - **Return** division _float of `arg0` by `arg1`
  - `getKey` (1)x`/` - **Return** value from incomming pipe where `key` of json is =  `arg0`
  - `getKeyInAr` (1)x`/` - **Return** _array_ of _values_ form array of jsons with set key to get
  - `getKeyInArEq` (2)x`/` -
  - `packitsoQ` (1)x`/` - ?|lsWork|yes to interact with `-packitso [action]`
  - `packitsoLsAll` (1)x`/` - `arg0` _string_ _.lsWork=>keyWord_ as from where / what worker
  - `packitsoGET` (2)x`/` - as get data from worker. `arg0` _string_ _keyWord_ to set worker `arg1` _string_ ident use to identyfy work peas
  - `packitsoPOST` (2)x`/` - TODO `arg0` _string_ keyWord, `arg1` _json_ data to POST
  - `otdmTools` (1)x`/` - **Return** result from otdmTools.py `args...`
  - `ping` (0)x`/` - **Return** `pong`
  - `echo` (1)x`/` - **Return** given argument back as echo
  - `waitFor` (1)x`/` - **Return** current otdmTools.py time but with delay in sec from `arg0`
  - `infoPipe` (0)x`/` - xxxxx**Return** info about pipe
  - `.json` (0)x`/` - **Return** _json_ from `pipe`
  - `.raw` (0)x`/` - **Return** _raw_/_string_ from `pipe`
  - `.html` (0)x`/` - **Return** _raw_/_string_ from `pipe` to wrapt `html`

## using serviceIt examples


* serviceIt starting `http`  communication layer (if more then one use like `http,mqtt`)

  ```shell
  otdmTools.py -serviceIt htt
  ```

  this will start http api stack on a given ip:port(from your config file) that will handle tasks given in the incoming url.  

* lets start with echo
  Example url: 
  ```bash
  curl http://192.168.43.220:1990/echo/Hello_from_otdmTools/json
  ```

  **Return** in this case `json`  

  ```json
  {"code": 200, "status": "success", "msg": "Hello_from_otdmTools"}
  ```

* pipe progressive data formating/wrapping in HTTP API  

  ```bash
  curl http://192.168.43.220:1990/echo/Piping_example/json/getKey/code/divPipe/100/html
  ```

  **Return** in this case `html`
  In this example it's showing how you can delegate work to server site. Getting `echo` as example with argument `Pinging_eaxample` pipe to `json` pipe to `getKey` = `code` then pipe this value to dividing `divPipe` function by `/10` and to `html`

  ```json
  <html><body>2.0</body></html>
  ```
