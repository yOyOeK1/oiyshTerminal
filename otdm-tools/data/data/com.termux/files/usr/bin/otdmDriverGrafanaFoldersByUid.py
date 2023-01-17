from otdmDriverGrafanaProto import *

class otdmDriverGrafanaFoldersByUid( otdmDriverGrafanaProto ):

    keyWord = "dgfoldersByUid"

    def __init__(self, args, conf ):
        super(otdmDriverGrafanaFoldersByUid, self).__init__( args, conf, "grafana", "/folders/uid" )


    def GETAll( self ):
        return self.GETAllByType( "dash-folder" )


    def getHelp( self ):
        print( '''-dgfoldersByUid [uid] - Retuns json of grafana folders with uid.
            Use:
            $ otdmTools.py -forceHost 192.168.43.1 -dgfoldersByUid "f87d21ae04d5fae1"
            Or:
            $ otdmTools.py -forceHost 192.168.43.1 -dgfoldersByUid "Ks_fQ-kRz" -oFile /tmp/db1.json''')
        super().getHelp( 1 )


    #overrite
    #def GET( self, d ):
    #    return self.CurlWResChk( "GET",
    #        f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}{self.getSuffix()}/{d}"
    #        )
