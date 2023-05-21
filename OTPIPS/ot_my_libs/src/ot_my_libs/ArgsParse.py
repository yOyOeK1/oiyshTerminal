#!/usr/bin/env python3

from ot_my_libs.myLoger import myLoger as mlog
import ot_my_libs.myLoger as mlogD

import sys


lg = mlog( 'ArgsParse', silenc={
    'info': False,
    'debug': False,
    'error': True,
    'critical': True
    },defColor=mlogD.myLogColors.Yellow )

def ArgsParse( argv ):
    global lg
    
    lg.info(f"invoke ... argv:[{argv}]")
    
    tr = {}
    vS = 0
    lastArg = ""

    aName=""
    for i,a in enumerate( argv ):
        if i > 0:
            lg.debug("arg nr {0} arg({1})".format(i,a))
            if vS == 1:
                if aName != "":
                    tr[aName] = a
                    aName = ""
                    vS = 0
                else:
                    lg.error(f"Error empty value in arg:[{lastArg}]")
            elif a[0] == "-":
                vS = 1
                aName = a[1:]
                lastArg = aName

    return tr
    
if __name__ == "__main__":
    lg.info("This is a main of ArgsParse ... ")

    lg.info("* test 1 - as invoke from code use")
    a = ArgsParse(["","-h","1"])
    lg.info("res")
    lg.debug(a)
    lg.info(["res for h",a.get('h','')])

    lg.info("* test 2 - as regular use add some argument on start 'cat look for help'")
    a = ArgsParse( sys.argv )       
    lg.info("res")
    lg.debug(a)
    lg.info(["have help?", True if a.get('help', -1) != -1 else False])

