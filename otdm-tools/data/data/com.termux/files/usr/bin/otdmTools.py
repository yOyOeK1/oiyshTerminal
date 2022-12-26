#!/usr/bin/env python3

import sys
import json
import requests

ver="0.10"
confFilePath="/data/data/com.termux/files/home/.otdm/config.json"
deb=0

changelog='''
0.10 - first release of python version.
    path "grafana" "ds" by "uid" add and del works.
    So it can do for otdm-nrfj-TestMqttMysl aaajj.
'''


conf={}

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
    print("configuration file loading from [%s]..."%confFilePath)
    return loadFileToJson( confFilePath )

def testEcho2def( args ):
    print("echo from testEcho2def!")
    print( "----\n{0}\n----".format( args.get('testEcho2') ) )
    if args.get('testEcho2') == 'exit1':
        print("exit1 from testEcho2 !!")
        sys.exit(1)
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
        print("Error - curlIt methodee not implemented.")
        sys.exit(1)

    return ""

def curlJ( methodee, url, headerss=None, data=None ):
    r=curlIt( methodee, url, headerss, data )
    if deb: print("curlJ r len:%s"%len(r))
    try:
        j=json.loads(r)
        return j
    except:
        print("Error - curlJ r to json \n\ngot r[{0}]".format(r))
        sys.exit(1)

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
    #print( type(j) )
    for i,r in enumerate(j):
        #print( "    - %s"%type(r) )
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

    global conf
    conf=confLoad()

    gUrl = "{0}/datasources".format( graGetBaseUrl( args ) )
    nrUrl = "{0}/flows".format( nrGetBaseUrl( args ) )

    gRes = curlJ( "GET", gUrl )
    nrRes = curlJ( "GET", nrUrl )

    print( "grafana url: [%s]"%gUrl)
    ds=JGetByKey(gRes,"name")
    print( "    response length: %s elements in json"%len(gRes))
    print( "    datasources: {0}\n\t- {1}".format( len(ds),"\n\t- ".join(ds) ) )

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

    global conf
    print( "- config load   (confLoad)\n", end=" ")
    conf=confLoad()
    print("    OK")

    print( "- building urls for grafana and node red    (graGetBaseUrl())", end=" ")
    gUrl = "{0}/datasources".format( graGetBaseUrl( args ) )
    print(" OK" )
    print( "- building urls for grafana and node red    (nrGetBaseUrl())", end=" ")
    nrUrl = "{0}/flows".format( nrGetBaseUrl( args ) )
    print(" OK" )

    print( "- communication to grafana  ", end=" ")
    gRes = curlJ( "GET", gUrl )
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
    nrRes = curlJ( "GET", nrUrl )
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

def setDebug( args ):
    print( "setDebug action %s"%args )
    if args.get('debug') != None:
        global deb
        deb=int( args.get('debug') )


def importFromTo( args ):
    return exportFromTo( args )

