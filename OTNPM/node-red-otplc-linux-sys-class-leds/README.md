

## node-red-otplc-linux-sys-class-leds

Ufff what a name !

   Is for reading / writing sys class leds on linux from Node-RED

**ot-plc to use linux sys / class / leds kernel layer to flash your leds!**

You need to have permissions to write to /sys/class/leds/*/[brightness|trigger] then this is working for setting. Without it is only able to read status now.



## in result we have

iot keyboard led



 You can send it topic {string}:

   **dirList** - to get `payload` with posible options to set as led

   **getStatus** - to get `payload` current brightness

   **getStatusLong** - extended {json} in `payload` info about set led

   **set** - with `payload` will write to brightness

   **trigger** - with `payload` write trigger

   On start look on status of node or what is returning

![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/node-red-otplc-linux-sys-class-leds/sample/screenshots/nodeStatus.png)

## status

working

## screenshots

![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/node-red-otplc-linux-sys-class-leds/sample/screenshots/inFlowAndSomePayloads.png)

 



[![](https://camo.githubusercontent.com/cd07f1a5d90e454e7bbf69d22ebe4cdbd3a0b3dcf56ba0b6c2495a8e99c776be/68747470733a2f2f6b6f2d66692e636f6d2f696d672f676974687562627574746f6e5f736d2e737667)](https://ko-fi.com/B0B0DFYGS)
