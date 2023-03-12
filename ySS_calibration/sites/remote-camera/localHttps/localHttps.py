import http.server, ssl, io
from datetime import datetime


print(" at :4443")
#print(" and POST receiver /camPost at :4444")
server_address = ('0.0.0.0', 4443)
#server_addressPost = ('0.0.0.0', 4444)
import uploadserver
import base64,re
from PIL import Image
import requests

class mySHRHPOST(http.server.SimpleHTTPRequestHandler):

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()


    def getI420FromBase64(self, codec, image_path="/tmp"):
        array = codec.split('data:image/jpeg;base64,')
        base64_naked = array[1]
        imgdata = base64.b64decode(base64_naked)
        with open(image_path, 'wb') as f:
            f.write(imgdata)
        f.close()

    def do_POST(self):
        print(f" do_POST ............path: {self.path}")

        if self.path == "/camPost":
            content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
            post_data = self.rfile.read(content_length) # <--- Gets the data itself
            print( f"Posted body len ... {len(post_data)}") # <-- Print post data

            now = datetime.now()
            fnN = now.strftime("./camsFiles/post_%y%m%d_%H%M%S.base64")

            ## save as file
            print(f"file name is ... {fnN}")
            f = open(fnN, 'wb')
            base64_naked = f"{post_data.decode()}"[23:]
            imgdata = base64.b64decode(base64_naked)
            f.write(imgdata)
            f.close()

            ## do request to api about new file
            print("GET comPost ... ",end="")
            oturi = f"http://192.168.43.220:1880/camPost"
            res = requests.get(url=oturi, params={ "f": fnN })
            print(f"get res ... {res}")


            self.wfile.write(
                bytes(
                    f"<html><body><h1>POST!</h1></body></html>".encode('utf-8')
                )
            )

            self._set_headers()


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
