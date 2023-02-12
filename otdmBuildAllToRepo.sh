. ./otdmBuildList.sh

echo "build all repository elements....."

eList=""

for e in ${bList}
do
  echo "-------------------------------------"
  echo "making now ["${e}"]"
  otdmMake.sh ${e}
  r=$?
  if [ ${r} = "0" ]
  then
    echo "finish Correctly-------------------"
  else
    echo "Error at end ----------------------"
    eList=${eList}", "${e}
  fi


done

echo "Errors in total in: ["${eList}"]"
