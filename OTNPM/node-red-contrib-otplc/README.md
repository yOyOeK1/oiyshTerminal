## node-red-contrib-otplc

  Is a Node-RED ui version to use oiyshTerminal - plc layes

## in result we have

Nice ot-plc engine node in Node-RED



### basic example node set



**.json to import to Node-RED**

```json
[     {         "id": "a3660857227f36b6",         "type": "otplcEngine",         "z": "bf43b163cb91aff3",         "name": "basicExample",         "location": "exampleInstance",         "otPlcSel": "",         "x": 3720,         "y": 260,         "wires": [             [                 "60d8ae19edf3fce1"             ]         ]     },     {         "id": "60d8ae19edf3fce1",         "type": "debug",         "z": "bf43b163cb91aff3",         "name": "Engine msgs...",         "active": true,         "tosidebar": true,         "console": false,         "tostatus": false,         "complete": "true",         "targetType": "full",         "statusVal": "",         "statusType": "auto",         "x": 3940,         "y": 360,         "wires": []     },     {         "id": "20c8adb79b88670c",         "type": "inject",         "z": "bf43b163cb91aff3",         "name": "getAll",         "props": [             {                 "p": "payload"             },             {                 "p": "topic",                 "vt": "str"             }         ],         "repeat": "",         "crontab": "",         "once": false,         "onceDelay": 0.1,         "topic": "getAll",         "payloadType": "date",         "x": 3370,         "y": 240,         "wires": [             [                 "a3660857227f36b6"             ]         ]     },     {         "id": "40edeeee2eabd3ad",         "type": "inject",         "z": "bf43b163cb91aff3",         "name": "getAllTypes / location",         "props": [             {                 "p": "payload"             },             {                 "p": "topic",                 "vt": "str"             }         ],         "repeat": "",         "crontab": "",         "once": false,         "onceDelay": 0.1,         "topic": "getAllTypes",         "payload": "location",         "payloadType": "str",         "x": 3420,         "y": 280,         "wires": [             [                 "a3660857227f36b6"             ]         ]     },     {         "id": "0bc873df87a30ebc",         "type": "inject",         "z": "bf43b163cb91aff3",         "name": "add 2 ...",         "props": [             {                 "p": "payload"             },             {                 "p": "topic",                 "vt": "str"             }         ],         "repeat": "",         "crontab": "",         "once": false,         "onceDelay": 0.1,         "topic": "add",         "payload": "{\"plcType\":\"fromInjectionExample\",\"name\":\"test2 - add bt 2\",\"location\":\"exampleInstance\",\"srcName\":\"Node-RED injection\"}",         "payloadType": "json",         "x": 3380,         "y": 320,         "wires": [             [                 "a3660857227f36b6"             ]         ]     },     {         "id": "936e6657578909d6",         "type": "inject",         "z": "bf43b163cb91aff3",         "name": "zeroAll",         "props": [             {                 "p": "payload"             },             {                 "p": "topic",                 "vt": "str"             }         ],         "repeat": "",         "crontab": "",         "once": false,         "onceDelay": 0.1,         "topic": "zeroAll",         "payloadType": "date",         "x": 3370,         "y": 360,         "wires": [             [                 "a3660857227f36b6"             ]         ]     },     {         "id": "aceaf00a8a877a47",         "type": "inject",         "z": "bf43b163cb91aff3",         "name": "getAllTypes / plcTypes",         "props": [             {                 "p": "payload"             },             {                 "p": "topic",                 "vt": "str"             }         ],         "repeat": "",         "crontab": "",         "once": false,         "onceDelay": 0.1,         "topic": "getAllTypes",         "payload": "plcType",         "payloadType": "str",         "x": 3420,         "y": 400,         "wires": [             [                 "a3660857227f36b6"             ]         ]     },     {         "id": "e6ece57e14ebc9a4",         "type": "inject",         "z": "bf43b163cb91aff3",         "name": "add ...",         "props": [             {                 "p": "payload"             },             {                 "p": "topic",                 "vt": "str"             }         ],         "repeat": "",         "crontab": "",         "once": false,         "onceDelay": 0.1,         "topic": "add",         "payload": "{\"plcType\":\"fromInjectionExample\",\"name\":\"test1Inject\",\"location\":\"exampleInstance\",\"srcName\":\"Node-RED injection\"}",         "payloadType": "json",         "x": 3230,         "y": 320,         "wires": [             [                 "a3660857227f36b6"             ]         ]     },     {         "id": "49e759d6ef381466",         "type": "comment",         "z": "bf43b163cb91aff3",         "name": "About ot-plc Engine",         "info": "Use it to add, and manipulate data about ot-plc layer as documentation describes ...\n\n[link to documentation ...](https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTNPM/node-red-contrib-otplc)\n\n",         "x": 3250,         "y": 140,         "wires": []     } ]
```

*this is a import json to get example node set or [link to exampleNodeSet.json](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/node-red-contrib-otplc/examples/exampleNodeSet.json)*

![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/node-red-contrib-otplc/examples/ss_exampleNodeSet.png)







## status

in progress ...

## screenshots

![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/node-red-contrib-otplc/examples/ss_engineNode.png)

In dept topics in docs in Node-RED and at [otplc site ...](https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTNPM/otplc)

[![](https://camo.githubusercontent.com/cd07f1a5d90e454e7bbf69d22ebe4cdbd3a0b3dcf56ba0b6c2495a8e99c776be/68747470733a2f2f6b6f2d66692e636f6d2f696d672f676974687562627574746f6e5f736d2e737667)](https://ko-fi.com/B0B0DFYGS)
