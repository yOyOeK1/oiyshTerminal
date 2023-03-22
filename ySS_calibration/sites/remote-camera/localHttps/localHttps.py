import http.server, ssl, io
from datetime import datetime
import json

print(" at :4443")
#print(" and POST receiver /camPost at :4444")
server_address = ('0.0.0.0', 4443)
#server_addressPost = ('0.0.0.0', 4444)
import uploadserver
import base64,re
from PIL import Image
import requests
from urllib.parse import unquote


yssHome = '/OT/ySS_calibration'
yssUrlHppts = 'http://192.168.43.220:4443'
yssLibsDir = f"{yssHome}/libs"



class mySHRHPOST(http.server.SimpleHTTPRequestHandler):

    def _set_headers(self, doEnd=True):
        print(" set_headers ....")
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '192.168.43.220')
        self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Max-Age', '1000')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Referrer-Policy', 'unsafe-url')

        if doEnd == True:
            self.end_headers()


    def getI420FromBase64(self, codec, image_path="/tmp"):
        array = codec.split('data:image/jpeg;base64,')
        base64_naked = array[1]
        imgdata = base64.b64decode(base64_naked)
        with open(image_path, 'wb') as f:
            f.write(imgdata)
        f.close()

    def do_GET(self):
        print(f"do_GET ..... path [{self.path}]")
        if self.path[:6] == "/toNR?":
            print("     Got to Node-RED: %s"%self.path)
            u = unquote( f"{self.path}"[6:] )
            print("current u decode status is.....")
            print(u)
            try:
                j = json.loads( u )
            except:
                print("Error in parsing message ....")
                self._set_headers()
                return 0

            self.pushToNR( j )

            self._set_headers()
            return 0

        elif self.path[:6] == "/libs/":
            self.path = f"{yssLibsDir}/{self.path[6:]}"
            print("     Have libs dir shift prefix ....")
            #print(f"    New path is .... {self.path}")
            self._set_headers()
            self.wfile.write( bytes(
                open( self.path, 'r').read().replace(
                    'socketIn = new  WebSocket("ws://192.168.43.1:1880/ws/accel/oriCal");',
                    'socketIn = new  WebSocket("ws://192.168.43.220:1880/ws/yss");'
                ).encode('utf-8')
                )
            )
            return 0

        else:
            self._set_headers( doEnd=False )
            super().do_GET()

    def pushToNR( self, msg ):
        print(f" push to Node-RED .... ", end="")
        oturi = f"http://192.168.43.220:1880/camPost"

        res = requests.get(url=oturi, params=msg)
        print(f"get res ... {res}")


    def do_POST(self):
        print(f" do_POST ............path: {self.path}")


        if self.path == "/camPost":
            content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
            post_data = self.rfile.read(content_length) # <--- Gets the data itself
            postDec = unquote(post_data.decode())
            #print(postDec)
            print( f"   Posted body len ... {len(post_data)}") # <-- Print post data
            devSenderN = ""
            data = ""
            if postDec.find('&') != -1:
                print("     got arguments .....")
                d = postDec.split('&')
                for e in d:
                    vt = e.split('=')
                    if vt[0] == 'data':
                        #print(vt)
                        data = bytes(vt[1].split(';base64,')[1].encode())
                        if len(data)%4 != 0:
                            data = data[:-(len(data)%4)]
                    elif vt[0] == 'devName':
                        devSenderN = vt[1]
            else:
                print("No args no action .....")
                self._set_headers()
                return 0




            now = datetime.now()
            fnN = now.strftime(f"./camsFiles/post_{devSenderN}_%y%m%d_%H%M%S.base64")

            ## save as file
            print(f"    data len {len(data)} from {devSenderN} file name is ...  {fnN} ")
            base64_naked = data
            print("     converting .....")
            try:
                imgdata = base64.b64decode(base64_naked)
                f = open(fnN, 'wb')
                f.write(imgdata)
                f.close()

                if data != b'':
                    ## do request to api about new file
                    self.pushToNR( {
                        "f": fnN,
                        "devName": devSenderN
                    })
            except:
                print(" error in base64 to binarry ...")
                print(data)



            print("ALL OK")
            self._set_headers()
            return 0


from multiprocessing import Process
import time, sys
isWorking = True


def doLoopPost():
    global isWorking
    while isWorking == True:
        print("post iter ....")

        httpdP  = http.server.HTTPServer(server_addressPost, mySHRHPOST )
        httpdP.socket = ssl.wrap_socket(httpdP.socket,
                                       server_side=True,
                                       certfile='localhost.pem',
                                       ssl_version=ssl.PROTOCOL_TLS)
        httpdP.serve_forever()
        print("Post done ... looping ...")

        time.sleep(1)

if __name__ == "__main__":
    print("main action !")


    httpd = http.server.HTTPServer(server_address, mySHRHPOST)#http.server.SimpleHTTPRequestHandler)
    httpd.socket = ssl.wrap_socket(httpd.socket,
                                   server_side=True,
                                   certfile='localhost.pem',
                                   ssl_version=ssl.PROTOCOL_TLS)
    #h1 = httpd.serve_forever()
    p1 = Process( target=httpd.serve_forever )


    #p2 = Process( target=doLoopPost )
    p1.start()
    #p2.start()
    p1.join()
    #p2.join()
