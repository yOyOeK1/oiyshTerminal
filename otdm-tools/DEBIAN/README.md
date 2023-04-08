# otdm-tools

With grate power comes grate responsibility. It's a power-user tool.

---

## why I need it?

For me it's all the time around similar subjects. Reading files, getting data from http. O this data is json, that data is in mysql I need a driver to talk to mysql then make query then I will have some data. New project similar story.

otdm-tools is my attempt to eliminate the idea of precise work type. My understenging is. You want to do "work / task". You know what is the medium providing / holding data.

It's becoming your universal worker, qualified for the exact work you have.


## dependencies

It will **expect from you:** python3, pip, jq, cowsays, 
Python: python3-apt|python-apt(optional), requests, paho-mqtt, uploadserver


## using it

- [ ] (**-ddpkg**) dpkg
  - [x] **"*"** otdm package list
  - [x] **"app"** get package details
  - [ ] install package
  - [ ] uninstall package

- [x] (**-dfs**) file system
  - [x] read file / directory
  - [x] write to file
  - [x] make directory

- [x] (**-osType**) recognize os
  - [x] termux 117
  - [x] ubuntu 22.04 and *.*

- [x] Grafana:
  - [x] (**-dganById**) annotations
  - [x] (**-dgdbByUid**) dashboards by uid
  - [x] datasources by uid

- [x] Node-red:
  - [x] (**-dnrfByUid**) flow(s)
  - [ ] (**-dnrsfByUid**) subflow(s)

- [x] Internal cliper
- [ ] (**-serviceIt**) internal utility service system [link...](otdm_serviceIt_README.md)(working on ....)

- [x] (**-webCmdSubProcess**) Shell command wraper to mqtt / webSocket
  - [x] with live stdio and stdout to mqtt :)

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

Some info for drivers and what to use as a default. If you use otdm-tools by installing otdm-installer-dummy This is a place where you need to set up ip, ports and other setting to mache your system.  Setting for Node-red, grafana, mysql. If you don't have some of those services on your system ma by you have access to it on different machine? Set it up in this file.

---

### the concept of otdmDriverProto.py

It's a definition of a universal driver. It can have:

- name - keyWord

- help

- GET - reading task

- POST - writing task

- DELETE - delete task

By using this solution we can ignore what kind of work we want to do. And especially how? It's delegated to otdm-tools :)

By expanding otdmDriverProto.py you can have workers knowing what to do with:

- dpkg

- file system

- Grafana:

  - annotations
    *check family of otdm-grafana-an-*

  - dashboards by uid
    *check family of otdm-grafana-db-*

  - datasources by uid
    *check family of otdm-grafana-ds-*

- Node-red:

  - flow(s)
    *check family of otdm-nrf-*

- [Web (.js) <=> mqtt <=> shell (sh)](https://github.com/yOyOeK1/oiyshTerminal/wiki/xdevdoc-otdmDriverProto-web-cmd-sub-process)
  *check family of otdm-p-*  

---

## examples:

* **getting** info **from dpkg** about all otdm compatible .deb's

  ```bash
  otdmTools.py -ddpkg '*' -oFile '/tmp/debs_status.json'
  ```

  It will ask dpkg for all .deb's in repository / current package data base matching otdm family. Result go to oFile path.

* **add note** to internal cliper .otdm/cliper.json

  ```bash
  otdmTools.py -addNote "This is a example note 1."
  ```
- it will try to **help**.

  ```bash
  otdmTools.py -h
  ```

- make **backup** of all

  ```bash
  otdmTools.py -mkbp "*"
  ```
* wrap bash command to mqtt or webSocket and interact with the app over websocket

  ```bash
  otdmTools.py \
  -webCmdSubProcess "[/usr/bin/pkexec,--disable-internal-agent,whoami]" \
  -pH "pH93419_" \
  -oFile "--"
  ```

  It will start system authentication proces then run "whoami". Will start mqtt topic:

  - subP/pH93419_/status - will public **starting** or **done**

  - subP/pH93419_/line - will give line by line from command

  - subP/pH93419_/in - it's a stdin of command so if you have prompt or something you can interact with app.

  In action: https://www.youtube.com/watch?v=7Kc2dpNmxh4


---

## CHANGELOG

* migration in ddpkg from dpkg-query to apt-cache

---

## NOTES

- prompting system for $ auth /usr/bin/pkexec --disable-internal-agent /bin/echo 'foo'
- list all files in .deb
  dpkg -c otdm-tools*
