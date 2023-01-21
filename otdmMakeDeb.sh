echo "- - = = [ [   oiyshTerminal - otdmMakeDeb.sh   ] ] = = - -"
ver="0.2"
f=$1
v=`cat $f"/DEBIAN/control" | grep 'Version' | awk '{print $2}'`
a=`cat $f"/DEBIAN/control" | grep 'Architecture' | awk '{print $2}'`


if [ -f $f"/DEBIAN/otdm_bNR" ]; then
  bNr=`cat $f"/DEBIAN/otdm_bNR"`
  bNr=$[$bNr+1]
  echo $bNr > $f"/DEBIAN/otdm_bNR"
else
  echo "1" > $f"/DEBIAN/otdm_bNR"
  bNr=1
fi

debFn=$f"_"$v"-"$bNr"_"$a".deb"

echo "------ make deb from ["$debFn"] -----"
dpkg-deb --build $f $debFn
r=$?
if [[ "$r" != "0" ]]; then
  echo "Error in dpkg-deb --bui..... .... it return [$r]"
  exit 1
fi

echo "size: `ls $debFn -sh | awk '{print $1}'`"
echo "file done: [ $debFn ]"

echo "clipIt ...."
J='{"cdm": "otdmMakeDeb.sh '$f'", "project":"'$f'", "pwd":"'`pwd`'", "fName":"'$debFn'", "v":'$v', "bNr": '$bNr', "arch":"'$a'" }'
echo "args: $J"
otdmTools.py -addNote "otdm made deb - "$f" ver: "$v"-"$bNr"_"$a -o "$J"
r=$?
if [[ "$r" != "0" ]]; then
  echo "Error in otdmTools.py .... it return [$r]"
  exit 1
fi

echo "- - = = [ [   oiyshTerminal - otdmMakeDeb.sh   ] ] = = - - END ver $ver"
