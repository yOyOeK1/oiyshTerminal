echo "Node-red flow to odtm...."

fn=$1
echo "got file to work with [$fn]"

echo "- file to string..."
fs=`cat $fn`

tNodesC=`echo $fs | jq -r '.[].id' | wc | awk '{print $1}'`
echo "- got $tNodesC nodes in json...."


echo "- checking tabs....."
tTabPress=0
tTabId=""

nodes=`echo $fs | jq -r '.[].type'`
i=0
nStr=""
tNodePress=0

for n in $nodes; do
  echo "  - node nr [$i] it's type:[$n]"
  if [ "$n" = 'tab' ]; then
    tId=`echo $fs | jq -r '.['$i'].id'`
    echo "    - it's tab! with id[$tId]"
    tTabId=$tId
    tTabPress=$[$tTabPress+1]

  else
    n=`echo "$fs" | jq ".[$i]"`
    echo "adding to nodes ......[$?]....................."
    echo $n
    echo "--------------------------------------------"
    nStr=$nStr$n','
    tNodePress=$[$tNodePress+1]
  fi

  i=$[$i+1]

done

if [[ "$tTabId" != "" && "$tTabPress" == 1 ]]; then
  echo "- so there is a tab! id:[$tTabId] and [$tNodePress] nodes"


  echo '----------------------------------------NODES'
  echo $nStr


else
  echo "error there is not 1 tab in json."
  echo "I found "$tTabPress" tab(s)!"
fi




echo "DONE"
