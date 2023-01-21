echo " --- oiyshTerminal - Build all with this: "

REPODIR="/home/yoyo/Apps/oiyshTerminal/OTDM"

pN=$1
echo "This is [$pN]! it will be a deb soon..."

v=`cat $pN"/DEBIAN/control" | grep 'Version' | awk '{print $2}'`
a=`cat $pN"/DEBIAN/control" | grep 'Architecture' | awk '{print $2}'`

echo "- make deb..."
re=`otdmMakeDeb.sh "$pN"`
bNr=`cat $pN"/DEBIAN/otdm_bNR"`
debFn=$pN"_"$v"-"$bNr"_"$a

echo "got file["$debFn".deb]-----"
#exit 1


if [ -f "./"$debFn".deb" ]; then
  si=`ls -alh $debFn".deb" | awk '{print $5}'`
  echo "- we have deb! size "$si

  echo -n "- making archive with release....  "
  zipFn=$debFn"_"`date +%y%m%d%H%M%S`".zip"
  zip -q -r $zipFn "./"$pN
  si=`ls -alh $zipFn | awk '{print $5}'`
  echo "Zip! size "$si

  echo "--------------------------------------"
  toRm=$REPODIR"/"$pN"*.deb"
  qMsg="Do you want to remove old deb files from Repo. Of [$pN*.deb]
    rm "$toRm
  otdmTools.py -doQueryYN "$qMsg" -d n
  r=$?
  if [[ "$r" == "1" ]]; then
    rm -v "$toRm"
  fi
  echo "--------------------------------------"


  echo -n "- copy it to repo directory....  "
  mv $debFn".deb" $REPODIR"/"
  echo "DONE"

  echo -n "- update repo..."
  otdmRepoUpdate.sh
  echo "  DONE"

  echo "- ls in repo dir ...."
  ls -alh $REPODIR"/"$debFn".deb"
  echo "  DONE"

else
  echo "Error - there is no deb file !"

fi

echo "DONE"
