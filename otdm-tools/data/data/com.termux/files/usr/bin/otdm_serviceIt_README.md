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
  `http` url a certain structure.  For more details [otdm_sapis_README.md](otdm_sapis_README.md)

<<<<<<< HEAD
=======


  
>>>>>>> branch 'main' of https://github.com/yOyOeK1/oiyshTerminal.git

## using serviceIt examples


* serviceIt starting `http`  communication layer (if more then one use like `http,mqtt`)

  ```shell
  otdmTools.py -serviceIt http
<<<<<<< HEAD
  ```
  this will start http api stack on a given ip:port(from your config file) that will handle tasks given in the incoming url.  

* run in full debug
  ```shell
  tdmTools.py -serviceIt http -sitDebug 1 -stsDebug 1 -sapisDebug 1
=======
>>>>>>> branch 'main' of https://github.com/yOyOeK1/oiyshTerminal.git
  ```

<<<<<<< HEAD
=======
  this will start http api stack on a given ip:port(from your config file) that will handle tasks given in the incoming url.  

>>>>>>> branch 'main' of https://github.com/yOyOeK1/oiyshTerminal.git
* lets start with echo
  Example url: 
  ```bash
  curl http://192.168.43.220:1990/echo/Hello_from_otdmTools/.json
  ```

  **Return** in this case `json`  

  ```json
  {"code": 200, "status": "success", "msg": "Hello_from_otdmTools"}
  ```

* pipe progressive data formating/wrapping in HTTP API  

  ```bash
  curl http://192.168.43.220:1990/echo/Piping_example/json/getKey/code/divPipe/100/.html
  ```

  **Return** in this case `html`
  In this example it's showing how you can delegate work to server site. Getting `echo` as example with argument `Pinging_eaxample` pipe to `json` pipe to `getKey` = `code` then pipe this value to dividing `divPipe` function by `/10` and to `.html`

  ```json
  <html><body>2.0</body></html>
  ```
