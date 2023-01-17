


# $1 - message to echo on exit
# $2 - exit code, default 1
# example $ exitMsg "No file." 2
function exitMsg(){
  echo "exitMsg args: [$*]"
  ec=$2
  if [[ "$ec" == "" ]]; then ec=1; fi

  echo "[ Exit "$ec" ] "$1
  exit $ec

}


# $1 - if statment
# $2 - if true message to echo on exit
# $3 - exit code, default 1
# example $ exitIf $? "No file found" 5
function exitIf(){
  #echo "exitIf args:"$*
  if [[ $1 ]] ; then
    exitMsg "$2" $3
  fi

}
