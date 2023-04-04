Is to do some basic battery things. Do scaling of your data to `unit` you want. Have `min`, `max` values those are use to calculate `nLevel`. Ra ports `isNormal`  _boolean_ if all is OK. Location is used in otplt structure to put in in some place for you for later.


---

## use it

To use it feed any number to it in `payload`. It will handle it as you set the values in parameters of the node.

`return` _json_ {
    
 - `"topic"` _string_ - where to look for mqtt updates
 - `"volts"` _float_ - you `payload` as _number_ * `scale` from property
 - `"nLevel"` _float_ - 0.0 .... 1.0 base on current `volts` and your `min` `max` brackets
 - `"isMin"` _boolean_ - if is less then min then `false`
 - `"isMax"` _boolean_ ....
 - `"isNormal"` _boolean_ ....
 - `"unit"` _string_ - from property of the `"hz"` _float_ - frequency of the data

}

## install it

For now installation is by entering node-red home directory then installing locally to Node-RED. So user starting `node-red` home director `./.node-red`

```shell
npm i node-red-contrib-otplc-battery
```

*then restart Node-RED and start your oiyshTerminal thing*


## example flow set

In Node-RED
![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/ot-sf2n-builds/otplc-battery/examples/ss_exampleNodeSet.png)


*This is a json to import it as a example node set or use [link to ... ./examples/exampleNodeSet.json](https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTNPM/ot-sf2n-builds/otplc-battery/examples/exampleNodeSet.json)*

```json
[    {        "id": "8c74d86dd646c968",        "type": "debug",        "z": "6e119010f87bea35",        "name": "",        "active": true,        "tosidebar": true,        "console": false,        "tostatus": false,        "complete": "true",        "targetType": "full",        "statusVal": "",        "statusType": "auto",        "x": 2130,        "y": 1240,        "wires": []    },    {        "id": "864b5a8a1582f4d8",        "type": "otplc-battery",        "z": "6e119010f87bea35",        "name": "BATTERY EXAMPLE Node example",        "batName": "BATTERY EXAMPLE Node example",        "sMin": 12.08,        "sMax": 13.08,        "vScale": 0.1,        "sUnit": "volts",        "batLoc": "sf2nTest",        "x": 1910,        "y": 1240,        "wires": [            [                "8c74d86dd646c968"            ]        ]    },    {        "id": "711823b6fda47551",        "type": "function",        "z": "6e119010f87bea35",        "name": "",        "func": "\nreturn msg;",        "outputs": 1,        "noerr": 0,        "initialize": "",        "finalize": "",        "libs": [],        "x": 1630,        "y": 1140,        "wires": [            [                "154d97aa81b6dff1",                "864b5a8a1582f4d8",                "b3ade6f5b67c4574"            ]        ]    },    {        "id": "74f181fce59b49d9",        "type": "comment",        "z": "6e119010f87bea35",        "name": "sf2n otplc-battery",        "info": "",        "x": 1420,        "y": 1100,        "wires": []    },    {        "id": "a39bbe4c027701d1",        "type": "inject",        "z": "6e119010f87bea35",        "name": "test/bat1 -> high",        "props": [            {                "p": "payload"            },            {                "p": "topic",                "vt": "str"            }        ],        "repeat": "",        "crontab": "",        "once": false,        "onceDelay": 0.1,        "topic": "test/bat1",        "payload": "150",        "payloadType": "str",        "x": 1430,        "y": 1140,        "wires": [            [                "711823b6fda47551"            ]        ]    },    {        "id": "305a83e8a7337060",        "type": "inject",        "z": "6e119010f87bea35",        "name": "test/bat1 -> norm",        "props": [            {                "p": "payload"            },            {                "p": "topic",                "vt": "str"            }        ],        "repeat": "",        "crontab": "",        "once": false,        "onceDelay": 0.1,        "topic": "test/bat1",        "payload": "127",        "payloadType": "str",        "x": 1430,        "y": 1180,        "wires": [            [                "711823b6fda47551"            ]        ]    },    {        "id": "7697d23b0f9ff6dc",        "type": "inject",        "z": "6e119010f87bea35",        "name": "test/bat1 -> low",        "props": [            {                "p": "payload"            },            {                "p": "topic",                "vt": "str"            }        ],        "repeat": "",        "crontab": "",        "once": false,        "onceDelay": 0.1,        "topic": "test/bat1",        "payload": "100",        "payloadType": "str",        "x": 1430,        "y": 1220,        "wires": [            [                "711823b6fda47551"            ]        ]    }]
```

---

If you see that this makes sense [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS) | [Master repository](https://github.com/yOyOeK1/oiyshTerminal) | [About SvOiysh](https://www.youtube.com/@svoiysh)
