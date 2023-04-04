## ot-sf2n

Is for node / cli Node-RED subflow to npm directory tool chain. Now is super basic.

### in background

Take id of a instance of your subflow. In need to have all stuff for npm deployment set up end dandy. `meda.type` in your sub flow need to end wint `my-lowcase**-dev**` and it's cut off.
It try's to make some if'ups with id's so it can make some problem in future.
In do one README.md to them all!

### in CLI

From directory of node_module all starts by `node . [args]`

- `-h` | `--help`    _string_    to get help

- `doId`=`aabbcc` `pDir`=`prefixDir`     will export `aabbcc` subflow to npm from instance to `prefixDir`

- `runTestErr`        will *exit code 1*

So example command can be:

```shell
node . doId=287824b207e90fa3 pDir=/tmp/b

# or

./otdmBuildNodeREDSubs.sh

# or

./sf2n.sh f31c6882d831136a /OT/OTNPM/ot-sf2n-builds

```



---

If you see that this make sens [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS)

Master repository: https://github.com/yOyOeK1/oiyshTerminal
