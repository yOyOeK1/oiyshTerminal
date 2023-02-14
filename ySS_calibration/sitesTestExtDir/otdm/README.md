# OTDM in yss

It need some explanation what is going on!?!@Xe  yss is a web site helping in hosting sites. OTDM is oiyshTerminal Debian Manager. I'm currently trying to fuse them together...

Package control file now use custom field X-Otdm. This field will be used by otdm tool as key binder for, package vs inputs of data what you have in the system. It will simplify step of sorting things if you want help. It will be possible
to find .debs maching your need of your current instance.

## Status of coding...

- [x] is in menu

- [x] list installed sites

- [x] view selected site

- [ ] enable / disable site

- [ ] uninstall site

- [x] list sites from repository

- [ ] install new stuff

- [ ] make one button branche

- [ ] deploy to repo sites

## ScreenShots

---

Otdm in menu. If all is ok you should see it in side menu.

![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/ySS_calibration/sitesTestExtDir/otdm/screenshots/01inMenu.png)



List of installed sites on your instance.

![list of installed](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/ySS_calibration/sitesTestExtDir/otdm/screenshots/02InstalledApps.png)

---

Example of finding key word in sites. Site installed [off] (disabled) and color is saing it's external directory site.

![looking for](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/ySS_calibration/sitesTestExtDir/otdm/screenshots/03LokingFor.png)

---

Application detail view.

![app details](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/ySS_calibration/sitesTestExtDir/otdm/screenshots/04AppDetails.png)

---

Connecting web page user expirience with dpkg **.deb** user space. Integration with [otdm-tools](https://github.com/yOyOeK1/oiyshTerminal/blob/main/otdm-tools/).

![from dpkg passing otdmtools](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/ySS_calibration/sitesTestExtDir/otdm/screenshots/05ListFromDpkgSearchOtdm.png)

---

Details form [otdm-tools](https://github.com/yOyOeK1/oiyshTerminal/blob/main/otdm-tools/DEBIAN/README.md) -> dpkg.

![details of deb](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/ySS_calibration/sitesTestExtDir/otdm/screenshots/06DebPackageDetails.png)

### NOTES

Fore using diff, patch

* get patch update file
  
  ```bash
  $ diff -u ./oldFile ./newFile > ./patchToUpgrade.patch
  ```

* set patch on file
  
  ```bash
  $ patch ./oldFile ./patchToUpgrade.patch
  ```

* reverse downgrade
  
  ```bash
  $ patch -R ./oldFile ./patchToUpgrade.patch
  ```

* nice two columns view of two files and difference
  
  ```bash
  $ diff -y ./oldFile ./newFile
  ```

* https://www.shellhacks.com/create-patch-diff-command-linux/
