import logging
import asyncio

from hbmqtt.client import MQTTClient
from hbmqtt.mqtt.constants import QOS_1, QOS_2


#
# This sample shows how to publish messages to broker using different QOS
# Debug outputs shows the message flows
#

logger = logging.getLogger(__name__)

config = {

}

#C = MQTTClient()


@asyncio.coroutine
def test_coro():
    C = MQTTClient()
    yield from C.connect('ws://localhost:1880/ws/yss_In')
    tasks = [
        asyncio.ensure_future(C.publish('ws/yss_In', 'TEST MESSAGE WITH QOS_0',opcode=0)),
        asyncio.ensure_future(C.publish('a/b', b'TEST MESSAGE WITH QOS_1')),
        asyncio.ensure_future(C.publish('a/b', b'TEST MESSAGE WITH QOS_2')),
    ]
    yield from asyncio.ensure_future(tasks)
    logger.info("messages published")
    yield from C.disconnect()


if __name__ == '__main__':
    formatter = "[%(asctime)s] {%(filename)s:%(lineno)d} %(levelname)s - %(message)s"
    logging.basicConfig(level=logging.DEBUG, format=formatter)
    asyncio.get_event_loop().run_until_complete(test_coro())
