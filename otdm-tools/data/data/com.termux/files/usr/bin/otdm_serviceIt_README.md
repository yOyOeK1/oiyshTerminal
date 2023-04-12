# otdmTools.py - serviceIt

  Is a argument `-serviceIt` in otdmTools witch  starting a service layers: http apis, mqtt, ... It's to request from otdmTools some action. Using easy east communication  method for your situation

## status

  in progress... working

## to get latest and your instance skills (sapis) an serviceIt's

  The newest skills set you can get by `otdmTools.py -serviceIt ?` it will spit all it have now at your system. Plugins will extend your list on your instance. So check it out ...

### serviceIt to start as demons in foreground are

  By starting `-serviceIt [args,..]` you can statart ...
     - `mqtt`  - arg can by use to start ...mqtt
     - `http`  - arg can by use to start ...http
     - `ws`  - arg can by use to start ...ws
     - `xmlrpc`  - arg can by use to start ...xmlrpc

  With all the services there is a way to use otdmSTS system by senging in
  `http` url you can build task for otdmTools look in README.md

### list of `SAPIS` it otdmSTS

  This is a list of `sapis` it's like function / task / set / formater / parser / extractor / result
  use in String To Sentence system. Current options:
    - `help` (0)x`/` - **Return** _raw_/_string_ this help :)
    - `getConfig` (0)x`/` - **Return** _json_ current known config of otdm
    - `clipLimit` (1)x`/` - **Return** otdm cliper last `arg0` entrys
    - `sum` (2)x`/` - **Return** sume _float_ as sum of `arg0` ,`arg1`
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

  To start it use argument `-serviceIt` `serviceName` can be set as `http` or/and `mqtt` so if more then one use `http,mqtt`

* serviceIt layer `http` and `mqtt` communication layer
  To start it use argument `-serviceIt` `serviceName` can be set as `http` or/and `mqtt` so if more then one use `http,mqtt`

  ```bash
  otdmTools.py -serviceIt http,mqtt
  ```

  will start http api stack and mqtt as comunication for tasks and msg's to/from otdmTools.py -serviceIt ...

* echo at start

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
