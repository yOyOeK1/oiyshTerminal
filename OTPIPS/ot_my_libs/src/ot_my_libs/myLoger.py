
from ot_my_libs.TimeHelper import *


class myLogColors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class myLoger:
    def __init__(self, prefix,
            silenc={
                'info': True,
                'debug': False,
                'error': False,
                'critical': True
                } ):

        self.silenc = silenc
        self.th = TimeHelper()
        self.prefix = prefix
        self.i("__init__")

    def m(self, typeMessage, message):
        if self.silenc[typeMessage]:
            try:
                col = ""
                colEnd = ""

                if typeMessage == 'debug':
                    col = myLogColors.OKCYAN
                if col != "":
                    colEnd = myLogColors.ENDC

                print("{0}[{1}] [{2}] {3} {4} -> ({5})".format(
                    col,
                    self.th.getNiceShortDate(),
                    typeMessage,
                    self.prefix,
                    colEnd,
                    message))
            except:
                print( typeMessage)
                print( message)


        #self.m("erro", message)

    def getSublog(self,parentName):
        return myLoger(
            "{0}/{1}".format(self.prefix, parentName),
            #f"{self.prefix}/{parentName}",
            self.silenc
            )

    def info(self, msg):
        self.i(msg)
    def i(self,message):
        self.m("info", message)


    def debug(self, msg):
        self.d(msg)
    def d(self,message):
        self.m("debug",message)

    def error(self, msg):
        self.e(msg)
    def e(self,message):
        self.m("error",message)

    def critical(self,msg):
        self.m("critical", msg)
