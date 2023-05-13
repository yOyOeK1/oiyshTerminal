p="$1"

echo "Will make xdoc'ish .md files from .py in ... $p"


if [ -d "$p""/src/$p" ]; then
    echo "- file looks ok ...."
else
    echo "Error wrong path? no file at $p EXIT 11"
    exit 11
fi

echo "- running pydoc-markdown .... > $p/README_xdoc.md"
pydoc-markdown -I "$p""/src" --render-toc > "$p/README_xdoc.md"

echo "	DONE"
ls -alh "$p/README_xdoc.md"

