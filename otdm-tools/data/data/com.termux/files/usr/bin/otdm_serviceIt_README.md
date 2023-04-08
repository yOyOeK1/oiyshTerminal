# otdmTools.py - serviceIt

  Is a argument `-serviceIt` in otdmTools witch  starting a service layers: http apis, mqtt, ... It's to request from otdmTools some action. Using easy east communication  method for your situation

## status

  in progress... working

## list of sapis

  As a target this need to be plugins system with `otAsapi_prototype.py` TODO
  
  At 2023-04-11 ... more update list can be found [link...](otdm_sapis_README.md#list)
  - `infoPipe` - need 0 arguments. **Return** info about pipe
  - `ping` - need 0 arguments. **Return** `pong`
  - `echo` - need 1 arguments. **Return** given argument back as echo
  - `sum` - need 2 arguments. **Return** sume _float_ as sum of `arg0` ,`arg1`
  - `divPipe` - need 1 arguments. **Return** division _float_ incomming `pipe` by `arg0`
  - `div` - need 2 arguments. **Return** division _float of `arg0` by `arg1`
  - `getKey` - need 1 arguments. **Return** value from incomming pipe where `key` of json is =  `arg0`
  - `otdmTools` - need 1 arguments. **Return** result fromotdmTools.py `args...`
  - `json` - need 0 arguments. **Return** _json_ from `pipe`
  - `raw` - need 0 arguments. **Return** _raw_/_string_ from `pipe`
  - `html` - need 0 arguments. **Return** _raw_/_string_ from `pipe` to wrapt `html`
  - `help` - need 0 arguments. **Return** _raw_/_string_ this help :)

## using serviceIt

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
