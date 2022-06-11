#!/bin/sh



#### config
sshPort=2222
mqttPort=10883
mysqlUser="ykpu"
mysqlPasswd="pimpimpampam"
#### config END

instVer=220608

fD(){
  echo "[deb] "$*
}

funcTest(){
  fD "funcTest start"


  fD "funcTest DONE"
}


fMainConfig(){
  echo "
Config for apps and services:
  sshd at port    :"$sshPort"
  mqtt broker at port :"$mqttPort"
  node-red at port    :1880
  mysql at port       :3306
    user:   "$mysqlUser"
    passwd: "$mysqlPasswd"
    oiyshTerminal database: svoiysh

  mqtt to mysql server drops topics:
  - and/
  - NR/
  - cIMU/

    also prefix for tables is [topic_]
  "
}

steps="termux-services termux-api nodejs nodeRed mqtt mysql mysqlInit oiyshTerminal ssh grafana"
fMain(){

  ## curl http://192.168.43.220:8081/installer/run.sh -s | sh
  echo "Hello in oiyshTerminal installer ver:"$instVer

  echo "we will install:"
  echo $steps
  fMainConfig

  read -p "Is it ok ? [y/n]" rout

  if [ "$rout" = "y" ]; then
    echo "ok so go go go ....."
    for w in $steps
    do
      echo "fMain now will do [$w]"
      . ./run.sh -i $w

    done

    echo "DONE :)
    it's a automated installation. So is it ok ? you will see.
    Check wiki at https://github.com/yOyOeK1/oiyshTerminal/wiki
    Allso if you find any problem there is a place to raport a issues."

  else
      echo "exiting then ....."
      fExitNice
  fi


}

fHelp(){
  echo "help----------------------"
  echo "-i [opt]
  opt - [$steps]
-h  this help :)
-setProxy ip:port
  it will set proxy for pkg apk curl bash env"
}

fArgsParse(){
  fD "fArgsParse argsCount"$#

  if [ "$#" -eq "0" ]; then
    fMain

  elif [ "$#" -eq "2" ]; then

    if [ "$1" = "-i" ]; then
      echo "install "$2


      if [ "$2" = "ssh" ]; then
        fChkSv
        fInstallSsh

      elif [ "$2" = "nodejs" ]; then
        fInstallNodejs

      elif [ "$2" = "nodeRed" ]; then
        fChkSv
        fInstallNodeRed

      elif [ "$2" = "mqtt" ]; then
        fChkSv
        fInstallMqtt

      elif [ "$2" = "mysql" ]; then
        fChkSv
        fInstallMysql

      elif [ "$2" = "mysqlInit" ]; then
        fMysqlInit

      elif [ "$2" = "oiyshTerminal" ]; then
        fChkSv
        fInstallOiyshTerminal

      elif [ "$2" = "termux-services" ]; then
        fInstallTerSer

      elif [ "$2" = "termux-api" ]; then
        fInstallTerApi

      elif [ "$2" = "grafana" ]; then
        fInstallGrafana


      fi


    elif [ "$1" = "-setProxy" ]; then
      echo "make proxy !"
      fSetProxy $2

    else
      fHelp
    fi

  else
    fHelp
  fi


}

fExitNice(){
  echo "trying to exit nice ......."
  aabb
}

fChkSv(){
  echo "fChkSv"
  echo "... checking if termux-services is set up"
  pkg list-installed 2> /dev/null | grep 'termux-services/stable'
  if [ "$?" = "1" ]; then
    echo "I think there is no termux-service on this system :( you need to do it first"
    fExitNice
  else
    echo "  OK! go go go..."
  fi
}


