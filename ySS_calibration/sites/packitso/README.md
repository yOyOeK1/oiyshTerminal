# otdm-yss-packitso

It is a yss site otdm-yss-packitso web front end and otdm-tools-packitso. Pack from otdm- family.

Easy way to deploy your stuff to otdmp- family. otdm-tools have build in driver proto layer. This is giving as a way to make a simple work in places. Word "work" in in meaning swap enable actions ( Node-RED flow, Grafana dashboard, yss-site, bash script, .... ) If word "work" in replaceable we have a `combo box` to select from types of available works. Selecting what to do to make a .deb. It adds all marginal scripts. Only to install / remove it as a .deb with stuff you select to put in it. Prepare selection to deployment to .deb

It use it's home directory as a storage for packitso sets. Directory is located in `.otdm/yss-packitso` In it you have folders `./p-*` those are the packitso folders.
In it you have `packitso.json` having all information needed for `otdmTool` to do background work. End result is updated repository with your new .deb file in it. NICE!

## Using packitso

From main yss site select "pack it so"

![](./ss_in_yss.png)

*you need to have it in your yss instance*

Then start new by pressing

![](./ss_start_new.png)

*click button to start making new ..*

Some minimum information about your upcoming .deb release

![](./ss_basic_form.png)

Easy. Select [ProtoDriver](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-tools#idea-of-otdmdriverprotopy) / [ident](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-tools#examples-of-using-it) from where you want to make a work on. Then select type of work. Then select what to take to deployment.

![](./ss_selected_driverProto.png)

*selected driverProto as node-red next to do is to set flow to deploy*

Saving

![](./ss_toastOnSave.png)

*Toast to let you know on status of saving...*

 Pack it so** ... to get **.deb**

![](./ss_clean_save_packitso.png)





## Status of coding

It's important section. This is still in progress project. It's to big to do it all at once :)

So **what we have** what **TODO**:

- [x] Main page

- [x] List of packitso'us
  
  - [x] fast way of backuping

- [x] Start new one

- [x] Save as new

- [x] Overwrite

- [ ] Delete

- [ ] otdm-dev

- [x] otdm-tools handlers ....
  
  - [x] execute `cmd` in `sh` layer and get `exitCode`
  
  - [x] be able to make backups
  
  - [x] init directory as git repository
  
  - [x] ....

- [x] Deploying packitso as .deb

- [ ] Examples, tutorials

- [x] rest..... ( oiyshTerminal - otdm all this repo final version )

## Screenshots of the site

**Main**
![](./ss_mainPage.png)
*Main page of packitso. Super touch friendly using mApp. You can start new packitso or edit on from directory*



![](./ss_toasts1OnIndex.png)

*Information on loading status updat*



**Editing**
![](./ss_editingPackitso.png)
*Editing packitso ./p-nameOfPack/packitso.json This is a gate to have .deb with packitso solution*

## Notes

- [x] Init git repository from javascript in set directory. Makes carusela of directory to have backups option on crash.
  
  ```javascript
  let c = new mDoCmd();
  c.doSh('/data/data/com.termux/files/usr/bin/packitsoSh.sh -setPackGit /tmp/a/p-nrf-hhbell-tts','no',(d,r)=>{cl(d); c.cmdWork = false; });
  //on console on callback
  /*
  .....
  24: "exitCode:0" << -- NICE! more about [exitCode - in packitsoSh.sh](https://github.com/yOyOeK1/oiyshTerminal/blob/main/otdm-tools-packitso/data/data/com.termux/files/usr/bin/packitsoSh.sh)
  25: -1
  length:26
  [[Prototype]]:Array(0)
  */
  ```
