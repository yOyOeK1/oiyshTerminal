echo "-- OTDM - repositorium update --"

otRepUpdTmpF=`mktemp`"_"`date +%s`"_otdmRepoUpdate.log"

echo "Goind to OTDM directory .... "
cd ./OTDM

echo -n "Raw ... "
dpkg-scanpackages . /dev/null > Release 2>&1 >> $otRepUpdTmpF
if [ "$?" = "0" ]; then
  echo -n "(OK)"
else
  echo "Build log is at .... "$otRepUpdTmpF\\n"Error exit 1 - otdm repo update"
  exit 1
fi


echo -n "Gz ... "
dpkg-scanpackages . /dev/null | gzip -9c > Packages.gz 2>&1 >> $otRepUpdTmpF
if [ "$?" = "0" ]; then
  echo -n "(OK)"
else
  echo "Build log is at .... "$otRepUpdTmpF\\n"Error exit 2 - otdm repo update"
  exit 1
fi


cd ../
echo "DONE"
