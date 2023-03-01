#!/bin/bash


if [ "$(pwd)" != "/OT" ];then
  echo "go first to /OT EXIT 3"
  exit 3
fi

echo "Full from p- /packitso.json to .deb ...."
if [ "$#" = "1" ];then
  pisJ="$1"
  if [ -f "$pisJ" ];then
    echo "Ok Let's GO!"

    cowsay "Running packitso.json to otdmp- project dir ... "

    rStdOut=`/data/data/com.termux/files/usr/bin/packitsoSh.sh -debianize $pisJ`
    r="$?"
    if [ "$r" = "0" ];then
      echo "OK"
    else
      echo -e "$rStdOut" | while read -r line ; do echo -e '      '"$line"; done
      exit $r
    fi


    pDir="otdmp-"`cat "$pisJ" | jq '.packitso.name' -r`
    echo "Packege otdmp-$pDir"
    if [ -d "/OT/""$pDir" ];then
      echo "Project directory $pDir is there."
    else
      echo "No project directory $pDir EXIT 12"
      exit 12
    fi

    cowsay "Running ./otdmMake.sh on it ..."
    rStdOut=`./otdmMake.sh "$pDir"`
    r="$?"
    if [ "$r" = "0" ];then
      echo "OK"
    else
      echo -e "$rStdOut" | while read -r line ; do echo -e '      '"$line"; done
      exit $r
    fi


    echo "All done. from packitso.json to .deb DONE"
    exit 0
  fi
fi


echo "No argument to ./packitso.json EXIT 11"
exit 11

#rm -rvf /OT/otdmp-test-nrf-from-hu-test5; /data/data/com.termux/files/usr/bin/packitsoSh.sh -debianize ./ySS_calibration/sites/packitso/p-test-nrf-from-hu-test5/packitso.json
