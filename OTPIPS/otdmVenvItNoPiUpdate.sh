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
    echo "	making venv ... --without-pip"
    mkdir venv
    python3 -m venv ./venv --without-pip --prompt "VENVing ... "
    echo "	venv init DONE"
fi

echo "- in to venv ..."
echo "[ i ] to go out of venv type 	[ $ deactivate ]"
echo "[ i ] to activate it 		[ $ source ./$p/venv/bin/activate ]"
echo 'source ./venv/bin/activate' | bash

echo "DONE ---"
