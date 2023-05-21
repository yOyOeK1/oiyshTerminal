
from ot_my_libs.TimeHelper import *


class myLogColors:
    HEADER =        '\033[95m'
    OKBLUE =        '\033[94m'
    OKCYAN =        '\033[96m'
    OKGREEN =       '\033[92m'
    WARNING =       '\033[93m'
    FAIL =          '\033[91m'
    ENDC =          '\033[0m'
    BOLD =          '\033[1m'
    UNDERLINE =     '\033[4m'
    Black =         '\033[0;30m'
    Dark_Gray =     '\033[1;30m'
    Red =           '\033[0;31m'
    Light_Red =     '\033[1;31m'
    Green =         '\033[0;32m'
    Light_Green	=   '\033[1;32m'
    Brown_Orange =  '\033[0;33m'
    Yellow =        '\033[1;33m'
    Blue =          '\033[0;34m'
    Light_Blue =    '\033[1;34m'
    Purple =        '\033[0;35m'
    Light_Purple =  '\033[1;35m'
    Cyan =          '\033[0;36m'
    Light_Cyan =    '\033[1;36m'
    Light_Gray =    '\033[0;37m'
    White =         '\033[1;37m'

class myLoger:
    def __init__(self, prefix,
            silenc={
                'info': True,
                'debug': True,
                'error': True,
                'critical': True
                },
             defColor="" ):

        self.silenc = silenc
        self.defColor = defColor
        self.th = TimeHelper()
        self.prefix = prefix
        self.i(f'''__init__   {self.defColor}with def color: IT IN{myLogColors.ENDC} ''')

    def m(self, typeMessage, message):
        if self.silenc[typeMessage]:
            try:
                col = self.defColor
                colEnd = ""

                if typeMessage == 'debug':
                    col = myLogColors.OKCYAN
                if col != "":
                    colEnd = myLogColors.ENDC

                print("{0}[{1}] {2} {3} {4} -> ({5})".format(
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
        
        
