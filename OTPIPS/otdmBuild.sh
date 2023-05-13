p=$1
echo "Will do project ... $p"

if [ -d "$p" ]; then
    echo "- target directory is ok"
else
    echo "Error wrong target directory [$p] EXIT 11"
    exit 11
fi

echo "- enter directory ..."
cd "$p"

echo "- build it ..."
python3 -m build | while read -r li; do 
	echo -ne "\r$li                        "; 
done
	                              
echo "	result of build"



echo "DONE---------------"
