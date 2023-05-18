

## TODO to many places some stuff 
REPO_DIR="./REPOPIPS"


echo "Starting create ..."
echo "* base on: $REPO_DIR making index for $REPO_DIR""imple"
pypi-mirror create -c -d "$REPO_DIR" -m "$REPO_DIR""imple"
echo "DONE"

pCount=`cat "$REPO_DIR""imple/index.html" | grep 'a href=' | wc -l`
echo "Repo now hawe ($pCount) packages"
