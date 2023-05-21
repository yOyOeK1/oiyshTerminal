#! /usr/bin/python3.8

from ot_my_libs.myLoger import myLoger as mlog
from ot_my_libs.FileActions import FileActions as fad
from ot_my_libs.TimeHelper import TimeHelper as thd
import json
import sys
import os
import toml


#import otdmRepoUpdate as repo



print("using eclipt adding some...")
t = thd()
print( t.getNiceShortDate() )

def smallTestOneSet( dName ):
    print( f"#   {dName}" )
    print( "---------"*5 )
    print( "\n- make instance\n")
    o = otpip( dName )
    print( "\n- chkIt ... \n")
    ren = o.chkIt()
    
    #breakpoint()
    
    print( f"\n{dName}---------------------------")
    print( "##  result of chkIt:\n" ) 
    print( json.dumps( ren,indent=2 ) )
    
    print( f"\n{dName}---------------------------")
    print( "##  dist info:\n" ) 
    print( json.dumps( ren['dist'], indent=2 ) )
    
    print( f"\n{dName}---------------------------")
    print( "##  repository info:\n" ) 
    print( json.dumps( ren['repo'], indent=2 ) )
    
    print( f"\n{dName}- DONE --------------------------\n")

    
    

def smallTest():
    print("Small test ....")
    smallTestOneSet('ot_test2')
    smallTestOneSet('ot_my_libs')
    print("... small test DONE")
        

class otpip:

    def __init__( self, dName ):
        self.log = mlog( f"fotpip:{dName}", 
            silenc={
                'info': True,
                'debug': True,
                'error': True,
                'critical': True
                },)
    
        self.fa = fad()
        self.th = thd()

        self.dName = dName
        self.fPath = f"./{dName}"
        self.pyprojPath = self.jfPath( 'pyproject.toml' )        
        self.venvPath = self.jfPath( 'venv' )
        self.distPath = self.jfPath( 'dist' )
        self.srcPath = self.jfPath( 'src' )
        self.ReadmePath = self.jfPath( 'README.md' )
        self.xdocPath = self.jfPath( 'README_xdoc.md' )
        
        self.chkOk = False   
        self.l(f"init ... DONE")


    def l( self, msg ):
        self.log.info( msg )

    def jfPath( self, objPath):
        return self.fa.join( self.fPath, objPath )
        
    def jdPath( self, objPath):
        return self.fa.join( self.distPath, objPath )


    def chkIt( self ):
        dirOk = self.fa.isDir( self.fPath ) 
        tr = { 
            "exists": dirOk,
            "repo" : {
                "ver" : -1,
                "inRepo": False,
                "verDiff": -1
            },
            "dist": { 
                "exists": False, 
                "build": {  
                    "whl": { "exists": False, "name": "" }, 
                    "tar": { "exists": False, "name": "" } 
                } 
            }
        }
        
        if dirOk:
            fileOk = self.fa.isFile( self.pyprojPath )
            tr['pyproject'] = { "exists": fileOk }

            tr['dist']['exists'] = self.fa.isDir( self.distPath )

            if fileOk:
                tr['pyproject']['data'] = toml.load( self.pyprojPath )
                self.ver = tr['pyproject']['data']['project']['version']
                self.l(['from','pyproject','got','version',self.ver])
                #tr['repo']['ver'] = repo.getJson().get( self.dName, -1 )
                #tr['repo']['inRepo'] = True if self.ver == tr['repo']['ver'] else False
                
                fWhl = f"{self.dName}-{self.ver}-py3-none-any.whl" 
                fTar = f"{self.dName}-{self.ver}.tar.gz" 
                self.distWhlPath = self.jdPath( fWhl )
                self.distTarPath = self.jdPath( fTar )
        
                tr['dist']['build'] = {
                    'whl': {
                        "exists": self.fa.isFile( self.distWhlPath ),
                        "name": fWhl
                    },
                    'tar': {
                        'exists': self.fa.isFile( self.distTarPath ),
                        'name': fTar                    
                    }
                }
                
            tr['venv'] = { "exists": self.fa.isDir( self.venvPath ) }
            tr['src'] = { "exists": self.fa.isDir( self.srcPath ) }
            tr['readme'] = { "exists": self.fa.isFile( self.ReadmePath ) }
            tr['xdoc'] = { "exists": self.fa.isFile( self.xdocPath ) }
        
        self.chkOk = True
        
        return tr

    def initNew( self ):
        pass

    def makeDocsMd( self ):
        pass

    def venvIt( self ):
        pass

    def build( self ):
        pass


class otpipsrepo:

    def __init__( self ):
        pass


if __name__ == "__main__":

    print("oiyshTerminal pip 's - tool chaine / builde / ...")
    smallTest()
    
    """
    print("# test_run in otpip ....")
    print("  - init")
    p = otpip('test_run')
    print(f"  - chkIt ... [{p.chkIt()}]")
    
    """
