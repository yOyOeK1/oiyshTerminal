# esp32 box io v1

Arduino-ide part.
Box is going over list of essid's. Then connect to ip and port of mqtt broker start publish states of GPIO's.


## configuration

In `./esp32iobox1/esp32iobox1.ino` edit sections ...

```c

char *ap_ssid[] = {  "apHome",        "DIRECT-7u-SecureTether-svOiysh7" , "HUAWEI Y7a"           };
char *ap_pass[] = {  "123456789",     "9egHgaWh",                        "srytyfrytybangbang"  };
char *mq_server[] = { "192.168.1.1",  "192.168.49.1",                   "192.168.43.1"  };
char apCount = 2; // count of Access points starting from 0 
char *mqClient = "boxio11";
int boxioNo = 1;
```

*ap_ssid* list of ESSID's to try to connect
*ap_pass* list of passwords to ESSID's
*mq_server* list of mqtt server brokers on every access point
*apCount* count of essid's to try. Count from 0
*mqClient* name of this **box-io**
*boxioNo* channel for this box-io to publish on
    * `and/boxio/**boxioNo**/adc/..` - adc readouts of GPIO 36, 39, 34, 35
    * `and/boxio/**boxioNo**/in` - `payload` jsstr of GPIO `{23:[1|0],22:[1|0],21:[1|0],19:[1|0]}`

