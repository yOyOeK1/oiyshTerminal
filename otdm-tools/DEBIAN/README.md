# otdm-tools

With grate power comes grate responsibility. It's a power-user tool.

## why I need it?

For me it's all the time around similar subjects. Reading files, getting data from http. O this data is json, that data is in mysql I need a driver to talk to mysql then make query then I will have some data. New project similar story.

  otdm-tools is my attempt to eliminate the idea of precise work type. My understenging is. You want to do "work / task". You know what is the medium providing / holding data.

  It's becoming your universal worker, qualified for the exact work you have.

## dependencies

  It will **expect from you:** python3, pip, jq, cowsays, 
  Python: python3-apt|python-apt(optional), requests, paho-mqtt, uploadserver

## using it

- [x] recognize os (**-osType**) 
  - [x] termux 117
  - [x] ubuntu 22.04 and *.*

- [x] Internal cliper
- [ ] dpkg (**-ddpkg**) 
  - [x] **"*"** otdm package list
  - [x] **"app"** get package details
  - [ ] install package
  - [ ] uninstall package

- [ ] protoDriver family (**-dxxxx**) [info](https://github.com/yOyOeK1/oiyshTerminal/blob/main/otdm-tools/data/data/com.termux/files/usr/bin/otdm_protoDriver_README.md) or [xdevdoc](https://github.com/yOyOeK1/oiyshTerminal/wiki/xdevdoc-otdmDriverProto)
	- [x] file system (**-dfs**) 
  		- [x] read file / directory
  		- [x] write to file
  		- [x] make directory

	- [x] Grafana (**-dgxxxx**):
		- [x] annotations (**-dganById**) 
  		- [x] dashboards by uid (**-dgdbByUid**) 
        - [ ] folders by uid (**-dgfoldersByUid**)
  		- [x] datasources by uid (**-dgdsByUid**)

	- [x] Node-red (**-dnr**):
  		- [x] flow(s) (**-dnrfByUid**) 
  		- [ ] subflow(s) (**-dnrsfByUid**)

- [x] Shell command wraper to mqtt / webSocket (**-webCmdSubProcess**) [xdevdoc](https://github.com/yOyOeK1/oiyshTerminal/wiki/xdevdoc-otdmDriverProto-web-cmd-sub-process)
  - [x] with live stdio and stdout to mqtt :)

- [ ] internal utility service system (**-serviceIt**) [info/xdevdoc](https://github.com/yOyOeK1/oiyshTerminal/blob/main/otdm-tools/data/data/com.termux/files/usr/bin/otdm_serviceIt_README.md)
	- [x] http interface
	- [x] mqtt interface 
    - [ ] sapis familly [info/xdevdoc](https://github.com/yOyOeK1/oiyshTerminal/blob/main/otdm-tools/data/data/com.termux/files/usr/bin/otdm_sapis_README.md)

- [x] Makes backups of (**-mkbp**):  
  - [x] ds|gdsuid|gdsid|gdsname|gdhs|gdhuid|gdhid|gdhname|*

- [x] Deb files:  
  - [x] pre deploy actions
  - [x] build .deb
  - [x] deploy .deb to repository
  - [x] update repository

---

**Home directory:** /data/data/com.termux/files/

The directory path looks like this so that otdm-tool could also run on android using Termux.
If you use otdm-tool on a different platform (I use it on Ubuntu) you do not need Termux but the path will still look like this for consistency.

**Config file:** /data/data/com.termux/files/home/.otdm/config.json

Some info for drivers and what to use as a default. If you use otdm-tools by installing otdm-installer-dummy This is a place where you need to set up ip, ports and other setting to match your system. Setting for Node-red, grafana, mysql. If you don't have some of those services on your system maybe you have access to it on different machine? Either way you can set it up in this file.

---

## examples:

* **getting** info **from dpkg** about all otdm compatible .deb's
  ```bash
  otdmTools.py -ddpkg '*' -oFile '/tmp/debs_status.json'
  ```
  *It will ask dpkg for all .deb's in repository / current package data base matching otdm family. Result go to oFile path*

* **add note** to internal cliper .otdm/cliper.json
  ```bash
  otdmTools.py -addNote "This is a example note 1."
  ```
 
* **help***
  ```bash
  otdmTools.py -h
  ```

* **backup** of all
  ```bash
  otdmTools.py -mkbp "*"
  ```
  
* **webCmdSubProcess** wrap bash command to mqtt or webSocket and interact with the app over websocket  
  ```bash
  otdmTools.py \
  -webCmdSubProcess "[/usr/bin/pkexec,--disable-internal-agent,whoami]" \
  -pH "pH93419_" \
  -oFile "--"
  ```
  It will start system authentication proces then run "whoami". Will start mqtt topic:
  - `subP/pH93419_/status` - will public **starting** or **done**
  - `subP/pH93419_/line` - will give line by line from command
  - `subP/pH93419_/in` - it's a stdin of command so if you have prompt or something you can interact with app.
  
  In action: https://www.youtube.com/watch?v=7Kc2dpNmxh4

---

## CHANGELOG

* migration in ddpkg from dpkg-query to apt-cache

---

## NOTES

- prompting system for $ auth /usr/bin/pkexec --disable-internal-agent /bin/echo 'foo'
- list all files in .deb
  dpkg -c otdm-tools*
