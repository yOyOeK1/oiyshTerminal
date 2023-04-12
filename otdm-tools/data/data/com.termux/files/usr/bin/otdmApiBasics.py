import subprocess
import os
import json
import time
import urllib
from datetime import datetime
from otdmPackitso import *
import otdmTools as ot

def otGet_sapisDef():
    sapis = [
        ['help',            0, otA_help,       '**Return** _raw_/_string_ this help :)'],

        ['getConfig',       0, otA_getConfig,  '**Return** _json_ current known config of otdm'],

        ['clipLimit',       1, otA_ClipLastNote, '**Return** otdm cliper last `arg0` entrys'],
        #['clipAdd',         1, otA_ClipAdd,      'TODO'],


        ['sum',             2, otA_sum,         '**Return** sume _float_ as sum of `arg0` ,`arg1`'],
        ['divPipe',         1, otA_divPipe,     '**Return** division _float_ incomming `pipe` by `arg0`'],
        ['div',             2, otA_div,         '**Return** division _float of `arg0` by `arg1`'],

        ['getKey',          1, otA_getKey,      '**Return** value from incomming pipe where `key` of json is =  `arg0`'],
        ['getKeyInAr',      1, otA_getKeyInAr,  '**Return** _array_ of _values_ form array of jsons with set key to get'],
        ['getKeyInArEq',    2, otA_getKeyInArEq,  ''],

        ['packitsoQ',        1 , otA_PackitsoQ,  '?|lsWork|yes to interact with `-packitso [action]`'],
        ['packitsoLsAll',    1 , otA_PackitsoLsAll,  '`arg0` _string_ _.lsWork=>keyWord_ as from where / what worker'],
        ['packitsoGET',      2 , otA_PackitsoGET,  'as get data from worker. `arg0` _string_ _keyWord_ to set worker `arg1` _string_ ident use to identyfy work peas'],
        ['packitsoPOST',     2 , otA_PackitsoPOST,  'TODO `arg0` _string_ keyWord, `arg1` _json_ data to POST'],



        ['otdmTools',       1 , otA_otdmTools,  '**Return** result from otdmTools.py `args...`'],

        ['ping',            0, otA_ping,        '**Return** `pong`'],
        ['echo',            1, otA_echo,        '**Return** given argument back as echo' ],

        ['waitFor',         1, otA_waitFor,     '**Return** current otdmTools.py time but with delay in sec from `arg0`'],


        ['infoPipe',        0, otA_infoPipe,    'xxxxx**Return** info about pipe'],


    ]


    sapis.append( ['.json',           0, otA_toJson,      '**Return** _json_ from `pipe`'] )
    sapis.append( ['.raw',            0, otA_toRaw,       '**Return** _raw_/_string_ from `pipe`'] )
    sapis.append( ['.html',           0, otA_toHtml,      '**Return** _raw_/_string_ from `pipe` to wrapt `html`'] )

    return sapis

def otA_help( fromPipe, args ):
    readmeC = ''
    with open('otdm_serviceIt_README.md', 'r') as file:
        readmeC = file.read().rstrip()

    sapisList = []
    for a in otGet_sapisDef():
        sapisList.append( "   - `%s` - need %s arguments. %s"%(a[0], a[1], a[3]) )
    readmeC = '%s\n\n## list of sapis\n\n%s'%(readmeC, "\n".join( sapisList ))


    return 0, '%s\n\n'%readmeC

def otA_getConfig( fromPipe, args ):
    return ot.confLoad()

def otA_ClipLastNote( fromPipe, args ):
    ot.conf = ot.confLoad()
    ot.chkClipBoard()
    limit = 1
    if args[0] != "":
        limit = int( args[0] )

    return ot.lastNote({"lastNote": limit,"oFile":'pipe'} )

def otA_PackitsoLsAll( fromePipe, args ):
    return otA_otdmTools( fromePipe, ['-packitso "ls" -work "%s" -ident "*" '%args[0]] )

def otA_PackitsoPOST( fromePipe, args ):
    pd = args[0]
    jd = args[1]
    iStrUrl = urllib.parse.quote_plus(json.dumps(jd))
    sToDo='-%s 1 -act POST -iStrUrl "%s"'%( pd, iStrUrl )
    postRes=otA_otdmTools( fromePipe, [sToDo] )
    print("post return -----------------")
    print(postRes)
    return postRes

def otA_PackitsoGET( fromePipe, args ):
    return otA_otdmTools( fromePipe, ['-packitso "ls" -work "%s" -ident "%s" '%(args[0],args[1])] )

def otA_PackitsoQ( fromePipe, args ):
    return otA_otdmTools( fromePipe, ['-packitso %s'%args[0]] )


def otA_ping( fromPipe, args ):
    return 0, "pong"

def otA_echo( fromPipe, args ):
    return 0, args[0]

def otA_waitFor( fromPipe, args ):
    time.sleep( int(args[0]) )
    return otA_echo( [0,''], fromPipe[1])

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


#['getKeyInAr',      1, otA_getKeyInAr,  'TODO'],
def otA_getKeyInAr( fromPipe, args ):
    return 0, ot.JGetByKey( fromPipe, args[0])

#['getKeyInArEq',    2, otA_getKeyInArEq,  'TODO'],
def otA_getKeyInArEq( fromPipe, args ):
    return 0, ot.JGetConWhenKeyEq( fromPipe, args[0], args[1])


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
