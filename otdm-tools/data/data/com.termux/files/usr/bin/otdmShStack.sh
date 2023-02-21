
CLStack='{
  "entryDate": '`date +%s`'
}'

otdmStackDump(){
  echo "CLStack dump......."
  echo ${CLStack} | jq '.'
  echo "--------------"
}


otdmStackR(){
  stackBack=`echo $CLStack`
  CLStack=`echo $CLStack | jq "$1"`
  if [ $? = "0" ]; then
    echo "stack Q: ok   .... q length:"${#1}
    return 0
  else
    echo "otdmStackQ ["$1"] ERROR rolling back.... return 1"
    CLStack=$stackBack
    return 1
  fi

}

otdmStackQ(){
  echo `echo $CLStack | jq "$1" $2`
}

# $1 - is jq query to set
# Ouery Stock with jq sentence end echo it in RAW
# example $ otdmSQR '.config | keys'
# get keys from config in raw
otdmSQR(){
  otdmStackQ "$1" -r
}

# $1 - is jq query to set
# Ouery Stock with jq sentence end echo it in String " "
# example $ otdmSQR '.config | keys'
# get keys from config in String ""
otdmSQ(){
  otdmStackQ "$1"
}
