#!/data/data/com.termux/files/usr/bin/sh

# link short
# https://bit.ly/3Qedy9w
#
# check
# --force-confdef for apt

#### config
sshPort=2222
mqttPort=10883
mysqlUser="ykpu"
mysqlPasswd="pimpimpampam"
#### config END

instVer=221221


fD(){
  echo "[deb] "$*
}

funcTest(){
  fD "funcTest start"


  fD "funcTest DONE"
}

fDialYN(){
  #echo "got ------------"
  #echo $1
  #echo "end ------------"

  dialog --title "oiyshTerminal - installer" \
--yesno "$*" 20 60
  res=$?
  echo "yesno res:["$res"] is returning it..."
  return $res
}

fDialInf(){
  dialog --infobox "$*" 10 30
}

fMainConfig(){
  echo "Config for apps and services:\n
  sshd at port        :"$sshPort"\n
  mqtt broker at port :"$mqttPort"\n
  node-red at port    :1880\n
  mysql at port       :3306\n
    user:   "$mysqlUser"\n
    passwd: "$mysqlPasswd"\n
    oiyshTerminal database: svoiysh\n
\n
  mqtt to mysql server drops topics:\n
  - and/\n
  - NR/\n
  - cIMU/\n
\n
    also prefix for tables is [topic_]"
}



