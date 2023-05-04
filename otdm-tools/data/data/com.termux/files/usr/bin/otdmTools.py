#!/usr/bin/env python3

import os
import sys
import json
import requests
from datetime import datetime
import tempfile
import shutil
import hashlib
from subprocess import run

import otdmUtils as otU

from otdmDriverProto import *
from otdmDriverManager import *
#from otdmDriverNodeRedFlowById import *
#from otdmDriverGrafanaDashboardByUid import *
#from otdmDriverGrafanaDatasourceByUid import *
#from otdmDriverFileSystem import *

from otdmPackitso import *

from otdmServiceIt import *

ver="0.27.10"
confFilePath="/data/data/com.termux/files/home/.otdm/config.json"
deb=0




conf={}
clip=[]
otdl=[]

def argsParser( args ):
    tr={}

    #print( "arg count {0}".format(
    #    len(args)
    #))

    vS = 0
    aName=""
    for i,a in enumerate(args):
        if i > 0:
            #print("arg nr {0} arg({1})".format(i,a))
            if vS == 1:
                if aName != "":
                    tr[aName]=a
                    aName=""
                    vS=0
                else:
                    print("error")
            elif a[0] == "-":
                vS=1
                aName=a[1:]

    return tr

class pcols:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def ErrDo( args, msg, codeNo=1 ):
    print(f"[{pcols.FAIL} Error {pcols.ENDC}] {msg}")
    print(f"[{pcols.FAIL} Error {pcols.ENDC}] Exit ({codeNo})")
    if args.get("exitToReturn") != None:
        return codeNo
    else:
        sys.exit( codeNo )

def argChkIf( args, erIf, argMsg, codeNo=1 ):
    if erIf:
        m=f"Argument {argMsg} need to be setup!"
        ErrDo( args, m, codeNo=codeNo )


def dYN( query, defReturn=False, inPrefix="i" ):
    tr=defReturn
    #print("tr: [{0}] type:[{1}]".format(tr, type(tr)) )
    if isinstance(tr, str):
        tr = True if tr in ["1", "y", "Y"] else False
    if tr:
        yn="Y / n"
    else:
        yn="y / N"

    while True:
        print( f"[ {inPrefix} ] {query} [ {yn} ]:" )
        r=input().lower()
        print("got input [%s]"%r)
        if r in [ "y", "n" ]:
            if r == "y":
                return True
            else:
                return False
        elif r == "":
            return tr
        print(" yyyyy no...")

    return tr


def chkClipBoard():
    #print("[ i ] chkClipBoard ....", end="")
    global clip

    cDir="{0}".format(conf['otdm']['prefix'])
    cFile=f"{cDir}/cliper.json"
    if os.path.isdir( cDir ) == False:
        ErrDo( args, "No cliper directory no .otdm? %s"%cDir)

    if os.path.exists( cFile ) == False:
        f = open( cFile, "w" )
        f.write( json.dumps( [] ) )
        f.close()


    cff = loadFileToJson( cFile )
    cfl = len( cff )
    if cfl > 1000: print("[ WARNING ] clip file (%s)"%cfl)
    if clip == [] and cfl > 0:
        #print(f" .....   loading: {cfl}")
        clip = cff
    elif len(clip) == cfl:
        #it's that subfunction is running?
        print("as sub?")
        aaa=1
    elif clip == [] and cfl == 0:
        ok=1
    else:
        print("Error cliper mist something !!!!")
        print(f"current clip len {len(clip)}, cff len {cfl}")


    #print("Exit for now to do it.")
    #sys.exit(1)

def tn_delIt():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def clipDumpToFile():
    fp="{0}/cliper.json".format(conf['otdm']['prefix'])
    print("clip dump to file %s"%fp)
    putToFile( fp, json.dumps( clip ), overrite=True )

def clipIt( args, o, note ):
    global clip
    tnow=otU.tn_nice()
    ol = "None" if o == None else len(o)

    print(f"[ clip ] Added note: ", end=" " )
    argsToAdd=json.loads(json.dumps(args))
    try:
        argsToAdd.pop("addNote")
    except:
        print("Error 98098")
        pass
    try:
        argsToAdd.pop("o")
    except:
        print("Error 353252")
        pass

    clip.append( {
        "args": argsToAdd,
        "o": o,
        "note": note,
        "ts": tnow
        } )
    printNote( clip[-1] )
    clipDumpToFile()

def putToFile( fp, jtr, overrite=False ):

    if fp == "--":
        print( jtr )
        return 1

    exitWith=1
    try:
        if os.path.exists( fp ) and overrite==False:
            if dYN(
                f"{fp}\n\ttarget file is existing. Overrite it?",
                inPrefix=" overrite it? ",
                defReturn=True
            ) == False:
                print("Abord. Exit 2")
                exitWith=2
                sys.exit(2)
            print(f"Overriting {fp} ...")

        f = open( fp, "w" )
        f.write(f"{jtr}")
        f.close()
    except:
        if exitWith == 1:
            print( f"Error {exitWith} - putToFile went wrong...\nfilepath:[{fp}]\ncontent:[{jtr}]\n")
        sys.exit(exitWith)

def argsNew( args ):
    tr=args

    de=args.get("debug")
    if de != None:
        tr["debug"]=de

    fh=args.get("forceHost")
    if fh != None:
        tr["forceHost"]=fh

    return tr

def loadFileToJson( fPath ):
    try:
        if deb:print("- open file...")
        with open(fPath, 'r') as file:
            if deb:print("- read data...")
            data = file.read().rstrip()

        if deb:print("- data to json...")
        j=json.loads(data)

        if deb:print(" DONE")
        return j

    except:
        print("Error - loadFileToJson with path [%s]"%fPath)
        exit(1)

    return None

def confLoad():
    if conf == {}:
        #print("[ i ] Configuration file loading from [%s]..."%confFilePath)
        return loadFileToJson( confFilePath )
    else:
        #print("conf is loaded so pass read.")
        return conf

def testEcho2def( args ):
    if deb:print( f"echo from testEcho2def! ..... deb[{deb}]")
    print( "{0}".format( args.get('testEcho2') ) )
    if args.get('testEcho2') == 'exit1':
        ErrDo( args, "exit1 from testEcho2 !!")
    return 1


def curlIt( methodee, url, headerss=None, data=None ):
    if deb:print( "curlIt for \nmethon [{0}]\nheaders [{1}]\nurl [{2}]".format(methodee,headerss,url))
    if deb and data:print("got data! len: %s"%len(data))
    r=""

    if methodee == "POST":
        r = requests.post( url, headers=headerss, data=data )
        if deb: print("POST--.text--\n{0}\n--.content--\n{2}\n---context len[{1}]--".format( r.text, len(r.content), r.content ) )
        return r.content

    elif methodee == "DELETE":
        r = requests.delete( url, headers=headerss, data=data )
        if deb: print("DELETE--.text--\n{0}\n--.content--\n{2}\n---context len[{1}]--".format( r.text, len(r.content), r.content ) )
        return r.content


    elif methodee == "GET":
        if headerss:
            r=requests.get( url )
        else:
            r=requests.get( url, headers=headerss )

        #print( f"response text: {r.text}" )

        return r.content

    else:
        ErrDo( args, "curlIt methodee not implemented." )

    return ""

def curlJ( args, methodee, url, headerss=None, data=None ):
    r=curlIt( methodee, url, headerss, data )
    if deb: print("curlJ r len:%s"%len(r))
    try:
        j=json.loads(r)
        return j
    except:
        ErrDo( args, "curlJ r to json \n\ngot r[{0}]".format(r), codeNo=2,  )


    return {}

