#!/usr/bin/env python3

import json



def getOnly( data, keyName, value ):
    tr = []
    for e in data:
        if e[keyName] == value:
            tr.append(e)
    return tr



if __name__ == "__main__":
    print("Node-red - flow worker")

    with open('nr_getActiveFlowConfig.log_2212192129_nice.json', 'r') as f:
        jd = f.read()

    data = json.loads(jd)

    if 1:
        #test of get Only tab
        print("- test getOnly looking for tab")
        r=getOnly(data, "type", "tab")
        print("got: %s element"%len(r))
        print("tabs list:")
        for t in r:
            print(t['label'] )
            #print( t )


    print("-- buy !!!--")
