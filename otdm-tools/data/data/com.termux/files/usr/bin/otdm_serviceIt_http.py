
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import _thread
import json
import random
import os
import subprocess

from otdm_serviceIt_prototype import *
from otdmSTS import *


'''
###  tests
curl http://192.168.43.220:1990/sum/1/2/divPipe/0.2
> [0, 15.0]

curl http://192.168.43.220:1990/sum/1/2/divPipe/0.2/json
> {"code": 200, "status": "success", "msg": 15.0}

#### to grafana
  ##### grafana folders to gets to raw :)
  http://192.168.43.220:1990/otdmTools/-forceHost%20192.168.43.220%20-dgfoldersByUid%20a/raw
  > [{"id": 3, "uid": "WfQnvHc7z", "title": "4ilu", "uri": "db/4ilu", "url": "/dashboards/f/WfQnvHc7z/4ilu", "slug": "", "type": "dash-folder", "tags": [], "isStarred": false, "sortMeta": 0}, {"id": 9, "uid": "olDaEdL4k", "title": "for-development", "uri": "db/for-development", "url": "/dashboards/f/olDaEdL4k/for-development", "slug": "", "type": "dash-folder", "tags": [], "isStarred": false, "sortMeta": 0}, {"id": 4, "uid": "PKt0vHcnk", "title": "ilu dashboards", "uri": "db/ilu-dashboards", "url": "/dashboards/f/PKt0vHcnk/ilu-dashboards", "slug": "", "type": "dash-folder", "tags": [], "isStarred": false, "sortMeta": 0}]

  # grafana data sources
  http://192.168.43.220:1990/otdmTools/-forceHost%20192.168.43.220%20-dgdsByUid%20a/raw




'''

class otSHTTP( BaseHTTPRequestHandler ):

    otWebS = -1
    httpConf = -1
    otP = -1
    apis = -1

    def sResp( self, r=200 ):
        self.send_response( r )

    def parsePath(self, cquery, path ): # look in apis paths
        trStatsCode = 201
        bodyStr = "No Api"
        dataSrc = 'path'

        for i,h in enumerate( cquery.headers ) :
            if h == "q":
                #print("got Q")
                qArgs = json.loads(cquery.headers[ 'q' ])
                #print ()
                dataSrc = "headerQ"
                break


        if dataSrc == "path":
            qArgs = {}
            qtmp = path.split("?")
            qtmpLen = len( qtmp )
            if qtmpLen == 2:
                path = qtmp[0]
                qtmp = qtmp[1].split("&")
                print("so now is path as")
                print( path )
                print("and qtmp")
                print( qtmp )

                for ar in qtmp:
                    tt = ar.split("=")
                    if len( tt ) != 2:
                        #no args no nothing or more then one ?
                        #return 203, 'Wrong argument build to many = = ...'
                        print( 'oiysh ! - should return 203 Wrong argument build to many = = ...' )
                    else:
                        qArgs[ tt[0] ] = tt[1]


            elif qtmpLen == 1:
                pass
            else:
                #no args no nothing or more then one ?
                return 202, 'Wrong arguments (to many ? ? ... )'

        print( f"Api with data source: {dataSrc} :: {path} :: ",end="" )
        print( qArgs )
        for a in self.apis:
            if a['path'] == path:
                bodyStr = a['o']( qArgs )
                trStatsCode = 200
                break

        return trStatsCode, bodyStr

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

    def do_GET(self):
        self.otP.count['in']+=1
        print(f"tr_sts ----------------{self.path}----")

        tr_sts = otdmSTS( self.otP.sapis, self.path[1:] );
        print("--- result ----")
        print(tr_sts)
        print("--- result ----")
        self.sResp( )
        self.send_header('Access-Control-Allow-Origin', 'http://192.168.43.1')
        #self.send_header("Content-type", "text/json")
        self.end_headers()
        self.wr( tr_sts )
        #self.wfile.write(bytes("<p>Request: %s</p>" % self.path, "utf-8"))
        #print(f" so got GET with path [{self.path}]")
        self.otP.count['out']+=1
        return 0

        '''
        resCode, bodyStr = self.parsePath( self, self.path )
        if resCode == 200:
            self.otP.count['ok']+=1
        else:
            self.otP.count['err']+=1

        self.sResp( resCode )
        self.send_header('Access-Control-Allow-Origin', 'http://192.168.43.1')
        self.send_header("Content-type", "text/json")
        self.end_headers()
        self.wr( bodyStr )
        #self.wfile.write(bytes("<p>Request: %s</p>" % self.path, "utf-8"))
        #print(f" so got GET with path [{self.path}]")
        self.otP.count['out']+=1

        '''




