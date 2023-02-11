
echo "Is it real? Somone download me and want to install
oiyshTerminal

NICE !

Let's go !"

echo "Checkinf if it's a termux....."
if [ ${SHELL} = "/data/data/com.termux/files/usr/bin/bash" ]
then
  echo "shell location termuxish"
else
  echo "shell location from env not termuxish"
  exit 1

fi

echo "Will ask for some permissions...."
sleep 1
termux-setup-storage

echo "Move to home..."
cd ~

echo "Now in "`pwd`

echo "Running update of termux ...."
pkg update -y

echo "Adding repository file to apt.source..."
if [ -d /data/data/com.termux/files/usr/etc/apt/sources.list.d ]
then
  echo "  sources.list.d is OK"
else
  echo "  no sources.list.d ... so making it"
  mkdir "/data/data/com.termux/files/usr/etc/apt/sources.list.d"
fi

echo 'deb [trusted=yes] http://192.168.43.220:8081/ ./ ' > "/data/data/com.termux/files/usr/etc/apt/sources.list.d/otdmFromZetoToHero.list"
echo 'deb [trusted=yes] https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTDM/ ./ ' > "/data/data/com.termux/files/usr/etc/apt/sources.list.d/otdmFromZetoToHero.list"

echo "Update one more time ..."
pkg update -y
pkg install termux-services -y
pkg install otdm-yss
