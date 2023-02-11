# OTDM for termux installation

This is a step by step manual how to get from Vanilla termux on android to running otdm-yss on it. It's a entry point to start to use otdm- family

To write this document I'm using oreo android x86_64 in virtual machine.

Termux in version 0.118.0 ( [link to repository](https://github.com/termux/termux-app) ... Big Qudos for them !) on page you can find "Releases" in assets download what you need for your device.

## Steps to install

On Android device Install Termux from downloaded .apk file.

Copy this line, start termux and past the line. Confirm with Enter.

```bash
curl https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/installer/run2.sh > ./run2.sh; . ./run2.sh
```

This command will download basic installer for termux. It will star installation process. On the way ask some questions. Fallow it.

- [x] DONE - you have otdm-yss on your android device



| ![](./otdm-onTermuxDesktop.png) | ![](./otdm-onTermuxDesktop-yss.png) |
| ------------------------------- | ----------------------------------- |

Android emulator with oreo. On desktop firefox shortcut to http://127.0.0.1:1880/yss



| <img title="" src="./otdm-node-red-installer-onTermux.png" alt="" width="599"> | otdm-node-red-installer - Node-red on device. This is a status after installing otdm-yss. By dependency you got running Node-RED instance |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |



| ![](./otdm-nrf-ot-test.png) | otdm-nrf-ot-test - is a fast and easy place to see what is OK in otdm enviroment |
| --------------------------- | -------------------------------------------------------------------------------- |



## What next?

It's still a start. But it's a good start. More info on progress you can find on (debianish systems) similar to termux [link...](https://github.com/yOyOeK1/oiyshTerminal/blob/fromZeroToHero/otdm-ubuntu-vanilla-install.md)

By using command: `$ apt-cache search otdm` you will get all packages in current moment in repository.
