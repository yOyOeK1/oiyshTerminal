import sys
from otdmDriverFileSystem import *

class otdmDriverManager:

    args={}
    conf={}
    deb=False

    def __init__( self, args, conf ):
        if self.deb:print(f"otdmDriverManager args:[{args}]")
        if self.deb:print( sys.path )

        self.args=args
        self.conf=conf



    def lookForDrivers( self, acts ):
        #self.deb = 1
        if self.deb:print("[ i ] looking for drivers ....", end=" ")
        tr = []
        for p in sys.path:
            if self.deb:print(f" looking in [{p}]")
            dfs=otdmDriverFileSystem( self.args, self.conf, prefixFS=p )
            l=dfs.GET("")
            if isinstance(l, list):
                for f in l:
                    if f.get("isFile"):
                        tname=f.get("name","")
                        if tname in [ None, "" ]:
                            continue
                        #otdmDriverXXXXX.py
                        if len(tname) >= 14:
                            if tname[:10] == "otdmDriver" and \
                                tname[-3:] == ".py" and \
                                tname[-8:] != "Proto.py" and \
                                tname != "otdmDriverManager.py":
                                cname=tname.replace(".py","")
                                if self.deb:print("GOT it ! %s"%cname)

                                #eval( f"import {cname}" )
                                #print("importing")
                                d=il.import_module( cname )
                                d=eval(f"d.{cname}( self.args, self.conf ) ")
                                #d=f"{cname}"( args, conf )
                                #print
                                #d=d.otdmDriverProto( args, conf )
                                #print("getName")
                                #d.getName()
                                tr.append( {
                                    "o": d,
                                    "type": "driver",
                                    "cname": cname,
                                    "name": d.getName()
                                } )

        if self.deb:print("The list of drivers in otdm:----------------------")
        #print(tr)
        return tr

    def injectDrivers( self, acts ):
        dl=self.lookForDrivers( acts )
        print(f"[ i ] InjectDrivers acts len {len(acts)} found drives {len(dl)}...", end=" ")

        for d in dl:
            acts.append( d )
            print(" + ", end=" ")
        print("")

        return acts
