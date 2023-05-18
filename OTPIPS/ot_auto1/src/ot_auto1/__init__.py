'''
Is only a test of auto builder system and its a doc auto for main library

## use it as 

"""python
from ot_auto1 import ot_auto1 
ot_auto1()

from ot_auto1.example import *
ot_auto1()
"""
'''

"""only version name of __init__ file"""
mver = "0.0.1"

'''to do basic test from example main lib'''
def ot_auto1():
    print("(from init) oiyshTerminal - at pip, [__init__ . ot_auto1] in version:%s"%mver)
