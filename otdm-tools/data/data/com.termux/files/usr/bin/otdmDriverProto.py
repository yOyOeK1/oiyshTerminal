
import sys
import os
import requests
import json
import importlib as il

class otdmDriverProto:
    """
    This is a programer documentation for otdmDriverProto. If you want to your owne Driver
    this is a place to be. It's python code explenation of what is in back of the idea and functions.
    This one is running in shell layer in python3. More about otdmTools info is comming....

    ## Plan in this is
    To make tasks simple. Making work will be only by saing what to do but how to make it is
    Handle by selected corect DriverProto. It know if this work is on http API or file system or
    mysql database using some selections. Not important :)
    If you have driverProto for it it is in otdm-
     - [x] You can use your driverProto from yss / bash / otdm- instance
     - [x] one line tasks any ware
     - [ ] will do for using in packitso .deb builder

    By implementing your DriverProto you can extend options and join the family otdm-

    ## Example
    ```bash
    $ otdmTools.py -dfs '/tmp' -oFile '--'
    ```
    *argument dfs if is same as your keyWord your driver will be execute to do the task. `-oFile` store data to output file if -- to stdout.*

    ```bash
    $ otdmTools.py -dfs '/tmp/abc123' -act MKDIR -oFile '--'
    ```
    *`-act` is not GET|POST|DELETE it will try your argument in try So you can put your own function handler and argument vector is pass from otdmTool.py*

    ```bash
    $ tm=`tempfile`;otdmTools.py -forceHost 192.168.43.220 -dnrfByUid "*" \
    -oFile ${tm} >> /dev/null
    cat ${tm} | jq '.[].id'
    ```
    *force different host then in .otdm/config.json / use Node-RED driver proto / GETAll () to `tm` file then jq `.id` from result*

    ```bash
    $ tm=`tempfile`
    outTemp='{"name":.name,"path":.fullPath}'
    otdmTools.py -dfs "/tmp" -oFile ${tm} >> /dev/null
    cat ${tm} | jq '.[] | select( .isFile == false ) | '${outTemp}
   ```
   *Returns only directory from /tmp in array of dicts `{"name":.name,"path":.fullPath}`*
   ```javascript
   .....
       "path": "//tmp/jsdoc-api"
    }
    {
      "name": "pyjsdoc",
      "path": "//tmp/pyjsdoc"
    }
   .....
   ```

    **ver:** 0.2.2


    It's for inhereting and overriting some of it's function / method.

    **There is a name restriction** for new files `otdmDriver`YOURNAME`.py`
    Adding `otdmDriver`YOURNAME`Proto.py` in name will make skip your file in
    plugin init step.

    All your driversProto should to extand by otdmDriverProto

    *nice cmd:  ```python import pdb; pdb.set_trace()```*
    """

    deb=False

    name=""
    suffix=""
    args={}
    conf=None

    keyWord="driverProto"
    """**keyWord**: string - @overwriteIt important to invoce from arguments from console."""

    iKey=""
    """**iKey**: string - @overwriteIt if want to use driver in packitso"""

    iUid=""
    """**iUid**: string - @overwriteIt if want to use driver int packitso"""

    isPackitso=False
    """**isPackitso**: bool - @overwriteIt important to use in packitso only if ready"""



    def __init__( self, args, conf, name, suffix ):
        """# Arguments
        args: dict - with argumens to parse and look for your inputs
        conf: dict - from otdmTools.py instance .otdm/config.json is comming
        name: string - to identyfy in .otdm/config.json
        suffix: string | dict - to pass some args in instance
        """
        self.name = name
        self.suffix=suffix
        self.args = args
        self.conf = conf
        #print( f"otdmDriverProto init name [{name}] instance of [{self}]" )

    def getName( self ):
        return self.name

    def getHelp( self, implemented=0 ):
        """@overwriteIt - to set your own help as extra. After the default `$ otdmTools.py -h '1'` """
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

            if arg == "isPackitso":
                if self.args.get("oFile","") == "":
                    print("Error if * then -oFile")
                    sys.exit(1)
                r = {
                    "isPackitso": self.isPackitso,
                    "iKey": self.iKey,
                    "iUid": self.iUid
                    }

                self.saveIfArgs( r )
                return 1

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
                    if ifile == -1:
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
        """@overwriteIt - use rest as curl instance for http api HOST:getPort/getSuffix/getApiPath
        # Returns
        [string] - host defined from config and iff set handles -forceHost (then call super)"""
        host = self.conf[ self.getName() ].get("host")
        #print("args:%s"%self.args)
        if self.args.get("forceHost","") != "":
            host=self.args.get("forceHost")
        return host

    def getPort( self ):
        """@overwriteIt - use rest as curl instance for http api getHost:PORT/getSuffix/getApiPath
        # Returns
        [string] - port defined from config"""
        return self.conf[ self.getName() ].get("port")

    def getSuffix( self ):
        """@overwriteIt - use rest as curl instance for http api getHost:getPort/suffix/getApiPath
        # Returns
        [string] - suffix defined from self.suffix set on super() """
        return self.suffix

    def getApiPath( self ):
        """@overwriteIt - use rest as curl instance for http api getHost:getPort/getSuffix/path
        # Returns
        [string] - suffix defined from config"""
        return self.conf[ self.getName() ].get("apiPath")


    def getHeaders( self,):
        """@overwriteIt - if want to make http api with this header or overwriteit"""
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
        """@overwriteIt - to hendle request of all something like all
        # Returns
        [list] - of data some form"""
        print("otdmDriverProto.GETAll")
        return self.GET("")

    def GET( self, d ):
        """@overwriteIt - to hendle request of single work read
        # Arguments
        d: object - to identyfy your work to get it
        # Returns
        [list] - data some form file storable json preffered"""
        print( f"otdmDriverProto.GET({d})" )
        return self.CurlWResChk( "GET",
            f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}{self.getSuffix()}/{d}"
            )

    def POST( self, d ):
        """@overwriteIt - to hendle request of single work write / make / execute / do taks
        # Arguments
        d: object - to put in work as data input to work
        # Returns
        [json] - to raport status"""
        print( f"otdmDriverProto.POST( chars of data:{len(d)} )" )
        return self.CurlWResChk( "POST",
            f"http://{self.getHost()}:{self.getPort()}{self.getApiPath()}{self.getSuffix()}",
            data=f"{json.dumps(d)}"
            )

    def DELETE( self, d ):
        """@overwriteIt - to hendle request of deleting / removing / dropping / eresing something like all
        # Returns
        [list] - to raport status"""
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