def graGetBaseUrl( args ):
    return "http://{3}:{4}@{0}:{1}{2}".format(
        args.get( 'forceHost', conf['grafana']['host'] ),
        conf['grafana']['port'],
        conf['grafana']['apiPath'],
        conf['grafana']['user'],
        conf['grafana']['passwd']
    )

def nrGetBaseUrl( args ):
    return "http://{0}:{1}{2}".format(
        args.get( 'forceHost', conf['node-red']['host'] ),
        conf['node-red']['port'],
        conf['node-red']['apiPath']
    )



def JGetByKey( j, key ):
    tr=[]
    print( type(j) )
    for i,r in enumerate(j):
        print( "    - %s"%type(r) )
        print("         %s"%r)
        for k in r.keys():
            if k == key:
                tr.append( r[k] )

    return tr

def JGetConWhenKeyEq( j, key, val ):
    trConteners = []
    #print( type(j) )
    for i,r in enumerate(j):
        #print( "    - %s"%type(r) )
        for k in r.keys():
            if k == key:
                if r[k] == val:
                    trConteners.append( j[i] )

    return trConteners

def tCurl( args ):
    if deb:print( "testing curl .....%s"%args )

    w=args.get("testCurl")
    #global conf
    #conf=confLoad()
    mkG=False
    mkNR=False
    if w in ["grafana", "*"]:
        mkG=True
    if w in ["node-red", "*"]:
        mkNR=True


    if mkG:
        gUrl = "{0}/datasources".format( graGetBaseUrl( args ) )
        gRes = curlJ( args, "GET", gUrl )
        print( "grafana url: [%s]"%gUrl)
        ds=JGetByKey(gRes,"name")
        print( "    response length: %s elements in json"%len(gRes))
        print( "    datasources: {0}\n\t- {1}".format( len(ds),"\n\t- ".join(ds) ) )

    if mkNR:
        nrUrl = "{0}/flows".format( nrGetBaseUrl( args ) )
        nrRes = curlJ( args, "GET", nrUrl )
        print( "node-red url: [%s]"%nrUrl)
        print( "    response length: %s elements in json"%len(nrRes))
        flows=JGetConWhenKeyEq(nrRes, "type", "tab")
        fCount=len( flows )
        fLabels= "\n        - ".join(JGetByKey(flows,"label"))
        print( f"    flows: {fCount}\n\t- {fLabels}" )



    if deb:
        print( f"\n\n\ncontent of gRes\n{gRes}\n\n\nnode-red\n{nrRes}\n\n\n")
        print( "test curl...... END")

    return 1




def testAll( args ):
    print( "running test all ...")

    #global conf
    #print( "- config load   (confLoad)\n", end=" ")
    #conf=confLoad()
    #print("    OK")

    print( "- building urls for grafana and node red    (graGetBaseUrl())", end=" ")
    gUrl = "{0}/datasources".format( graGetBaseUrl( args ) )
    print(f" {pcols.OKBLUE}OK{pcols.ENDC}" )
    print( "- building urls for grafana and node red    (nrGetBaseUrl())", end=" ")
    nrUrl = "{0}/flows".format( nrGetBaseUrl( args ) )
    print(" OK" )

    print( "- communication to grafana  ", end=" ")
    gRes = curlJ( args, "GET", gUrl )
    print("-> have datasources %s  OK"%len(gRes))
    for d in gRes:
        print( f" - name:[{d['name']}]    id:[{d['id']}]   uid:[{d['uid']}]" )


    gId="myTzXx74k"
    print("- check if in grafana there is any datasources ...." )
    print(f" - have ds? with id=[{gId}]? %s  OK"% nrJIsThere( gRes, 'id', gId ) )
    print(f" - have ds? with uid=[{gId}]? %s  OK"% nrJIsThere( gRes, 'uid', gId ) )
    print(f" - have ds? with uid=[random]? %s  OK"% nrJIsThere( gRes, 'uid', 'random' ) )
    print(" - have ds? with name=[MySQLatNex7]? %s   OK"% nrJIsThere( gRes, 'name', "MySQLatNex7" ) )
    print(" OK")



    print( "- communication to Node-red ", end=" ")
    nrRes = curlJ( args, "GET", nrUrl )
    print("-> got flows %s    OK"%len(nrRes))

    #print("- check if in grafana/datasources/uid/323525322 is there.")

    nrId="7786178988d3d725"
    print(f"- check if in node-red have flow by is there...", end=" ")

    nrFlows=nrJGetOnlyFlows( nrRes )
    print("-> have tabs %s  OK"%len(nrFlows))
    for f in nrFlows:
        print(f" - label:[{f['label']}] id:[{f['id']}]")
    print(" OK")

    print(" Will test some stuff in node-red  .....")
    print(f" - have flow? with id=[{nrId}]? %s  OK"% nrJIsThere( nrRes, 'id', nrId ) )
    print(f" - have flow? with id=[random]? %s  OK"% nrJIsThere( nrRes, 'id', "uouaueodioes" ) )
    print(f" - have flow? with label=[Flow 1]? %s   OK"% nrJIsThere( nrRes, 'label', "Flow 1" ) )
    print(" OK")

    '''

    '''

    print( "test all DONE")
    return 1

def nrJGetOnlyFlows( j ):
    return JGetConWhenKeyEq( j, "type", "tab")

def nrJIsThere( j, byWhat, value):
    if deb: print(f"nrJIsThere - by what:{byWhat}; value:{value}")
    r=nrJGetFlowBy( j, byWhat, value )
    if len(r) == 0:
        return 0
    else:
        return 1

def nrJGetFlowBy( j, byWhat, value):
    chRCont=nrJGetOnlyFlows( j )
    return JGetConWhenKeyEq( j, byWhat, value)




def importFromTo( args ):
    return exportFromTo( args )

