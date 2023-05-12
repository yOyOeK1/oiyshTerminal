

from ot_my_libs.TimeHelper import TimeHelper
from ot_my_libs.myLoger import *
import paho.mqtt.client as mqtt
import time
import sys



class myMqttClient:

    def __init__(self,
            clientId,
            host,
            port,
            on_connect=None,
            on_message=None,
            subscribe = ["#"]
            ):
        self.l = myLoger("myMqttClient", {
            'info': True,
            'debug': False,
            'error': False,
            'critical': True
            })
        self.ready = False
        self.th = TimeHelper()
        self.clientId = clientId
        self.host = host
        self.port = port
        self.subscripbeTo = subscribe

        self.makeClient(self.clientId,
            on_connect if on_connect else self.on_connect,
            on_message if on_message else self.on_message
            )

    def connect(self):
        self.cli.connect(self.host, self.port)


    def makeClient(self, clientId, on_connect, on_message):
        self.l.i("makeClient")
        self.cli = mqtt.Client( clientId )
        self.cli.on_connect = on_connect
        self.cli.on_message = on_message


    def on_connect(self, client, userdata, flags, rc):
        self.l.i("on_connected with result code [{}]".format(rc) )
        for topic in self.subscripbeTo:
            self.client.subscribe(topic)
        self.ready = True
        return 0

    def on_message(self, client, userdata, msg):
        self.l.i("on_message topic:[{}]    msg:[{}]".formet(
            msg.topic,
            msg.payload
            ))


if __name__=="__main__":
    mqC = myMqttClient(
    "clientStandAlone",
    '127.0.0.1',
    '12883'
    )

    mqC.cli.loop_forever()
