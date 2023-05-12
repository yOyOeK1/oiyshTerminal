#! /usr/bin/python3.8

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
			fa.loadFile( "./Repo.json" )
			)
		)
	print("as J")
	print(repoJ)
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
			
	print("have list ....")
	print(files)
	fa.writeFile( f"{REPO_DIR}/pips.json", json.dumps({
		"files":files,
		"entryDate": th.getTimestamp(),
		"last update": th.getNiceDateFromTimestamp()
	}, indent=2) )	

def repoUpdate():
	print( "Pips repository update ..." )
	
	repoItems = getJson()
		
	packs = repoItems.keys()
	totalC = len(packs)

	print(f"- have repo list to do with {totalC} elements.\n\t{repoItems}")
	
	for i,packKey in enumerate( packs ):
		ver = repoItems[ packKey ]
		path = f"{packKey}/dist/{packKey}-{ver}*"
		print(f"	[ {i+1} / {totalC} ] {packKey}	....	[{path}]")
		copyIt( path )
		
	print("- making new repo global list ...", end="")
	repoGlobalListUpdate()
	print("  DONE")
	
	#names="$( cat ./Repo.json | jq '.[].name' -r )"
#names="$( cat ./Repo.json | jq '.[].name' -r )"


if __name__ == "__main__":
	repoUpdate()