def doDkpg( args ):
    #otdmTools.py -dpkg `env`" -w gdsByName -by "$dbName"

    denv=args.get("dpkg")
    if 0:
        denv='''
SHELL=/data/data/com.termux/files/usr/bin/bash
HISTCONTROL=ignoreboth
no_proxy=192.168.*.*,127.0.0.1,localhost
DPKG_ADMINDIR=/data/data/com.termux/files/usr/var/lib/dpkg
PREFIX=/data/data/com.termux/files/usr
DPKG_MAINTSCRIPT_PACKAGE_REFCOUNT=1
TERMUX_MAIN_PACKAGE_FORMAT=debian
PWD=/
LOGNAME=u0_a239
LOGDIR=/data/data/com.termux/files/usr/var/log
TERMUX_VERSION=0.118.0
DPKG_RUNNING_VERSION=1.21.13
EXTERNAL_STORAGE=/sdcard
LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so
HOME=/data/data/com.termux/files/home
LANG=en_US.UTF-8
ANDROID_RUNTIME_ROOT=/apex/com.android.runtime
DPKG_FRONTEND_LOCKED=true
DPKG_FORCE=security-mac,downgrade
DPKG_MAINTSCRIPT_DEBUG=0
SVDIR=/data/data/com.termux/files/usr/var/service
DEX2OATBOOTCLASSPATH=/apex/com.android.runtime/javalib/core-oj.jar:/apex/com.android.runtime/javali
b/core-libart.jar:/apex/com.android.runtime/javalib/okhttp.jar:/apex/com.android.runtime/javalib/bo
uncycastle.jar:/apex/com.android.runtime/javalib/apache-xml.jar:/system/framework/framework.jar:/sy
stem/framework/ext.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/sy
stem/framework/ims-common.jar:/system/framework/miuisdk@boot.jar:/system/framework/miuisystemsdk@bo
ot.jar:/system/framework/android.test.base.jar:/system/framework/mediatek-telephony-base.jar:/syste
m/framework/mediatek-telephony-common.jar:/system/framework/mediatek-common.jar:/system/framework/m
ediatek-framework.jar:/system/framework/OPCommonTelephony.jar:/system/framework/mediatek-ims-common
.jar:/system/framework/mediatek-ims-base.jar:/system/framework/mediatek-telecom-common.jar
TMPDIR=/data/data/com.termux/files/usr/tmp
DPKG_ROOT=
https_proxy=http://192.168.43.1:8118
SSH_CONNECTION=192.168.43.220 34528 192.168.43.64 2222
ANDROID_DATA=/data
TERM=xterm-256color
USER=u0_a239
DPKG_MAINTSCRIPT_NAME=preinst
NO_PROXY=192.168.*.*,127.0.0.1,localhost
SHLVL=1
DPKG_COLORS=always
HTTPS_PROXY=http://192.168.43.1:8118
HTTP_PROXY=http://192.168.43.1:8118
DPKG_MAINTSCRIPT_PACKAGE=otdm-grafana-ds-mysql
ANDROID_ROOT=/system
http_proxy=http://192.168.43.1:8118
BOOTCLASSPATH=/apex/com.android.runtime/javalib/core-oj.jar:/apex/com.android.runtime/javalib/core-
libart.jar:/apex/com.android.runtime/javalib/okhttp.jar:/apex/com.android.runtime/javalib/bouncycas
tle.jar:/apex/com.android.runtime/javalib/apache-xml.jar:/system/framework/framework.jar:/system/fr
amework/ext.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/fr
amework/ims-common.jar:/system/framework/miuisdk@boot.jar:/system/framework/miuisystemsdk@boot.jar:
/system/framework/android.test.base.jar:/system/framework/mediatek-telephony-base.jar:/system/frame
work/mediatek-telephony-common.jar:/system/framework/mediatek-common.jar:/system/framework/mediatek
-framework.jar:/system/framework/OPCommonTelephony.jar:/system/framework/mediatek-ims-common.jar:/s
ystem/framework/mediatek-ims-base.jar:/system/framework/mediatek-telecom-common.jar:/apex/com.andro
id.conscrypt/javalib/conscrypt.jar:/apex/com.android.media/javalib/updatable-media.jar
SSH_CLIENT=192.168.43.220 34528 2222
ALL_PROXY=http://192.168.43.1:8118
ANDROID_TZDATA_ROOT=/apex/com.android.tzdata
PATH=/data/data/com.termux/files/usr/bin
DPKG_MAINTSCRIPT_ARCH=all
SSH_TTY=/dev/pts/28
_=/data/data/com.termux/files/usr/bin/env'''

    w=args.get("w")
    by=args.get("by")
    dargs=args.get("args")

    wCan=["gdsByName", "gdbByName"]
    argChkIf( args, w not in wCan, f"-w Out of spec. Can by {wCan} " )
    argChkIf( args, dargs == None, '-args - its "$*" of a state ')
    if w == "gdsByName":
        argChkIf( args, by == None or by == "", "-by inccorrect")


    #print( f"env:[{denv}]" )

    # ENV to json
    dt=denv.split("\n")
    djenv={}
    for ee in dt:
        et=ee.split("=")
        if len(et) == 2:
            djenv[ et[0] ]=et[1]
        elif len(et) > 1:
            k=et[0]
            et.pop()
            djenv[ k ]=k.join("=")

    argChkIf( args, len(djenv) < 10, "-dpkg")

    inStep=djenv.get("DPKG_MAINTSCRIPT_NAME")
    #dName=djenv.get("DPKG_MAINTSCRIPT_PACKAGE")
    #if isinstance( dName, str ):
#        name=dName.replace("otdm-","")
    #else:
    #    name="NaN Error?"
    #argChkIf( args, dName == None or dName == "", "-dpkg dont have DPKG_MAINTSCRIPT_PACKAGE on the list,")

    #print( f"   dpkg name: [{dName}] but will use [{name}]")
    print(  "      inStep: [%s]"%inStep)
    print( f"    got args: [{dargs}]")
    #print("djenv: %s"%json.dumps(djenv, indent=4))

    if inStep == "preinst":

        #chk if install in not comming with versions...
        insA=dargs.split(" ")
        if len( insA ) == 3:
            # in install update control?
            # spot to add version control if needed.
            # for now ignor version asume it's comming from instance
            # where prevesiely there was removed one odtm this.
            print(f" posible place for version control? preinst from v0:[{insA[1]}] -> v1:[{insA[2]}]")
            dargs="install"
            #print("I'm in !")
            #sys.exit(1)


        if dargs == "install":

            if w == "gdsByName" or w == "gdbByName":
                print("\n[ 1 / 3 ] Checking host....")
                hostOk=0
                try:
                    #r=exeIt( { "forceHost": "192.168.43.1", "testCurl": "grafana" } )
                    r=exeIt( { "testCurl": "grafana" } )
                    if deb: print("exeIt 1 return: [%s]"%r)
                    if r == 1:
                        hostOk=1
                    elif r == 2:
                        sys.exit(1)
                    else:
                        print(" useuhoentuheo un2352")

                except SystemExit as e:
                    if deb: print(f"wast error end ? e:[{e}] type:[{type(e)}]")
                    if ("%s"%e) == "1":
                        ErrDo(args, "(2) Wrong response from grafana / datasources")
                    elif ("%s"%e) == "2":
                        ErrDo(args, "(2) Wrong response from grafana / datasources. Can't convert response to json.")
                    else:
                        print(" ueououoeuou")

                if deb: print(f"OUT hostOK:[{hostOk}] ")

                print(f"\n[ 2 / 3 ] Checking datasourc by name  looking for [{by}]... ! Expecting Error !")
                dbNameEmpty=True
                try:
                    #r=exeIt( { "forceHost": "192.168.43.1", "export": "grafana", "expW": "dsByName", "file": "--", "eBy": wCan } )
                    if w == "gdsByName":
                        r=exeIt( { "export": "grafana", "expW": "dsByName", "file": "--", "eBy": by } )
                    elif w == "gdbByName":
                        r=exeIt( { "export": "grafana", "expW": "dbByName", "file": "--", "eBy": by } )

                    if deb:print("exit 3.0 r:%s"%r)
                    if r == 1:
                        dbNameEmpty = False
                except SystemExit as eNo:
                    print("[ i ] Got expected error :) Checking if it's correct one....")
                    if deb:print("exit 3.1 with eNo:%s"%eNo)
                    if "%s"%eNo == "1":
                        if deb:print("[ i ] all good.")
                        dbNameEmpty = True
                    elif "%s"%eNo == "2":
                        ErrDo( args, "Unexpected response from grafana.")
                    else:
                        dbNameEmpty = False

                if deb: print("exeIt 3.2 return: [%s]"%r)
                if dbNameEmpty == False:
                    ErrDo(args, f"There is a datasourc with the name [{by}]")



                print(f"\n[ 3 / 3 ] Making backups of current before injection grafana datasourcs....")
                exeIt( {"mkbp": "gds", "bSuffix": f"_{inStep}_{dargs}"} )

                print("All good.")
                return 1

            else:
                ErrDo( args,"Not implemented jet :) 3242")



        else:
            ErrDo( args,"Not implemented jet :) 999929")



    else:
        ErrDo( args,"Not implemented jet :) 22342")




    return 1

