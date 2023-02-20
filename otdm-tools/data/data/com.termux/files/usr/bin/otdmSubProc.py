from subprocess import Popen, PIPE, STDOUT

from otdmWcspMqtt import *

class otdmSubProc:

    subP = 0
    subOut = []
    def th_subP( self, args, cb ):
        print(f"sub thread {args['name']} is starting cmd {args['cmd']}")
        print("Popen")
        print("subOut is now %s"%self.subOut)

        empty = 0
        lNo = 0

        self.subOut = []
        LastPipe=-1
        try:
            print(f"have to check if dont need splitting ... {args['cmd']}")
            cmdStep=[]
            for a in args['cmd']:
                if a != "|":
                    cmdStep.append( a )
                elif len(cmdStep) > 0:
                    print(f"run sub split detected .... on stock")
                    if LastPipe == -1:
                        print(f"tail run... no before this is first {cmdStep}")
                        self.subP = Popen(cmdStep,  stdout=PIPE, stdin=PIPE, stderr=STDOUT)
                        LastPipe=1
                    else:
                        print(f"tail run... next {cmdStep}")
                        self.subP = Popen(cmdStep,  stdout=PIPE, stdin=self.subP.stdout, stderr=STDOUT)

                    cmdStep=[]
                else:
                    print("end of command no in stack done...")

            if len(cmdStep) > 0:
                if LastPipe == -1:
                    print(f"tail run... no before this is first {cmdStep}")
                    self.subP = Popen(cmdStep,  stdout=PIPE, stdin=PIPE, stderr=STDOUT)
                else:
                    print(f"tail run... next {cmdStep}")
                    self.subP = Popen(cmdStep,  stdout=PIPE, stdin=self.subP.stdout, stderr=STDOUT)

        except:
            print("ojjj Error ")
            self.subOut.append( b"error o.O" )
            self.subOut.append( -1 )
            return 0

        cb.subP = self.subP
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
            "name": "subprocess name test 1234",
            "cmd": args
            },cb, ))
        x.start()
        #time.sleep(.5)

        nn = 0
        lr = 0
        while 1:
            nn+= 1
            for l in range( lr, len(self.subOut), 1):
                if self.subOut[l] != -1:
                    li = self.subOut[l]
                    cb.pub( "line", str(f"{l}:{str(li)}") )
                    lr = l+1

            if len(self.subOut)>0 and self.subOut[-1] == -1:
                break
            time.sleep(.01)
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
        return 'SubProcesss DONE'
