import websocket
import sys
import time
import ssl
from threading import Thread


def on_message(ws, message):
    print(message)
    if message[0:6]=='{"0":{':
       print(message)


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### closed ###")



clientIdent = 'draPenEmuPyth'

def on_open(ws):

    def run(*args):
        while True:
            # send the message, then wait
            # so thread doesn't exit and socket
            # isn't closed
            print("w")
            ws.send(f"wsClientIdent:{clientIdent}")
            time.sleep(10)

        time.sleep(1)
        ws.close()
        print("Thread terminating...")

    Thread(target=run).start()


def wsStart( callOnMsg, wsCI='NotSetIdentDef', host = "ws://localhost:2999/" ):
    global clientIdent
    clientIdent = wsCI
    websocket.enableTrace(False)
    #websocket.enableVerify( False )
    #websocket.enableTrace(False)
    ws = websocket.WebSocketApp(
        host, on_message=callOnMsg, on_error=on_error, on_close=on_close
    )
    ws.on_open = on_open


    def run(*args):
        time.sleep(1)
        print("Started WS client ... {}\n\twsClientIdent: {}".format(
            host, wsCI
        ))
        ws.run_forever( ws.run_forever( sslopt={"cert_reqs": ssl.CERT_NONE} ) )
        print("Thread terminating...")

    Thread(target=run).start()




if __name__ == "__main__":
    #websocket.enableTrace(True)
    if len(sys.argv) < 2:
        host = "ws://localhost:2999/"
    else:
        host = sys.argv[1]
    ws = websocket.WebSocketApp(
        host, on_message=on_message, on_error=on_error, on_close=on_close
    )
    ws.on_open = on_open
    ws.run_forever()