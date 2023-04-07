import os
import subprocess
import sys
import time
from datetime import datetime
import threading
import json

import _thread

from otdm_serviceIt_prototype import *

try:
    import paho.mqtt.client as mqtt
except:
    print("paho missing - no woris it's for test.....")


'''

m='{
    "pH":123,
    "cmd":"-dnrfByUid a -pH 00009999"
}'
mosquitto_pub -h 'hu' -p 10883 -t 'and/otdmTools/cmd/run' -m "$m"

will return all Node-RED flows `a` as all
It will Return to mqtt otdm_serviceIt_mqtt.mqttC['topicPrefix']/cmd/run/res/123


'''

class otCmd:
    isDone = False
    pH = -1
    cmd = ''

    def __init__(self, pH, cmd):
        this.pH = pH
        this.cmd = cmd


class otdm_serviceIt_mqtt( otdm_serviceIt_prototype ):
    mqtCli = -1
    client = -1
    mqttC = {
        "clientId": "otdmTools_serviceIt",
        "topicPrefix": "and/otdmTools",
        "ver": "0.0.1"
    }

    name = 'S:mqtt'
    isOk = False
    count = { "in":0, "out":0, "ok":0, "err":0, "cmd":0, "cmdOk":0, "cmdErr":0 }
    ver = "0.0.2"

    def __init__(self, sapis, args, conf ):
        #print(f"${self.name} constructor ....")
        super( otdm_serviceIt_mqtt, self ).__init__( sapis, args, conf )
        self.mqtCli = mqtt.Client(self.mqttC['clientId'])
        self.mqtCli.on_connect = self.on_connect
        self.mqtCli.on_message = self.on_message



    def gTopic( self, t ):
        return f"{self.mqttC['topicPrefix']}/{t}"

    def rTopic( self, t ):
        return t[ (len(self.mqttC['topicPrefix'])+1) : ]



    def on_connect(self, client, userdata, flags, rc):
        print(f"${self.name} - Connected with result code "+str(rc))
        self.mqtCli = client
        print(" - set some basic info about otdm service mqtt ....")
        now=datetime.now()
        tn=now.strftime("%s")
        self.isOk = True
        self.publish( "status/startAt", tn, True );
        self.publish( "status/ver", self.mqttC['ver'], True );
        self.publish( "status/ping", tn, True );



        print(" - subscribe to: ",self.gTopic("#"))
        self.mqtCli.subscribe( self.gTopic("#") )
        return 0

    def publish( self, topic, msg, retainMy=False ):
        if self.isOk == False:
            print(f"${self.name} - client not connected .....")
            self.count['err']+=1
        else:
            self.mqtCli.publish( self.gTopic(topic), msg, retain=retainMy );
            self.count['out']+=1


    def pCmd( self, topic, msg ):
        #print( f"pCmd ....... [{topic}] " )
        self.count['cmd']+=1
        if topic[:len(self.mqttC['topicPrefix']):] != self.mqttC['topicPrefix']:
            print("S: dump ..")
            return 0

        c = self.rTopic( topic )
        #print("pre [%s]"%c)

        if c in ["status/ping"]:
            #print("S: got ping own..")
            pass
        elif topic[:29] == "and/otdmTools/cmd/run/res/":
            return 0

        elif topic[:21] == "and/otdmTools/status/":
            return 0

        elif c == "cmd/echo":
            print("S: got echo ...")
            self.publish( 'cmd/echo/res', msg );

        elif c == "cmd/updateCount":
            print("S: update counts ...")
            for k in self.count.keys():
                self.publish( 'status/caunt/'+k, self.count[ k ] );


        elif c == "cmd/run":
            print("S: got run ...")
            j = -1
            try:
                j = json.loads( msg )
            except:
                print("S: Error message ...")
                self.publish( 'cmd/run/Eres', 'wrong msg' );
                pass

            print("OK so try to run cmd ....")
            pH = j.get('pH','')
            if pH == "":
                print("S: Error no pH")
                self.publish( 'cmd/run/Eres', 'Error no pH' );

            cmd = j.get('cmd','')
            if cmd == "":
                print("S: Error no cmd")
                self.publish( 'cmd/run/Eres', 'Error no cmd' );


            oFileP = f"/tmp/otSerIt_{pH}.res"
            print("Do it ..."+oFileP)
            subprocess.run(
                '/home/yoyo/Apps/oiyshTerminal/otdm-tools/data/data/com.termux/files/usr/bin/otdmTools.py '+
                    j.get('cmd')+" -oFile "+oFileP,
                shell=True
                )
            print(" DONE")
            tr = ""
            if os.path.exists( oFileP ) == True:
                with open(oFileP, 'r') as file:
                    tr = file.read().rstrip()

                print(f"S: Result for {pH}")
                self.publish( f"cmd/run/res/{pH}", tr );
                self.count['cmdOk']+=1



        #self.publish( 'cmd/echo/res', msg );

        else:
            print(f"S: NaN cmd [{topic}]  len(msg) [{len(msg)}]")
            self.count['cmdErr']+=1


    def on_message(self, client, userdata, msg):
        self.count['in']+=1
        #print(f"got in topic: {msg.topic} cmd: {m}")
        self.pCmd( msg.topic, msg.payload )
        #print("send a %s"%m)
        #self.subP.stdin.write(m)
        #self.subP.stdin.flush()

    def intRunIt(self, a=0,bb=0):
        print(f"${self.name} - intRunIt a",a,"  b",bb)
        conRes = self.mqtCli.connect( self.conf['mqtt']['host'], self.conf['mqtt']['port'], 60 )
        self.mqtCli.loop_start()
        print(f"${self.name} - intRunIt DONE")

    def runIt(self, conf=0,b=0):
        print(f"${self.name} - runIt")
        self.conf = conf
        _thread.start_new(self.intRunIt,())
        print(f"${self.name} - runIt DONE")
