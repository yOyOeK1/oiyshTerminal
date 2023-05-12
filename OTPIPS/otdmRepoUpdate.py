#! /usr/bin/python3.8

from ot_my_libs.FileActions import FileActions as fad
import json,sys,os


fa = fad()

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
	cmd= f"cp {srcUrl} ./REPOPIPS/"
	print("		copyIt ... ",end="")
	#print(cmd)
	#fa.cp( srcUrl,
	os.popen(cmd)
	print("DONE")
	

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
	#names="$( cat ./Repo.json | jq '.[].name' -r )"
#names="$( cat ./Repo.json | jq '.[].name' -r )"


if __name__ == "__main__":
	repoUpdate()
