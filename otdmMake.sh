echo '. . . x x x X X X   otdm - maker    X X X x x x . . .
./otdmMake.sh [dir of .deb project]

will check for:
- DEBIAN/preBuildRC - pre build bash
- DEBIAN/otdm - otdmTool work - import export downlad tasker json define what will be done
- will run $ otdmBuildAllWith.sh .... on it to make .deb and update Repository ./OTDM
'


pd=$1
if [[ $pd == "" ]]; then
  echo "need to add [DIR] as a argument"
  exit 1
fi

if [ -d $pd ]; then
  echo "Will do make in ["$pd"]"
else
  echo "need to add [DIR] as a argument"
  exit 1
fi


if [ -f $pd"/DEBIAN/preBuildRC" ]; then
  echo "preBuildRC file pressent. Running it..."
  . $pd"/DEBIAN/preBuildRC"
  echo $?" << -- EXIT CODE"

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
echo "Running now otdmBuildAllWith.sh ..... "
./otdmBuildAllWith.sh $pd
r=$?
if [[ "$r" != "0" ]]; then
  echo "Error in otdmBuildAllWith.sh .... it return [$r]"
  exit 1
fi

echo "Run By otdmBuildAllWith.sh is DONE"

echo "What now? we have ready deb"

echo ". . . x x x X X X   otdm - maker    X X X x x x . . . DONE"
