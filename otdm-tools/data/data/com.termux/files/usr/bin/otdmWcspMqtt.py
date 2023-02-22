import os
import subprocess
import sys
import time
import threading

import _thread

try:
    import paho.mqtt.client as mqtt
except:
    print("paho missing - no woris it's for test.....")


class otdmWcspMqtt:
    cli = None
    pH = "ueoueouoeueo"
    topic = ""
    subP = 0
    mqttConf = {}

    def makeCli(self, pH, mqttConf):
        self.pH = pH
        self.mqttConf = mqttConf
        self.cli = mqtt.Client("webClientSubProcess%s"%pH)
        self.topic = f"subP/{pH}"
        self.cli.on_connect = self.on_connect
        self.cli.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        self.cli = client
        print("subscribe to: %s"%f"{self.topic}/#")
        self.cli.subscribe( f"{self.topic}/#" )
        return 0

    def pub(self, topic, msg):
        self.cli.publish( f"{self.topic}/{topic}", msg );

    def on_message(self, client, userdata, msg):
        #print("on_message")
        #print(msg.topic+" "+str(msg.payload))
        if msg.topic[-3:] == '/in':
            m = msg.payload
            print("got in cmd:%s"%m)
            print("send a %s"%m)
            self.subP.stdin.write(m)
            self.subP.stdin.flush()

    def runIt(self,a=0,b=0):
        print("hbMqttClient.runIt")
        _thread.start_new(self.intRunIt,())
        print("hbMqttClient.runIt DONE")

    def intRunIt(self,a=0,bb=0):
        print("hbMqttClient.intRunIt()",a,"  b",bb)
        print("connecting to mqtt  ------------------%s"%self.mqttConf)
        #sys.exit(1)
        conRes = self.cli.connect( self.mqttConf['host'], self.mqttConf['port'], 60 )
        self.cli.loop_start()
        print("hbMqttClient inRunIt DONE")


if __name__ == "__main__":
    print("running it as stand alone - test....")
    m = otdmWcspMqtt()
    m.makeCli( 'phTest1', {'host':'192.168.43.1', 'port':10883} )
    m.runIt()
    print("connected?")
    time.sleep(.5)
    m.pub( 'subP/phTest1/in', '123' )
    print("pub")
    time.sleep(.5)
    print("....")
    time.sleep(.5)
    print("....")
