## otdmp-nrf-http-api-plc

   Is for getting information about your plc's in your system. So if you can do http you can have some interaction / information about this system.



## is doing it....

First of all it's working at http://....:1880/plc/ 

Second is that all queries to it need to be send in headers. Example curl to get echo from api...

```bash
curl -H 'q: {"echo": "abc"}' http://192.168.43.220:1880/plc | jq '.'
```

**Returns** {json} 

```json
{
  "msg": "echoBackAPI: abc END ECHO",
  "exitCode": 0
}
```



## if q {json}

"echo" {string} - will echo string back as json

"lsTopics" {string} - any string but key will return topics in system

 "stats" {string:tName} - to get statistics on topic





## status

in progress



## screenshots

![](./ss_allGlory.png)

*in all it's glory. On left flow in Node-RED. On right terminal with statistics of one of the topics*

## notes