def exportFromTo( args ):
    #global conf
    exp=args.get('export')
    imp=args.get('import')
    fp=args.get('file')
    impW=args.get('impW')
    iFile=args.get('iFile')
    iStr=args.get('iStr')
    expW=args.get('expW')
    eBy=args.get('eBy')


    argChkIf( args, imp and impW == None, "-impW" )
    argChkIf( args, imp and ( iFile == None and iStr == None ), "-iFile or -iStr" )
    argChkIf( args, fp == None, "-file")
    argChkIf( args, imp == None and expW == None, "-expW")
    argChkIf( args, exp == "grafana" and expW not in ["ds","dsByName", "dsByUid","dashs","dashByName","dashByUid"], "-expW is out of spec,")
    argChkIf( args, exp == "node-red" and expW not in ["flow","flows"], "-expW is out of spec," )
    argChkIf( args, exp == "grafana" and expW in ["dsByName","dsByUid","dashByName","dashByUid"] and eBy == None, "-expW is as [{0}] you need to set up -eBy argument. out of spec,".format("expW") )
    argChkIf( args, exp == "node-red" and expW in ["flow"] and eBy == None, "-expW is as [{0}] you need to set up -eBy argument. out of spec,".format("expW") )

    #print(f"-------------------------\n{eBy}\n--------")


    if imp:
        if imp == "node-red":
            argChkIf( args, impW not in ["flow"], "- impW is as [{0}] out of spec,".format(impW) )
        elif imp == "grafana":
            argChkIf( args, impW not in ["ds","dashs"], "-impW is as [{0}] out of spec,".format(impW) )

    if exp:
        print( '''Will do export:
        - get data from [{0}] / [{2}] / [{3}]
        - put to file :[{1}]
        '''.format( exp, fp, expW, eBy ) )
    if imp:
        print( '''Will do import :
        - will use file? [{0}]
        - or will use string input? [{1}]
        - will import stuff to [{2}] / [{3}]
        - result will go to [{4}]
        '''.format( iFile, iStr, imp, impW, fp ) )


    #conf=confLoad()
    gUrl = graGetBaseUrl( args )
    nrUrl = nrGetBaseUrl( args )
    jtr=None
    jr=None
    impH={
        "content-type": "application/json"
    }

    if imp:
        jFF = loadFileToJson( iFile )
        if deb: print("jFF---------\n%s"%jFF)

    if imp == "node-red" and impW == "flow" and iFile != None:
        jr=curlJ( args, "POST", "%s/flow"%(nrUrl), impH, data=json.dumps(jFF) )

    elif imp == "grafana" and impW == "ds" and iFile != None:
        jr=curlJ( args, "POST", "%s/datasources"%(gUrl), impH, data=json.dumps(jFF) )


    elif exp == "grafana" and expW == "ds":
        jr=curlJ( args, "GET", "%s/datasources"%(gUrl) )

    elif exp == "grafana" and expW == "dsByName" and eBy != None:
        jr=curlJ( args, "GET", "%s/datasources/name/%s"%(gUrl,eBy) )

    elif exp == "grafana" and expW == "dsByUid" and eBy != None:
        jr=curlJ( args, "GET", "%s/datasources/uid/%s"%(gUrl,eBy) )


    elif exp == "node-red" and expW == "flows":
        jr = curlJ( args, "GET", "%s/flows"%(nrUrl)  )

    elif exp == "node-red" and expW == "flow" and eBy != None:
        jr=curlJ( args, "GET", "%s/flow/%s"%(nrUrl,eBy) )


    #elif imp == "grafana" and impW == "ds"

    else:
        ErrDo( args, "not implemented 4112")

    if deb:
        print("imp status [%s]"%imp)
        print( "imp: {0} str:{1} bool:{2}".format(imp,"grafana",imp=="grafana") )
    if exp == "grafana" or imp == "grafana":
        if deb:
            print("checking if it's json and correct one...")
            print("results----------------------------\n")
            print("[%s]"%jr)
        if jr == None:
            ErrDo( args, "no jr ? how?" )

        if jr.get('traceID') == "00000000000000000000000000000000":
            ErrDo( args, "wrong response...\n\n%s\n"%jr )

        if jr.get('message') == "Data source not found":
            ErrDo( args, "Data source not found\ngrafana return:\n%s\n"%jr )

        #print(jr)
        if type(jr) == "<class 'dict'>":
            if jr.get('traceID') == "00000000000000000000000000000000":
                ErrDo( args, "not expected! \n %s"% jr )

        jtr=jr
        print("got it from")

    if exp == "node-red" or imp == "node-red":
        if jr == None: ErrDo( args, "no jr ? how? 52523" )

        if jr.get('code') == "unexpected_error":
            ErrDo( args, "wrong response...\n\n%s\n"%jr)

        #print(jr)
        '''if type(jr) == "<class 'dict'>":
            if jr.get('traceID') == "00000000000000000000000000000000":
                ErrDo( args, "Error - not expected!\n%s"%jr )
                sys.exit(1)'''
        jtr=jr
        print("got it from")


    if jtr == None:
        ErrDo( args, "no json to store at the end of export section.")


    if exp or imp:
        print( "write json to file...")
        putToFile( fp, json.dumps(jtr) )

    print(" DONE")
    return 1

def rmIn( args ):
    return acIn( args, "rm" )

def acIn( args, act="rm" ):
    #global conf
    if deb: print( "acIn with act[%s]"%act )

    ac=args.get(act)
    acW=args.get("%sW"%act)
    acBy=args.get("by")

    argChkIf( args, acW == None, f"-{act}W" )
    argChkIf( args, acBy == None, "-by" )

    #conf=confLoad()
    gUrl = graGetBaseUrl( args )
    nrUrl = nrGetBaseUrl( args )
    jtr=None
    jr=None
    impH={
        "content-type": "application/json"
    }

    if act == "rm" and ac == "grafana" and acW=="ds":
        jr=curlJ( args, "DELETE", "%s/datasources/uid/%s"%(gUrl,acBy) )
        if jr.get("message") == "Data source deleted":
            print( "DELETED" )
            return 1
        elif jr.get("message") == "Data source not found":
            ErrDo( args, "grafana: %s"%jr.get("message") )
        else:
            ErrDo( args, "not implemented 66433")

    else:
        ErrDo( args, "not implemented yet...42322")



    print(" DONE")
    return 1

def gPrintHD():
    print(f"place \t uid \t\t id \t orgId \t name \t\t type")

def gPrintDS( dsOne ):
    print( f"g/ds \t {dsOne['uid']} \t {dsOne['id']} \t {dsOne['orgId']} \t {dsOne['name']} \t {dsOne['type']}" )

