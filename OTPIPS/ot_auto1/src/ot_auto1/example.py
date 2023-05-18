'''
Is only a test of auto builder system and its a doc auto for example sub library
'''


"""only version name of example file"""
mverEx = "0.0.1"

otName="ot_auto1"

'''to do basic test from example sub lib'''
def ot_auto1():
    print("(from exa) oiyshTerminal - at pip, [ot_auto1 . ot_auto1] in version:%s"%mverEx)

# to run set from example as
def test():
    print("-- starting test ----")
    ot_auto1()
    print("-- end test ----")
