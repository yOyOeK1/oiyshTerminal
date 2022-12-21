#!/bin/sh

# https://www.geeksforgeeks.org/shell-scripting-dialog-boxes/


export PATH="/data/data/com.termux/files/home/.npm/bin:/data/data/com.termux/files/usr/bin:$PATH"

dialog \
  --title "oiyshTerminal - Main Menu" \
  --menu "Select action:" 15 60 45  \
0 "Exit" \
1 "make backup (~/.node-red)" \
2 "update yss_calibration directory from github" 2> ./sm_maiMen.res

res=`cat ./sm_maiMen.res`
echo "got:"$res
hd="/data/data/com.termux/files/home"
oPwd=`pwd`
case $res in
  1)
    echo "make backup! node-red"
    t=`date +%y%m%d%H%M`
    echo "will use date ["$t"]"

    echo "backup of node-red..."
    fn=$hd"/backup_nodeRed_home_"$t".tar.bz2"
    tar -cjvf $fn $hd"/.node-red"
    echo "done"


    nrs=`ls -alh $fn | awk '{print $5}'`

    ./sm_infoDialogUniversal.sh "node-red backup DONE \n\
  size: $nrs \n\
  file name:\n $fn " "sm_maiMen.sh"

    echo "DONE"
    exit 0;;
  2)
    echo "update yss_calibration directory from github"
    echo "change directory to repo"
    cd $hd"/oiyshTerminal"
    echo "pull ....."
    rm $hd"/gitPulOfOiysh.log"
    git pull >> $hd"/gitPulOfOiysh.log"
    echo "pull DONE"
    gRes=`cat $hd"/gitPulOfOiysh.log"`
    echo "cp....."
    cp -rv ./ySS_calibration/* $hd"/debiar_rootfs/usr/share/grafana/public/yss/"
    echo "end dialog..."
    echo "go back to start directory..."
    cd $oPwd
    ./sm_infoDialogUniversal.sh "ySS_calibration update done. :)\ngit pull is:\n ${gRes} " "sm_maiMen.sh"


    echo "DONE"
    exit 0;;
  *)
    echo "esc ! exit!";
    echo "res["$res"]"
    exit 1;;
esac


$oPwd"/sm_maiMen.sh"