def mkBackUp( args ):
    #global conf
    by=args.get("by")
    w=args.get("mkbp")
    packItAtEnd=True
    hostAdd=args.get("forceHost")
    bPrefix=args.get("bPrefix","")
    bSuffix=args.get("bSuffix","")

    if hostAdd == None:
        fHostPrefix=""
    else:
        fHostPrefix=hostAdd+"_"

    if w in ["gdsuid","gdsid","gdsname","gdhuid","gdhid","gdhname","fid","fname" ]:
        argChkIf( args, by == None, "-w [{w}] so -by")



    #conf=confLoad()
    gUrl = graGetBaseUrl( args )
    nrUrl = nrGetBaseUrl( args )
    gsUrl = "{0}/datasources".format( graGetBaseUrl( args ) )
    nrsUrl = "{0}/flows".format( nrGetBaseUrl( args ) )

    jtr=None
    jr=None
    impH={
        "content-type": "application/json"
    }

    destDir="%s/Backups"%conf["otdm"]["prefix"]
    now=datetime.now()
    tn=now.strftime("%y%m%d%H%M%S")
    tDir=tempfile.mkdtemp(prefix="bkup_",suffix=f"_{tn}")
    print( f"Will use prefix to archive [{tn}]. " )
    print( f"Making tmp directory [{tDir}]" )
    isExist = os.path.exists(tDir)
    wTask = ""

    prefixF=f"{tDir}/{fHostPrefix}"

    if w == "flows":
        wTask="nrflows"
        jfs=curlJ( args, "GET", nrsUrl )
        nrFlows=nrJGetOnlyFlows( jfs )
        jfsFn=f"{prefixF}flows_{tn}{bSuffix}.json"
        print(f"backuping [{len(nrFlows)}] flows...to [{jfsFn}]", end=" ")
        putToFile( jfsFn, json.dumps(jfs) )
        print(" DONE")

    elif w == "gds":
        wTask="grafana-ds"
        jds=curlJ( args, "GET", gsUrl )
        jdsFn=f"{prefixF}grafana_ds_{tn}{bSuffix}.json"
        print(f"backuping grafana / datasources [{len(jds)}] ... to [{jdsFn}]\n")

        gPrintHD()
        for d in jds:
            gPrintDS( d )

        putToFile( jdsFn, json.dumps(jds) )
        print("\n DONE")

    elif w == "fpath":
        fullP = os.path.join( os.getcwd(), by)
        oName = os.path.basename( fullP )
        oPath = os.path.dirname( fullP )
        bPrefix = args.get("bPrefix", "" )+oName
        fArchName = f"{bPrefix}_{tn}{bSuffix}.tar.bz2"
        fsFn=f"{prefixF}{fArchName}"
        isExist = os.path.exists(fullP)

        cTd = (f"cd {oPath}; tar -jcvf {fsFn} {oName}")

        print(f"fpath backup ! fullP:{fullP} isExist:{isExist} oName:{oName}\n"+
            f"so cmd will be ... \n\n{cTd}\nDestination dir: {destDir}\n")

        if isExist == False:
            print("Error source directory to backup is not existing.... EXIT 2")
            sys.exit(2)

        print("in 2 sec it will do it .....")
        time.sleep(2)
        print("Running it .... ", end="")
        subprocess.run( cTd, shell=True )
        print("DONE")

        print(f"Moving it to destination directory: {destDir} ... ", end="")
        shutil.move( fsFn, f"{destDir}/" )
        print("DONE")
        if args.get('oFile','') != "":
            print("---- oFile is !!")
            addArgHandle_oFile(args, {
                "dirName": oPath,
                "name": oName,
                "archInfo": fileInfo( os.path.join( destDir, fArchName ) ),
                "currPath": destDir,
            })
        sys.exit(1)

    elif w == "*":
        egds=argsNew( args )
        egds["mkbp"]="gds"
        efs=argsNew( args )
        efs["mkbp"]="flows"

        if deb:print("\nwill run automation tasker......tasks are:\n")

        return exeArray( [ egds, efs  ] )




    else:
        ErrDo( args, "not implemented yet...32  2222")





    if packItAtEnd:
        print(f"Moving it all to.. \n\t{destDir}")
        pFrom="%s/"%tDir
        pTo=f"{destDir}/"
        files=os.listdir(pFrom)
        for f in files:
            print(f"\t[{f}] ", end=", ")
            src=pFrom+f
            dst=pTo+f
            shutil.move( src, dst )


        '''
        shutil.make_archive( f"{destDir}/{wTask}_{tn}", "zip", tDir )
        fnzip=f"{destDir}/{wTask}_{tn}.zip"
        print("fnzip %s"%fnzip)
        fas=os.path.getSize( fnzip ) / (1024)
        print(f"done. size {fas} KB")
        '''

    print(" DONE ")
    return 1

def fileInfo( filePath ):
    return {
        "isFile": os.path.isfile( filePath),
        "isDir": os.path.isdir( filePath),
        "name": os.path.basename( filePath ),
        "dir": os.path.dirname( filePath ),
        "fullPath": filePath,
        "size": os.path.getsize( filePath ),
        "ctime": os.path.getctime( filePath )
    }

def execTasksFrom( args ):
    if deb: print( f"execTasksFrom .... {args}" )
    #global conf
    hPath=args.get("tasks")

    print(f"Working with otdm file [{hPath}]" )
    j=loadFileToJson( args.get("tasks") )
    tc=len(j)
    if tc > 0:
        print( f"Have some tasks.....[ {tc} ]")
        for i,t in enumerate(j):
            print( f"--- task [ {i+1} / {tc} ] ........ START" )
            print("|")
            conf={}
            if t.get("task") == "otdm":
                argsTs=argsNew({})
                argsI=t.get("args")
                for til in argsI.keys():
                    argsTs[til]=argsI[til]

                print( " \---> $ "+t.get("desc")+" args: %s\n"%argsTs)
                rAP=exeIt( argsTs )
                if deb:
                    print("\nrelust: [%s]"%rAP)
                    print(f"\n\--task {i+1}----------------")
                if rAP != 1:
                    ErrDo( args, "in otdm if not 1 not good")

            else:
                ErrDo( args, "not implemented yet otdm tasker 55322")
            print( f"--- task [ {i+1} / {tc} ] ........ END" )



        print( f"Tasks list of {tc} tasks executed.")



    if deb: print( f"execTasksFrom .... {args} DONE" )
    return 1


def setDebug( args ):
    print( "setDebug action %s"%args )
    if args.get('debug') != None or args.get('debug') == "":
        global deb
        deb=int( args.get('debug') )


def MakeInjToJ( args, tr ):
    print("checking if -injToJ was set...")
    atw=args.get("injToJ")
    if atw != None:
        print(" adding it.. currently is type: [%s]"%type(atw))
        #print(atw)
        if ( "%s"%type(atw) ) == "<class 'dict'>":
            print(" no need to convert to json")
            jsjd=atw
        else:
            try:
                jsjd=json.loads( atw )
            except:
                ErrDo( args, "Error in parsing -injToJ is it json string?")

        for aa in jsjd.keys():
            tr[ aa ]=jsjd[ aa ]

    else:
        print(" no.")

    return tr


def mkInjectionFile( args ):
    #deb = 1
    print(f"make injection files ready...{args}")
    fIn=args.get("if")
    fOut=args.get("of")
    w=args.get("mkInjFil")

    if w not in ["grafana-ds", "grafana-db", "node-flow"]:
        ErrDo( args, "not implemented... 342232")

    argChkIf( args, fIn == None or fOut == None, "-if and -of is needed,")


    jIn=loadFileToJson( fIn )
    if deb:print(f"jIn len {len(jIn)} {jIn}")

    # ./otdmTools.py -mkInjFil "grafana-ds" -if /OT/otdm-grafana-ds-MySql/data/data/com.termux/files/home/.otdm/gafana-ds-MySql/gds_mysql_ot_org.json -of "--"
    if w == "grafana-ds":
        tr={}
        hId=False
        hUid=False
        hOrgId=False
        for k in jIn.keys():
            if k == "id":
                hId=True
            if k == "uid":
                hUid=True
            if k=="orgId":
                hOrgId=True

            if k not in [ "id", "uid", "orgId" ]:
                tr[ k ]=jIn[ k ]

        if hId==False or hUid==False or hOrgId==False:
            ErrDo( args, "there is somethin wrong with source json id{hId} uid{hUid} orgId{hOrgId}")

        tr=MakeInjToJ( args, tr)
        if deb:print(" end rel --------\n")
        if deb:print( tr )

        putToFile( fOut, json.dumps( tr ) )

    elif w == "grafana-db":
        if jIn.get("meta",1)==1  or jIn.get("dashboard", 1) == 1:
            ErrDo( args, "Wrong data in input file.")
        del jIn['meta']
        del jIn['dashboard']['uid']
        del jIn['dashboard']['version']
        tr=MakeInjToJ( args, jIn)

        putToFile( fOut, json.dumps( jIn ) )

    else:
        ErrDo( args, "not implemented yet otdm tasker uouoa999ueo")

    print( "DONE" )
    return 1



