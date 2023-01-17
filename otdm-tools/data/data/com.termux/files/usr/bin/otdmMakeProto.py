
class otdmMakeProto:

    def GETAll( self ):
        print("otdmMakeProto.GETAll")
        pass

    def doExport( self, args ):
        pass

    def doImport( self, d ):
        pass

    # deleting all uid id orgid
    def resultToInjectionJson( self, jIn ):
        print("otdmMakeProto.resultToInjectionJson overrite!")
        return jIn

    # inject to json your data if can
    def injectYourData( self, inJson ):
        pass
