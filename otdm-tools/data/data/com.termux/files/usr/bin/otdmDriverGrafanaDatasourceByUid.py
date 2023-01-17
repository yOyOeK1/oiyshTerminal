from otdmDriverGrafanaProto import *


class otdmDriverGrafanaDatasourceByUid( otdmDriverGrafanaProto ):

    keyWord = "dgdsByUid"

    def __init__(self, args, conf ):
        super(otdmDriverGrafanaDatasourceByUid, self).__init__( args, conf, "grafana", "/datasources/uid" )



    def GETAll( self ):
        print(f" GETAll from grafana by type datasource *")
        r=self.CurlWResChk( "GET",
            f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}/datasources/"
            )
        return r




    def resultToInjectionJson( self, j ):
        del j['meta']
        del j['datasource']['version']
        del j['datasource']['id']
        del j['datasource']['uid']
        return j


    #overrite
    #def GET( self, d ):
    #    return self.CurlWResChk( "GET",
    #        f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}{self.getSuffix()}/{d}"
    #        )
