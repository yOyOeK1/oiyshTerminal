
import os,sys,time,_thread
from otdmSubProc import *
import tempfile

class otdmPG_driverFifo( otdmSubProc ):
    makeItRunning = False
    isOk = True
    dfIter = 0
    args = -1
    conf = -1
    thObj = -1
    debIters = False

    def __init__(self, args, conf, prefixFS="/" ):
        print("otdmPG_driverFifo init ...")
        self.makeItRunning = False
        self.args = args
        self.conf = conf
        self.thObj = -1

    def mainLoop( self,a=0,bb=0 ):
        print(f"otdmPG_driverFifo enter loop...[{self.makeItRunning}]")
        pIn=''
        pOut=''

        while self.makeItRunning:
            if self.debIters: print(f" driverFifo iter ... [{self.makeItRunning}]")

            print("checking if out file is there ....")




            self.onStdIn( f"call from main loop..." )

            self.dfIter+=1
            time.sleep(1)
        this.isOk = False
        print("otdmPG_driverFifo exit loop")

    def onStdIn(self, m):
        print(f"onStdIn: [{m}]")

    def startIt( self ):
        print(" .startIt ...")
        self.makeItRunning = True
        _thread.start_new( self.mainLoop, () )

        while self.isOk == True:
            if self.debIters:  print(f"driver fifo is running ... OK ({self.dfIter})")

            time.sleep(2)


    def stopIt( self ):
        self.makeItRunning = False
