from otdmDriverNodeRedProto import *

class otdmDriverNodeRedSubFlowById( otdmDriverNodeRedProto ):

    keyWord = "dnrsfByUid"
    iKey="name"
    iUid=""
    isPackitso=True

    def __init__(self, args, conf ):
        super(otdmDriverNodeRedSubFlowById, self).__init__( args, conf, "node-red", "/flow" )


    def GETAll( self ):
        print('otdmDriverNodeRedSubFlowById.GETAll(*) calling GETAllByType("*")')
        return self.GETAllByType( "subflow" )




    def getHelp( self ):
        print( '''-dnrsfByUid [uid] - Retuns json of Node-red subflow with uid.
            Use:
            $ otdmTools.py -forceHost 192.168.43.1 -dnrsfByUid "f87d21ae04d5fae1"''')
        super().getHelp( 1 )

    #overrite
    def resChk( self, r ):
        if isinstance( r, dict ):
            if r.get("message") == "Error":
                print("ERROR %s"%r)
                return False
                #sys.exit(1)
            elif r.get("message") == "Dashboard not found":
                print("ERROR %s"%r)
                return Fasle
                #sys.exit(1)
            else:
                return r



        return r



    def chkHostSuffix( self ):
        return "*"
