echo "otdmTools : otdmSh.sh init ...."
echo "args count: "$#
echo "argv: ["$*"]"
echo ""
echo " ----------- oiyshTerminal - otdmTools - otdmSh.sh ----------------"
echo ""
otdmHome="/data/data/com.termux/files/home/.otdm"
otdmUsrBin='/data/data/com.termux/files/usr/bin'



for ftl in `echo 'FC ShStack'`; do
  echo "Loading bin/ondm"$ftl".sh ..."
  . $otdmUsrBin"/otdm"$ftl".sh"
  if [ $? = "0" ]; then
    echo "DONE"
  else
    echo "No file ...."
    return 0
  fi
done

echo "Stacking .otdm/config.json ...."
if [ -f ${otdmHome}"/config.json" ]
then
  configJson=$( cat ${otdmHome}"/config.json" | jq '.' )
  echo "adding config from .otdm/config.json ..."
  otdmStackR '. .config='"$configJson"
  #otdmStackDump
else
  echo "No config file of otdmTools .... EXIT"
  exit 1
fi
echo "DONE"










# $1 - message to echo on exit
# $2 - exit code, default 1
# example $ exitMsg "No file." 2
otdmExitMsg(){
  echo "exitMsg args: [$*]"
  ec=$2
  if [ "${ec}" = "" ]; then ec=1; fi

  echo "[ Exit "$ec" ] $1"

  echo "EXIT not real for deb"
  exit $[$ec]

}


# $1 - if statment
# $2 - if true message to echo on exit
# $3 - exit code, default 1
# example $ exitIf $? "No file found" 5
otdmExitIf(){
  ar=$1
  echo "exitIf args:"$*
  echo "ar: "$ar
  if [ "${ar}" = "" ] ; then
    otdmExitMsg "no thing in if "'($1)'" section" $3
  elif [ ${ar} = "0" ];then
    echo "is nice go forvard ...."
  else
    otdmExitMsg "$2" $3
  fi

}



echo "otdmSh.sh -------- loaded."

otdmPathBot(){
  tpb='->'`date +%s`' PB:('$otdmPB')>'
  echo -ne \\r"$tpb"
  if [ $otdmPB = "1" ];then
    sleep 1 && otdmPathBot;
  fi
}

echo "initin path bot .... otdmPM=1 to stop it to 0"
otdmPB=1
