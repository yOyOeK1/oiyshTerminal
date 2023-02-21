import subprocess as sp
from otdmWcspMqtt import *

class otdmSubProc:

    subP = 0
    subOut = []
    errorInStack = False
    def th_subP( self, args, cb ):
        print(f"sub thread {args['name']} is starting cmd {args['cmd']}")
        print("Popen")
        print("subOut is now %s"%self.subOut)

        empty = 0
        lNo = 0

        self.subOut = []
        self.errorInStack = False
        LastPipe=-1
        if 1:
            print(f"have to check if dont need splitting ... {args['cmd']}")
            cL=[]
            cmdSets=[]
            if args['cmd'][0] == "sh":
                print("doing in sh ......")
                cmdSets = [args['cmd']]
                args['cmd'] = []

            print("doing in SubProcesss.Popon ......")
            for a in args['cmd']:
                if a != "|":
                    cL.append( a )
                elif len(cL) > 0:
                    cmdSets.append( cL )
                    cL=[]

            if len(cL) > 0:
                cmdSets.append( cL )
                cL=[]

            print(f"so after resections we have cmds .... {cmdSets}")

            for i,s in enumerate(cmdSets):
                if i == 0:
                    print("first -- >")
                    si = sp.PIPE
                else:
                    print(" -- > after -- >")
                    si = self.subP.stdout

                print(f"sub split ...   [{s}] ",end="")
                try:
                    self.subP = sp.Popen(
                        s,
                        stdout=sp.PIPE, stdin=si,
                        stderr=sp.STDOUT
                        )
                    print("DONE")

                except:
                    self.errorInStack = True
                    print(" !! Error !!")
                    break

                if self.subP.returncode != None:
                    raise Exception( f'Invalid result: { self.subP.returncode }' )



            '''
                    print(f"run sub split detected .... on stock")
                    if LastPipe == -1:




                        print(f"1:  tail run... no before this is first {cmdStep}")
                        self.subP = sp.Popen(cmdStep,  stdout=sp.PIPE, stdin=sp.PIPE, stderr=sp.STDOUT)
                        print(f"1:    exit code1 ... [{self.subP.returncode}]")
                        LastPipe=1
                    else:
                        cmdSets.append( cmdSets )
                        cmdStep=[]
                        print(f"2:  tail run... next {cmdStep}")
                        self.subP = sp.Popen(cmdStep,  stdout=sp.PIPE, stdin=self.subP.stdout, stderr=sp.STDOUT)
                        print(f"2:    exit code2 ... [{self.subP.returncode}]")

                    cmdStep=[]
                else:
                    print("end of command no in stack done...")

            if len(cmdStep) > 0:
                if LastPipe == -1:
                    print(f"3:  tail run... no before this is first {cmdStep}")
                    self.subP = sp.Popen(cmdStep,  stdout=sp.PIPE, stdin=sp.PIPE, stderr=sp.STDOUT)
                    print(f"3;    exit code3 ... [{self.subP.returncode}]")
                else:
                    print(f"4:  tail run... next {cmdStep}")
                    self.subP = sp.Popen(cmdStep,  stdout=sp.PIPE, stdin=self.subP.stdout, stderr=sp.STDOUT)
                    print(f"4:    exit code4 ... [{self.subP.returncode}]")

            '''

        else:
            print("ojjj Error ")
            self.subOut.append( b"error o.O" )
            self.subOut.append( -1 )
            return 0

        #print("-------------exit")
        #sys.exit(1)

        print(f"\n------ reader ----------------- any error?[{self.errorInStack}]\n")

        cb.subP = self.subP
        empty=0
        while 1:
            time.sleep(.01)
            lNo+=1

            if empty > 10:
                self.subOut.append( -1 )
                break
            if self.subP.stdout.readable() :
                try:
                    #print('read....')
                    #self.subP.stdout.flush()
                    ws = self.subP.stdout.read1()
                    #print("ws")
                    #print(ws)
                    for w in ws.decode().split("\n"):
                        #print(" read done [%s]"%w)
                        self.subOut.append( w )
                        if w == '':
                            empty+=1
                            self.subOut = self.subOut[0:-1]
                        else:
                            empty = 0
                except:
                    print("subOut append read error ")
                print(f"sub thread {args['name']} is DONE")

    def testSubProcAndProm( self, args, cb ):
        print("testSubProcAndProm")

        x = threading.Thread( target=self.th_subP, args=({
            "name": "Bash layer",
            "cmd": args
            },cb, ))
        x.start()
        #time.sleep(.5)

        nn = 0
        lr = 0
        while 1:
            nn+= 1
            for l in range( lr, len(self.subOut), 1):
                if self.subOut[l] != -1 :
                    li = self.subOut[l]
                    cb.pub( "line", str(f"{l}:{str(li)}") )
                    lr = l+1

            if len(self.subOut)>0 and ( self.subOut[-1] == -1 or self.subOut[-1] == -2):
                break
            time.sleep(.03)
        #sys.exit(11)
        return 1

    def SubProcGET( self, name, fromQ = '' ):
        ph = self.args.get("pH","")
        cmd = self.args.get("webCmdSubProcess")[1:-1].split(',')

        if ph == "":
            print("Error no -pH argument for destincting prefix handler for communication.")
            sys.exit(1)

        print("cmd will do :%s"%cmd)

        print("starting mqtt topic communication channel.....")
        s = otdmWcspMqtt()
        s.makeCli( ph, self.conf['mqtt'] )
        s.runIt()
        time.sleep(.0001)
        s.pub("status", "starting")
        time.sleep(.5)

        self.testSubProcAndProm( cmd, s )

        s.pub("status", "done")
        time.sleep(.5)

        #sys.exit(1)
        if self.args.get("stdout",'') == '':
            return 'SubProcesss DONE'
        else:
            print("")
            return self.subOut