def exportFromTo( args ):
    global conf
    exp=args.get('export')
    imp=args.get('import')
    fp=args.get('file')
    impW=args.get('impW')
    iFile=args.get('iFile')
    iStr=args.get('iStr')
    expW=args.get('expW')
    eBy=args.get('eBy')


    if imp and impW == None:
        print("Error! arg -impW  need to be set up!")
        sys.exit(1)

    if imp and ( iFile == None and iStr == None ):
        print("Error arg -iFile or -iStr need to be set up!")
        sys.exit(1)

    if fp == None:
        print("Error! arg -file need to be set up!")
        sys.exit(1)

    if imp == None and expW == None:
        print("Error! arg -expW need to be set up!")
        sys.exit(1)


    if exp == "grafana" and expW not in ["ds","dsByName", "dsByUid","dashs","dashByName","dashByUid"]:
        print( "Error - expW out of spec." )
        sys.exit(1)
    if exp == "node-red" and expW not in ["flow","flows"]:
        print( "Error - expW out of spec." )
        sys.exit(1)

    if exp == "grafana" and expW in ["dsByName","dsByUid","dashByName","dashByUid"] and eBy == None:
        print( "Error - expW is as [{0}] you need to set up -eBy argument. out of spec.".format("expW") )
        sys.exit(1)
    if exp == "node-red" and expW in ["flow"] and eBy == None:
        print( "Error - expW is as [{0}] you need to set up -eBy argument. out of spec.".format("expW") )
        sys.exit(1)

    if imp:
        if imp == "node-red":
            if impW not in ["flow"]:
                print( "Error - impW is as [{0}] out of spec!".format(impW) )
                sys.exit(1)
        elif imp == "grafana":
            if impW not in ["ds","dashs"]:
                print( "Error - impW is as [{0}] out of spec!".format(impW) )
                sys.exit(1)

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


    conf=confLoad()
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
        jr=curlJ( "POST", "%s/flow"%(nrUrl), impH, data=json.dumps(jFF) )

    elif imp == "grafana" and impW == "ds" and iFile != None:
        jr=curlJ( "POST", "%s/datasources"%(gUrl), impH, data=json.dumps(jFF) )


    elif exp == "grafana" and expW == "ds":
        jr=curlJ( "GET", "%s/datasources"%(gUrl) )

    elif exp == "grafana" and expW == "dsByName" and eBy != None:
        jr=curlJ( "GET", "%s/datasources/name/%s"%(gUrl,eBy) )

    elif exp == "grafana" and expW == "dsByUid" and eBy != None:
        jr=curlJ( "GET", "%s/datasources/uid/%s"%(gUrl,eBy) )


    elif exp == "node-red" and expW == "flows":
        jr = curlJ( "GET", "%s/flows"%(nrUrl)  )

    elif exp == "node-red" and expW == "flow" and eBy != None:
        jr=curlJ( "GET", "%s/flow/%s"%(nrUrl,eBy) )


    #elif imp == "grafana" and impW == "ds"

    else:
        print("Error - not implemented 4112")
        sys.exit(1)

    if deb:
        print("imp status [%s]"%imp)
        print( "imp: {0} str:{1} bool:{2}".format(imp,"grafana",imp=="grafana") )
    if exp == "grafana" or imp == "grafana":
        if deb: print("checking if it's json and correct one...")
        if jr == None:
            print("Error - no jr ? how?")
            sys.exit(1)

        if jr.get('traceID') == "00000000000000000000000000000000":
            print("Error - wrong response...\n\n%s\n"%jr)
            sys.exit(1)



        #print(jr)
        if type(jr) == "<class 'dict'>":
            if jr.get('traceID') == "00000000000000000000000000000000":
                print("Error - not expected!")
                print( jr )
                sys.exit(1)
        jtr=jr
        print("got it from")

    if exp == "node-red" or imp == "node-red":
        if jr == None:
            print("Error - no jr ? how? 52523")
            sys.exit(1)

        if jr.get('code') == "unexpected_error":
            print("Error - wrong response...\n\n%s\n"%jr)
            sys.exit(1)

        #print(jr)
        '''if type(jr) == "<class 'dict'>":
            if jr.get('traceID') == "00000000000000000000000000000000":
                print("Error - not expected!")
                print( jr )
                sys.exit(1)'''
        jtr=jr
        print("got it from")


    if jtr == None:
        print("Error - no json to store at the end of export section.")
        sys.exit(1)


    if exp or imp:
        if fp == "--":
            print(jtr)
        else:
            print( "write json to file...")
            f = open( fp, "a" )
            f.write(f"{jtr}")
            f.close()

    print(" DONE")
    return 1

def rmIn( args ):
    return acIn( args, "rm" )

def acIn( args, act="rm" ):
    global conf
    if deb: print( "acIn with act[%s]"%act )

    ac=args.get(act)
    acW=args.get("%sW"%act)
    acBy=args.get("by")

    if acW == None:
        print(f"Error! arg -{act}W  need to be set up!")
        sys.exit(1)

    if acBy == None:
        print(f"Error! arg -by  need to be set up!")
        sys.exit(1)

    conf=confLoad()
    gUrl = graGetBaseUrl( args )
    nrUrl = nrGetBaseUrl( args )
    jtr=None
    jr=None
    impH={
        "content-type": "application/json"
    }

    if act == "rm" and ac == "grafana" and acW=="ds":
        jr=curlJ( "DELETE", "%s/datasources/uid/%s"%(gUrl,acBy) )
        if jr.get("message") == "Data source deleted":
            print( "DELETED" )
            return 1
        elif jr.get("message") == "Data source not found":
            print( "Error grafana: %s"%jr.get("message") )
            sys.exit(1)
        else:
            print ( "Error - not implemented 66433")
            sys.exit(1)

    else:
        print(f"Error! not implemented yet...")
        sys.exit(1)






    print(" DONE")
    return 1

