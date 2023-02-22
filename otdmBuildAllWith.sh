echo " --- oiyshTerminal - Build all with this - otdmBuilAllWith.sh ---- "


REPODIR="/home/yoyo/Apps/oiyshTerminal/OTDM"

pN=$1
echo "This is [$pN]! it will be a deb soon..."

v=`cat $pN"/DEBIAN/control" | grep 'Version' | awk '{print $2}'`
a=`cat $pN"/DEBIAN/control" | grep 'Architecture' | awk '{print $2}'`
echo -n "- run command $ ./otdmMakeDeb.sh "$pN" .... to get .deb... "
re=`./otdmMakeDeb.sh "$pN"`
if [ "$?" = "0" ];then
  echo "DONE"
else
  echo \\n"ERROR exit 11................... $ ./otdmBuilAllWith.sh "$pN
  exit 11
fi

bNr=`cat $pN"/DEBIAN/otdm_bNR"`
debFn=$pN"_"$v"-"$bNr"_"$a

echo "Got it ["$debFn".deb]"
#exit 1


if [ -f "./"$debFn".deb" ]; then
  si=`ls -alh $debFn".deb" | awk '{print $5}'`
  echo "  - .deb size "$si

  echo -n " - making archive with release....  "
  zipFn=$debFn"_"`date +%y%m%d%H%M%S`".zip"
  zip -q -r "OTDMSrcZips/"$zipFn "./"$pN
  si=`ls -alh "OTDMSrcZips/"$zipFn | awk '{print $5}'`
  echo "Zip! size "$si

  #echo "--------------------------------------"
  toRm=$REPODIR"/"$pN"*deb"
  #qMsg="Do you want to remove old deb files from Repo. Of [$pN*.deb]
  #    rm "$toRm

  #otdmTools.py -doQueryYN "$qMsg" -d y
  #r=$?
  r="1"
  if [[ "$r" == "1" ]]; then
    echo "will rm $toRm"
    #echo 'ls'
    #ls $toRm
    rm $toRm
  fi
  #echo "--------------------------------------"


  echo -n "- copy it to repo directory ....  "
  mv $debFn".deb" $REPODIR"/"
  echo "DONE"

  echo -n "- update repo ... "
  ./otdmRepoUpdate.sh 2> /dev/null
  echo "  DONE"

  echo "- ls in repo dir ...."
  ls -alh $REPODIR"/"$debFn".deb"
  echo "  DONE"

else
  echo "Error - there is no deb file !"

fi

echo "DONE"
