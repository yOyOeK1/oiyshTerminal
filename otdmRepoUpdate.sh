echo "-- OTDM - repositorium update --"

echo "goind to OTDM directory ...."
cd ./OTDM

echo "Raw ..."
dpkg-scanpackages . /dev/null > Release

echo "Gz ..."
dpkg-scanpackages . /dev/null | gzip -9c > Packages.gz

cd ../
echo "DONE"