steps="termux-services termux-api ssh nodejs nodeRed mqtt mysql mysqlInit oiyshTerminal grafana mkBashrc mkChkSystem"
fMain(){

  ## curl http://192.168.43.220:8081/installer/run.sh -s | sh
  m="Hello in oiyshTerminal installer\n\
ver:"$instVer"\n\
\n\
We will install:\n\
"$steps


  m=$m"\n\n"$(fMainConfig)"\n\n\
More info about project at github wiki:\n\
https://github.com/yOyOeK1/oiyshTerminal/wiki\n\n\
Do you want to continue?"

  fDialYN "$m"
  rout=$?
  clear
  echo "Dialog done. Result:["$rout"]"
  #exit 1
  if [ $rout -eq 0 ]; then
    echo "ok so go go go ....."


    echo "check if we need to ask for sdcard acces..."
    echo "home dir is["$HOME"]"
    if [ -d $HOME"/storage" ]; then
      echo " - OK. it's done."
    else
      echo "let's make permitions to sdcard...."
      echo " - NO. You will be prompt for permitions. allow if you want to continue."
      fDialInf "We will ask for permitions to acces sdcard now..."
      sleep 1
      termux-setup-storage
    fi

    curDir=`pwd`
    echo "------ my pwd ["$curDir"]"
    echo "move to home..."
    cp ./run.sh $HOME/run.sh
    cd $HOME
    pwd
    echo "  DONE?"

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
  fD "fArgsParse argsCount ["$#"]"

  if [ "$#" -eq "0" ]; then
    fMain

  elif [ "$#" -eq "2" ]; then

    if [ "$1" = "-i" ]; then
      echo "install "$2
      fDialInf "installing now step ["$2"] ..."
      sleep 1
      echo "so doing 1:["$1"] 2:["$2"]"

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

      elif [ "$2" = "mkChkSystem" ]; then
        fMkChkSystem

      elif [ "$2" = "mkBashrc" ]; then
        fMkBashrc


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

fChkBin(){
  b=$*
  echo "checking binary in system ["$b"]"
  if whereis "$b" > /dev/null; then
    return 1
  else
    return 0
  fi
}

if [ "1" -eq 0 ]; then
  echo "--------fChkBin ('mc') test"
  fChkBin "mc"
  res=$?
  echo "res:["$res"]"
  echo "test done"

  exit 11
fi



fInstallGrafana(){
  echo "installing grafana"

  echo "first proot and debian ..."
  apt install proot-distro -y
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
  if [ -f ~/.setProxy ]; then
    ip=`cat ~/.setProxy`
    echo "  yes ["$ip"]"
    echo "  so setting up proxy on debian also..."
    echo "  setting proxy for apk / pkg ..."
    echo 'Acquire::http::Proxy "'$ip'"; ' > debian_rootfs/etc/apt/apt.conf.d/proxy.conf
    echo 'Acquire::https::Proxy "'$ip'"; ' >> debian_rootfs/etc/apt/apt.conf.d/proxy.conf
    echo "setting proxy for wget in .wgetrc...."
    echo 'http_proxy='$ip > ~/.wgetrc
    echo 'https_proxy='$ip >> ~/.wgetrc

  else
    echo "  no"
  fi

  echo "update, upgrade ..."
  proot-distro login debian -- apt update
  proot-distro login debian -- apt upgrade -y
  echo 'installing essensials ...'
  proot-distro login debian -- apt install libfontconfig1 wget -y


  echo "getting grafana ..."
  cpuArch=`proot-distro login debian -- uname -m`
  urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_amd64.deb"
  if [ "$cpuArch" = "x86_64" ];then
    urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_amd64.deb"
  elif [ "$cpuArch" = "aarch64" ];then
    urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_arm64.deb"
  elif [ "$cpuArch" = "armhf" ];then
    urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_armhf.deb"
  elif [ "$cpuArch" = "armv7l" ]; then
    urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_armhf.deb"
  elif [ "$cpuArch" = "armv8l" ]; then
    urlG="https://dl.grafana.com/enterprise/release/grafana-enterprise_8.5.5_armhf.deb"


  else
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    oj I don't know what to download :(
    please send issue raport to https://github.com/yOyOeK1/oiyshTerminal with this
-- grafana arch unknown --
debian cpu arch ["$cpuArch"]
-- grafana arch unknown --

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
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
  sv-enable grafana
  #sv-disable grafana
  #sv-enable grafana

  cd ~

  echo "DONE"
}


fInstallTerSer(){
  echo "installing termux-services and needed thinks ...."
  echo "update...."
  apt update
  echo "upgrade all ..."
  apt upgrade -y
  echo "reloading profile..."
  . $PREFIX/etc/profile
  echo "installing essensials..."
  apt update
  apt install clang git wget proot mc iproute2 python -y

  pkg install termux-services -y
  echo "reloading profile..."
  . $PREFIX/etc/profile

  fDialInf "You need to restart termux.\n\
CTRL+d or exit command should do but it will\n\
be nice to stop it in setting and then start\n\
it from icon."

  fExitNice

}



fMkBashrc(){
  echo "making .bashrc file...."
    t=`date`
    echo "add things to .bashrc..."
    echo 'echo "-------------------------

Hello from oiyshTerminal

  installation: '$t'

-----------------

	ssh		    :2222
	mosquitto	:10883
	mysqld		:3306
	grafana		:3000
	nodeRed		:1880

local time:	`date`
UTC time:   `date -u`

------------------------"

' > ~/.bashrc

    echo "adding wake lock ..."
    echo "termux-wake-lock" >> ~/.bashrc

    if [ -f ~/.setProxy ]; then
      ph=`cat ~/.setProxy`
      tp='
# set proxy
export http_proxy="'$ph'"
export HTTP_PROXY="'$ph'"

export https_proxy="'$ph'"
export HTTPS_PROXY="'$ph'"

export ALL_PROXY='$ph'

export no_proxy="192.168.*.*,127.0.0.1,localhost"
export NO_PROXY="192.168.*.*,127.0.0.1,localhost"
    '
    echo "adding proxy to .bashrc..."
    echo "$tp" >> ~/.bashrc
    echo "adding profile file with proxy settings..."
    echo "$tp" >> /data/data/com.termux/files/usr/etc/profile.d/setProxy.sh


    fi

    echo "  DONE"

}

fInstallTerApi(){
  echo "installing termux-api ...."
  apt install termux-api -y
  echo "DONE"
  echo "Info - reamamber to instal termux-api apk :) termux-api in termux it's only a bridge
to communicate to android termux-api"

}

fMkChkSystem(){
  echo "making check of this system ...."
  cd $HOME/oiyshTerminal/installer
  ./sm_cheOfSta.sh
  cd $HOME
  echo "DONE"
}


fInstallSsh(){
  echo "installing sshd ..."
  apt install openssh -y
  echo "Set up your password do ssh:"
  passwd

  echo "setting up services files ...."
  echo '#!/data/data/com.termux/files/usr/bin/sh
exec sshd -p '$sshPort' -D' > $PREFIX/var/service/sshd/run
  chmod +x $PREFIX/var/service/sshd/run
  echo "restaning service ...."
  #sv enable sshd
  #sv-disable sshd
  sv-enable sshd

  echo "DONE"
}

fInstallNodejs(){
  echo "installing node js"
  apt install nodejs-lts -y
  echo "DONE"
}

fInstallNodeRed(){
  echo "installing node-red and esentials"

  echo "but first update of npm...."
  #rm -rvf $HOME"/.npmMy"
  #proot chown -R 10064:10064 $HOME"/.npmMy"
  npm config set cache "/data/data/com.termux/files/home/.npmMy" -g
  npm cache verify -g
  proot --link2symlink npm i -g npm@8.19.1

  l="termux node-red@2.1.5 node-red-dashboard node-red-node-mysql node-redcontrib-termux-api"
  for i in $l
  do
    echo "- installing ["$i"]"
    proot --link2symlink npm i -g $i
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
  #sv enable node-red
  sv-disable node-red
  sv-enable node-red

  echo "if all was fine node-red is at :1880"
  cd ~
  echo "DONE"
}


fInstallMqtt(){
  echo "installing mosquitto as a mqtt broker"
  apt install libmosquitto mosquitto -y

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
exec mosquitto -c /data/data/com.termux/files/home/mosquitto.conf 2>&1 >> /dev/null' > ./mosquitto/run
  chmod +x ./mosquitto/run

  echo "restart service ...."
  #sv enable mosquitto
  sv-disable mosquitto
  sv-enable mosquitto

  echo "so mosquitto config file is in ~/mosquitto.conf
  it's at "$mqttPort" port if all was ok"
  cd ~

  echo "DONE"
}

fMysqlInit(){
  echo "initing mysql ...."
  q="create user '"$mysqlUser"'@`%` identified by '"$mysqlPasswd"';"
  q+="create user '"$mysqlUser"'@'localhost' identified by '"$mysqlPasswd"';"
  q+="GRANT ALL PRIVILEGES ON "
  q+='*.*'
  q+=" TO '"$mysqlUser"'@'%' WITH GRANT OPTION;"
  q+="GRANT ALL PRIVILEGES ON "
  q+='*.*'
  q+=" TO '"$mysqlUser"'@'localhost' WITH GRANT OPTION;"
  q+="FLUSH PRIVILEGES;"

  echo "will use query------------------"
  echo "$q"
  echo "-------------do init privileges"
  #exit 1
  echo "executing ....."
  echo "$q" | mysql -D 'mysql' -u $(whoami);
  echo " DONE"

  echo "create database...."
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
  apt install mariadb-static -y
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
  cd ~/oiyshTerminal/cMqtt2Mysql2
  inc="-I/home/yoyo/src/mosquitto-2.0.13/include "
  libsDir="-L/home/yoyo/src/mosquitto-2.0.13/bu/lib "
  libs="-lmosquitto "

  gcc -Wno-error=int-conversion -o cMqtt2Mysql2 main.c myWords.c `mysql_config --cflags --libs` $inc $libsDir $libs


  echo "setting up services files ....."
  cd $PREFIX/var/service/
  mkdir cMqtt2Mysql
  mkdir cMqtt2Mysql/log
  ln -sf $PREFIX/share/termux-services/svlogger $PREFIX/var/service/cMqtt2Mysql/log/run
  echo '#!/data/data/com.termux/files/usr/bin/sh
exec /data/data/com.termux/files/home/oiyshTerminal/cMqtt2Mysql2/cMqtt2Mysql2 2>&1 >> /dev/null' > ./cMqtt2Mysql/run
  chmod +x ./cMqtt2Mysql/run

  echo "restart service ...."
  #sv enable cMqtt2Mysql
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
  echo 'noproxy=127.0.0.1' >> ~/.curlrc

  echo "setting proxy for npm in .npmrc ..."
  echo 'proxy='$ip >> ~/.npmrc
  echo 'https-proxy='$ip >> ~/.npmrc
  echo 'strict-ssl=false' >> ~/.npmrc
  echo 'registry="http://registry.npmjs.org/"' >> ~/.npmrc
  echo 'maxsockets=1' >> ~/.npmrc

  echo "setting proxy for wget in .wgetrc...."
  echo 'http_proxy='$ip > ~/.wgetrc
  echo 'https_proxy='$ip >> ~/.wgetrc

  echo "setting proxy for git in .gitconfig ..."
  echo '[http]
	proxy = '$ip'
[https]
	proxy = '$ip'
[git]
	proxy = '$ip'
' > ~/.gitconfig

  echo $ip > ~/.setProxy

  echo "setting proxy for apk / pkg ..."
  echo 'Acquire::http::Proxy "'$ip'"; ' > debian_rootfs/etc/apt/apt.conf.d/proxy.conf
  echo 'Acquire::https::Proxy "'$ip'"; ' >> debian_rootfs/etc/apt/apt.conf.d/proxy.conf

  export http_proxy=$ip
  export https_proxy=$ip


  echo $http_proxy
  echo "DONE"

}


# check if we are at termux
echo "check if we are at termux ...."
if env | grep TERMUX > /dev/null; then
#if [ 1 ]; then
  echo " - ok. It's termux. do normal stuff."

  fArgsParse $*
else
  echo " - no. It's different enviroment / distro. I will exit"
  fExitNice
fi
# end pre check

#fMysqlInit