def testDialog( args ):
    if dYN( "It's a dialog test do you want to go to next one?", inPrefix=args.get("testDialog", " i ") ):
        while dYN( "Press Y to exit loop.", inPrefix=args.get("testDialog", " i ") ) == False:
            pass
        return 1
    else:
        return 0

def mkDialogWithExit( args ):
    sys.exit(
        dYN( args.get("doQueryYN"), defReturn=args.get("d",False), inPrefix=" ? " )
    )


def addNote( args ):
    o=args.get("o",None)
    a=args.get("addNote",None)

    if isinstance(o,str):
        try:
            print("It's comming from command line or something. Trying to do json...")
            o=json.loads(o)
            print(" -o str -> json")
        except:
            print(" not convertable :( [%s]"%o)

    clipIt( args, o, a )
    if ( a != None and o == None ) or ( a != None and o != None ):
        return 1
    return 0

def printNote( n ):

    ol="None" if n['o'] == None else len(n['o'])

    print( f"{n['ts']} : {pcols.BOLD}{pcols.HEADER}{n['note']}{pcols.ENDC}",end=" " )
    if n['o'] != None:
        print(f" ( o.len {ol} )" )
    else:
        print()

    print( "[args]:%s"%n['args'] )

    if isinstance(n['o'],dict):
        print( json.dumps(n['o'], indent=4) )
        print( f"{n['ts']} : ------- END Note" )
    elif isinstance(n['o'],str):
        print( n['o'] )
        print( f"{n['ts']} : ------- END Note" )

    elif n['o'] == None:
        pass
    else:
        print("obj is typ: e%s"%type(n['o']))

def lastNote( args ):
    c=args.get("lastNote")
    try:
        cint=int(c)
    except:
        ErrDo( args, "need number.")

    tr = []

    cl=len(clip)
    cStart=cl-cint
    if cStart < 0:
        cStart=0
    cEnd=cl
    if cEnd < 0:
        cEnd=0
    for e,i in enumerate(range( cStart,cEnd,1 )):
        #if e > 0:
        #    print(",")
        #print( clip[i], end=" " )
        #n=clip[i]
        #printNote(n)
        tr.append( clip[i] )

    addArgHandle_oFile( args, tr)

    if args.get("oFile",'') == "pipe":
        return 0,tr
    else:
        for n in tr:
            printNote(n)
    #print()

    return 1

def extractDataFrom( args ):
    w=args.get("extract")
    fi=args.get("if")

    argChkIf( args, fi == None, "-if" )

    #if w == ""
    if os.path.exists(fi) == False:
        ErrDo( args, "no if {fi}")
    ji=loadFileToJson( fi )
    print("len: %s"%len(ji))

    if len(ji) == 4:

        dsId=ji.get("id")
        dsUid=ji["datasource"].get("uid")
        dsorgId=ji["datasource"].get("orgId")
        dsName=ji["datasource"].get("name")

    elif len(ji) == 20:
        print(" YES !")

        dsId=ji.get("id")
        dsUid=ji.get("uid")
        dsorgId=ji.get("orgId")
        dsName=ji.get("name")

        #sys.exit(1)

    else:
        ErrDo( args, "file format unknown...")

    if dsId == None or dsUid == None or dsorgId == None or dsName == None:
        ErrDo( args, "Error - file dont have name[{3}] id[{0}] uid[{1}] orgId[{2}]".format(
            dsId, dsUid, dsorgId, dsName
        ))

    print("extraction name[{3}] id[{0}] uid[{1}] orgId[{2}]. Making files for bash.".format(
        dsId, dsUid, dsorgId, dsName
    ))

    print("doing md5 ....",end=" ")
    dsMd5=hashlib.md5( open(fi,'rb').read() ).hexdigest()
    print(" DONE")

    print("writing files ....", end=" ")
    putToFile( f"{fi}_name", dsName )
    putToFile( f"{fi}_id", dsId )
    putToFile( f"{fi}_uid", dsUid )
    putToFile( f"{fi}_orgId", dsorgId )
    putToFile( f"{fi}_md5", dsMd5 )
    print(" DONE")

    clipIt( args, {"name":dsName, "id":dsId, "uid":dsUid, "orgId":dsorgId, "md5": dsMd5},
        "Extraction grafana / datasource / file after injection to bash." )

    return 1


subP = 0
subOut = []

def th_subP( args ):
    print(f"sub thread {args['name']} is starting cmd {args['cmd']}")
    import time
    from subprocess import Popen, PIPE, STDOUT
    import threading

    print("Popen")
    global subP
    global subOut

    subOut = []
    subP = Popen(args['cmd'],  stdout=PIPE, stdin=PIPE, stderr=STDOUT)
    #time.sleep(.2)
    empty = 0
    while 1:
        #print(subP.stdout.readable())
        #print(subP.stdout.readline())
        #print(subP.stdout.closed)
        #print("empty now:%s"%empty)
        if empty > 10:
            subOut.append( -1 )
            break
        if subP.stdout.readable() :
            #print("read line ..")
            try:
                w = subP.stdout.readlines()
                #print("w:%s"%w)
                #subP.stdout.flush()
                for l in w:
                    subOut.append( l )
                if w == []:
                    #print("empty")
                    empty+=1
                    subOut = subOut[0:-1]
            except:
                print("subOut append read error ")
        #else:
        #    break

        #print(f"sub thread {name} iter")
        #time.sleep(.1)


    print(f"sub thread {args['name']} is DONE")

def testSubProcAndProm( args ):
    print("testSubProcAndProm")
    global subP
    global subOut
    import threading
    import time

    x = threading.Thread( target=th_subP, args=({
        "name": "subprocess name test 1234",
        #"cmd": ["ls", "/tmp"],
        #"cmd": ["./otdmTools.py", "-testDialog", "abc"]
        #"cmd": ["sleep", "10"]
        #"cmd": ["apt-cache", "search", "mpg123"]
        #"cmd": ["dpkg-query", "-W", "-f='{${Package} ${Status}}'", "otdm-tools"]
        #"cmd": ["echo", "ala ma kota tink ping." ]
        #"cmd": ["tree", "/tmp"]
        #"cmd": ["cal"],
        #"cmd": ["whoami"]
        "cmd": ["sudo", "--stdin", "apt", "update"]
        }, ))
    x.start()
    #time.sleep(.5)

    nn = 0
    lr = 0
    while 1:
        nn+= 1

        if len(subOut)>0 and subOut[-1] == -1:
            print("It's done.....")
            for l in range( lr, len(subOut)-1,1 ):
                #print(f"({l}) : {subOut[l].decode()}", end="")
                print(f"({l})   : {subOut[l].decode()}", end="")
            break

        for l in range( lr, len(subOut),1 ):
            print(f"({l})   : {subOut[l].decode()}", end="")
            lr = l+1

        #print( f"subOut len:{len(subOut)} stdout closed:{subP.stdout.closed}")


        if len(subOut) > 0 and subOut[-1] == b'[ abc ] It\'s a dialog test do you want to go to next one? [ y / N ]:\n':
            print("got known prompt !! send y")
            subP.stdin.write(b'y\n')
            subP.stdin.flush()


        if nn in [ 50 ]:
            print("send a")
            subP.stdin.write(b'a\n')
            subP.stdin.flush()

        if 0 :
            if nn in [ 16 ,21, 24 ]:
                print("send w")
                subP.stdin.write(b'w\n')
                subP.stdin.flush()


            if nn in [ 29 , 35 ]:
                print("send y")
                subP.stdin.write(b'y\n')
                subP.stdin.flush()

        time.sleep(.1)
    #sys.exit(11)
    return 1


