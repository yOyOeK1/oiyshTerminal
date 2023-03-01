from otdmDriverNodeRedProto import *

class otdmDriverNodeRedFlowById( otdmDriverNodeRedProto ):

    keyWord = "dnrfByUid"
    iKey="label"
    iUid=""
    isPackitso=True

    def __init__(self, args, conf ):
        super(otdmDriverNodeRedFlowById, self).__init__( args, conf, "node-red", "/flow" )


    def GETAll( self ):
        print('otdmDriverNodeRedFlowById.GETAll(*) calling GETAllByType("*")')
        return self.GETAllByType( "tab" )




    def getHelp( self ):
        print( '''-dnrfByUid [uid] - Retuns json of Node-red flow with uid.
            Use:
            $ otdmTools.py -forceHost 192.168.43.1 -dnrfByUid "f87d21ae04d5fae1"''')
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
