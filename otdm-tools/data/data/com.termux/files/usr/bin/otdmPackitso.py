import os
import sys
from otdmDriverProto import *

class otdmPackitso:


    def __init__(self ):
        print("otdmPackitso init ...")



    def lsWork( self, otdl ):
        print("lsWork - for posible works skilles ....")
        #print("otdl.drivers")
        #print(otdl.drivers)
        tr=[]
        for d in otdl.drivers:
            tr.append( {
                "workerId": len(tr),
                "name":d['name'],
                "keyWord": d['o'].keyWord
                } )


        return tr

    def ls( self, keyWord, otdl, ident ):
        drv=-1
        for d in otdl.drivers:
            print(f"d: {d}")
            if d['o'].keyWord == keyWord:
                drv=d
                break
        if drv == -1:
            print("Error - wrong work keyWord...")
            sys.exit(1)

        print(f"\n\n\nls work index [{keyWord}] drv.name: [{drv['name']}] / [{drv['o'].keyWord}] / [{ident}]")
        if ident == "*":
            print("-ident as * - so checking if driver have all.....")
            try:
                tr = drv['o'].GETAll()
            except:
                print("no .GETAll() on this one so normal * to get ....")
                tr = drv['o'].GET(ident)
        else:
            tr = drv['o'].GET(ident)

        return tr

    def printHelp(self):
        print('''Help

        Can be found in README.otdm-tools-packitso.md''')



    def query( self, args, otdl, conf ):
        print(f".query args: {args}")

        self.otdmDP = otdmDriverProto( args, conf, 'in jar', 'MySufix' )
        pis=args.get("packitso","");
        work=args.get("work","");
        ident=args.get("ident","");
        tPath=args.get("tPath","");



        if pis in ["?","h","help"]:
            self.printHelp()
            return 2



        if pis == "ls":
            otdl.ifNoArgExit("oFile", "If ls need it.")
            work=otdl.ifNoArgExit("work", "keyWord from lsWork.")
            ident=otdl.ifNoArgExit("ident", '''to identyfy what you want. Most of drivers
            can do * ''')

            res = self.ls( work, otdl, ident )
            self.otdmDP.saveIfArgs( res )
            return 1



        elif pis == "lsWork":
            otdl.ifNoArgExit("oFile", "If ls need it.")

            res = self.lsWork( otdl )
            self.otdmDP.saveIfArgs( res )
            return 1

        else:
            self.printHelp()
            return 2

        return 1

    def packitso( self, args, conf ):
        print(".packitso...")

        return 1
