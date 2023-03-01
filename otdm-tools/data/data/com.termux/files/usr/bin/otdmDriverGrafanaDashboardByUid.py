from otdmDriverGrafanaProto import *

class otdmDriverGrafanaDashboardByUid( otdmDriverGrafanaProto ):

    keyWord = "dgdbByUid"
    iKey="title"
    iUid=""
    isPackitso=True


    def __init__(self, args, conf ):
        super(otdmDriverGrafanaDashboardByUid, self).__init__( args, conf, "grafana", "/dashboards/uid" )


    def GETAll( self ):
        print("otdmDriverGrafanaDashboardByUid.GETAll dash-db")
        return self.GETAllByType( "dash-db" )


    def getHelp( self ):
        print( '''-dgdbByUid [uid] - Retuns json of grafana dashboard with uid.
            Use:
            $ otdmTools.py -forceHost 192.168.43.1 -dgdbByUid "f87d21ae04d5fae1"
            Or:
            $ otdmTools.py -forceHost 192.168.43.1 -dgdbByUid "Ks_fQ-kRz" -oFile /tmp/db1.json
            Or:
            otdmTools.py -dgdbByUid lookForDeps -iFile /tmp/dbLab_clean.json -oFile ./depsOfDashBoard.json''')
        super().getHelp( 1 )




    #overrite
    #def GET( self, d ):
    #    return self.CurlWResChk( "GET",
    #        f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}{self.getSuffix()}/{d}"
    #        )
