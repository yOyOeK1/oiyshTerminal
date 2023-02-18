
import sys
import os
import requests
import json
import importlib as il


class otdmDriverProto:
    deb=False

    name=""
    suffix=""
    args={}
    conf=None

    keyWord="driverProto"



    def __init__( self, args, conf, name, suffix ):
        self.name = name
        self.suffix=suffix
        self.args = args
        self.conf = conf
        #print( f"otdmDriverProto init name [{name}] instance of [{self}]" )

    def getName( self ):
        return self.name

    def getHelp( self, implemented=0 ):
        if implemented == 0:
            print( f"{self.getName()}.getHelp() Not implemented key word [{self.keyWord}]" )

        print(f'''          Should do also:
            -{self.getName()} [?|h|help|chkHost|lookForDeps|clean|*|GET|POST|DELETE]
                if [lookForDeps|clean|*] you need to set up -iFile and -oFile
                -oFile [pathToFile|--] when "--" trow to console.''')


    def saveIfArgs( self, r ):
        ofile=self.args.get("oFile","")
        if ofile == "--":
            print( json.dumps(r, indent=4) )
        elif ofile != "":
            f = open( ofile , "w" )
            f.write(f"{json.dumps(r)}")
            f.close()
            print(f"saved .....  [{ofile}]")


    def chkArgs( self, args ):
        self.args = args
        if self.deb:print("otdmDriverProto.chkArgs(.....)")

        # if keyWord is OK
        if args.get(self.keyWord,"")!="":
            arg=args.get(self.keyWord)
            by=arg
            act=args.get("act","GET")

            if arg in ["?", "h", "H", 'help']:
                self.getHelp()
                sys.exit(1)

            if arg == "chkHost":
                return self.chkHost()

            if arg == "lookForDeps" or arg == "clean":
                ifile=args.get("iFile","")
                if ifile != "":
                    import otdmDriverFileSystem as dfsc
                    dfs=dfsc.otdmDriverFileSystem( self.args, self.conf )
                    iJ=dfs.GET( ifile )

                    if arg == "clean":
                        r=self.resultToInjectionJson( iJ )
                    elif arg == "lookForDeps":
                        r=self.lookForDependencis( iJ)
                    self.saveIfArgs( r )
                    return 1

                print("-iFile and -oFile error")
                self.getHelp()
                sys.exit(1)

            if arg == "*":
                if self.args.get("oFile","") == "":
                    print("Error if * then -oFile")
                    sys.exit(1)
                r=self.GETAll()
                self.saveIfArgs( r )

                #print(r)
                return 1


            #self.MKTEST(111)
            self.difAct=-1
            if act not in ["GET","POST","DELETE","ADD"]:
                print("trying if have arg like: [%s]"%act)
                try:
                    self.difAct = eval( f"self.{act}('{arg}')" )

                except:
                    print(" NO don't have ....")

                if self.difAct != -1:
                    self.saveIfArgs( {} )
                    sys.exit( self.difAct )

            if act not in ["GET","POST","DELETE","ADD"]:
                print("Wrong -act")
                self.getHelp()
                sys.exit(1)



            if act == "GET":
                if self.args.get("oFile","") == "":
                    print("Error no -oFile")
                    sys.exit(1)
                r=self.GET( by )
                self.saveIfArgs( r )
                return 1

            elif act == "POST":
                ifile=-1
                if self.args.get("iFile","") == "":
                    print("Error no -iFile")
                    #sys.exit(1)
                else:
                    print("Using -iFile ....")
                    ifile=args.get("iFile","")
                    import otdmDriverFileSystem as dfsc
                    dfs=dfsc.otdmDriverFileSystem( self.args, self.conf )
                    iJ=dfs.GET( ifile )

                if ifile == -1 and self.args.get("iStr","") == "":
                    print("Error no -iStr")
                    sys.exit(1)
                else:
                    iJ=self.args.get("iStr","")
                    print(f"Using -iStr .... [{len(iJ)}]")

                try:
                    r=self.POST(iJ)
                except:
                    print("single arg faild trying double ....")
                    try:
                        r = self.POST( self.args.get( self.keyWord, ""), iJ)
                    except:
                        print("Error exit 2")
                        return 2
                self.saveIfArgs(r)
                return 1

            elif act == "DELETE":
                r = ''
                r = self.DELETE( self.args.get( self.keyWord, '' )  )
                print("Exception in DELETE proto ......")


                print("DELETE STOP ...")
                sys.exit(1)
                return 1

            #sys.exit(1)
        return 0

    def getHost( self ):
        host = self.conf[ self.getName() ].get("host")
        #print("args:%s"%self.args)
        if self.args.get("forceHost","") != "":
            host=self.args.get("forceHost")
        return host

    def getPort( self ):
        return self.conf[ self.getName() ].get("port")

    def getSuffix( self ):
        return self.suffix

    def getApiPath( self ):
        return self.conf[ self.getName() ].get("apiPath")


    def getHeaders( self,):
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }

    def curlIt( self, methodee, url, headerss=None, data=None ):
        r=""

        if headerss==None:
            headerss=self.getHeaders()
        print("url:%s"%url)

        if methodee == "POST":
            r = requests.post( url, headers=headerss, data=data )
            return r.content

        elif methodee == "DELETE":
            r = requests.delete( url, headers=headerss, data=data )
            return r.content

        elif methodee == "GET":
            r=requests.get( url, headers=headerss, data=data )
            return r.content

        else:
            print("ERRor curlIt methodee not implemented." )

        return None

    def curlJ( self, methodee, url, headerss=None, data=None ):
        r=self.curlIt( methodee, url, headerss, data )
        try:
            j=json.loads(r)
            return j
        except Exception as e:
            print( "ERROR curlJ r to json \n\ngot responce [{0}] Error[{1}]".format(str(r)[:80],e)  )
            print( "it's type: %s"%type(r))

        return r

    def chkHostSuffix( self ):
        return ""

    def chkHost( self ):
        r=self.GET(self.chkHostSuffix())
        print(f"otdmDriverProto.chkHost: type:[{type(r)}] r:[{str(r)[:10]}...]")
        if isinstance( r, dict ):
            if r != {}:
                return True

        return False


    def resChk( self, r ):
        print(f"otdmDriverProto.resChk")
        print("resChk r is len: %s"%len(r))
        err = 0
        if err:
            sys.exit(1)
        return r

    def CurlWResChk( self, methodee, url, headerss=None, data=None ):
        return self.resChk(
            self.curlJ( methodee, url, headerss, data )
        )


    def GETAll( self ):
        print("otdmDriverProto.GETAll")
        return self.GET("")

    def GET( self, d ):
        print( f"otdmDriverProto.GET({d})" )
        return self.CurlWResChk( "GET",
            f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}{self.getSuffix()}/{d}"
            )

    def POST( self, d ):
        print( f"otdmDriverProto.POST({d})" )
        return self.CurlWResChk( "POST",
            f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}{self.getSuffix()}",
            data=f"{json.dumps(d)}"
            )

    def DELETE( self, d ):
        print( f"otdmDriverProto.DELETE({d})" )
        sys.exit(1)


    def printNice( self, j ):
        print( f"default print from proto -----------------")
        if isinstance( j, dict ):
            print( json.dumps(j, indent=4) )
        elif isinstance( j, list ):
            print( json.dumps(j, indent=4) )

        else:
            print("---------not json")
            print( j )

    def convJToInject( self, d ):
        print( f"otdmDriverProto.convJToInject({d})" )
        sys.exit(1)
