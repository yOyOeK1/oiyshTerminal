# otdmTools.py - serviceIt

  Is a argument in otdmTools starting a service layers: http apis, mqtt, ...


## status

  in progress... working
  

## using serviceIt

  To start it use argument `-serviceIt` `serviceName` can be set as `http` or/and `mqtt` so if more then one use `http,mqtt`

  * serviceIt layer `http` and `mqtt` communication layer
    To start it use argument `-serviceIt` `serviceName` can be set as `http` or/and `mqtt` so if more then one use `http,mqtt`
    ```bash
    otdmTools.py -serviceIt http,mqtt
    ```  
    *will start http api stack and mqtt as comunication for tasks and msg's to/from otdmTools.py -serviceIt ...*

  * echo at start
    ```bash
    curl http://192.168.43.220:1990/echo/Hello_from_otdmTools/json
    ```
    **Return** in this case `json`  
    ```json
    {"code": 200, "status": "success", "msg": "Hello_from_otdmTools"}
    ```

  * using progressive piping in HTTP API
    There is a piping system in urls.
    ```bash
    curl http://192.168.43.220:1990/echo/Piping_example/json/getKey/code/divPipe/100/html
    ```  
    **Return** in this case `html`
    In this example it's showing how you can delegate work to server site. Getting `echo` as example with argument `Pinging_axample` pipe to `json` pipe to `getKey` = `code` then pipe this value to dividing `divPipe` function by `/10` and to `html`
    ```json
    <html><body>2.0</body></html>
    ```
