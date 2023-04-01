

## node-red-otplc-linux-sys-class-leds

Ufff what a name !

   Is for reading / writing sys class leds on linux from Node-RED

**ot-plc to use linux sys / class / leds kernel layer to flash your leds!**

You need to have permissions to write to /sys/class/leds/*/[brightness|trigger] then this is working for setting. Without it is only able to read status now.


## install it

For now installation is by entering node-red home directory then installing localy for Node-RED
```shell
npm i node-red-otplc-linux-leds
```
*then restart Node-RED and start your led instance!*


## in result we have

iot keyboard led



## using it

 You can send it topic {string}:

   **dirList** - to get `payload` with posible options to set as led

   **getStatus** - to get `payload` current brightness

   **getStatusLong** - extended {json} in `payload` info about set led

   **set** - with `payload` will write to brightness

   **trigger** - with `payload` write trigger

   On start look on status of node or what is returning

![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/node-red-otplc-linux-sys-class-leds/sample/screenshots/nodeStatus.png)


## example flow set

To check it out .json to import to Node-RED [link...](https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTNPM/node-red-otplc-linux-sys-class-leds/sample/exampleNodeSet.json)


## status

working

## screenshots

Video showing how to set it up and use it wrapt in node-red node as node-red-otplc-linux-sys-class-leds ...

[![](https://i.ytimg.com/an_webp/X3jwnlGD_SM/mqdefault_6s.webp?du=3000&sqp=CIewoaEG&rs=AOn4CLBo2zmuuYR-4eJyDtKvtJkHamsh8w)
](https://www.youtube.com/watch?v=X3jwnlGD_SM)

*node-red-otplc-linux-sys-class-leds oiyshTerminal at npm* - on youtube from setting it up to blinking led...




![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/node-red-otplc-linux-sys-class-leds/sample/screenshots/inFlowAndSomePayloads.png)



---
If you see that this make sens

[![](https://camo.githubusercontent.com/cd07f1a5d90e454e7bbf69d22ebe4cdbd3a0b3dcf56ba0b6c2495a8e99c776be/68747470733a2f2f6b6f2d66692e636f6d2f696d672f676974687562627574746f6e5f736d2e737667)](https://ko-fi.com/B0B0DFYGS)
