if [ -f /usr/bin/mplayer ]
then
  mplayer $1
elif [ -f /usr/bin/aplay ]
then
  aplay $1
elif [ -f /data/data/com.termux/files/usr/bin/termux-media-player ]
then
  termux-media-player play $1
else
  echo "aplay and termux-media-player not found!"
fi
