curl -X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-H 'Bearer eyJrIjoia1gwM0xYTzQ0UDdwSFhMV0sweHZIR3EzbnRGNG1ZdUsiLCJuIjoiZm9ySnMiLCJpZCI6MX0=' \
http://admin:admin@192.168.43.64:3000/api/dashboards/db \
-d @dash_dbDiagnose.json > ./dash_dbDiagnose.res

echo "------------"
cat ./dash_dbDiagnose.res | jq '.'
