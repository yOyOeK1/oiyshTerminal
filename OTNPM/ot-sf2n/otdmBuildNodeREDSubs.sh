
tDir="/tmp/b"
list='[
{
	"id": "287824b207e90fa3",
	"subName": "Hello-manE",
	"pDir": "/OT/OTNPM/ot-sf2n-builds"
},{
	"id": "7cbfb2fd73cd66f9",
	"subName": "otplc-notification-system-to-http-api",
	"pDir": "/OT/OTNPM/ot-sf2n-builds"
},{
	"id": "154d97aa81b6dff1",
	"subName": "otplc-battery",
	"pDir": "/OT/OTNPM/ot-sf2n-builds"
},{
	"id": "f31c6882d831136a",
	"subName": "ot-hz-detector",
	"pDir": "/OT/OTNPM/ot-sf2n-builds"
},{
	"id": "536b855d2966be06",
	"subName": "ot-to-status",
	"pDir": "/OT/OTNPM/ot-sf2n-builds"
},




{
	"id": "dummy",
	"subName": "subDummy",
	"pDir": "'"$tDir"'"
}
]'


j=$(echo "$list" | jq '.')
#echo "$j"
c=$(echo "$j" | jq '. | length')
i=0
while (( $i < $c ));do
  echo "doing object $i"
  o=$(echo "$j" | jq '.['"$i"']')
  echo "$o"
  oId=$(echo "$o" | jq '.id' -r)
	oPDir=$(echo "$o" | jq '.pDir' -r)


  cd /OT/OTNPM/ot-sf2n/
  rStout=$( ./sf2n.sh $oId $oPDir)
  rCode="$?"
  echo "end exit: $rCode"
  if [ "$rCode" = "0" ];then
    echo "OK next ..."
  else
    echo "Error ----------------------"
    echo "$rStout"
    exit $rCode
    echo "---------------------------"
    echo "Error exit $rCode"
  fi

  i=$[$i+1]
done