# to run in as mqtt and htt apis
# ./otdmTools.py -serviceIt http,mqtt

# tmp$ curl http://192.168.43.220:1990/otdmTools -H 'q: {"cmd": "-osType 1","resAs":"json"}'
# {"os": "Ubuntu", "like": "debian", "ver": "20.04"}


class otdm_serviceIt_http( otdm_serviceIt_prototype ):
    count = { "in":0, "out":0, "ok":0, "err":0,"cmdOk":0,"cmdEr":0}
    conf = -1
    name = "http"
    ver = "0.0.1"
    otHttp = -1
    otWebS = -1
    confHttp = { "ip": "192.168.43.220", "port": 1990 }

    def __init__(self, sapis, args, conf ):
        #print(f"${self.name} constructor ....")
        super( otdm_serviceIt_http, self ).__init__( sapis, args, conf )
        #print("redirect it ....")
        self.otHttp = otSHTTP
        self.r = random.Random()

    def setArgsConf(self, args, conf):
        self.args = args
        self.conf = conf

    def runIt( self, conf ):
        self.conf = conf
        print(f"otSHTTP . runIt ....")
        _thread.start_new(self.intRunIt,())


    def intRunIt(self, a=0, b=0):
        otSH = otSHTTP
        otSH.otP = self
        self.otWebS = HTTPServer( (self.confHttp['ip'], self.confHttp['port']), otSHTTP )
        print("otSHTTP Server started http://%s:%s" % (self.confHttp['ip'], self.confHttp['port']))
        self.isOk = True
        try:
            self.otWebS.serve_forever()
        except KeyboardInterrupt:
            pass

        self.otWebS.server_close()
        self.isOk = False
        print("otSHTTP Server stopped.")


    def delIt(self):
        a='''
        def otAPing_delIt(self, q):
            print("otAPing: ",q)
            return "pong"

            def otAEchoMsg_delIt(self, q):
                print("otAEchoMsg: ",q)

                return q['msg']

                def otAEcho_delIt(self, q):
                    print("otAEcho: ",q)
                    return q


                    def otAotdmTools_delIt(self, q):
                        print("---------------------------------")
                        print("otAotdmTools ...")
                        tr = "ok"
                        print(q)
                        print("---------------------------------")
                        if q.get("cmd","") != "":
                            print("Have cmd: %s ...."%q['cmd'])

                            pH=f"_{self.r.random()}_{self.r.random()}"
                            oFileP = f"/tmp/otApTo_{pH}.res"
                            print("Do it ..."+oFileP)
                            subprocess.run(
                            '/home/yoyo/Apps/oiyshTerminal/otdm-tools/data/data/com.termux/files/usr/bin/otdmTools.py '+
                            q.get('cmd')+" -oFile "+oFileP,
                            shell=True
                            )
                            print(" DONE")
                            trp = ""
                            if os.path.exists( oFileP ) == True:
                                with open(oFileP, 'r') as file:
                                    trp = file.read().rstrip()

                                    print(f"S: Result for {pH}")
                                    self.count['cmdOk']+=1
                                    if q.get("resAs","json") == "json":
                                        return json.loads(trp)
                                    else:
                                        return trp

                                        return tr
'''
