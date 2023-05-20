#! /usr/bin/python3.8

# target


soTarge="""
# new plat !

  abond custom hosting let's use python-pypi-mirror :)
  
  - [ ] task is
    pip install from localhost/repository to be offline / lesstraffic
    $ pip3 install -i http://localhost:8081/ --trusted-host localhost:8081 \
      ot_test_scrip1 
    
  - [ ] to have local builds and dist directory with hosting 
    to install/populating {REPO_DIR} with my package to host
    $ pypi-mirror download -d ./{REPO_DIR} <package|pathToFile>
    **or**
    $ pypi-mirror download -d ./{REPO_DIR} ./pathToMyApp/dist/pathToMyApp-0.0.0.tar.gz
    
  - [ ] build simple http set to host and index pypi
    $ pypi-mirror create -c -d ./{REPO_DIR} -m ./{REPO_DIR}imple
    
    this directory need to be http over localhost or https if not localhost
"""




from ot_my_libs.FileActions import FileActions as fad
from ot_my_libs.TimeHelper import TimeHelper as thd
import json,sys,os




REPO_DIR = "./REPOPIPS"

fa = fad()
th = thd()

def getJson():
	global fa
	
	repoJ = json.loads(
		"\n".join(
			fa.loadFile( "Repo.json" )
			)
		)
	#print("as J")
	#print(repoJ)
	return repoJ

def copyIt( srcUrl ):
	global fa
	global REPO_DIR
	cmd= f"cp {srcUrl} {REPO_DIR}/"
	print(f"		copyIt ... to {REPO_DIR}	",end="")
	#print(cmd)
	#fa.cp( srcUrl,
	os.popen(cmd)
	print("  DONE")
	
	
def repoGlobalListUpdate():
	global fa
	global REPO_DIR
	global th
	files = []
	for fileT in fa.getFileList(REPO_DIR):
		fs = fileT.split('.')
		if fs[-1] in ["whl","gz"]:
			files.append( fileT )
			
	#print(f"have list .... with {len(files)}")
	#print(files)
	targetFile = f"{REPO_DIR}_pips.json"
	fa.writeFile( targetFile, json.dumps({
		"files":files,
		"entryDate": th.getTimestamp(),
		"last update": th.getNiceDateFromTimestamp()
	}, indent=2) )	
	print(f"\n- write new records do [{targetFile}]")
	
	return files

def repoUpdate():
	print( "Pips repository update ..." )
	
	repoItems = getJson()
		
	packs = repoItems.keys()
	totalC = len(packs)

	print(f"- have repo list to do with {totalC} elements.\n\t{repoItems}\n----------------------------------------")
	
	for i,packKey in enumerate( packs ):
		ver = repoItems[ packKey ]
		path = f"{packKey}/dist/{packKey}-{ver}*"
		print(f"	[ {i+1} / {totalC} ] {packKey}	....	[{path}]")
		copyIt( path )
		
	print("- making new repo global list ...", end="")
	packsInRepo = len( repoGlobalListUpdate() )
	print(f"({packsInRepo}) files in repo  DONE")
	
	#names="$( cat ./Repo.json | jq '.[].name' -r )"
    #names="$( cat ./Repo.json | jq '.[].name' -r )"

def chkIsDir( dirPath ):
    if fa.isdir( dirPath ) == False:
        print("Error no {dirPath} EXIT 13")
        sys.exit( 13 )
    return True

def preCheck():
    global fa
    global REPO_DIR
    print("* precheck ... ",end="")
    for dToChk in ["pypiMeta", "imple"]:
        chkIsDir( "f{REPO_DIR}{dToChk}" )
    print( "OK" )

if __name__ == "__main__":
    preCheck()
    epoUpdate()
	
