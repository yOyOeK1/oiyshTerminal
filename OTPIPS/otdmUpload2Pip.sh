p="$1"

echo "Will upload to pip ... $p"
puPath="$p"

echo -n "* file looks ok ... "
if [ -f "$puPath"".tar.gz" ]; then
    echo "OK"
else
    echo ""
    echo "Error wrong path? no file at ""$puPath"".tar.gz EXIT 11"
    exit 11
fi


echo "- setting up proxy ... "
mP="http://192.168.43.1:8118"
export HTTP_PROXY="$mP"
export HTTPS_PROXY="$mP"
export ALL_PROXY="$mP"


#echo "$puPath* exit 3 for now "
#exit 3

echo "- twine upload ...."
python3 -m twine upload --repository testpypi "$puPath*"
echo "DONE