fInstallGrafana(){
  echo "installing grafana"

  echo "first proot and debian ..."
  pkg install proot-distro
  proot-distro install debian
  ln -s /data/data/com.termux/files/usr/var/lib/proot-distro/installed-rootfs/debian debian_rootfs


  echo '#!/bin/bash
cd /usr/share/grafana
grafana-server
' > ./debian_rootfs/root/sGrafana.sh
  chmod +x ./debian_rootfs/root/sGrafana.sh

  echo '#!/data/data/com.termux/files/usr/bin/sh
proot-distro login debian -- /root/sGrafana.sh
' > ./startGrafana.sh
  chmod +x ./startGrafana.sh

  echo "checking if proxy is set?"
  if [ -f "~/.setProxy" ]; then
    ip=`cat ~/.setProxy`
    echo "  yes ["$ip"]"
    echo "  so setting up proxy on debian also..."
    echo "  setting proxy for apk / pkg ..."
    echo 'Acquire::http::Proxy "'$ip'"; ' > debian_rootfs/etc/apt/apt.conf.d/proxy.conf
    echo 'Acquire::https::Proxy "'$ip'"; ' >> debian_rootfs/etc/apt/apt.conf.d/proxy.conf

  else
    echo "  no"
  fi

  echo "update, upgrade ..."
  proot-distro login debian -- apt update
  proot-distro login debian -- apt upgrade
  echo 'installing essensials ...'
  proot-distro login debian -- apt install libfontconfig1 wget


  echo "getting grafana ..."
  cpuArch=`proot-distro login debian -- uname -m`
  urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_amd64.deb"
  if [ "$cpuArch" = "x86_64" ];then
    urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_amd64.deb"
  elif [ "$cpuArch" = "aarch64" ];then
    urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_arm64.deb"
  elif [ "$cpuArch" = "armv7l" ]; then
    urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_armhf.deb"

  else
    echo "oj I don't know what to download :(
    please send issue raport to https://github.com/yOyOeK1/oiyshTerminal with this
-- grafana arch unknown --
debian cpu arch ["$cpuArch"]
-- grafana arch unknown --
"
  fi

  echo "downloading ....."
  wget $urlG -c -O debian_rootfs/root/grafana.deb
  echo "installing in proot debian ...."
  proot-distro login debian -- dpkg -i /root/grafana.deb

  echo "setting up services files ....."
  cd $PREFIX/var/service/
  mkdir grafana
  mkdir grafana/log
  ln -sf $PREFIX/share/termux-services/svlogger $PREFIX/var/service/grafana/log/run
  echo '#!/data/data/com.termux/files/usr/bin/sh
exec /data/data/com.termux/files/home/startGrafana.sh 2>&1 >> /dev/null' > ./grafana/run
  chmod +x ./grafana/run

  echo "restart service ...."
  sv enable grafana
  sv-disable grafana
  sv-enable grafana

  cd ~

  echo "DONE"
}


fInstallTerSer(){
  echo "installing termux-services and needed thinks ...."
  echo "upgrade all ..."
  pkg upgrade
  echo "installing essensials..."
  pkg install clang git wget

  pkg install termux-services
  echo "You need to restart termux.
CTRL+d or exit command should do but it will be nice to stop it in setting and then start
it from icon."
  fExitNice

}

fInstallTerApi(){
  echo "installing termux-api ...."
  pkg install termux-api
  echo "DONE"
  echo "Info - reamamber to instal termux-api apk :) termux-api in termux it's only a bridge
to communicate to android termux-api"

}

fInstallSsh(){
  echo "installing sshd"
  pkg install openssh
  echo "Set up your password:"
  passwd

  echo "setting up services files ...."
  echo '#!/data/data/com.termux/files/usr/bin/sh
exec sshd -p '$sshPort' -D' > $PREFIX/var/service/sshd/run
  chmod +x $PREFIX/var/service/sshd/run
  echo "restaning service ...."
  sv enable sshd
  sv-disable sshd
  sv-enable sshd

  echo "DONE"
}

fInstallNodejs(){
  echo "installing node js"
  pkg install nodejs-lts
  echo "DONE"
}

fInstallNodeRed(){
  echo "installing node-red and esentials"
  l="node-red node-red-dashboard node-red-node-mysql node-redcontrib-termux-api termux"
  for i in $l
  do
    echo "- installing "$i
    npm -g install $i
  done

  echo "setting up services files ....."
  cd $PREFIX/var/service/
  mkdir node-red
  mkdir node-red/log
  ln -sf $PREFIX/share/termux-services/svlogger $PREFIX/var/service/node-red/log/run
  echo '#!/data/data/com.termux/files/usr/bin/sh
exec node-red 2>&1 >> /dev/null' > ./node-red/run
  chmod +x ./node-red/run

  echo "restart service ...."
  sv enable node-red
  sv-disable node-red
  sv-enable node-red

  echo "if all was fine node-red is at :1880"
  cd ~
  echo "DONE"
}


