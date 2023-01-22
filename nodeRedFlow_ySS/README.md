# Node-red flow for doing ySS.



Part of a [otdm-yss-otdm](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/sitesTestExtDir/otdm/README.md)



This .json builds flow in Node-red to give all nesseseri support to make [otdm-yss](https://github.com/yOyOeK1/oiyshTerminal/blob/main/ySS_calibration/README.md) runing.



## Providing...

- http web / file **hosting** -> http://ipOfYourNodeRed:1880/yss

- makes **WebSocket** ws://ipOfYourNode/ws/yss_In and ws://ipOfYourNode/ws/yss

- run **API** over **HTTP** using http://ipOfYourNodeRed:1880/yss/?otdmQ:{args like otdm-tools} binds it with shell layar of machine.



## HTTP API :1880/yss/?otdmQ:

It's only a bridge to [otdm-tools](https://github.com/yOyOeK1/oiyshTerminal/blob/main/otdm-tools/DEBIAN/README.md). Conversion of args is to json it looks like this...

- To get from grafana annotations by id = 2

```json
{ "dgaById": "2" }
```

Return - json with annotation with id 2 from grafana, otdm-tool config file settings.



- To list /tmp directory:

```json
{ "dfs": "/tmp" }
```

Return - json with listed /tmp directory and some extra data. It's a request handled by dfs driver in otdm-tools.

**IMPORTANT** This is powerfull and dengerus. Be avare what power you have now!

```json
[
    {
        "name": "bwrap.log",
        "fullPath": "//tmp//bwrap.log",
        "isFile": true,
        "size": 10134
    },
    {
        "name": ".org.chromium.Chromium.odPLiv",
        "fullPath": "//tmp//.org.chromium.Chromium.odPLiv",
        "isFile": false
    },
    {
    ...
```





### ver 0.3 - More integration with otdmTols.

This update is about creating connection Node-red currently suporting HTTP API as a new thing in this release. Building bridge for quering dpkg from web brawser. It provide only .deb in repository from otdm familly.

![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/ySS_calibration/sitesTestExtDir/otdm/screenshots/05ListFromDpkgSearchOtdm.png)  

*This is a list of .deb files from dpkg-query request Going over HTTP API and we are getting list of it in web app.*
