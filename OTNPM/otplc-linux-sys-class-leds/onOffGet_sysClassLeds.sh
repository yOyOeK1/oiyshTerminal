
aC="$#"
aInp=$1 # name of leds
aAct=$2 # set | get
aSet=$3


#echo "As input: $aInp "
#exit 0
if [ -d "/sys/class/leds/input"$aInp"::capslock" ]; then
  #echo "- directory of input is ok ! "
  aaa=""
else
  aaea=""
fi


if [ "$aAct" = "set" ]; then
  #echo "is set"

  if [ "$aSet" = "" ]; then
    echo "No set value :/ Exit 4"
    exit 4
  fi

elif [ "$aAct" = "get" ]; then
  #echo "is get"
  cat "/sys/class/leds/"$aInp"/brightness"
  exit 0

elif [ "$aAct" = "trigger" ]; then
  #echo "is get"
  echo $aSet >  "/sys/class/leds/"$aInp"/trigger"
  exit 0

elif [ "$aC" = "0" ]; then
  tr="$(
    ls /sys/class/leds/ | while read -r line; do
      #echo $tr
      echo -n " | . +=[{ \"name\":\"$line\",
        \"brightness\": {
          \"now\": \"$( cat "/sys/class/leds/"$line"/brightness")\",
          \"max\": \"$( cat "/sys/class/leds/"$line"/max_brightness")\",
          \"trigger\": \"$( cat "/sys/class/leds/"$line"/trigger")\"
        }
      }]"
    done
  )"
  #echo "final tr $tr"
  echo "[]" | jq '. '"$tr"
  exit 0

elif [ "$aC" = "1" ]; then
  tr="$(
    ls /sys/class/leds | grep $aInp | while read -r line; do
      #echo $tr
      echo -n " | . +=[{ \"name\":\"$line\",
        \"brightness\": {
          \"now\": \"$( cat "/sys/class/leds/"$line"/brightness")\",
          \"max\": \"$( cat "/sys/class/leds/"$line"/max_brightness")\",
          \"trigger\": \"$( cat "/sys/class/leds/"$line"/trigger")\"
        }
      }]"
    done
  )"
  #echo "final tr $tr"
  echo "[]" | jq '. '"$tr | .[]"
  exit 0

else
  echo "Eror no action set | get | trigger Exit 3"
  exit 3
fi

echo $aSet > "/sys/class/leds/"$aInp"/brightness"
