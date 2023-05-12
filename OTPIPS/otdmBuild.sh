p=$1
echo "Will do project ... $p"

echo "- enter directory ..."
cd "$p"

echo "- build it ..."
python3 -m build | while read -r li; do echo -ne "\r$li"; done
echo "	result of build:"

echo "DONE---------------"