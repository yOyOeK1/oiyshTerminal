# node-red-contrib-otplc-linux-battery

  Is to get linux-battery to OiyshTerminal plc layer in Node-RED
  Nice ot-plc linux-battery source information in Node-RED

## status

in progress .... / working

## use it

  By sending any `msg` to it. It will send `msg` with battery status as it will be possible

  **return** `msg.payload` _json_
  *On my Dell laptop I`m getting nice fat data :)*
  ```json
  {
    "nativePath":"BAT0",
    "vendor":"LGC-LGC3.553",
    "model":"DELL C27RW8C",
    "serial":"6210",
    "powerSupply":"yes",
    "updated":"Sun 09 Apr 2023 06:23:28 PM EST (119 seconds ago)",
    "hasHistory":"yes",
    "hasStatistics":"yes",
    "present":"yes",
    "rechargeable":"yes",
    "state":"discharging",
    "warningLevel":"none",
    "energy":"11.6394 Wh",
    "energyEmpty":"0 Wh",
    "energyFull":"31.1106 Wh",
    "energyFullDesign":"41.9976 Wh",
    "energyRate":"17.3508 W",
    "voltage":"10.909 V",
    "timeToEmpty":"40.2 minutes",
    "percentage":"37%",
    "capacity":"74.0771%",
    "technology":"lithium-ion",
    "iconName":"'battery-good-symbolic'"
  }
```

### basic example node set

  ![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/node-red-contrib-otplc-linux-battery/examples/exampleNodeSet.png)

  **.json to import to Node-RED**

  ```json
  [     {         "id": "e999d1dfdae1ac85",         "type": "debug",         "z": "712159aab39493aa",         "name": "linux-battery update [0]",         "active": true,         "tosidebar": true,         "console": false,         "tostatus": true,         "complete": "payload",         "targetType": "msg",         "statusVal": "payload.percentage",         "statusType": "msg",         "x": 680,         "y": 460,         "wires": []     },     {         "id": "9a83d29d898ac372",         "type": "otplcLinuxBattery",         "z": "712159aab39493aa",         "name": "otplc-linux-battery : example [0]",         "location": "exampleLocation",         "batno": "0",         "x": 430,         "y": 480,         "wires": [             [                 "e999d1dfdae1ac85"             ]         ]     },     {         "id": "ecf951595eeb632c",         "type": "comment",         "z": "712159aab39493aa",         "name": "need to set up battery No _int_",         "info": "",         "x": 430,         "y": 420,         "wires": []     },     {         "id": "268cd83d042613bb",         "type": "inject",         "z": "712159aab39493aa",         "name": "read linux-battery",         "props": [             {                 "p": "payload"             },             {                 "p": "topic",                 "vt": "str"             }         ],         "repeat": "",         "crontab": "",         "once": false,         "onceDelay": 0.1,         "topic": "",         "payloadType": "date",         "x": 160,         "y": 480,         "wires": [             [                 "9a83d29d898ac372"             ]         ]     } ]
  ```
