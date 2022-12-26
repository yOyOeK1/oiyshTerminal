otGraUser="admin"
otGraPass="admin"
otGraHost="localhost"
otGraApiUrl="http://"$otGraUser":"$otGraPass"@"$otGraHost":3000/api"



#########################



function otDI(){
  echo -e "[inf] "$*
}

function otDIs(){
  echo -e "   [inf] "$*
}

function otDE(){
  echo -e "[err] "$*
}

function otD(){
  echo -e "[deb] "$*
}
function otDs(){
  echo -e "  [deb] "$*
}

function otTest(){
  otDs "otdmTest response!"
  otDs "Grafana host: ["otGraApiUrl"]"
  otDs "do pretests..."
  rC=`otGraPreCheck`
  graSta=$?
  echo "$rC"
  if [[ "$graSta"  == "1" ]]; then
    echo "- host is ok"
    otDs "all OK -------------------------- return 1"
    return 1
  else
    echo "error --------------------"
    echo "$rC"
    echo "erro - in precheck grafana. return 209"
    return 209
  fi


}


function otIsEq(){
  # $1 - arg0
  # $2 - arg0
  if [[ "$1" == "$2" ]]; then
    echo 1
  else
    echo 0
  fi
}


function otWgetAndLookFor(){
  # $1 - url
  # $2 - looking for string
  wr=`otCurlGET "$1"`
  #echo "checking content for ["$2"] using ["$1"]..."
  if echo "$wr" | grep "$2" > /dev/null; then
    #echo "  there is "$2"!"
    return 1
  else
    #echo "  no :("
    return 0
  fi

}


function otJGetVBK(){
  # $1 - json
  # $2 - key
  echo "$1" | jq -r "$2"
}

function otIsJSON(){
  # $1 - string is json ?
  echo "$1" | jq '.' 2> /dev/null > /dev/null
  if [ "$?" == 0 ]; then
    return 1
  fi

  return 0
}

function otGraDSUidByName(){
  # $1 - datasource name
  dbN=$1
  r=`otGraDBByName "$dbN"`
  if [[ "$r" == "" ]]; then
    echo "error got 0 chars. return 4"
    return 4
  fi

  otJUidByName "$r"
  return $?
}

function otJIdByName() {
  # $1 - json
  # $2 - datasource name
  r=`otJGetVBK "$1" ".id"`
  if [[ "$r" == "null" || "$r" == "" ]]; then
    echo ""
    return 0
  else
    echo "$r"
    return 1
  fi

}
function otJUidByName() {
  # $1 - json from grafana api
  r=`otJGetVBK "$1" ".uid"`
  if [[ "$r" == "null" || "$r" == "" ]]; then
    echo ""
    return 0
  else
    echo "$r"
    return 1
  fi

}



function otGraDBByName(){
  # $1 - db name
  #echo "$u"
  n=`otCurlGET $otGraApiUrl"/datasources/name/"$1`
  echo "$n"
}

function otCurlGET(){
  # $1 - url
  r=`curl -X GET \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
"$1" 2> /dev/null`
  echo "$r"
}


function otGraPreCheck(){
  echo "ot grafana pre check ["otGraApiUrl"]..."

  echo "  - checking if there is Grafana..."
  u=$otGraApiUrl"/datasources/0"
  jDBS=`otCurlGET "$u"`
  echo "  - got some stuff from grafana"
  #echo $jDBS

  otIsJSON "$jDBS"
  r=$?
  echo "  - is result a json result "$r
  if [[ "$r" == "1" ]]; then
    echo " - it's ok ?"
    return 1
  else
    echo "ERROR - no grafana at "otGraApiUrl
    echo "exit 0"
    return 0
  fi


  return 1
}
