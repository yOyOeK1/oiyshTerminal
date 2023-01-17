from otdmDriverProto import *
from otdmMakeProto import *

class otdmDriverGrafanaProto( otdmDriverProto, otdmMakeProto ):



    def getHost( self ):
        tr="{0}:{1}@{2}".format(
            self.conf[ self.getName() ].get("user"),
            self.conf[ self.getName() ].get("passwd"),
            super().getHost()
            )
        return tr

    #dash-db dash-folder
    def GETAllByType( self, byType="dash-db" ):
        print(f" GETAll from grafana by type [{byType}] *")
        r=self.CurlWResChk( "GET",
            f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}/search/"
            )

        tr=[]
        for i in r:
            if i.get("type","") == byType:
                tr.append(i)

        #print("r[%s]"%r)
        return tr


    #overrite
    def resChk( self, r ):
        if isinstance( r, dict ):
            if r.get("message") == "Data source not found":
                print("ERROR %s"%r)
                return None
                #sys.exit(1)
            elif r.get("message") == "Dashboard not found":
                print("ERROR %s"%r)
                return None
                #sys.exit(1)
            else:
                return r

        #print("---------------------")
        #print(r)

        return r


    def lookIn( self, tr , j, l ):
        if isinstance( j, list ):
            for i in j:
                tr=self.lookIn( tr, i, l+1)
        elif isinstance( j, dict ):
            for k in j.keys():
                if k == "datasource" and isinstance( j["datasource"], dict) and j["datasource"].get("type","") == "mysql":
                    #print( "-----------------\n%s"%j['datasource'] )
                    tr['mysql'] = 1

                if isinstance( j[k], list ):
                    tr=self.lookIn( tr, j[k], l+1)
                elif isinstance( j[k], dict ):
                    tr=self.lookIn( tr, j[k], l+1)

        return tr


    def lookForDependencis( self, j ):
        deps=self.lookIn( {}, j, 1  )
        print(f"deps for otdm: {deps}")
        return deps

    def resultToInjectionJson( self, j ):
        del j['meta']
        del j['dashboard']['version']
        del j['dashboard']['id']
        del j['dashboard']['uid']
        #self.lookForDependencis( j )
        return j
