import subprocess
import os
import json

def otApi1( fromPipe, args ):
    return 0,f"- otApi1     got a: {args[0]} b: {args[1]}\n"

def otBpi2( fromPipe, args ):
    return 0, f"- otBpi     got a: {args[0]}\n"

def otASum( fromPipe, args ):
    return 0, int(args[0])+int(args[1])

def otADiv( fromPipe, args ):
    return 0, int(args[0])/int(args[1])

def otADivPipe( fromPipe, args ):
    return 0, int(fromPipe)/int(args[0])


def otAtoHtml( fromPipe, args ):
    return f"<html><body>{fromPipe}</body></html>"

def otAtoJson( fromPipe, args ):
    return {
        "code": 200, "status":"success",
        "msg": fromPipe
        }
def otAtoRaw( fromPipe, args ):
    return fromPipe



def otAotdmTools(fromPipe, args):
    print("---------------------------------")
    print("otAotdmTools ...")
    tr = "ok"
    pH='43242'
    q={
        "cmd": args[0],
        'resAs': "json"
    }
    print(q)
    print("---------------------------------")
    if q.get("cmd","") != "":
        print("Have cmd: %s ...."%q['cmd'])

        pH=f"_234567890"#{self.r.random()}_{self.r.random()}"
        oFileP = f"/tmp/otSTS_{pH}.res"
        print("Do it ..."+oFileP)
        subprocess.run(
            '/home/yoyo/Apps/oiyshTerminal/otdm-tools/data/data/com.termux/files/usr/bin/otdmTools.py '+
                q.get('cmd')+" -oFile "+oFileP,
            shell=True
            )
        print(" DONE")
        trp = ""
        if os.path.exists( oFileP ) == True:
            with open(oFileP, 'r') as file:
                trp = file.read().rstrip()

            print(f"S: Result for {pH}")
            if q.get("resAs","json") == "json":
                return 0,json.loads(trp)
            else:
                return 0,trp



    return 0,tr



def otdmGetApi( apiName ):
    apis = [
        ['apiSum',    2, otASum],
        ['apiDivPipe',    1, otADivPipe],
        ['apiDiv',    2, otADiv],
        ['api1',    2, otApi1],
        ['bpi1',    1, otBpi2],

        ['ot', 1 , otAotdmTools],

        ['json',    0, otAtoJson],
        ['raw',    0, otAtoRaw],
        ['html',    0, otAtoHtml]
    ]
    for a in apis:
        if a[0] == apiName:
            return a

    return []

def otdmStrToStack( strI ):

    tr = []

    a=s0.split('/')
    #print(f"so a is: {a}")
    skip = 0;
    i=0
    aLen=len(a)
    isOk = True
    while i < aLen:
        argument = a[i]
        #print(f"looking for :   {argument}")
        api = otdmGetApi( argument )
        if api == []:
            print(" is no api arg Error")
            isOk = False
        else:
            #print(f" api hangler: {api[0]} argument need {api[1]}..")
            #print(f" so i:{i} and api args: {api[1]}")
            argsPass = a[ i+1 : 1+i+api[1] ]
            apiO = api[2]
            tr.append( {
                "apiName": argument,
                "api": apiO,
                "args": argsPass} )
            #print( f"   will pass argument: {argsPass}" );
            i+=api[1]

        i+=1

    if isOk == False:
        print("Error in process of parsing path task what now ???")


    return tr


def dAdr( s0 ):
    print("Start------------------------------------------")
    print(s0)
    apiStack = otdmStrToStack( s0 )
    #print( apiStack  )
    #print('--------------------')
    tr = [0,'']
    for i,t in enumerate(apiStack):
        #print(f"exic task ({i})  as {t['apiName']}")
        tr = t['api']( tr[1], t['args']  )

    print('End result-------------------------')
    print( tr )



if __name__ == "__main__":
    s0='api1/a0/a1/bpi1/b0/json'
    dAdr(s0)
    s0='apiSum/1/11'
    dAdr(s0)
    s0='apiDiv/12/2'
    dAdr(s0)
    s0='apiDiv/12/2/json'
    dAdr(s0)

    s0='apiSum/1/11/apiDivPipe/6'
    dAdr(s0)

    s0='apiSum/1/11/apiDivPipe/6/json'
    dAdr(s0)

    s0='apiSum/1/11/apiDivPipe/6/html'
    dAdr(s0)

    s0='apiSum/1/11/apiDivPipe/6/raw'
    dAdr(s0)

    s0='apiSum/1/11/apiDivPipe/6'
    dAdr(s0)

    s0='ot/-osType 1'
    dAdr(s0)

    s0='ot/-osType 1/json'
    dAdr(s0)

    s0='ot/-osType 1/html'
    dAdr(s0)
