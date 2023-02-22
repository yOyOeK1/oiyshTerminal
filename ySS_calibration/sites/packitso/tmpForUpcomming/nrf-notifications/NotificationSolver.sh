# Notification solver for systems
#
# Working on:
# -[x] ubuntu -> gnome
# -[ ] termux -> android notification
#
# Example
# $ echo "["$(./NotificationSolver.sh "It's a msg `date`" '{"status":"normal"}'; echo $? )"]"
# *> [{"exitCode": "0", "msg":"notify-send handle it"} 0]
# wil put System notification on host mahine with status level `normal` and msg as it's.*
#
# Notes
# check ~ $ termux-notification-list on termux to get list of notifications :)
# *returns json of somthing*
#
# $ termux-notification -c "message content" # regular notifi but no title no pop up low?
# $ termux-notification  -t "Title" -c "Message"
# icon set ? https://fonts.google.com/icons?selected=Material+Icons
#
#
# arguments
# $1 - Notification title
# $2 - params {json}
# @namespace params {json}
# @property params.status {string} - [|alert|info|weather] to distinct level of impartance
ar1="$1"
ar2="$2"
arC="$#"


notSolver(){
  aStatus="$2"
  statusLev="low"
  if [ "$aStatus" = "" ];then
    echo "no status level define. Seting low ..."
  else
    statusLev="$aStatus"
  fi
  nm="OT ($statusLev) : $1"

  #echo "---------------------------"
  #echo "notify-send --urgency=$statusLev $nm"

  echo '{"exitCode": "'$(
    termux-notification -t "otNoti - ($statusLev)" -c "$nm" && echo '0", "msg":"termux-api handle it"}' 2> /dev/null || \
    notify-send --urgency="$statusLev" "$nm" && echo '0", "msg":"notify-send handle it"}' || \
    echo '1","msg":"no tts found"}'
  )
}

case $arC in
  2 )
    #echo "2 args"

    #j='{"status":"incriti"}'; echo -n $( echo "$j" | jq '.status' -r | grep "null" > /dev/null && echo "low" || echo "$j" | jq '.status' -r )
    # from json extract status - if not set set as def `low` other pass
    statusLevel=`echo -n $( echo "$ar2" | jq '.status' -r | grep "null" > /dev/null && echo "low" || echo "$ar2" | jq '.status' -r )`
    #echo "arg2: ["$ar2"] - > status: $statusLevel"
    notSolver "$ar1" "$statusLevel"
    exit 0
  ;;
  1 )
    echo "1 arg"

    if [ "$ar1" = "-testAll" ];then
      echo "Runing testAll levels of Notifications ......"

      echo "- only msg"
      notSolver "Test - only msg"

      doTest(){
        echo '- msg {"status":"'"$1"'"}'
        notSolver 'Test - msg {"status":"'"$1"'"}' "$1"
        ec="$?"
        if [ "$ec" = "0" ];then
          echo "OK"
        else
          echo "Error in notSolver ... error [$ec]\\n\\n$rRes\\n\\n---"
          exit 1
        fi
      }

      echo "- msg and empty  {}"
      notSolver "Test - only msg and empty " '{}'
      doTest ''
      doTest 'low'
      doTest 'normal'
      doTest 'critical'


    fi


    notSolver "$ar1"
    exit 0
  ;;
  * )
    echo "Error Oiysh wrong arg count."
    exit 1
  ;;
esac
