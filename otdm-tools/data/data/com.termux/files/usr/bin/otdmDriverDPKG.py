from otdmDriverProto import *
import os
import subprocess
import sys, apt,apt_pkg
import re


class otdmDriverDPKG( otdmDriverProto ):

    keyWord = "ddpkg"


    def __init__(self, args, conf, prefixFS="/" ):
        super(otdmDriverDPKG, self).__init__( args, conf, "ddpkg", prefixFS )

    def getHelp( self ):
        print( '-'+self.keyWord+'''  TODO
It's a set of helper to work with dpkg as it's in system on what otdmTools is running.
            TODO''')



    def subExe( self, cmd ):
        if isinstance(cmd, str):
            cmdA = cmd.split(' ')
            for i,c in enumerate(cmdA):
                cmdA[i] = "%s"%c
        else:
            cmdA = cmd
        #print(f"subExe will run with [%s]"%cmdA)
        result = subprocess.run( cmdA, capture_output=True, text=True)
        return {
            "sto":result.stdout,
            "ste":result.stderr,
            "exitCode": result.returncode
            }


    def mkPath( self, fPath ):
        return f"{self.getSuffix()}{fPath}"

    def chkHost( self ):
        print("check dpkg in system ....")
        res = self.subExe('which dpkg')
        if res['exitCode'] == 0:
            return 'ok'
        else:
            return ('error [%s]'%res)
        print("resultsssssssss\n%s"%res)
        return 'ok?'

    def ADD( self, fPath, d ):
        print(f"ADD {fPath} -> {d}")
        #f = open( self.mkPath(fPath) , "a" )
        #f.write(f"{d}")
        #f.close()

    def POST( self, fPath, d ):
        print(f"POST {fPath} -> {d}")
        #f = open( self.mkPath(fPath) , "w" )
        #f.write(f"{d}")
        #f.close()

    def DELETE( self, d ):
        print(f"DELETE {fPath} -> {d}")
        #os.remove(self.mkPath(d))

    def GETAll( self, firstFilter='otdm' ):
        #print(f" GETAll from dpkg-query --search otdm  with base:otdm by tag [{firstFilter}]")
        tr = {}

        self.ac = apt.Cache()
        self.ac.open()
        c = apt_pkg.Cache()
        ipacks = [pack for pack in c.packages]
        pattern = re.compile( firstFilter )
        cached = [pack for pack in ipacks if pattern.match(pack.name)]
        for c in cached:
            #print(" - > %s"%c.name)
            #tr[ c.name ] = self.GET( c.name, 'fromAll' )
            try:
                acp = self.ac[ "%s"%c.name ]
                rd = self.GET( c.name, 'fromAll' )
                tr[ c.name ] = rd
            except:
                print(f"package [{c.name}] is not in dpkg database...")



        return tr

        # old way
        reAllOtdm = self.subExe(f'apt-cache search {firstFilter}')
        rAllOtdm = []
        print("[  ]")
        for d in reAllOtdm['sto'].split("\n"):
            t = d.split(" ")
            if t[0] != "" and tr.get( t[0], '' ) == '':
                try:
                    self.ac[ "%s"%name ]
                    rd = self.GET( t[0], 'fromAll' )
                    tr[ rd['name'] ] = rd
                except:
                    print(f"package [{name}] is not in dpkg database...")

        return tr

    def GET( self, name, fromQ = "" ):
        if name != "*" and fromQ == '':
            return self.GETAll(name)
        d = 0
        print(f"GET  -> [{name}] ")

        if d:print("using apt-cache....")
        m = {
            "name":"Package",
            "section":"Section",
            "ver":"Version",
            "tag":"Tag",
            "status":"Status",
            "author":"Maintainer",
            "Homepage": "Homepage",
            "installSize": "Installed-Size",
            "Size": "Size",
            "Tag": "Tag",
            "desc": "Description",
            "debFile": "Filename",
            "Pre-Depends": "Pre-Depends",
            "Depends": "Depends",
            "Recommends": "Recommends"
            }
        r = self.subExe( ["apt-cache", "show", name] )
        ls = r['sto'].split("\n")
        tr = {}
        vals = list( m.values() )
        keys = list( m.keys() )
        descLast = False
        packageWas = 0
        for l in ls:
            if packageWas >= 2:
                print("have all package... skip rest...[%s]"%packageWas)
                break

            found = -1
            val = ""
            for v in vals:
                try:
                    found = l.index( f"{v}:" )
                    val = v
                    break
                except:
                    pass
            if d:
                print(f"found is found:{found} val:{val} descLast:{descLast}")
                print("line                                             %s"%l)
                print("desc detecte[%s]"%l[:2])
            if descLast and l[:2] == "  ":
                if d:print(" add missing desc....")
                tr['desc'] = f"{tr['desc']} {l[2:]}"
            else:
                descLast = False

            if found == 0:
                if val == "Description":
                    descLast = True
                tr[ keys[ vals.index( val ) ]  ] = l.split(": ")[1]
                if val == "Package" :
                    packageWas+=1



        if d:
            print( "have r ")
            print( r )
            print("------------------------------------")
            #sys.exit(11)
            print("tr")
            print(tr)
            print("is it installed ?")


        tr['installed'] = self.ac[ "%s"%name ].is_installed

        return tr