def bashConfigToJson( args, fPath ):
    global conf
    fs = otdmDriverFileSystem( args, conf )
    fLines = fs.GET('/etc/os-release').split("\n")
    fD = {}
    for l in fLines:
        t = l.split('=')
        if t[1][0] == '"' and t[1][-1] == '"' and len(t[1])>1:
            t[1] = t[1][1:-1]

        if len(t) > 0:
            fD[ t[0] ] = t[1]
    #print("from file\n")
    #print(fD)
    return fD


fsDFS = -1

""" Handle -oFile
arg - passd from your script
ts  - to save data"""
def addArgHandle_oFile( args, tsData ):
    global conf
    global fsDFS
    if fsDFS == -1:
        fsDFS = otdmDriverFileSystem( args, conf )
    fsDFS.saveIfArgs(tsData)


def getPipeContent():
    global fsDFS
    print("fsDFS is now %s"%fsDFS)
    return fsDFS.pipe


def osType( args ):
    print("looking for os type.... ", end="")

    tr = {
        'os':-1,
        'like':-1,
        'ver':-1
    }

    if os.path.exists( '/etc/os-release' ):
        print("debianish \ ...", end="")

        fc = bashConfigToJson( args, '/etc/os-release' )

        if fc.get('NAME', '') != '':
            tr['os'] = str(fc.get('NAME'))

        if fc.get('VERSION_ID', '') != '':
            tr['ver'] = fc.get('VERSION_ID')

        if fc.get('ID_LIKE', '') != '':
            tr['like'] = str(fc.get('ID_LIKE'))

    elif os.environ.get('TERMUX_VERSION','') != '':
        print('termux ish \ ...', end="")

        tr['os'] = 'termux'
        tr['like'] = 'termuxDebian'
        tr['ver'] = os.environ.get('TERMUX_VERSION','')

    else:
        print("NaN os")


    print("\nend for now ....................\n")
    print(tr)
    addArgHandle_oFile(args, tr)
    return 1

    ##sys.exit(0)
    a= '''
        if dYN(
            f"{fp}\n\ttarget file is existing. Overrite it?",
            inPrefix=" overrite it? ",
            defReturn=True
        ) == False:
            print("Abord. Exit 2")
            exitWith=2
            sys.exit(2)
        print(f"Overriting {fp} ...")

    f = open( fp, "w" )
    f.write(f"{jtr}")
    f.close()
        '''


def printVersion( args ):
    print( ver )
    addArgHandle_oFile( args, ver)
    return 1

def packitsoQuery( args ):
    pis = otdmPackitso()
    global otdl
    r = pis.query( args, otdl, conf )
    if r == 1:
        return pis.packitso( args, conf )
    elif r == 2:
        return 1








def serviceIt( args ):
    global conf
    otdmServiceIt( args, conf )

def cliSapi( args ):
    stsRes = otdmSTS(
        otGet_sapisDef(),
        args.get("cliSapi", ""),
        { 'sts': False, 'sapis': False }
    )
    addArgHandle_oFile( args, stsRes )
    #print(f"cli Sapi .... \n result ----- \n {stsRes}\n-----\nExit 1")
    return 1


acts = [
    [ "v", "printVersion", f"Prints version of oiyshTerminal - tools. now is ver: {ver}" ],
    [ "packitso", "packitsoQuery", "To make automatic sets of works bast on driver proto. README.otdm-tools-packitso.md"],
    [ "debug", "setDebug", "debuging enable disable by 1 or 0" ],
    [ "cliSapi", "cliSapi", "to make sapi use from cli **Example** `otdmTools.py -cliSapi 'ver/.json' ;` - to get json"],
    [ "serviceIt",  "serviceIt", "To start it as a services more info TODO" ],
    [ "testSubProcAndProm",   "testSubProcAndProm", "test subprocess with args"],
    [ "testDialog", "testDialog", "Test of dialog function."],
    [ "forceHost", "", "owerrits host ip address" ],
    [ "exitToReturn", "", "Overrits exit to return. Usefull in tasker!" ],
    [ "addNote", "addNote", '''It use .otdm/cliper.json''' ],
    [ "lastNote", "lastNote", "[n] Returns last notes. n = 1 by def."],
    [ "tasks", "execTasksFrom", "[pathTo.otdm_file] Run tasks list from array list of tasks."],
    [ "mkInjFil", "mkInjectionFile",
        '''It convert reagular export json files to injection ready.
        [grafana-ds|node-flow] - possible arguments for now.
        -if [inFile] - path to input file with json
        -of [outFile] - path to output file with injection ready json
        -injToJ "{}" - inject/overrites keys and vals to main export file.'''],
    [ "extract", "extractDataFrom",
        '''[gdsInjRes] Set what to decode then different aproche will be taken to the file source.
        -if [pathto.json] - path to file to work with.'''],
    [ "mkbp", "mkBackUp",
        '''Make backups. Have some options.
        what to backup?
            [gds|gdsuid|gdsid|gdsname|gdhs|gdhuid|gdhid|gdhname|fpath]
            g - for grafana
            or
            fpath - to make file / directory backup / compression to .otdm/Backups
              use it as: `otdmTools.py -mkbp fpath -by ./abc` to backup abc directory
            or
            [flows|fid|fname]
            for Node-red
            [*] to make all and seperate.
        -by - if not (s) then value of what to backup
        -bSuffix - can use it or not. Will add bSuffic content to end of file
            in backup proces
            '''],
    [ "rm", "rmIn",
        '''Will remove something.. depends on arguments.
        -rm - remowe in what? [node-red|grafana]
        -rmW - remowe what?
            if node-red [flow]
            if grafana [ds,dash]
        -by - it's in:
            if node-red by id of a flow
            if grafana uid
        -'''],
    [ "export", "exportFromTo",
        '''Export data from [grafana|node-red]
    args need to set!
        -file "path" - to storage. If set to "--" will print.
        -expW "ds" - export what?
            if export is to grafana select:[ds|dsByName|hsByUid|dashs|dashByName|dashByUid]
            if export is to node-red select:[flow|flows]''' ],
    [ "import", "importFromTo",
        '''import data from file to [grafana|node-red]
        args need to set!
        -iFile - file path to json to work with
        -iStr - string / json input to work with this or -iFile
        -impW - import what?
            if importing is to grafana select:[ds|dashs]
            if importing is to node-red select:[flow]''' ],
    [ "dpkg", "doDkpg",
        '''"`env`" - from the process.
        Argument use in dpkg operations. Needed for automation process of
        preinst | postist | prerm | postrm and with arguments it's handle
        actions.
        -w [gdsByName] - Where argument sets where to do actions and with the
            sets of arguments from dpkg it will know what to do.
        -by [xxx] - is for what is the action about.
        - ''' ],
    [ "doQueryYN", "mkDialogWithExit",
        '''Can by used otdmTools.py -doQueryYN "Ala ma kota" -d y
        So defoult selected Y Normally N is default''' ],
    [ "testCurl", "tCurl",
        "test curl get to grafana and node-red." ],
    [ "testEcho2", 'testEcho2def',
        "test. it's a test function to echo from acts arry." ],
    [ "testAll", "testAll",
        "Run all test defined in test section." ],
    [ "osType", "osType",
        "Check system on what is running." ],

]



