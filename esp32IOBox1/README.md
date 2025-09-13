# esp32 box io v1

Arduino-ide part.
Center of the party is esp32 - n4 with 30 pin dev board.
Box is going over list of essid's. Then connect to ip and port of mqtt broker start publish states of GPIO's.


## schematics 

To build it from hardware point of view we need to connect some wires with components.


### esp32 - N4 30 pin version

TODO



## configuration

In file for **arduino-ide** located in `./esp32iobox1/esp32iobox1.ino` edit sections ...

```c
char *ap_ssid[] = {  "apHome",        "DIRECT-7u-SecureTether-svOiysh7" , "HUAWEI Y7a"           };
char *ap_pass[] = {  "123456789",     "9egHgaWh",                        "srytyfrytybangbang"  };
char *mq_server[] = { "192.168.1.1",  "192.168.49.1",                   "192.168.43.1"  };
char apCount = 2; // count of Access points starting from 0 
char *mqClient = "boxio11";
int boxioNo = 1;
```

* *ap_ssid* list of ESSID's to try to connect
* *ap_pass* list of passwords to ESSID's
* *mq_server* list of mqtt server brokers on every access point
* *apCount* count of essid's to try. Count from 0
* *mqClient* name of this **box-io**
* *boxioNo* channel for this box-io to publish on
    * `and/boxio/**boxioNo**/adc/..` - adc readouts of GPIO 36, 39, 34, 35
    * `and/boxio/**boxioNo**/in` - `payload` jsstr of GPIO `{23:[1|0],22:[1|0],21:[1|0],19:[1|0]}`


## results at mqtt

Raporting ../in GPIO's, ./adc/N
```bash
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/in', ... (21 bytes))
{23:0,22:0,21:0,19:0}
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/adc/36', ... (1 bytes))
0
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/adc/39', ... (1 bytes))
0
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/adc/34', ... (1 bytes))
0
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/adc/35', ... (1 bytes))
```

**public to**

"boxio1/adcHz" "100" - to set Hz of refresh
"boxio1/p" "GPIONO:[0|1]" - to set state 


## debuging 

* on yss
    **node-yss** is comming with some preinstalled **site**'s to play with. One of theme is **multiSvg**. On this site you can find `boxio1Debug.svg` 

    ![](./examples/multiSvg_debugingPage.png)


* node-red boxio1 test flow
    So there is a flow for Node-RED to include. [boxio1_boxio1_testFlow.json](./examples/boxio1_testFlow.json)

    ![](./examples/boxio1_testFlow.png)

    * can test mqtt pass and connection
    * showing incomming raports from boxio1 from input: ADC, GPIO's
    * TODO inject to set pin state


### links

Useful links:
* https://github.com/espressif/arduino-esp32