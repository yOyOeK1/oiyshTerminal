#!/bin/bash

p="$1"

if [ "$p" == "" ]; then
    echo "Error no [projName/dist/projName-x.x.x.tar.gz] as argument EXIT 11"
    exit 11
fi

puPath="$p"
pDistPath="$(dirname $p)"
pName="$( dirname $pDistPath )"
pFileUpdate="$( basename $p )"


echo "Will reinstall in pip3 ... $pName ... $pFileUpdate"



echo -n "* file looks ok ... "
if [ -f "$puPath" ]; then
    echo "OK"
else
    echo ""
    echo "Error wrong path? no file at ""$puPath""x-x-x.tar.gz EXIT 11"
    exit 11
fi



echo "* uninstalling ... $pName"
sudo pip3 uninstall $pName -y

echo "* installing ... $puPath"
sudo pip3 install $puPath

echo "DONE"
