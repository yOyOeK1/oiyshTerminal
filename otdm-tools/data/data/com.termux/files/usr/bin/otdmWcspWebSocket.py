import os
import subprocess
import sys
import time
import threading

import _thread
import logging
import asyncio

from hbmqtt.client import MQTTClient
from hbmqtt.mqtt.constants import QOS_1, QOS_2


logger = logging.getLogger(__name__)


@asyncio.coroutine
def test_coro( tasks ):
    print("coro:%s"%tasks)
    C = MQTTClient()
    for i,t in enumerate(tasks):
        print(f"pub msg {i}: topic:{t['topic']} -> {t['payload']}")
        tasks[i] = asyncio.ensure_future(C.publish(b'topic', b'payload'))
    yield from C.connect('ws://localhost:1880/ws/yss_In')
    yield from asyncio.wait(tasks)
    print("messages published")
    yield from C.disconnect()

class otdmWcspWebSocket:

    pH = "ueoueouoeueo"
    topic = ""
    subP = 0
    wsConf = {}

    def makeCli(self, pH, wsConf):
        self.pH = pH
        self.wsConf = wsConf
        self.topic = f"subP/{pH}"


    def pub(self, topic, msg):
        print("pub")
        asyncio.get_event_loop().run_until_complete(test_coro( [{'topic':topic, 'payload':msg}] ))


    def runIt(self,a=0,b=0):
        print("hbWsSocketClient.runIt")
        self.intRunIt()
        print("hbWsSocketClient.runIt DONE")

    def intRunIt(self,a=0,bb=0):
        print("hbWsSocketClient.intRunIt()",a,"  b",bb)
        url = f"ws://{self.wsConf['host']}:{self.wsConf['port']}{self.wsConf['path']}"


if __name__ == "__main__":
    print("running it as stand alone - test....")

    m = otdmWcspWebSocket()
    m.makeCli( 'pH11_', {'client':{}} )

    for t in range(0,10,1):

        if t == 3:
            m.pub("itATopic", "itAPayload")

        time.sleep(1)
        print("....")
