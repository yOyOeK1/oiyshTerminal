from otdmDriverProto import *

class otdmDriverNodeRedProto( otdmDriverProto ):

    def __init__(self, args, conf, name, suffix ):
        super(otdmDriverNodeRedProto, self).__init__( args, conf, name, suffix )



    def GETAllByType( self, byType="*" ):
        print(f" GETAll from node-red proto by type [{byType}] *")
        r=self.CurlWResChk( "GET",
            f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}/flows/"
            )

        tr=[]

        if byType=="tab":
            for i in r:
                if i.get("type","") == "tab":
                    tr.append(i)
            return tr
            
        if byType=="subflow":
            for i in r:
                if i.get("type","") == "subflow":
                    tr.append(i)
            return tr

        if byType=="*":
            return r


        for i in r:
            if i.get("type","") == byType:
                tr.append(i)

        #print("r[%s]"%r)

        return r


    #overrite
    def GET( self, d ):
        return self.CurlWResChk( "GET",
            f"http://{self.getHost()}:{self.getPort()}/flow/{d}"
            )

    def DELETE( self, d ):
        print("OO Ok delete is %s"%d)
        if len(d) == 16: # eb12a705b6a20db2
            return self.CurlWResChk( "DELETE",
                f"http://{self.getHost()}:{self.getPort()}/flow/{d}"
                )
        else:
            print("Wrong uid length !!!")