acts = [
    [
        "debug",
        "setDebug",
        "debuging enable disable by 1 or 0"
    ],
    [
        "forceHost",
        "",
        "owerrits host ip address"
    ],
    [
        "rm",
        "rmIn",
        '''Will remove something.. depends on arguments.
        -rm - remowe in what? [node-red|grafana]
        -rmW - remowe what?
            if node-red [flow]
            if grafana [ds,dash]
        -by - it's in:
            if node-red by id of a flow
            if grafana uid
        -'''
    ],
    [
        "export",
        "exportFromTo",
        '''Export data from [grafana|node-red]
    args need to set!
        -file "path" - to storage. If set to "--" will print.
        -expW "ds" - export what?
            if export is to grafana select:[ds|dsByName|hsByUid|dashs|dashByName|dashByUid]
            if export is to node-red select:[flow|flows]'''
    ],
    [
        "import",
        "importFromTo",
        '''iport data from file to [grafana|node-red]
    args need to set!
        -iFile - file path to json to work with
        -iStr - string / json input to work with this or -iFile
        -impW - import what?
            if importing is to grafana select:[ds|dashs]
            if importing is to node-red select:[flow]'''
    ],
    [
        "testCurl",
        "tCurl",
        "test curl get to grafana and node-red."
    ],
    [
        "testEcho2",
        'testEcho2def',
        "test. it's a test function to echo from acts arry."
    ],
    [
        "testAll",
        "testAll",
        "Run all test defined in test section."
    ],
]

def exeIt( args ):
    if deb: print( "exeIt args:[{0}]".format(args) )

    #list of actions from array acts
    if deb:print( "run acts args actions..." )
    for a in acts:
        if args.get( a[0] ) != None:
            if a[1] == "":
                print( "[{0}] virtual empty argument! acts array element function is empty.".format(a[0]) )
            else:
                r=globals()[ a[1] ]( args )
                if deb:print("acts {0} return {1}".format(a[0],r))
                if r == 1:
                    return 1

    if args.get('exeIt') == 'return0':
        return 0

    elif args.get('testConfLoad') != None:
        c=confLoad()
        print("----\n{0}\n----".format(c))
        return 1

    elif args.get('testExit') != None:
        print("testExit....")
        sys.exit( int( args.get('testExit') ) )
        #return 1

    elif args.get('testEcho') != None :
        print( "testEcho :)\n-----{0}-----".format( args.get('testEcho') ) )
        return 1

    else:
        return 0

    return 1


def printHelp():
    print( '''Help.
    You can run it:

    otdmTools.py 'JSONstr'
    Usage: otdmTools.py -testCurl 1

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

    Usage: otdmTools.py -r "/tmp/foo" -in "grafana" -act "preCheck"
    It will run if grafana is responding correcly with current configs.
    Rusult will be stored in "/tmp/foo"


args:
-testExit 11 - exit app with code 11
-return0 1 - test. exeIt returns 0 it imitate that it not detect argument
-testConfLoad 1 - test. loads config file or test loadconfig function
-testEcho "abc" - test. echos as print "abc"

args from args array:''' )
    for a in acts:
        print( "-{0} - {1}".format( a[0], a[2] ) )

if __name__ == "__main__":

    args=sys.argv
    #print( args )
    args=argsParser( args )
    #print("args after parser:{0}".format(args))

    print( "\n. . o o O O  oiyshTerminal - tools  O O o o . .\n" )

    if deb:print( "execR go GO go go....." )
    execR=exeIt(args)
    if execR and ( len(args.keys()) > 0 ):
        if deb:print( "execR DONE")
    else:
        if deb:print( "execR not used. no correct args!")
        printHelp()

    print( "\nEND . . o o O O  oiyshTerminal - tools  O O o o . . END" )
