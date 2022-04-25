fN=$1
echo "make js string var from svg file"
echo "file is ["$fN"]"
echo "result will be in "$fN".js"
echo "variable is ["$fN"]"
#exit(0)

echo "-------- Making it ..."
s=`cat ./$fN.svg`;
echo "var "$fN"=\`$s\`;" > ./$fN".js";

echo "-------- DONE"
