echo ". . . x x x X X X   otdm - maker    X X X x x x . . ."


pd=$1
if [[ $pd == "" ]]; then
  echo "need to add [DIR] as a argument"
  exit 1
fi

if [ -d $pd ]; then
  echo "will do make in ["$pd"]"
else
  echo "need to add [DIR] as a argument"
  exit 1
fi


if [ -f $pd"/DEBIAN/preBuildRC" ]; then
  echo "preBuildRC file pressent. Running it..."
  . $pd"/DEBIAN/preBuildRC"

  echo "Run by ["$pd"/DEBIAN/preBuildRC] is DONE"

fi


if [ -f $pd"/DEBIAN/otdm" ]; then
  echo "otdm file pressent. Running tools over it..."
  otdmTools.py -tasks $pd"/DEBIAN/otdm"
  r=$?
  if [[ "$r" != "0" ]]; then
    echo "Error in tools.... it return [$r]"
    exit 1
  fi

  echo "Run by ["$pd"/DEBIAN/otdm] is DONE"


fi

#echo "Running now otdmMakeDeb.sh ....."
#otdmMakeDeb.sh $pd
echo "Running now otdmBuildAllWith.sh ....."
otdmBuildAllWith.sh $pd
r=$?
if [[ "$r" != "0" ]]; then
  echo "Error in otdmBuildAllWith.sh .... it return [$r]"
  exit 1
fi

echo "Run By otdmBuildAllWith.sh is DONE"

echo "What now? we have ready deb"

echo ". . . x x x X X X   otdm - maker    X X X x x x . . . DONE"
