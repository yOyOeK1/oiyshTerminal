# otdm-tools

With grate power comse grate responsibility. It's a power user tool.



---

## Why I need it?

It's for me all the time arround the similar subject. Reading files, getting data from http. O this data is json, that data is in mysql I need a driver to talk to mysql then make query then I will have a data. New project similar story.

otdm-tools is a My attempt to eliminate a idea of precise work type. My understenging is. You wast to make "work / task". You know what is a medium providing / holding data.

It's becoming your universal worker, qualiffy for the exact work you have.



**knowing what to do with:**

- [ ] (**-ddpkg**) dpkg

  - [x] **"*"** otdm package list

  - [x] **"app"** get package details

  - [ ] install package

  - [ ] uninstall package

- [x] (**-dfs**) file system

  - [x] read file / directory

  - [x] write to file

  - [x] make directory

- [x] Grafana:

  - [x] (**-dganById**) annotations

  - [x] (**-dgdbByUid**) dashboards by uid

  - [x] datasources by uid

- [x] Node-red:

  - [x] (**-dnrfByUid**) flow(s)

- [x] Internal cliper

- [x] Makes backups of (**-mkbp**):

  - [x] ds|gdsuid|gdsid|gdsname|gdhs|gdhuid|gdhid|gdhname|*

- [x] Deb files:

  - [x] pre deploy actions

  - [x] build .deb

  - [x] deploy .deb to repository

  - [x] update repository


---

**Home directory:** /data/data/com.termux/files/

Yes. It's there to have any chance for me to have it working on android :). If you use otdm-tool on different platform then termux it's Cool !

I'm using it on ubuntu and it's fine. Main part is in python3 so it's makin not so big differenc wher it's running. But it **expect from you to have:** python3, pip, jq



**Config file:** /data/data/com.termux/files/home/.otdm/config.json

Some info for drivers and what to use as a defoults. If you use otdm-tools by installing otdm-installer-dummy This is a place where you need to set up ip, ports and other setting to mache your system.  Setting for Node-red, grafana, mysql. If you don't have some of those services on your system ma by you have access to it on different machine? Set it up in this file.



---

### Idea of otdmDriverProto.py

It's a definition of a universal driver. Can have:

- name - keyWord

- help

- GET - reading task

- POST - writing task

- DELETE - delete task

By using this solution we can ignore what cinde of a work we want to do. And specially how? It's delegated to otdm-tools :)

By expanding otdmDriverProto.py you can have worker knowing what to do with:

- dpkg

- file system

- Grafana:

  - annotations

  - dashboards by uid

  - datasources by uid

- Node-red:

  - flow(s)



---

## Examples of using it:

* **getting** info **from dpkg** about all otdm compatible .deb's

```bash
otdmTools.py -ddpkg '*' -oFile '/tmp/debs_status.json'
```

It will ask dpkg for all .deb's in repository / current package data base maching otdm. Result go to oFile path.



* **add note** to internal cliper .otdm/cliper.json

```bash
tdmTools.py -addNote "This is a example note 1."
```



- it will try to **help**.

```bash
tdmTools.py -h
```



- make **backup** of all

```bash
tdmTools.py -mkbp "*"
```



---

## CHANGELOG

* migration in ddpkg from dpkg-query to apt-cache



---

## NOTES

- prompting system for $ auth /usr/bin/pkexec --disable-internal-agent /bin/echo 'foo'
- list all files in .deb
  dpkg -c otdm-tools*
