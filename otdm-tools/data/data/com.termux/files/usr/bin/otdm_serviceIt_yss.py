
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import _thread
import json
import random
import os
import subprocess

from otdm_serviceIt_prototype import *
from otdmSTS import *
from ot_my_libs.FileActions import FileActions as fad


'''

'''


class otSYSS( BaseHTTPRequestHandler ):

    otWebS = -1
    otP = -1
    apis = -1
    yssPath = "/home/yoyo/Apps/oiyshTerminal/ySS_calibration/"

    def sResp( self, r=200 ):
        self.send_response( r )

    def parsePath(self):
        trPath = ""
        args = {}
        
        qtmp = self.path.split("?")
        if len( qtmp ) == 1:
            trPath = qtmp[0]
        else:
            trPath = qtmp[0]
            for atmp in qtmp[1].split('&'):
                av = atmp.split('=')
                if len( av ) == 2:
                    args[ av[0] ] = av[1]
                else:
                    args[ av[0] ] = None

        hcl = self.headers['Content-Length'] 
        return {
            "path": trPath, 
            "args": args,
            "body": {} if hcl == None else json.loads( self.rfile.read( int( hcl ) ) )
            }
        
    def wr(self, dataResp ):
        if 1 :
            if isinstance( dataResp, str ):
                self.wfile.write(
                    bytes("%s" % dataResp, "utf-8")
                )
            else:
                dataRespStr = ''
                dataRespStr = json.dumps(dataResp)
                self.wfile.write(
                    bytes("%s" % dataRespStr, "utf-8")
                )

    def sRespHeadDone(self, statusCode=200):
        self.sResp( statusCode )
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def getFilePath(self, fpath ):
        return (f"{self.yssPath}{fpath}")

    def readf(self, fpath ):
        return "\n".join( self.otP.fa.loadFile( 
            self.getFilePath( fpath )
         ) )

    def do_POST(self):
        ''' to test it run 
          curl -X POST 'http://192.168.43.220:19999/yss?a=2' -d '{"abc":1}'
        '''

        self.otP.count['in']+=1

        paar = self.parsePath()
        print(f"* DEB POST working \nwith: {paar}")
        
        ''' 
        # org post data body extract 
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        print("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n"%(
                str(self.path), str(self.headers), post_data.decode('utf-8')))
        '''

        self.sRespHeadDone()
        self.wr( 'POST hello on raw serviceIt - yss' )
        self.otP.count['out']+=1
        return 0

    def do_GET(self):
        ''' to test it run 
          curl -X GET 'http://192.168.43.220:19999/abc/aaa?a&b=2' -d '{"abc":1}'
          this will make some debugs and response
        '''
        self.otP.count['in']+=1

        paar = self.parsePath()
        print(f"* DEB working with: {paar}")

        if paar['path'] == '/':
            self.sRespHeadDone()
            self.wr( 'hello on raw serviceIt - yss' )
            self.otP.count['out']+=1
            print("* done by path /")
            return 0

        elif paar['path'][:8] == "/@sapis/":
            self.sRespHeadDone()
            q = paar['path'][8:]
            tr_sts = otdmSTS( self.otP.sapis, q, self.otP.debugConfig );
            self.wr( tr_sts )
            self.otP.count['out']+=1
            print(f"* done by path /@sapis/ [{q}]")

            return 0

            
        elif paar['path'] in ['/favicon.ico']:
            self.sRespHeadDone()
            #self.wr( self.readf( "/icons/favicon.png" ) )
            self.wfile.write(
                #bytes("%s" % dataRespStr, "utf-8")
                open( self.getFilePath( "/icons/favicon.png"), 'rb' ).read()
            )
            self.otP.count['out']+=1
            print("* done by path /favicon.ico")
            return 0
            
        elif paar['path'] == "/debugIt":
            msg = {
                'path': self.path,
                'request': self.request
            }
            
            
            self.sRespHeadDone()
            self.wr( ("%s"%msg) )
            self.otP.count['out']+=1
            print("* done by debugeIt")
            print(msg)
            return 0

        else:
            self.sRespHeadDone(404)
            self.wr( '404 on this instance ...' )
            self.otP.count['out']+=1
            print("* done by 404")
            #print(dir(self))
            #print(self.address_string())
            return 0


        tr_sts = otdmSTS( self.otP.sapis, self.path[1:], self.otP.debugConfig );

        if self.otP.sitDebug == True:
            print(f"tr_sts ----------------{self.path}----")
            print("--- result ----")
            print(tr_sts)
            print("--- result ----")
        self.sResp( )
        self.send_header('Access-Control-Allow-Origin', '*')
        #self.send_header("Content-type", "text/json")
        self.end_headers()
        self.wr( tr_sts )
        #self.wfile.write(bytes("<p>Request: %s</p>" % self.path, "utf-8"))
        #print(f" so got GET with path [{self.path}]")
        self.otP.count['out']+=1
        return 0



# to run in as yss host for yss web site
# ./otdmTools.py -serviceIt yss


class otdm_serviceIt_yss( otdm_serviceIt_prototype ):
    count = { "in":0, "out":0, "ok":0, "err":0,"cmdOk":0,"cmdEr":0}
    conf = -1
    name = "yss"
    ver = "0.0.1"
    otYSS = -1
    otWebS = -1
    confYSS = { "ip": "192.168.43.220", "port": 19999 }

    def __init__(self, sapis, args, conf, sDebug ):
        #print(f"${self.name} constructor ....")
        super( otdm_serviceIt_yss, self ).__init__( sapis, args, conf, sDebug )
        #print("redirect it ....")
        self.otYSS = otSYSS
        self.r = random.Random()
        self.fa = fad()

    def setArgsConf(self, args, conf):
        self.args = args
        self.conf = conf

    def runIt( self, conf ):
        self.conf = conf
        if self.sDebug:print(f"otSYSS . runIt ....")
        _thread.start_new(self.intRunIt,())


    def intRunIt(self, a=0, b=0):
        #if self.sDebug: 
        print("otSYSS Server started http://%s:%s" % (self.confYSS['ip'], self.confYSS['port']))
        otSYSS.otP = self
        self.otWebS = HTTPServer( (self.confYSS['ip'], self.confYSS['port']), otSYSS )
        self.isOk = True
        try:
            self.otWebS.serve_forever()
        except KeyboardInterrupt:
            pass

        self.otWebS.server_close()
        self.isOk = False
        print("otSYSS Server stopped.")
