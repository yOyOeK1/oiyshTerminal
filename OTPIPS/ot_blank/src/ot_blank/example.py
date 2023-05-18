'''
Is only a ot_blank of auto builder system and its a doc auto for example sub library
'''


"""only version name of example file"""
mverEx = "0.0.2"


otName="ot_blank"


'''to do basic test from example sub lib'''
def ot_blank():
    print("(from exa) oiyshTerminal - at pip, [ot_blank] in version:%s"%mverEx)
    print("(from exa) from ...")
    try:
        from ot_blank import ot_blank
        print("(from exa) execute it ...")
        ot_blank()
    except err:
        print(f"Error {err}")
    print("(from exa) ... DONE")


# to run set from example as
def test():
    print("-- starting test ----")
    ot_blank()
    print("-- end test ----")
