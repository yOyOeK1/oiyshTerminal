#!/usr/bin/env python3
from ot_my_libs.myLoger import myLoger as mlog
from ot_my_libs.FileActions import *

import sys,os
import importlib as il

class PlugsHelper:

    args={}
    conf={}
    deb=False

    def __init__( self, args=None, conf=None ):
        self.log = mlog( "PlugsHelper",
            silenc={
                'info': True,
                'debug': False,
                'error': True,
                'critical': True
                })

        self.log.debug(f"PlugsHelper args:[{args}]")
        self.log.debug( sys.path )

        self.fa = FileActions()
        self.args=args
        self.conf=conf
        self.drivers=[]


    def ifNoArgExit( self, arg, msgOnErr ):
        if self.args.get( arg, "" ) == "":
            self.log.error(f"No argument [-{arg}] found in argument. {msgOnErr}")
            sys.exit(1)
        else:
            return self.args.get( arg )

    def dirPlugs( self, pPrefix, pDiffThen ):
        preLen = len( pPrefix )
        minLen = preLen+1

        self.log.debug("[ i ] looking for dir drivers ....")
        tr = []
        for p in sys.path:
            self.log.debug(f" looking in [{p}]")
            if p in [ "/usr/lib/python38.zip" ]:
                continue

            dList = self.fa.getDirList( p )
            #print(dList)
            if isinstance(dList, list):
                for f in dList:
                    tname = f
                    if len(tname) >= minLen:

                        if tname[:preLen] == pPrefix and \
                            tname[-10:] != ".dist-info" and \
                            tname != pDiffThen:
                            cname=tname.replace(".py","")
                            self.log.debug("GOT it ! %s"%cname)
                            d=il.import_module( cname )
                            tr.append( {
                                "o": d,
                                "type": "driver",
                                "cname": cname,
                                "name": d
                            } )


        self.log.info(f"got ({len(tr)}) libs useng [{pPrefix}] ...  but not [{pDiffThen}] dir look up")
        return tr


    def lookForDrivers( self, pPrefix, pSufix, pDiffThen, acts = None ):
        preLen = len( pPrefix )
        sufLen = len( pSufix )
        minLen = preLen+sufLen+1

        self.log.debug("[ i ] looking for drivers ....")
        tr = []
        for p in sys.path:
            self.log.debug(f" looking in [{p}]")
            if p in [ "/usr/lib/python38.zip" ]:
                continue

            fList = self.fa.getFileList( p )
            #dList = self.fa.getDirList( p )
            #print(dList)
            if isinstance(fList, list):
                for f in fList:
                    tname = f
                    if 1:#f.get("isFile"):
                        #otdmDriverXXXXX.py
                        if len(tname) >= minLen:

                            if tname[:preLen] == pPrefix and \
                                tname[-3:] == ".py" and \
                                tname[-sufLen:] == pSufix and \
                                tname != pDiffThen:
                                cname=tname.replace(".py","")
                                self.log.debug("GOT it ! %s"%cname)

                                #eval( f"import {cname}" )
                                #print("importing")
                                d=il.import_module( cname )
                                #d=eval(f"d.{cname}( self.args, self.conf ) ")
                                #d=f"{cname}"( args, conf )
                                #print
                                #d=d.otdmDriverProto( args, conf )
                                #print("getName")
                                #d.getName()
                                tr.append( {
                                    "o": d,
                                    "type": "driver",
                                    "cname": cname,
                                    "name": d
                                } )

            #sys.exit(11)
        self.log.info(f"got ({len(tr)}) libs useng [{pPrefix}] ... [pSufix] but not [{pDiffThen}] look up")
        #print(tr)
        return tr

    def injectDrivers( self, acts ):
        dl=self.lookForDrivers( acts )
        self.drivers=dl
        print(f"[ i ] InjectDrivers acts len {len(acts)} found drives {len(dl)}...", end=" ")

        for d in dl:
            acts.append( d )
            print(" + ", end=" ")
        print("")

        return acts






if __name__ == '__main__':
    """
    Main in this case is to have aka example section where you can see how to use it
    We need to make some steps. Plugin system can work on file system in current
    directory or in directory of python libsrary path. Or plugins by directory
    so looking for key maths and ther include it as is ...

    in directory of installation run to check ...
    `python3 ./ot_my_libs/PlugsHelper.py`

    """

    """ setting up logging settings """
    log = mlog( "PlugsHelper.Main",
        silenc={
            'info': False,
            'debug': False,
            'error': True,
            'critical': True
            })
    log.info("as test run / maint ....")

    """ to make instance """
    ph = PlugsHelper()

    libs = ph.lookForDrivers( "PlugsHelperTest_", "_a.py", "abc.py" )
    log.info(f"Libs found ({len(libs)}) ")
    log.debug(libs)
    log.debug("-----------------------------------")
    if len(libs) > 0:
        log.info("Executing lib 0 ...")
        libs[0]['o'].plug()

    log.info("DONE")


    libs = ph.dirPlugs( "ot_my_", "abc.py" )
    log.info(f"Libs dirs found ({len(libs)}) \n {libs}")
    if len(libs) > 0:
        log.info("Executing lib 0 as directory plugin ...")
        libs[0]['o'].ot_my_libs()

    log.info("DONE")
