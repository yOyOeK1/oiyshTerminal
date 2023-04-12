import time


from otdm_serviceIt_mqtt import *
from otdm_serviceIt_http import otdm_serviceIt_http
from otdm_serviceIt_ws import *
from otdm_serviceIt_xmlrpc import *
from otdmApiBasics import *
import otdmUtils as otU


def otdmServiceIt( args, conf ):

    print(f"serviceIt .... precheck")

    sItList = [
        otdm_serviceIt_mqtt,
        otdm_serviceIt_http,
        otdm_serviceIt_ws,
        otdm_serviceIt_xmlrpc
    ]

    if args.get("serviceIt","") == "":
        print("Error -serviceIt can be [mqtt] pass as string separator by coma")
        sys.exit(1)

    if args.get("serviceIt","") in ["h","?"]:
        sListNames = ("%s"%str( sItList )[1:-1])
        sListNames = sListNames.replace(">, <",'><')
        sListNames = sListNames.replace("<class 'otdm_serviceIt_",'    * `')
        #sListNames = sListNames.replace('.otdm_serviceIt_','`\t- arg can by use to start ... \n')
        sListNames = sListNames.replace('\'>','\n')

        sListSapis = []
        for s in otGet_sapisDef():
            sListSapis.append( "    * `{name}` ({aCount})x`/` - {help}".format(
                name=s[0], aCount=s[1], help=s[3]
            ) )
        sListSapis = "\n".join(sListSapis)

        print(f'''
## help it's

### serviceIt to start as demons in foreground are

  By starting `-serviceIt [args,..]` you can statart ...
{sListNames}
  With all the services there is a way to use otdmSTS system by senging in
  `http` url you can build task for otdmTools look in README.md

### list of `SAPIS` it otdmSTS

  This is a list of `sapis` it's like function / task / set / formater / parser / extractor / result
  use in String To Sentence system. Current options:
{sListSapis}
        ''')
        sys.exit(1)

    sisOk = True
    sdebIters = False
    sIter = 0

    sapis = otGet_sapisDef()



    for i,s in enumerate( sItList ):
        print(f"    serviceIt ... {s.name} ... ",end="")
        if s.name in args.get("serviceIt"):
            print('YES')
            s = s( sapis, args, conf)
            s.makeItWorking = True
            s.runIt( conf )
            sItList[ i ] = s
        else:
            print('NO')


    if 0 :
        print("----------------------exit 11")
        sys.exit(11)


        print(" - mqtt .... ",end="")
        if 'mqtt' in args.get("serviceIt"):
            print('YES')
            doMqtt = True
            s_mq = otdm_serviceIt_mqtt( otGet_sapisDef(), args, conf)
            s_mq.runIt( conf )
        else:
            print('NO')
            doMqtt = False

        if 'http' in args.get("serviceIt"):
            print(" - http .... ",end="")
            print('YES')
            doHttp = True
            s_ht = otdm_serviceIt_http( otGet_sapisDef(), args, conf )
            s_ht.runIt( conf )
        else:
            print('NO')
            doHttp = False


    '''
    if doMqtt == True:
        print('{"s_mqtt": {"isOk":"'+(f"{s_mq.isOk}")+'", "counts": '+json.dumps(s_mq.count)+'}, "entryDate":"'+tn+'"}')
        s_mq.publish( "status/ping", tn, True );

        if doHttp == True:
            print('{"s_http": {"isOk":"'+(f"{s_ht.isOk}")+'", "counts": '+json.dumps(s_ht.count)+'}, "entryDate":"'+tn+'"}')
            '''

    tStart = otU.tn_unix()
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
                print( json.dumps( tps ) )


        print( json.dumps({"sIt": {
            "isOk":True,
            "entryDate": tn,
            "counts": { "sIter":sIter, "tStart": tStart }
        }}))
        sIter+=1
        time.sleep(5)

    return 1
