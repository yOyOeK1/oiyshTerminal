f=$1
echo "------ make deb from [$f]-----"
dpkg-deb --build $f
