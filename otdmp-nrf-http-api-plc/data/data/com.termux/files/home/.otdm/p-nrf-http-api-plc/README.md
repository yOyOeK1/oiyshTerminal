## otdmp-nrf-http-api-plc

   Is for getting information about your plc's in your system. So if you can do http you can have some interaction / information about this system. This a one place to explore ins and outs lets say ...

## is doing it....

First of all it's working at http://....:1880/plc

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

"avg" {string:tName} - to gen avg reading from 60 sec

    "sec" {int} - optional to avg form sec defined 

## status

in progress

- [x] listing db topics
  
  - [x] statistics

- [ ] listing virtual topics

- [ ] topic type information / staticsics ( so description of leaf / sensor )
  
  - [ ] type of msg / string / int / need some post processing / scale?
  
  - [ ] name of it
  
  - [ ] unit name



## imaging it!

![](./ot-plc-imaginIt_01.png)

This is my plan of attack for this. imagining it is in ver 0.1 but beside insaine amout of coding I don't see problems. Can you? 

Left column is devices / phones / esp / arduinos / cars / boats / rv / green houses / solar panel installation / diy rice cooker / ...

They are reporting in shortest possible way. If it's a esp in your home then it's in range of your WiFi. If it's a car and it have dedicated phone then it have WiFi if it's in your home. In `Scout Mode` it have gsm to pub at on-line mqtt broker server if you want it to do so.

Otdm plc API is aggregating traffic from all known sources. 

It have `Bundles` with names. So define `Sensors` on `IN`. This approach is giving you switches if you want or virtual `Alarm sound/light` 



  

## screenshots

![](./ss_allGlory.png)

*in all it's glory. On left flow in Node-RED. On right terminal with statistics of one of the topics*

## notes
