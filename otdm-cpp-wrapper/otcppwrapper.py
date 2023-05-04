from typing import Any, Callable
import inspect
import os
import sys
from ctypes import *

import subprocess


otDynoObj = {
'empty': -1
}

def otcpp(func: Callable[..., Any]) -> Callable[..., Any]:
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        otInDyno = otDynoWith( func.__name__ )
        if otInDyno != -1:
            return otInDyno( *args, ** kwargs )
        codeF = inspect.getsource( func )
        cRaw = codeF.split('\'\'\'')
        if len(cRaw) == 3:
            pass #print("len is OK so use it ...")
        else:
            print("Error 11- otcpp wrong data in wrapt definicion ")
            sys.exit(11)

        cmySum = otStrToRawC( func.__name__, cRaw[1])
        value = cmySum(*args, **kwargs)
        return value

    return wrapper



def otDynoWith( defName ):
    global otDynoObj
    return otDynoObj.get( defName, -1)

def otFName( defName ):
    return f"./_s2rc_{defName}"

def otSoImport( defName ):
    global otDynoObj
    print(f"import .... [{defName}] from .so")
    mSo = f"{otFName( defName )}.so"
    otDynoObj[ defName ] = CDLL( mSo )[ defName ]
    return otDynoObj[ defName ]


def otStrToRawC( defName, strDef ):
    global otDynoObj
    otdo = otDynoWith( defName )
    fName = otFName( defName )

    if otdo != -1:
        print('from casche ...')
        return otdo
    elif os.path.exists( f"{fName}.so" ):
        return otSoImport( defName )

    print( f"string to raw c .... def [{defName}] to file {fName}")

    print("set source ....")
    f = open( f"{fName}.c", 'w')
    f.write(f"// auto generated //\n#include <stdio.h>\n")
    f.write( strDef )
    f.write( "\n" )
    f.close()

    print("compile ....")
    ctc = f"gcc -fPIC -shared -o {fName}.so {fName}.c >> ./gcc.logs"
    subprocess.run( ctc, shell = True )
    return otSoImport( defName )
