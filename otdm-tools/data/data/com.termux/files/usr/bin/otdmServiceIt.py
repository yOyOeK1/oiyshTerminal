import time


from otdm_serviceIt_mqtt import *
from otdm_serviceIt_http import otdm_serviceIt_http
from otdm_serviceIt_ws import *
from otdm_serviceIt_xmlrpc import *
from otdmApiBasics import *
import otdmUtils as otU


def otdmServiceItGetServicesItList():
    return [
        otdm_serviceIt_mqtt,
        otdm_serviceIt_http,
        otdm_serviceIt_ws,
        otdm_serviceIt_xmlrpc
    ]




def otdmServiceIt( args, conf ):

    tStart = otU.tn_unix()
    print(f"serviceIt .... starting %s"%tStart)
    debugConfig = {
        "serviceIt": False,
        "sts":False,
        "sapis":False
    }

    if args.get("sitDebug","") != "":
        debugConfig['serviceIt'] = True

    if args.get("stsDebug","") != "":
        debugConfig['sts'] = True

    if args.get("sapisDebug","") != "":
        debugConfig['sapis'] = True

    sItList = otdmServiceItGetServicesItList()
    sapis = otGet_sapisDef()

    sDebug = debugConfig['serviceIt']
    print("so debug is - at ServiceIT")
    print(debugConfig)


    if args.get("serviceIt","") == "":
        if sDebug: print("Error -serviceIt can be [mqtt] pass as string separator by coma")
        sys.exit(1)

    if args.get("serviceIt","") in ["h","?"]:
        print( otdmSITHelp( sItList ) )
        sys.exit(1)

    sisOk = True
    sdebIters = False
    sIter = 0



    for i,s in enumerate( sItList ):
        print(f"    serviceIt ... {s.name} ... ",end="")
        if s.name in args.get("serviceIt"):
            print('YES')
            s = s( sapis, args, conf, debugConfig)
            s.makeItWorking = True
            s.runIt( conf )
            sItList[ i ] = s
        else:
            print('NO')



    print("serviceIt enter main loop ....")
    while sisOk == True:
        tn = otU.tn_unix()
        if sdebIters:  print(f"services are running ... OK ({sIter})")

        for s in sItList:
            if s.makeItWorking:
                s.doPing( tn )
                tps = {}
                tps[ s.name ] = {
                    "isOk": s.isOk,
                    "entryDate": tn,
                    "counts": s.count
                }
                if sDebug: print( json.dumps( tps ) )


        if sDebug: print( json.dumps({"sIt": {
            "isOk":True,
            "entryDate": tn,
            "counts": { "sIter":sIter, "tStart": tStart }
        }}))
        sIter+=1
        time.sleep(5)

    return 1



def otdmSITHelp( sItList ):
    sListNames = (" %s"%str( sItList )[1:-1])
    sListNames = sListNames.replace(">, <",'> <')
    sListNames = sListNames.replace("<class 'otdm_serviceIt_",' - `')
    sListNames = sListNames.replace('.otdm_serviceIt_','`- arg can by use to start ...')
    sListNames = sListNames.replace('\'>','\n')

    sListSapis = []
    for s in otGet_sapisDef():
        sListSapis.append( "  - `{name}` ({aCount})x`/` - {help}".format(
            name=s[0], aCount=s[1], help=s[3]
        ) )
    sListSapis = "\n".join(sListSapis)

    return (f'''
## help it's

### serviceIts to start as demons in foreground

  By using `-serviceIt [args,..]` you can use ...
{sListNames}
With all the services there is a way to use otdmSTS system by senging in
`http` url you can build task for otdmTools look in README.md

### extra args on start
  - `sitDebug` 1 - then debug a lot
  - `stsDebug` 1 - debug sts sequencer
  - `sapisDebug` 1 - debug sapis

### list of `SAPIS` it otdmSTS

This is a list of `sapis` it's like function / task / set / formater / parser / extractor / result
use in String To Sentence system. Current options:
{sListSapis}
''')
