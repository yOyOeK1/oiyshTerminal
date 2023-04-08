# otdm-tools-packitso

  Set of helpers based on idea of otdm-tools proto driver. Building sets of
  interchangable works. So works how is don is not important. This is delegate to
  otdm-tools proto driver. Driver know how to make a X work for us.

  `-packitso` [action] - (?|lsWork|yes)
  `-work` [work] - (nrf|fs|yss-site|.debBranch) work type (selection of tools is delegated )
  `-forceHost` [ip] - if needed for data sourcing different then your otdm-tool config file .otdm/config.json
  `-ident` [uid] - identification of work peas to source
    * `Node-red` - uid of node flow
    * `fs` - file / directory path
    * yss-site` - path to site directory (need to be external?)
    *.`debBranch` - name of debian package (need to be packitso?)
  `-oFile` [pathToDir] - path to directory to store results of operation.


## example

  - Getting workers list... store result in `/tmp/workers.json`
    ```shell
    otdmTools.py -packitso lsWork -oFile '/tmp/workers.json'
    ```
    *It will give you _json_ of in system drivers proto in array. Entrence dict with :name: and :keyWord of driver*
    in my case is my selection
    ```json
    {
      "name": "ddpkg",
      "keyWord": "ddpkg"
    },
    ....
    ```

  - Getting all flows from node-red store result in /tmp/currentFlowsAtDell.json with additional forceHost option.
    ```shell
    otdmTools.py -forceHost 192.168.43.220 -packitso ls -work n -ident '*' -oFile '/tmp/currentFlowsAtDell.json'
    ```
    *It will give you _json_ _array_ of all flows in _json_ as you get it from :1880/flows GET only tabs / flows. Where `n` is a phantom get your list from lsWork*

  - Getting one flow from Node-red store it in /tmp/flow_d43.json
    ```shell
    otdmTools.py -packitso ls -work d -ident 'd42e4dfde145ec63' -oFile '/tmp/flow_d43.json'
    ```
    *_json_ is a Node-red HTTP API as work in keyWork from lsWork in this case is where `d` is a phantom get your list from lsWork*

  - Getting datasource from grafana to the console
    ```shell
    otdmTools.py -forceHost 192.168.43.1 -packitso ls -work 0 -ident 'p8Fm6u87k' -oFile '--'
    ```

  - backup / getting all `grafana` annotations store it by `host` with current timestamp.
    ```shell
    host="192.168.43.220";
    curl "http://""$host"":1990/packitsoLsAll/dganById/.raw" | \
    jq '.' > "/tmp/grafAnAll_""$host""_$(date +%s).json"
    ```
