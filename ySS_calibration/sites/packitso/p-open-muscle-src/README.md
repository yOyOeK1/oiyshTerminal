## otdmp-open-muscle-rc

   Is a cooperation with open-muscle to build telemetry instrument as a proof of koncept if OT can !

Open muscle project is at github: https://github.com/turfptax/openmuscle

Data upcoming from sensor in by udp in format jsonish. Example row

```json
{
    'id': 'OM-Band12', 
    'time': (2023, 3, 12, 22, 23, 59, 6, 71), 
    'data': [1336, 5012, 5161, 4917, 5084, 5092, 5181, 5000, 5044, 4832, 5257, 4869], 
    'ticks': 187680, 
    'rec_time': 46.03442692756653
}
```

*this is nice formated for easy reading. Normally data is one line*

So I reformatted data to json more

```json
{
    "id": "OM-Band12", 
    "time": [2023, 3, 12, 22, 23, 16, 6, 71], 
    "data": [1280, 5153, 5332, 5100, 5385, 5176, 5304, 5069, 5317, 5140, 5324, 5073], 
    "ticks": 144633, 
    "rec_time": 3.0202174186706543
}
```

There is a Node-RED flow helper to transfer udp upcoming line by line data to something more usable for yss. Then data is send to WebSocket layer to show it on yss. This is open what can be done with the data. By sending it to mqtt (if define) it will be stored (if define). But there is a lot of it It will be nice to make custom data set in db.

To the power of multiSVG! 

To the power of influxDB - so this one is taking in to spin influxDB not only flexibility of this database will simplify future changes, easy to manage data, open .

To the power of grafana - influxDB datasource and wear in. Check screenshots...







## status

## screenshots

## ![](./ss_ofFlowUdpToWebSocket.png)

*flow helper*

![](./ss_firtVersionBarsAreMoving.png)

*first vesion bars are moving*

Revamp of interface 

![](./ss_interfaceRevamp1.png)

![](./ss_4chDevice.png)



Grafana integration for debugging and working on values

![](./ss_grafana_inflixDB_integration_for_debugging.png)





## notes

cat ./datasetTWO.txt | while read -r line; do echo $line; echo $line| nc -u localhost 3145 -w 1; done

cat ./datasetTWOFix.txt | while read -r line; do echo $line; echo $line | jq '.'| nc -u localhost 3145 -w 1; done