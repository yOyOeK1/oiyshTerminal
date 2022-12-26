echo " --- oiyshTerminal - Build all with this: "

REPODIR="/home/yoyo/Apps/oiyshTerminal/OTDM"


pN=$1
echo "This is [$pN]! it will be a deb soon..."

echo "- make deb..."
otdmMakeDeb.sh "$pN"

if [ -f "./"$pN".deb" ]; then
  si=`ls -alh $pN".deb" | awk '{print $5}'`
  echo "- we have deb! size "$si

  echo "- making archive with release...."
  zip -r $pN"_"`date +%y%m%d%H%M%S`".zip" "./"$pN

  echo "- copy it to repo directory...."
  mv $pN".deb" $REPODIR"/"

  echo "- update repo..."
  otdmRepoUpdate.sh

  echo "- ls in repo dir ...."
  ls -alh $REPODIR"/"$pN".deb"


  echo "DONE"

else
  echo "Error - there is no deb file !"

fi
