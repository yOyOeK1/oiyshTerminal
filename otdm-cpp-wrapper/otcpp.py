import os
import sys

import ctypes

from otBen import *
from otcppwrapper import *

import numpy as np



def PyDiv( a: int = 0, b: int = 1 ) -> int:
    return int( a / b)

@otcpp
def MyDiv( a: int = 0, b: int = 1 ) -> int:
    '''
    int MyDiv( int a, int b ){
        return a/b;
    }
    '''



def PyDiv2( a: int = 0, b: int = 1 ) -> int:
    c=0
    for i in range(1,10000,1):
        for ii in range(1,1000,1):
            c=a/b
    return int( c )

@otcpp
def MyDiv2( a: int = 0, b: int = 1 ) -> int:
    '''
    int MyDiv2( int a, int b ){
        int tr = 0;
        for(int i=1;i<10000;i++){
            for(int ii=1;ii<1000;ii++){
                tr = a/b;
            }
        }
        return tr;
    }
    '''

def PySumArray( a , aSize):
    tr = 0
    for i in range(0,aSize,1):
        tr+= a[i]
    return tr

@otcpp
def MySumArray( a, aSize ):
    '''
    int MySumArray( int *a, int aSize){
    	int tr = 0;
    	for( int i=0;i<aSize; i++){
    		//printf("%i",a[i]);
    		tr+= a[i];
    	}

    	return(tr);
    }
    '''






if __name__ == "__main__":
    print("In main --------------")


    print("invoce wrapper and funct ....")
    mD = MyDiv( 10, 5 )
    print(f"res: {mD} {PyDiv(10,5)}")

    print(f"res2: {MyDiv(20,5)}  {PyDiv(20,5)}")

    otB = otBen()

    doIt=2

    print("do MyDiv ....")
    cB = otB.benStart()
    for i in range(1, doIt, 1):
        for b in range(1, 5000000, 1):
            MyDiv( i, b )
    otB.benDone( cB, "This is wrapt to C ....", printIt=True )

    print("do MyDiv direct hangle ....")
    cB = otB.benStart()
    f = otDynoWith( 'MyDiv' )
    for i in range(1, doIt, 1):
        for b in range(1, 5000000, 1):
            f( i, b )
    otB.benDone( cB, "This is wrapt to C  direct handle....", printIt=True )

    print("do PyDiv ....")
    pB = otB.benStart()
    for i in range(1, doIt, 1):
        for b in range(1, 5000000, 1):
            PyDiv( i, b )
    otB.benDone( pB, "This is python ....", printIt=True )

    print("------------------DONE 1")

    print("do MyDiv2 ....")
    cB = otB.benStart()
    for i in range(1, doIt, 1):
        for b in range(1, 10, 1):
            MyDiv2( i, b )
    otB.benDone( cB, "This is wrapt to C ....", printIt=True )

    print("do MyDiv2 direct hangle ....")
    cB = otB.benStart()
    f = otDynoWith( 'MyDiv2' )
    for i in range(1, doIt, 1):
        for b in range(1, 10, 1):
            f( i, b )
    otB.benDone( cB, "This is wrapt to C  direct handle....", printIt=True )

    print("do PyDiv2 ....")
    pB = otB.benStart()
    for i in range(1, doIt, 1):
        for b in range(1, 10, 1):
            PyDiv2( i, b )
    otB.benDone( pB, "This is python ....", printIt=True )

    print("------------------- DONE2 ")


    ar = np.zeros(100000, dtype=np.int32)
    for i in range(100000):
        ar[i] = float(random.randint(-100,100))
    arcType = ar.ctypes.data_as( ctypes.POINTER(ctypes.c_uint32) )

    print("do MySumArray ....")
    cB = otB.benStart()
    for i in range(1, doIt, 1):
        for b in range(1, 100, 1):
            MySumArray( arcType, len(ar) )
    otB.benDone( cB, "This is wrapt to C ....", printIt=True )

    print("do PySumArray ....")
    pB = otB.benStart()
    for i in range(1, doIt, 1):
        for b in range(1, 100, 1):
            PySumArray( ar, len(ar) )
    otB.benDone( pB, "This is python ....", printIt=True )

    print("------------------- DONE2 ")




    if 0 :
        cmySum = otStrToRawC( 'mySum', '''

    int mySum(int a, int b){
        return(a*b);
    }

        ''' )

        print("In main testing it ...")
        print( cmySum( 1, 2) )

        print("In main testing it2 ...")
        print( cmySum( 1, 3) )

        print("In main testing it3 ...")
        print( cmySum( 2, 3) )

    if 0 :
        print("In main call tSum...")
        print( tSum(1,2) )

        print("In main call inspect for tvSum ....")
        print( inspect.getsource(tvSum) )
        print("In main call tvSum1...")
        print( tvSum(1,2) )
        print("In main call tvSum2...")
        print( tvSum(1) )
        print("In main call tvSum3...")
        print( tvSum(1.01,0.99) )

        print("----------------Main DONE")
