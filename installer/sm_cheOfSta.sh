#!/bin/sh


##
# scp -P 2222 ./sm_cheOfSta.sh a@192.168.43.1:/data/data/com.termux/files/home/src/
#

echo "checking status of device ..."

chkPacInstalled(){
  if apt list --installed | grep -q "^$1/"; then
    return 1
  else
    return 0
  fi
}

chkWgetAndLookFor(){
  fn=`echo $1 | md5sum | awk '{print $1}'`".res"
  rm $fn
  echo "wget chck fn["$fn"]..."
  wget $1 -O $fn 2> /dev/null
  echo "checking content for ["$2"] using ["$1"]..."
  if cat $fn | grep $2 > /dev/null; then
    echo "  there is "$2"!"
    return 1
  else
    echo "  no :("
    return 0
  fi

}

errMsg=""

echo "checking sshd is running..."
staSshd=0
if ps aux | grep sshd | grep 2222
then
  staSshd=1
else
  errMsg=$errMsg"- sshd is not running at 2222 port\n"

fi
echo "["$staSshd"]DONE"


echo "check apps if they are installed...."
al="mc wget nodejs-lts libmosquitto mosquitto openssh proot-distro clang git wget termux-services termux-api mariadb-static"
echo "temporary shorter app list!!!!"
al="mc"
appsOk=1
for a in $al; do
  printf " - checking app [%s].." "${a}"
  chkPacInstalled "${a}"
  res=$?
  if [ $res -eq 1 ]; then
    echo "  it's OK!"
  else
    echo "  not installed"
    errMsg=$errMsg"- ${a} is not installed\n"
    appsOk=0
  fi
  echo
done


echo "-------------------- run done with appsOk ["$appsOk"]"


echo "checking if mysql is there..."
staMySql=0
if mysql -D 'svoiysh' -e 'show tables;'; then
  staMySql=1
else
  errMsg=$errMsg"- mysql is not running\n"
fi
echo "["$staMySql"]DONE"






echo "----------------------"
sersOk=1
#if [ $appsOk -eq 1 ]; then
if [ 1 ]; then
  echo "So if apps are ok we can test apps wget action...\n\n"

  echo "- checking grafana ...."
  chkWgetAndLookFor "http://localhost:3000" "grafana"
  staSerGra=$?
  echo "grafana is running ["$staSerGra"]"
  if [ $staSerGra -eq 0 ]; then
    sersOk=0
    errMsg=$errMsg"- grafana is not at http 3000 port\n"
  fi

  echo "- checking node-red"
  chkWgetAndLookFor "http://localhost:1880" "node-red"
  staSerNodRed=$?
  echo "nodeRed is running ["$staSerNodRed"]"
  if [ $staSerNodRed -eq 0 ]; then
    sersOk=0
    errMsg=$errMsg"- node-red is not at http 1880 port\n"
  fi

  echo "- checking mosquitto at 10883"
  mosquitto_pub -p 10883 -t 'test' -m 'abc'
  staSerMos=$?
  echo "mosquitto is running ..."
  if [ $staSerMos -eq 0 ]; then
    echo "is ok"
  else
    echo "no error code ["$staSerMos"]"
    errMsg=$errMsg"- mosquitto pub test msg error code [${staSerMos}]\n"
    sersOk=0
  fi

else
  echo "not dooing test for running apps. if they are not installed."
fi



echo "-------- checks done ----------------"
#exit 1


echo "summary--------------------------------
sshd running    ["$staSshd"]
apps insta. Ok  ["$appsOk"]
http servs runni["$sersOk"]
mysql running   ["$staMySql"]
errMsg: ----------------------------
${errMsg}
------------------------------------
"





if [ $staSshd -eq 1 -a \
$staMySql -eq 1 -a \
$appsOk -eq 1 -a \
$sersOk -eq 1 ]
then
  echo "past all!"
  ./sm_maiMen.sh
else
  echo "need some work :("
  ./sm_infoDialogUniversal.sh "oiyshTerminal:\n\n\
After instance check I have some errors:\n\
${errMsg}\n\n\
We can make something with it." "sm_proSol.sh"

fi

echo "DONE"
