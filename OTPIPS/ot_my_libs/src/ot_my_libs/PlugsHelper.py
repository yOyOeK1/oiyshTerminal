#!/usr/bin/env python3
from ot_my_libs.myLoger import myLoger as mlog
from ot_my_libs.FileActions import *

import sys,os
import importlib as il

class PlugsHelper:
    """ To play with plugins idea fast ...

        __returns__ by default _array_ of _json_
        ```json
        [
            {
                "o": #_def_ or _object_,
                "type": "driver",
                "cname": #_str_ string,
                "name": #_str_ string name
            }, ...
        ]
        ```

    """

    args={}
    conf={}
    deb=False

    def __init__( self, oAsInitObject = False, args=None, conf=None ):
        """
        **oAsInitObject** _bool_ _default_ False - return ['o'] as init object with args,conf as argument or as definition to init
        **args** - to pass to your plugin
        **conf** - to pass to your plugin
        """
        self.log = mlog( "PlugsHelper",
            silenc={
                'info': False,
                'debug': False,
                'error': True,
                'critical': True
                })

        self.log.debug(f"PlugsHelper args:[{args}]")
        self.log.debug( sys.path )


        self.oAsInitObject = oAsInitObject
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

    def dirPlugs( self, pPrefix, pDiffThen, extraPaths = None ):
        """
        To look for library like by mache prefix and different then ...
        **pPrefix** _str_ - need to mache to go to list
        **pDiffThen** _str_|_filter_function - string is exact mache then no. If filter function arg as `name` is pass and your function need to return _bool_ on add it
        **extraPaths** _array_ of _str_ - to add extra paths to look for
        """
        preLen = len( pPrefix )
        minLen = preLen+1

        self.log.debug("[ i ] looking for dir drivers ....extra:{extraPaths}")
        tr = []
        pathsToChk = []
        if extraPaths != None:
            pathsToChk = extraPaths
        for p in sys.path:
            pathsToChk.append(p)

        for p in pathsToChk:
            self.log.debug(f" looking in [{p}]")
            if p in [ "/usr/lib/python38.zip" ]:
                continue

            dList = self.fa.getDirList( p )
            #print(dList)
            if isinstance(dList, list):
                for f in dList:
                    tname = f
                    if len(tname) >= minLen:

                        difTestRes = False
                        if isinstance( pDiffThen, str) and tname != pDiffThen:
                            difTestRes = True
                        else:
                            difTestRes = pDiffThen( tname )

                        if tname[:preLen] == pPrefix and \
                            tname[-10:] != ".dist-info" and \
                            difTestRes:
                            cname=tname.replace(".py","")
                            self.log.debug("GOT it ! %s"%cname)
                            d=il.import_module( cname )
                            if self.oAsInitObject:
                                d=eval(f"d.{cname}( self.args, self.conf ) ")
                            tr.append( {
                                "o": d,
                                "type": "driver",
                                "cname": cname,
                                "name": d
                            } )


        self.log.info(f"got ({len(tr)}) libs useng [{pPrefix}] ...  but not [{pDiffThen}] dir look up")
        return tr


    def lookForDrivers( self, pPrefix, pSufix, pDiffThen, extraPaths = None):
        """
        To look for files in current library or paths by maching ...
        **pPrefix** _str_ - need to mache to go to list
        **pSufix** _str_ - need to mache to go to list
        **pDiffThen** _str_|_filter_function - string is exact mache then no. If filter function arg as `name` is pass and your function need to return _bool_ on add it
        **extraPaths** _array_ of _str_ - to add extra paths to look for
        """
        preLen = len( pPrefix )
        sufLen = len( pSufix )
        minLen = preLen+sufLen+1

        self.log.debug("[ i ] looking for drivers .... extra:{extraPaths}")
        tr = []
        pathsToChk = []
        if extraPaths != None:
            pathsToChk = extraPaths
        for p in sys.path:
            pathsToChk.append(p)

        for p in pathsToChk:
            self.log.debug(f" looking in [{p}]")
            if p in [ "/usr/lib/python38.zip" ]:
                continue

            fList = self.fa.getFileList( "." if p == "" else p )
            self.log.debug(fList)
            #dList = self.fa.getDirList( p )
            #print(dList)
            if isinstance(fList, list):
                for f in fList:
                    tname = f
                    if 1:#f.get("isFile"):
                        #otdmDriverXXXXX.py
                        if len(tname) >= minLen:

                            difTestRes = False
                            if isinstance( pDiffThen, str) and tname != pDiffThen:
                                difTestRes = True
                            else:
                                difTestRes = pDiffThen( tname )

                            if tname[:preLen] == pPrefix and \
                                tname[-3:] == ".py" and \
                                tname[-sufLen:] == pSufix and \
                                difTestRes:
                                cname=tname.replace(".py","")
                                self.log.debug("GOT it ! %s"%cname)

                                #eval( f"import {cname}" )
                                #print("importing")
                                d=il.import_module( cname )
                                if self.oAsInitObject:
                                    d=eval(f"d.{cname}( self.args, self.conf ) ")
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



def PlugsHelperExample():
    """
    **PlugsHelperExample** example use look up for files / dirs to load as plugins ...
    """

    print("* instance of PlugsHelper ..")
    ph = PlugsHelper()

    print("* looking for local plugins ...")
    libs = ph.lookForDrivers( "PlugsHelperTest_", "_a.py", "abc.py")
    print(f"  * Libs found ({len(libs)}) ")
    print(libs)
    print("-----------------------------------")
    if len(libs) > 0:
        print("* Executing lib 0 ...")
        libs[0]['o'].plug()

    print("DONE")

    libs = ph.dirPlugs( "ot_my_", "abc.py" )
    print(f"* looking for dirs plugings ... found ({len(libs)}) \n {libs}")
    if len(libs) > 0:
        print("* Executing lib 0 as directory plugin ...")
        libs[0]['o'].ot_my_libs()

    print("DONE")


if __name__ == '__main__':
    """
    look in example PlugsHelperExample

    """
