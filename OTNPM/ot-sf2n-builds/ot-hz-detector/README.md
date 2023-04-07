To get frequence hz of a given signal transminsions 


---

# use it

To use it fead any signal to it. It will `return`  _int_ `payload` with frequence of the signal in Hz

## install it

For now installation is by entering node-red home directory then installing locally to Node-RED. So user starting `node-red` home director `./.node-red`

```shell
npm i node-red-contrib-ot-hz-detector
```

*then restart Node-RED and start your oiyshTerminal thing*


## example flow set


![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/ot-sf2n-builds/ot-hz-detector/sample/ss_exampleNodeSet.png)
---


## .json example to import

 It's as a example node set or use [link to ... ./sample/exampleNodeSet.json](https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTNPM/ot-sf2n-builds/ot-hz-detector/sample/exampleNodeSet.json)*

```json
[    {        "id": "82d5dde54b6acf0c",        "type": "debug",        "z": "6e119010f87bea35",        "name": "",        "active": true,        "tosidebar": true,        "console": false,        "tostatus": false,        "complete": "true",        "targetType": "full",        "statusVal": "",        "statusType": "auto",        "x": 2250,        "y": 980,        "wires": []    },    {        "id": "b3ade6f5b67c4574",        "type": "ot-hz-detector",        "z": "6e119010f87bea35",        "name": "Hz example",        "x": 1910,        "y": 980,        "wires": [            [                "82d5dde54b6acf0c"            ]        ]    },    {        "id": "a2211e9a3806a5e5",        "type": "inject",        "z": "6e119010f87bea35",        "name": "",        "props": [            {                "p": "payload"            },            {                "p": "topic",                "vt": "str"            }        ],        "repeat": "1",        "crontab": "",        "once": false,        "onceDelay": 0.1,        "topic": "",        "payloadType": "date",        "x": 1450,        "y": 880,        "wires": [            [                "f31c6882d831136a",                "b3ade6f5b67c4574"            ]        ]    }]
```

---

If you see that this makes sense [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS) | [Master repository](https://github.com/yOyOeK1/oiyshTerminal) | [About SvOiysh](https://www.youtube.com/@svoiysh)
