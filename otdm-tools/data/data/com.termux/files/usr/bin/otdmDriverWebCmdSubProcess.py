from otdmDriverProto import *
import os
import subprocess
import sys, apt,apt_pkg
import re

import time
from subprocess import Popen, PIPE, STDOUT
import threading

import _thread

from otdmWcspMqtt import *
from otdmSubProc import *


class otdmDriverWebCmdSubProcess( otdmSubProc, otdmDriverProto ):
    """
    to access it use:
    `$ otdmTools.py -webCmdSubProcess ......`

    Web cmd sub precess driverProto brings bash and pips to a game of oiyshTerminal and otdm-tools.
    It's to run somethin externaly on different instance of otdm-tools or localy but event starting it
    can be a web page javascript funcion invoque. Or as a element in any of your dayly tasks.

    Brings bash layer to web page or Node-red.

    For me updating system repository

    ## Example

    ```bash
    $ otdmTools.py -pH "pH84946_91997" -oFile "/tmp/ee.json" -webCmdSubProcess \
    '[cat,/data/data/com.termux/files/home/.otdm/config.json,|,jq,"keys in conf: "+keys[],-r]'
    ```
    Return on mqtt subP/pH84946_91997/line
    ```bash
    0:keys in conf: grafana
    1:keys in conf: mqtt
    2:keys in conf: mysql
    3:keys in conf: node-red
    4:keys in conf: otdm
    ```
    *This will `can` file in `bash pipe` it to `jq` parse it in `jq` add prefix. Result is send to mqtt at subP/pH84946_91997*

    ```bash
    $ otdmTools.py -webCmdSubProcess "[mplayer,/myMusic.mp3]" -pH "pH93419_" -oFile "--"
    ```
    This will start mqtt topic
    - subP/pH93419_/status - will public starting or done
    - subP/pH93419_/line - will give line by line from command
    - subP/pH93419_/in - it's a stdin of command so in this example sending p will pause :)

    **Check:** helper on javascript site [mDoCmd - documentation](./yss-js-functions-mDoCmd)

    """

    keyWord = "webCmdSubProcess"
    """**keyWord**  **webCmdSubProcess**"""


    def __init__(self, args, conf, prefixFS="/" ):
        super(otdmDriverWebCmdSubProcess, self).__init__( args, conf, "ddpkg", prefixFS )

    def getHelp( self ):
        print( '-'+self.keyWord+''' Connects shell commands to yyy yes mqtt.
        example:
        $ otdmTools.py -webCmdSubProcess "[mplayer,/myMusic.mp3]" -pH "pH93419_" -oFile "--"
        This will start mqtt topic
            subP/pH93419_/status - will public starting or done
            subP/pH93419_/line - will give line by line from command
            subP/pH93419_/in - it's a stdin of command so in this example sending p will pause :)
        ''')

    def chkHost( self ):
        print("check webCmdSubProcess in system ....")
        return 'ok?'


    def GET( self, name, fromQ = "" ):
        print(f"GET  -> [{name}] ")
        print("args %s"%self.args)

        return self.SubProcGET( name, fromQ )
