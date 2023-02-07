# otdm on fresh ubuntu 22.04

*( branch: From zero to Hero )*

This is a description with step by step process to get from fresh ubuntu 22.04 to running yss on it.

For this document I'm using installation of ubuntu 22.04 (lts after update and upgrade of system)  **it's not final version**.

**One of a first .deb base.**



## Installation steps

In terminal of your flavor run commands ...

```bash
$ sudo apt install git
```

Run more commands.

```bash
$ echo "deb [trusted=yes] https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/fromZeroToHero/OTDM/ ./ " | sudo tee -a /etc/apt/sources.list.d/otdmFromZetoToHero.list
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install otdm-tools otdm-mqtt-installer otdm-db-init otdm-node-red-installer 
$ sudo apt install otdm-nrf-yss 
$ cd /data/data/com.termux/files/home
$ git clone -b fromZeroToHero https://github.com/yOyOeK1/oiyshTerminal.git
```

[next release newer Node-red?] In current version of otdm-node-red-installer (0.1.8) it's installing Node-red in version 2.1.5. In this version there is a need of manually setting up websockets nodes.

At http://yourIp:1880 you have now Node-red. In it flow with name "ySS", node need to be found: /ws/yss_In and /ws/yss

Both need to be set up with Path according to the name. 

otdm-nrf-yss (0.1.5) also not set up correctly node "Main engine" In it set your values of your system.

```javascript
msg.yssWSUrl = "ws://192.168.43.220:1880/ws/yss";
```

*msg.yssWSUrl** - change only ip address to yours in local network set only ip this flow is making you ws:// on those paths

And Deploy.

Last step is to set external sites. You can do it by editing sites.json in yss directory. By running

```bash
$ node /data/data/com.termux/files/home/oiyshTerminal/ySS_calibration/sites/sites.json
```

Edit section to your needs. You can turn on / off sites or add yours!

Ctrl+x (to exit) and Ctrl+y (to confirm saving)



## First finecy visit

All in now good. So open a web browser and enter http://yourIp:1880/yss

Let me know what you think about it.

More is coming !!!

If you like buy me a coffee 
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B0DFYGS)
