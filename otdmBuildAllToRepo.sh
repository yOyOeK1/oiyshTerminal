bList="otdm-cmqtt2mysql \
otdm-db-init \
otdm-db-init-dummy \
otdm-grafana-ds-MySql \
otdm-installer-dummy \
otdm-intranetrepo-debianish \
otdm-intranetrepo-termux \
otdm-mqtt-installer \
otdm-mqtt-installer-dummy \
otdm-mrepo \
otdm-node-red-installer \
otdm-node-red-installer-dummy \
otdm-nrf-yss \
otdm-nrf-ot-test \
otdm-yss \
otdm-tools"

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
