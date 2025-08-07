import os
import sys
from otdmDriverProto import *

class otdmPackitso:


    def __init__(self ):
        print("otdmPackitso init ...")
        self.conf = {} 
        self.args = {}       


    def otdlFromActs(self, acts):
        tr=[]
        for d in acts:
            if isinstance( d, dict) and str(d['o'])[:7] != "<module":
                d['o'].conf = self.conf
                d['o'].args = self.args
                tr.append( d )

        return tr

    def lsWork( self, acts ):
        print("lsWork - for posible works skilles ....")
        tr=[]
        for d in self.otdlFromActs( acts ):
            tr.append( {
                "workerId": len(tr),
                "name": str(d['name']).split('.')[0][1:],
                "keyWord": d['o'].keyWord,
                "iKey": d['o'].iKey,
                "iUid": d['o'].iUid,
                "isPackitso": d['o'].isPackitso
                } )


        return tr

    def ls( self, keyWord, acts, ident ):
        drv=-1
        for d in self.otdlFromActs( acts ):
            #print(f"d: {d}")
            if d['o'].keyWord == keyWord:
                drv=d
                print(f"* ok have it by key [{keyWord}]")
                break
        if drv == -1:
            print("Error - wrong work keyWord...")
            sys.exit(1)

        print(f"* ls work index [{keyWord}] drv.name: [{drv['name']}] / [{drv['o'].keyWord}] / [{ident}]")
        if ident == "*":
            print(" -ident as * - so checking if driver have all .....")
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

    

    def query( self, args, acts, conf ):
        print(f".query args: {args}")

        self.conf = conf
        self.args = args
        self.otdmDP = otdmDriverProto( args, conf, 'in jar', 'MySufix' )
        pis=args.get("packitso","");
        work=args.get("work","");
        ident=args.get("ident","");
        tPath=args.get("tPath","");



        if pis in ["?","h","help"]:
            self.printHelp()
            return 2



        if pis == "ls":
            self.otdmDP.ifNoArgExit("oFile", "If ls need it.")
            work=self.otdmDP.ifNoArgExit("work", "keyWord from lsWork.")
            ident=self.otdmDP.ifNoArgExit("ident", '''to identyfy what you want. Most of drivers
            can do * ''')

            res = self.ls( work, acts, ident )
            self.otdmDP.saveIfArgs( res )
            return 1



        elif pis == "lsWork":
            #self.otdmDP.ifNoArgExit("oFile", "If ls need it.")
            res = self.lsWork( acts )
            #print("DONE")
            #print(res)
            self.otdmDP.saveIfArgs( res )
            return 1

        else:
            self.printHelp()
            return 2

        return 1

    def packitso( self, args, conf ):
        print(".packitso...")

        return 1
