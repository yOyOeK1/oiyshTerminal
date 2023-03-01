from otdmDriverProto import *
import os

class otdmDriverFileSystem( otdmDriverProto ):

    keyWord = "dfs"
    iKey="name"
    iUid=""
    isPackitso=True

    def __init__(self, args, conf, prefixFS="/" ):
        super(otdmDriverFileSystem, self).__init__( args, conf, "FileSystem", prefixFS )


    def getHelp( self ):
        print( '''-dfs [fdpath] - fdpath is a file / directory path.
            If pointing to directory will return list of directorys and
            files. In json form.
            Use:
            $ otdmTools.py -dfs "/rr" -act GET
            $ otdmTools.py -dfs /tmp/abb -act MKDIR
            $ otdmTools.py -dfs /tmp/abb2/f1 -act POST -iStr "abc"
            ''')


    def mkPath( self, fPath ):
        return f"{self.getSuffix()}{fPath}"

    def chkHost( self ):
        return os.path.exists( self.mkPath("") )

    def MKTEST( self, d ):
        print(f"MKTEST -> {d}")

        return 1

    def MKDIR( self, dir ):
        print("MKDIR: %s"%dir)
        uri=self.mkPath(dir)
        print(f"  path from driver:{uri}")
        if os.path.isdir( uri ) or os.path.isfile( uri ) or os.path.islink( uri ):
            print("There is something with that name. ERROR")
            return 2
        else:
            print("Cane make it :)..")
            os.mkdir( uri )

        return 1


    def ADD( self, fPath, d ):
        print(f"ADD {fPath} -> {d}")
        f = open( self.mkPath(fPath) , "a" )
        f.write(f"{d}")
        f.close()

    def POST( self, fPath, d ):
        print(f"POST {fPath} -> {d}")
        f = open( self.mkPath(fPath) , "w" )
        f.write(f"{d}")
        f.close()
        return {}

    def DELETE( self, d ):
        os.remove(self.mkPath(d))

    def GET( self, fPath ):
        fp=self.mkPath( fPath )
        if self.deb: print("otdmDriverFileSystem.GET fPath:[%s]"%fp)
        if os.path.isdir( fp ):
            tr = []
            dfs=os.listdir(fp)
            for df in dfs:
                dfp=f"{fp}/{df}"
                tadd={
                    "name": df,
                    "fullPath": dfp,
                    "isFile": os.path.isfile( dfp )
                }
                if os.path.isfile( dfp ): tadd["size"] = os.path.getsize( dfp )
                tr.append(tadd)
            return tr
        elif os.path.isfile( fp ):
            with open( fp, 'r') as file:
                r = file.read().rstrip()
                try:
                    j=json.loads(r)
                    return j
                except:
                    #print( f"file: {fp} is not a json. Returning Raw ")
                    return r

        else:
            return 0


    #overrite
    #def GET( self, d ):
    #    return self.CurlWResChk( "GET",
    #        f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}{self.getSuffix()}/{d}"
    #        )