fInstallMqtt(){
  echo "installing mosquitto as a mqtt broker"
  pkg install libmosquitto mosquitto

  echo "making new config file ..."
  echo 'listener '$mqttPort' 0.0.0.0
allow_anonymous true
' > ~/mosquitto.conf

  echo "setting up services files ....."
  cd $PREFIX/var/service/
  mkdir mosquitto
  mkdir mosquitto/log
  ln -sf $PREFIX/share/termux-services/svlogger $PREFIX/var/service/mosquitto/log/run
  echo '#!/data/data/com.termux/files/usr/bin/sh
exec mosquitto -c ~/mosquitto.conf 2>&1 >> /dev/null' > ./mosquitto/run
  chmod +x ./mosquitto/run

  echo "restart service ...."
  sv enable mosquitto
  sv-disable mosquitto
  sv-enable mosquitto

  echo "so mosquitto config file is in ~/mosquitto.conf
  it's at "$mqttPort" port if all was ok"
  cd ~

  echo "DONE"
}

fMysqlInit(){
  echo "initing mysql ...."
  echo "create user '"$mysqlUser"'@'%' identified by '"$mysqlPasswd"';
create user '"$mysqlUser"'@'localhost' identified by '"$mysqlPasswd"';
GRANT ALL PRIVILEGES ON *.* TO '"$mysqlUser"'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO '"$mysqlUser"'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
quit;
exit;
" | mysql -D 'mysql' -u $(whoami);

  echo 'create database svoiysh;' | mysql

  echo "so mysql is init for:
  user: "$mysqlUser"
  password: "$mysqlPasswd"
  oiyshTerminal database: svoiysh

  it have access from localhost and all hosts and it can do all!"
  echo "DONE"
}

fInstallMysql(){
  echo "installing mysql service"
  pkg install mariadb-static
  echo "starting service ...."
  sv-enable mysqld
  sleep 3
  #fMysqlInit


  echo "DONE"
}


fInstallOiyshTerminal(){
  echo "installing oiyshTerminal"
  cd ~
  git clone https://github.com/yOyOeK1/oiyshTerminal.git

  echo "building mqtt 2 mysql ...."
  cd /oiyshTerminal/cMqtt2Mysql2
  inc="-I/home/yoyo/src/mosquitto-2.0.13/include "
  libsDir="-L/home/yoyo/src/mosquitto-2.0.13/bu/lib "
  libs="-lmosquitto "

  gcc -o cMqtt2Mysql2 main.c myWords.c `mysql_config --cflags --libs` $inc $libsDir $libs


  echo "setting up services files ....."
  cd $PREFIX/var/service/
  mkdir cMqtt2Mysql
  mkdir cMqtt2Mysql/log
  ln -sf $PREFIX/share/termux-services/svlogger $PREFIX/var/service/cMqtt2Mysql/log/run
  echo '#!/data/data/com.termux/files/usr/bin/sh
exec /data/data/com.termux/files/home/oiyshTerminal/cMqtt2Mysql2/cMqtt2Mysql2 2>&1 >> /dev/null' > ./cMqtt2Mysql/run
  chmod +x ./cMqtt2Mysql/run

  echo "restart service ...."
  sv enable cMqtt2Mysql
  sv-disable cMqtt2Mysql
  sv-enable cMqtt2Mysql



  cd ~
  echo "DONE"
}


fSetProxy(){
  ip=$1
  echo "fSetProxy ip["$ip"]"

  export http_proxy=$ip
  export HTTP_PROXY=$ip

  export https_proxy=$ip
  export HTTPS_PROXY=$ip

  export ALL_PROXY=$ip

  echo "setting proxy for apk / pkg ..."
  echo 'Acquire::http::Proxy "'$ip'"; ' > $PREFIX/etc/apt/apt.conf.d/proxy.conf
  echo 'Acquire::https::Proxy "'$ip'"; ' >> $PREFIX/etc/apt/apt.conf.d/proxy.conf

  echo "setting proxy for curl in .curlrc ..."
  echo 'proxy='$ip > ~/.curlrc

  echo "setting proxy for npm in .npmrc ..."
  echo 'proxy='$ip'"' >> ~/.npmrc

  echo "setting proxy for git in .gitconfig ..."
  echo '[http]
	proxy = '$ip'
[https]
	proxy = '$ip'
[git]
	proxy = '$ip'
' > ~/.gitconfig

  echo $ip > ~/.setProxy

  echo $http_proxy
  echo "DONE"

}



fArgsParse $*
#fMysqlInit
