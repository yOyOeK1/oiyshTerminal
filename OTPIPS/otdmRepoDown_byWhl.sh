#!/bin/bash
p="$1"

## TODO to many places some stuff 
REPO_DIR="./REPOPIPS"

echo "--------------------------------"
echo "Download pack to local repo ... "

echo "## precheck"

if [ -f "$p" ]; then
    echo "* source is ok: $p"
else
    echo "Error wrong src EXIT 11"
    exit 11    
fi

pLen=`expr length "$p"`
pExt=`expr substr "$p" $[$pLen-3] $pLen`
if [ "$pExt" = ".whl" ]; then
    echo "* extension .whl is ok"
else
    echo "Error wrong sorurce / extension expecteding .whl  EXIT 11"
    exit 11    
fi


## running main attraction downolading to local repo ...
pypi-mirror download -d "$REPO_DIR" "$p"


echo "* add to ./RepoActions.log"
echo "{ \"entryDate\": $(date +%s), \"action\": \"download\", \"name\": \"$p\" }" >> ./RepoActions.log
echo "DONE"
echo -n "[ Q ]: Rebuild index of repo? [Y/n]:"
read -r yes
case $yes in
''|'y'|'Y')
    echo "YES ! GO GO go ..."
    ./otdmRepoCreateIndex.sh
    
    ;;
*)
    echo "no then no DONE" 
    ;;
esac


