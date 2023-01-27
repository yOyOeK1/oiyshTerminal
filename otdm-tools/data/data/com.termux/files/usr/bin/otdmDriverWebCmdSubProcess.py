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

    keyWord = "webCmdSubProcess"


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
