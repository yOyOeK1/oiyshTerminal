
from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

import time
import _thread
import json
import random
import os
import subprocess

from otdm_serviceIt_prototype import *
from otdmSTS import *


class otS_RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/otrpc1',)

    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleXMLRPCRequestHandler.end_headers(self)

class XRPCSWrapSapi:
    def __init__(self, sapi):
        self.sapi = sapi


    def doIt( self, *args ):
        print("Wrapper dog args for [%s]"%self.sapi[0])
        print( args )

        if self.sapi[1] == 0:
            return self.sapi[2]( [0,args], [] );
        else:
            return self.sapi[2]( [0,''], args )[1];


class otdm_serviceIt_xmlrpc( otdm_serviceIt_prototype ):
    count = { "in":0, "out":0, "ok":0, "err":0,"cmdOk":0,"cmdEr":0}
    conf = -1
    name = "xmlrpc"
    ver = "0.0.1"
    otHttp = -1
    otWebS = -1
    confHttp = { "ip": "0.0.0.0", "port": 33333, "path": "/otrpc1" } #TODO FIX NOT TAKING PATH
    xrpcApis = []

    def __init__(self, sapis, args, conf, sDebug ):
        #print(f"${self.name} constructor ....")
        super( otdm_serviceIt_xmlrpc, self ).__init__( sapis, args, conf, sDebug )
        #print("redirect it ....")
        self.otHttp = -1
        self.r = random.Random()

    def setArgsConf(self, args, conf):
        self.args = args
        self.conf = conf

    def runIt( self, conf ):
        self.conf = conf
        print(f"otSXMLRPC . runIt ....")
        _thread.start_new(self.intRunIt,())


    def mul( self , a , b ):
        print("got MUL !!")
        return a+b

    def sts( self, args ):
        print("do sts ...............", args)
        tr_sts = otdmSTS( self.sapis, args, self.debugConfig );
        print("result is ....",tr_sts)
        return tr_sts

    def intRunIt(self, a=0, b=0):
        self.otWebS = SimpleXMLRPCServer(
            (self.confHttp['ip'], self.confHttp['port']),
            requestHandler=otS_RequestHandler
        )
        self.otWebS.register_introspection_functions()

        self.otWebS.register_function( self.mul, 'mul' )
        self.otWebS.register_function( self.sts, 'sts' )
        trL=[]
        print("registering sapis to ....")
        for sapi in self.sapis:
            print(f"registering to xmlrpc ... %s" % sapi[0])
            trL.append( sapi[0] )
            o = XRPCSWrapSapi( sapi )
            self.xrpcApis.append( o )
            self.otWebS.register_function( o.doIt, sapi[0]  )


        print("in total list for xmlrpc is %s"%trL)



        print("otSXMLRPC Server started %s:%s %s" % (self.confHttp['ip'], self.confHttp['port'],otS_RequestHandler.rpc_paths))
        self.isOk = True
        try:
            self.otWebS.serve_forever()
        except KeyboardInterrupt:
            pass

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
