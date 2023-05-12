mP="http://192.168.43.1:8118"
export HTTP_PROXY="$mP"
export HTTPS_PROXY="$mP"
export ALL_PROXY="$mP"


python3 -m twine upload --repository testpypi dist/ot_test2-0.0.2*