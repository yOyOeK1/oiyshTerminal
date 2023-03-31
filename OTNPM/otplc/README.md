## oiyshTerminal - plc

   Is oiyshTerminal solution for chaos in pins layers. We have many pins different types ins/outs in our systems. Sometimes one mcu is making something in more then one device (that is in my case). Adding PLC layer virtual we can organize all that is some sort of order.

This library is to help with managing otplc's and get to point of having [this link ... yss-otplc](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/sites/otplc/README.md) and [this link ... p-nrf-http-api-plc](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/sites/packitso/p-nrf-http-api-plc/README.md)

## most basic layer otplc

Every thing have it's group. I call it `*plcType` for me it's battey, led, swith, button, relay, mic, temperature, rpm, .... We can put label of `*name` to every thing. Also `location` is important for later to know where it's. If it's a locker ok a car is in car. Over what type of protocol is mainly use `srcName` is like http, tcp, ws, mqtt, fs, ....  protocol over what we got it. And last in more detail `srcD` address. I case of mqtt: topic | ws: url | fs: path | ....    

*** need to set**

### making instance : new

```javascript
let o = require("./otplc");
var otplc = o.otplc;
```

To have a option to play with it ....

### adding new : .add

To add new battery for example you can make it as example. It is a need way to sort things. All battery this way cane be treated similar. And you know how many devices there is in one location

```javascript
otplc.add(
    'battery',        // as plcType
    'Home LiPo4',     // as name
    'oiysh',          // as location
    'mqtt',           // srcName
    'e01Mux/adc0',    // srcD
    -1                // extra data for this one from you to store
    );
```

**Return** {string} : your name of ot-plc

### get it all : .getAll

Is stored in `const` so it should be same for all but if you want to marge different instances invoke ....

**Return** {array} : of ot-plc's

```javascript
[{
    "plcType":"dummy",
    "name":"abc",
    "srcName":"",
    "srcD":"",
    "extra":-1
},{ ..... }]
```

## runing test1

To have a way to see what is going on

```javascript
let o = require("./otplc");
let t = new o.OTplcTest1();
> OTplcTest1 ....
> go run test 1 ...... Thu Mar 30 2023 11:27:51 ....
> OTplc init ...
> will have sufix .... mic_0
> Total in: 5
> Types: battery, led
> ---------------------
> All typel srcName
> [ 'mqtt', '' ]
> test 1 ........... DONE Exit 0
> in op is the instance to play ...
let o = t1.op;
// so o is our structure of otPlcs
```

## status

## screenshots

## notes
