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

## xdevdoc how to code with it
  Link to development documentation of this [xdevdoc-otdmDriverProto]([xdevdoc](https://github.com/yOyOeK1/oiyshTerminal/wiki/xdevdoc-otdmDriverProto))
