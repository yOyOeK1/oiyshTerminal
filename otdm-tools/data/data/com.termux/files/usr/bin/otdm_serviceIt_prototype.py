

class otdm_serviceIt_prototype:
    name = "serviceIt prototype"
    makeItWorking = False
    isOk = False
    count = { "in":0, "out":0, "ok":0, "err":0,"cmdOk":0,"cmdEr":0} # can be any thing
    ver = "0.0.1-prototype"
    debugConfig={}
    sDebug = False
    stsDebug = False
    sapisDebug = False

    sapis = -1
    args = -1
    conf = -1


    def __init__(self):
        print(f"otdm serviceIt {self.name} in ver {self.ver} init ....No args no conf")


    def __init__(self, sapis, args, conf, debugConfig ):
        print(f"[ i ] ServiceIt [ {self.name} ] in ver {self.ver} init ....and register sapis {len(sapis)}")
        self.sapis = sapis
        self.args = args
        self.conf = conf
        self.debugConfig = debugConfig
        self.sDebug = self.debugConfig['serviceIt']
        self.sitDebug = self.debugConfig['serviceIt']
        self.stsDebug = self.debugConfig['sts']
        self.sapisDebug = self.debugConfig['sapis']

        #print("so debug is - at %s"%self.name)
        #print(self.debugConfig)


    def getVer(self):
        return self.ver

    def doPing(self, tn_unix):
        pass
