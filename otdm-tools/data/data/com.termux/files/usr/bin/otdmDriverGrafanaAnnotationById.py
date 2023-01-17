from otdmDriverGrafanaProto import *

class otdmDriverGrafanaAnnotationById( otdmDriverGrafanaProto ):

    keyWord = "dganById"

# update
#curl -X PATCH http://admin:admin@192.168.43.1:3000/api/annotations/29 -H 'Accept: application/json' -H 'Content-Type: application/json' -d '{"text":"after edit", "timeEnd": 1672785603000}'

    def __init__(self, args, conf ):
        super(otdmDriverGrafanaAnnotationById, self).__init__( args, conf, "grafana", "/annotations" )


    def GETAll( self ):
        print(f" GETAll from grafana annotation by type *")
        r=self.CurlWResChk( "GET",
            f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}/annotations"
            )

        return r


    def getHelp( self ):
        print( '''-dganById [id] - Retuns json of grafana annotation with id.''')
        super().getHelp( 1 )


    #overrite
    def GET( self, d ):
        r=self.GETAll()
        print(f"--- GET d[{d}]       -----------------")
        for a in r:
            id=a.get("id","")
            if str(id) == str(d):
                return a

        return 0

    def resultToInjectionJson( self, j ):
        del j['id']
        del j['avatarUrl']
        del j['created']
        del j['updated']
        del j['data']
        return j
