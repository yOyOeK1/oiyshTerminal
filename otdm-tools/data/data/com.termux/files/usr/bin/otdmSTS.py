import subprocess
import os
import json
import urllib.parse

def otdmGetApi( sapis, apiName ):
    for a in sapis:
        if a[0] == apiName:
            return a

    return []

#to convert path to task list ....
def otdmSTS( sapis, path, debugConfig ):
    workStack = []
    a=path.split('/')
    #print(f"so a is: {a}")
    i=0
    aLen=len(a)
    isOk = True
    stsDeb = debugConfig['sts']
    sapisDeb = debugConfig['sapis']


    #print("so debug is - at STS")
    #print(debugConfig)


    while i < aLen:
        argument = a[i]
        if stsDeb == True: print(f"looking for :   {argument}")
        api = otdmGetApi( sapis, argument )
        if api == []:
            print(" is no api arg Error")
            isOk = False
        else:
            #print(f" api hangler: {api[0]} argument need {api[1]}..")
            #print(f" so i:{i} and api args: {api[1]}")
            argsPass = a[ i+1 : 1+i+api[1] ]
            for aNo,ap in enumerate( argsPass ):
                argsPass[ aNo ] = urllib.parse.unquote( ap )

            apiO = api[2]
            workStack.append( {
                "apiName": argument,
                "api": apiO,
                "args": argsPass} )
            if stsDeb == True: print( f"   will pass argument: {argsPass}" );
            i+=api[1]

        i+=1

    if isOk == False:
        print("Error in process of parsing path task what now ???")

    tr = [0,'']
    for i,task in enumerate(workStack):
        if stsDeb == True:
            print("------tr")
            print(tr)
            print( type(tr) )
        tr = task['api']( tr, task['args']  )

    return tr
