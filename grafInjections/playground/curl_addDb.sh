curl -X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
http://admin:admin@192.168.43.64:3000/api/datasources \
-d @datasourInjec_mysql3.json > ./datasourInjec_mysql3.res

echo "------------"
cat ./datasourInjec_mysql3.res | jq '.'
