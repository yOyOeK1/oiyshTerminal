{
  "id": "2d17e13af454cff48",
  "type": "subflow",
  "name": "npm-ot-vanilla1",
  "info": "oiyshTerminal vanilla 1 is a test package. If we can make it smoooth ...\n\nset it string to set in propertis \n\nit will add it as a suffix to your payload.",
  "category": "ot",
  "in": [
    {
      "x": 50,
      "y": 30,
      "wires": [
        {
          "id": "a4f058bee0f3c0fa"
        }
      ]
    }
  ],
  "out": [
    {
      "x": 580,
      "y": 40,
      "wires": [
        {
          "id": "a4f058bee0f3c0fa",
          "port": 0
        }
      ]
    }
  ],
  "env": [
    {
      "name": "vToAdd",
      "type": "str",
      "value": "",
      "ui": {
        "label": {
          "en-US": "String to add to msg"
        },
        "type": "input",
        "opts": {
          "types": [
            "str"
          ]
        }
      }
    }
  ],
  "meta": {},
  "color": "#FFCC66",
  "status": {
    "x": 580,
    "y": 120,
    "wires": [
      {
        "id": "a4f058bee0f3c0fa",
        "port": 1
      },
      {
        "id": "a323bc4a4be3c55a",
        "port": 0
      }
    ]
  },
  "flow": [
    {
      "id": "a4f058bee0f3c0fa",
      "type": "function",
      "z": "2d17e13af454cff48",
      "name": "",
      "func": "msg.payload = env.get(\"vToAdd\")+\": \"+msg.payload;\n\nreturn [\n    msg,\n    {\n        topic:\"ok\",\n        payload: \"msg \"+(new Date())\n    }\n];",
      "outputs": 2,
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 300,
      "y": 40,
      "wires": [
        [],
        []
      ]
    },
    {
      "id": "a323bc4a4be3c55a",
      "type": "inject",
      "z": "2d17e13af454cff48",
      "name": "",
      "props": [
        {
          "p": "payload"
        },
        {
          "p": "topic",
          "vt": "str"
        }
      ],
      "repeat": "",
      "crontab": "",
      "once": true,
      "onceDelay": "0.5",
      "topic": "set string to",
      "payload": "vToAdd",
      "payloadType": "env",
      "x": 260,
      "y": 200,
      "wires": [
        []
      ]
    }
  ]
}
