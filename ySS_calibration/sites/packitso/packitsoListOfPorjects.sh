#!/bin/bash
cd /OT/ySS_calibration/sites/packitso
i=0
a=$(find ./p-*/packitso.json -type f | sort  | \
     while read -r line; do 
	echo -n "{  \"modDate\":\"""$(find "$line" -printf "%Ay-%Am-%Ad %AT")""\",  ";
	echo -n " \"name\":\"$(dirname "$line")\",  ";
	echo -n " \"file\":\"$line\",  ";
	echo -n "  "$(ls -alh "$line" | awk '{print "\"size\":\""$5"\", "}'; 
	echo -n "\"content\":";
	echo -n `cat "$line"`" },  ";);
	echo "";
	if [ "$i" = "1" ];then
	    break
	fi 
    done;  
); 
echo "[ $a {} ]" | tr -d '\n'  | jq '.[0:-1]'