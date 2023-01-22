from otdmDriverProto import *
import os
import subprocess
import sys

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
        print(f"subExe will run with [%s]"%cmdA)
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

    def GETAll( self ):
        #print(f" GETAll from dpkg-query --search otdm  with base:otdm by tag *")
        reAllOtdm = self.subExe('dpkg-query --search otdm')
        #print(reAllOtdm['sto'])
        rAllOtdm = []
        tr = {}
        for d in reAllOtdm['sto'].split("\n"):
            t = d.split(" ")
            if t[0] != "" and tr.get( t[0][:-1], '' ) == '':
                #res
                #otdm-tools: /data/data/com.termux/files/home/.otdm/tools
                #otdm-installer-dummy: /data/data/com.termux/files/home/.otdm/i
                # name passt
                rd = self.GET( t[0][:-1] )
                tr[ rd['name'] ] = rd

        #print("result --------------------------")
        #print( tr )

        #print("for now --------")
        #sys.exit(11)
        return tr

    def GET( self, name ):
        #print(f"GET  -> {name}")
        a = {
            "name":"${binary:Package}",
            "section":"${Section}",
            "ver":"${Version}",
            "tag":"${Tag}",
            "status":"${Status}",
            "author":"${Maintainer}",
            "Homepage": "${Homepage}",
            "Size": "${Size}",
            "Tag": "${Tag}",
            "desc": "${Description}",
            "Depends": "${Depends}",
            "Pre-Depends": "${Pre-Depends}",
            "Recommends": "${Recommends}"
            }
        r = self.subExe(
            ["dpkg-query",
                "-W",
                '-f='+json.dumps(a),
                name ]
            )

        #print( "have r ")
        #print( r )

        tr = json.loads( r['sto'].replace("\n", " ").replace("\t", " ").replace("  ", " ") )
        if tr['status'] == 'install ok installed':
            tr['installed'] = True
        else:
            tr['installed'] = False

        return tr
