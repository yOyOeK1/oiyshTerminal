p="$1"
echo "Will venv it ... $p"


if [ -d "$p" ]; then
    echo "- target directory is ok"
else
    echo "Error wrong target directory [$p] EXIT 11"
    exit 11
fi

echo "- enter directory"
cd "$p"

if [ -d "venv" ]; then
    echo "	venv directory existing ..."
else
    echo "	making venv ..."
    mkdir venv
    python3 -m venv ./venv
    echo "	venv init DONE"
fi

echo "- in to venv ..."
echo "[ i ] to go out of venv type 	[ $ deactivate ]"
echo "[ i ] to activate it 		[ $ source ./$p/venv/bin/activate ]"
#source ./venv/bin/activate
