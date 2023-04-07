import subprocess
import os
import json
from datetime import datetime


def otGet_sapisDef():
    return [
        ['infoPipe',      0, otA_infoPipe],



        ['ping',          0, otA_ping],
        ['echo',          1, otA_echo],

        ['sum',          2, otA_sum],
        ['divPipe',      1, otA_divPipe],
        ['div',          2, otA_div],

        ['getKey',      1, otA_getKey],

        ['otdmTools',    1 , otA_otdmTools],

        ['json',            0, otA_toJson],
        ['raw',             0, otA_toRaw],
        ['html',            0, otA_toHtml],

        ['help',          0, otA_help],

    ]

def otA_help( fromPipe, args ):
    return 0, '''

    '''

def otA_ping( fromPipe, args ):
    return 0, "pong"

def otA_echo( fromPipe, args ):
    return 0, args[0]

def otA_sum( fromPipe, args ):
    return 0, float(args[0])+float(args[1])

def otA_div( fromPipe, args ):
    return 0, float(args[0])/float(args[1])

def otA_divPipe( fromPipe, args ):
    return 0, float(fromPipe[1])/float(args[0])

def otA_infoPipe( fromPipe, args ):
    tr = "Info pipe .....\n"
    tr+= "type     ... %s"%type(fromPipe)
    #tr+= type(fromPipe)
    tr+= f"\n{fromPipe}"


    return 0, tr



def otA_getKey( fromPipe, args ):
    print("getKey ....pipe")
    print(fromPipe)
    print("args .....")
    print(args)
    print(type(fromPipe))
    try:
        return 0, fromPipe[ args[0] ]
    except:
        return 1, "can't get key"


def otA_toHtml( fromPipe, args ):
    return f"<html><body>{fromPipe[1]}</body></html>"

def otA_toJson( fromPipe, args ):
    return {
        "code": 200, "status":"success",
        "msg": fromPipe[1]
        }

def otA_toRaw( fromPipe, args ):
    return fromPipe[1]



def otA_otdmTools(fromPipe, args):
    print("otAotdmTools ...")
    tr = "ok"
    pH='ttaa%s'%datetime.now().strftime('%s')
    cmd =  args[0]
    print("vanilla arg %s"%cmd)
    resAs =  "json"
    if cmd != "":
        print("Have cmd: .... %s"%cmd)
        oFileP = "/tmp/otSTS%s.res"%pH
        print("Do it ... %s"%oFileP)
        cmd = f"/home/yoyo/Apps/oiyshTerminal/otdm-tools/data/data/com.termux/files/usr/bin/otdmTools.py {cmd} -oFile \"{oFileP}\""
        print( "full cmd is  ... %s"%cmd)
        subprocess.run( cmd, shell=True )
        print(" DONE")
        trp = ""
        if os.path.exists( oFileP ) == True:
            with open(oFileP, 'r') as file:
                trp = file.read().rstrip()

            print(f"S: Result for ... {pH}")
            if resAs == "json":
                return 0,json.loads(trp)
            else:
                return 0,trp
        else:
            print("Error no target file ")



    return 0,tr
