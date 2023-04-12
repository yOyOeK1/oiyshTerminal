

c="$1";
tFile="/tmp/otdmTools_http.log"
ts=`date +%s%N`;
r="$(curl http://192.168.43.220:1990/$c 2>/dev/null)";
echo -e "\n-------RESULT----";
echo "$r";
echo -e "[S>]http     $c      $(date)" >> $tFile;
echo -e "[S<]http     $r"             >> $tFile;
resTime="[Si]            result in: $[$[$(date +%s%N)-$ts]/1000000] mSec"
echo "$resTime" >> $tFile
echo -e "----------------------------------\n$resTime   [$c]"