def exeArray( args ):
    l=len(args)

    print(f"exeArray starting tastk. In total: {l}")
    for i,a in enumerate(args):
        if deb:
            print(f"\n/--exeIt   {a}------------------ [ {(i+1)} / {l} ]")
        else:
            print(f"[ {(i+1)} / {l} ] O O o o . .")
        rAP=exeIt(a)
        if deb:
            print("\nrelust: [%s]"%rAP)
            print(f"\n\--exeIt   {a}------------------ [ {(i+1)} / {l} ]")
        if rAP != 1:
            ErrDo( args, "ERROR - in otdm if not 1 not good")
    return 1

def exeIt( args ):
    if deb: print( "exeIt args:[{0}]".format(args) )

    global conf
    global clip
    global otdl
    global acts
    conf=confLoad()
    chkClipBoard()
    # injecting drivers to acts list
    otdl = otdmDriverManager( args, conf )
    acts=otdl.injectDrivers( acts )
    #print("For now ....")
    #sys.exit(1)



    #list of actions from array acts
    if deb:print( "run acts args actions..." )
    for a in acts:
        if isinstance( a, dict) and a.get("type","") == "driver":
            if deb: print(f"try it [{a['name']}]")
            o=a.get("o")
            r=o.chkArgs( args )

            #if r == False:
            #    return False
            if r != 0:
                print(f"o is named? {o.getName()} key -{o.keyWord} got r[{r}]")
                return r

        elif args.get( a[0] ) != None:
            if deb:print("------>")
            if a[1] == "":
                print( "[{0}] virtual empty argument! acts array element function is empty.".format(a[0]) )
            else:
                r=globals()[ a[1] ]( args )
                if deb:print("[deb] acts {0} return {1}".format(a[0],r))
                if r == 1:
                    return 1

    #print("ooooooooooooooooooo")
    #sys.exit(1)
    if args.get('exeIt') == 'return0':
        return 0

    elif args.get('testConfLoad') != None:
        c=confLoad()
        print("----\n{0}\n----".format(c))
        return 1

    elif args.get('testExit') != None:
        ErrDo( args, "testExit....", codeNo=int( args.get('testExit') ) )

    elif args.get('testEcho') != None :
        print( "testEcho :)\n-----{0}-----".format( args.get('testEcho') ) )
        return 1

    else:
        return 0

    return 1


def printHelp():
    print( '''Help.
    You can run it:

    Usage: otdmTools.py -testCurl 1
    Will run test of config files, connection to grafana, node-red.
    Can run like all commands with -debug 1 to debug.

    Table:
    src     what    dir dest    status
    g       ds      i   file    *
    nr      flows   i   file    *
    g       ds      i   strInp  TODO
    g       ds          rm      *

    Usege: otdmTools.py -import grafana -impW ds -iFile /tmp/dsMysql-ot.json -file ./log1.log
    Import to grafana datasource from file "/tmp/dsMysql-ot.json" and
    result of a operation will be in ./log1.log. U can use "--" as a output
    to get it as a strout.

    Usage: otdmTools.py -debug 1 -rm "grafana" -rmW "ds" -by "EtRiTNkgk"
    Delete datasource with uid "EtRiTNkgk" from grafana / datasources.
    Return 0 if all correct. 1 if error.




args:
-testExit 11 - exit app with code 11
-return0 1 - test. exeIt returns 0 it imitate that it not detect argument
-testConfLoad 1 - test. loads config file or test loadconfig function
-testEcho "abc" - test. echos as print "abc"

args from args array:''' )
    for a in acts:
        if isinstance( a, dict) and a.get("type","") == "driver":
            a.get("o").getHelp()
        else:
            print( "-{0} - {1}".format( a[0], a[2] ) )




if __name__ == "__main__":

    args=sys.argv
    #print( args )
    args=argsParser( args )
    print("args after parser:{0}".format(args))

    '''
    print("--- importinf driverFifo")
    from otdmPG_driverFifo import *
    d = otdmPG_driverFifo('','')
    d.startIt()
    sys.exit()
    print("exit 19")
    '''



    print( f". . o o O O  oiyshTerminal - tools  O O o o . .ver {ver}\n" )

    conf=confLoad()
    if 0:
        dfs = otdmDriverFileSystem( args, conf )
        dnr = otdmDriverNodeRedFlowById( args, conf )
        dgdbByUid = otdmDriverGrafanaDashboardByUid( args, conf )
        dgdsByUid = otdmDriverGrafanaDatasourceByUid( args, conf )
        dgdbByUid = otdmDriverGrafanaDashboardByUid( args, conf )
        dgdsByUid = otdmDriverGrafanaDatasourceByUid( args, conf )

        tt = [
        [dfs, "/a.txt"],
        [dfs, "/a.json"],
        [dfs, "/data/data/com.termux/files/home/.otdm/config.json"],
        [dfs, "/fromOtdmTools.test1"],
        [dfs, "/rr"],
        [dnr, "7786178988d3d725"],
        [dgdbByUid, "Ks_fQ-kRz"],
        [dgdsByUid, "2aB7Dha7k"],
        [dgdbByUid, "Ks_fQ-kRz.."],
        [dgdsByUid, "2aB7Dha7k..."]
        ]

        for i,pr in enumerate(tt):
            d=pr[0]
            print(f"--------{d.getName()}---{d}----------")
            print("----- help")
            d.getHelp()
            ch=d.chkHost()
            print(f"----- {d.getName()}chkHost: [{ch}]" )
            print(f"----- GET({pr[1]})")
            r=d.GET(pr[1])
            print(f"---- ren:\n[{str(r)[:70]}]")
            print("----- PrintNice")
            d.printNice(r)

            if i == 3:
                print(f"----- POST({pr[1]})")
                d.POST( pr[1], "from post.\n" )
                print(f"----- GET({pr[1]}) -> {d.GET(pr[1])}")
                print(f"----- ADD({pr[1]})")
                d.ADD( pr[1], "from add..\n")
                print(f"----- GET({pr[1]}) -> {d.GET(pr[1])}")
                d.DELETE(pr[1])
                print(f"----- GET({pr[1]}) -> {d.GET(pr[1])}")


            print(f"--------{d.getName()}-------------")

            if i >= 4:
                sys.exit(1)

        sys.exit(1)



    if deb:print( "execR go GO go go....." )
    execR=exeIt(args)
    if execR and ( len(args.keys()) > 0 ):
        if deb:print( "execR DONE")
    else:
        if deb:print( "execR not used. no correct args!")
        printHelp()

    #clipIt("end",f"ver: {ver} end work correctly.")
    print( f"\n. . o o O O  oiyshTerminal - tools  O O o o . . END ver {ver}" )
