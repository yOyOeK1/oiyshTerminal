#! /bin/bash
#echo "Fuse mesh"
echo "ver 0.0.3"
#
#0.0.3
#  * adding
#  # @namespace clients[n]
#  # @property clients[n].dirHook {bool} [false:default|true] - look for FuseShare directory in fusePrefix but if `true` then hook directetly to directory
#'''

#set -e
r=$(which sshfs)
if [ "$?" != "0" ];then
  echo "Something is wrong with sshfs. found ? ! EXIT 3"
  exit 3
fi

clients='[
{
    "name": "hu",
    "ssh": {
      "user": "u",
      "ip": "192.168.43.1",
      "port": 2222
    },
    "fusePrefix": "/data/data/com.termux/files/home"
},
{
    "name": "hu_home",
    "ssh": {
      "user": "u",
      "ip": "192.168.43.1",
      "port": 2222
    },
    "fusePrefix": "/data/data/com.termux/files/home/",
    "dirHook": true
},
{
    "name": "hu_sdcard",
    "ssh": {
      "user": "u",
      "ip": "192.168.43.1",
      "port": 2222
    },
    "fusePrefix": "/sdcard/",
    "dirHook": true
},
{
    "name": "ilooPhone_home",
    "ssh": {
      "user": "a",
      "ip": "192.168.43.64",
      "port": 2222
    },
    "fusePrefix": "/data/data/org.galexander.sshd/files/",
    "dirHook": true
},
{
    "name": "ilooPhone_sdcard",
    "ssh": {
      "user": "a",
      "ip": "192.168.43.64",
      "port": 2222
    },
    "fusePrefix": "/sdcard/",
    "dirHook": true
},
{
    "name": "yDell",
    "ssh": {
      "user": "yoyo",
      "ip": "192.168.43.220",
      "port": 2222
    },
    "fusePrefix": "/home/yoyo"
},
{
    "name": "iloo",
    "ssh": {
      "user": "iloo",
      "ip": "192.168.43.3",
      "port": 22
    },
    "fusePrefix": "/home/iloo"
},
{
    "name": "uvm",
    "ssh": {
      "user": "yovm",
      "ip": "192.168.43.55",
      "port": 2222
    },
    "fusePrefix": "/home/uvm"
}
]'

#echo -e \\n\\n$clients\\n\\n


echo "$clients" | jq '.' >> /dev/null
if [ "$?" != "0" ];then
  echo "client json error EXIT 21"
  exit 21
fi

i=0
echo "$clients" | jq '.[].name' -r | while read -r cName; do
  echo -n "## client [$i] name: ["$cName"]... "

  mountDes='/mnt/FuseShare_'"$cName"
  sshUser=$(echo "$clients" | jq '.['"$i"'].ssh.user' -r)
  sshIp=$(echo "$clients" | jq '.['"$i"'].ssh.ip' -r)
  sshPort=$(echo "$clients" | jq '.['"$i"'].ssh.port' -r)
  cFusePrefix=$(echo "$clients" | jq '.['"$i"'].fusePrefix' -r)
  dirHook=$(echo "$clients" | jq '.['"$i"'].dirHook' -r)

  if [ "$dirHook" = "null" ];then
    dirHook="0"
  fi
  if [ "$dirHook" = "true" ];then
    dirHook="1"
  fi

  #echo "$clients"
  #echo "sshIp: "$sshIp
  #echo "sshPort: "$sshPort

  echo -n "- is mounted now? .... $mountDes "
  isMounted="0"
  ## status code od mounted 0 , 1- not mounted
  fStr="$mountDes";inL=$(expr length "$fStr");echo $(mount | awk '{print $3}'| grep "$fStr" | while read -r line; do lLen=$(expr length "$line"); echo "found: $line"; echo "length: $lLen"; [ "$inL" = "$lLen" ] && echo "this it !"; break || echo "lokking.."; done ) | grep "this it";
  r="$?"
  #r=`df "$mountDes"`
  if [ "$r" = "0" ];then

    echo "YES next ..."
    isMounted="1"
    cowsay "# TDOO check if is really there ! EXIT 13"
    #exit 13

  else
    echo "NO"

    if [ "$( [ -L ~/FuseShare/_"$cName" ]; echo $?)" = "0" ]; then
      rm ~/FuseShare/_"$cName"
    fi


    set -e

    echo -n "- making pre checking ... "
    if [ -d "$mountDes" ];then
      echo "[ mount destination directory OK ]"
    else
      echo "[ mkdir $mountDes ]"
      /usr/bin/pkexec --disable-internal-agent mkdir "$mountDes"
      /usr/bin/pkexec --disable-internal-agent chmod 777 "$mountDes"
    fi

    # directHook or FuseShare directory
    echo $dirHook
    if [ $dirHook = "1" ];then
      cFuseFromDir="$cFusePrefix"
      #echo "EXIT 44"
      #exit 44
    else
      cFuseFromDir="$cFusePrefix""/FuseShare"
    fi

    set +e
    echo "- fusing it ... fuseFromDir $cfuseFromDir"
    echo "sshfs -p "$sshPort" "$sshUser"@"$sshIp":"$cFuseFromDir" "$mountDes" ...... "
    sshfs -p "$sshPort" "$sshUser"@"$sshIp":"$cFuseFromDir" "$mountDes"
    sfsR="$?"

    set -e
    ## make links update to /mnt/FuseShare_
    if [ "$sfsR" != "0" ];then
      echo -n "Error sshfs detected !! "
      echo "    in ID:$i name:$cName;"
      isMounted="0"

      set +e
      echo -n "- run umount ...."
      r=`umount "$mountDes"`
      #echo $?": DONE"

      #ls -alh ~/FuseShare/_"$cName"
      set -e

    else
      echo "- mount nice way"
      isMounted="1"

    fi


  fi

  if [ "$isMounted" = "1" ];then
    echo  -n "- is mounted link check .... "
    if [ -d ~/FuseShare ];then
      if [ -e ~/FuseShare/_"$cName" ]; then
        echo "link OK !"
      else
        echo "All god so lets add link ... "
        ln -s "$mountDes" ~/FuseShare/_"$cName"
      fi
    else
      echo "no ~/FuseShare no links for you for client."
    fi
  fi

  set +e

  echo "# "$(df -h | grep "$mountDes" | awk '{print "Size: "$2", Use: "$5""}')



  #echo "EXIT 4"
  #exit 4
  #echo "i iter ... +1"
  i=$[$i+1]
done
res="$?"


if [ "$res" != "0" ];then
  echo "Error in loop EXIT pass EXIT $res"
  exit $res
fi


echo "DONE"
echo -e \\n\\n"## Current mount FuseShare clients ..."\\n
df -h | grep '/mnt/FuseShare_'


echo -e \\n"---for now EXIT 0"
exit 0

mkdir /mnt/FuseShare_hu
chmod 777 /mnt/FuseShare_hu

sshfs -p 2222 y@hu:/data/data/com.termux/files/home/FuseShare /mnt/FuseShare_hu
