
echo "---- otdm to yss .js files to doccumentation packer ----"
otDir="/OT"
yssDir=${otDir}"/ySS_calibration"
wikiDir="/home/yoyo/Apps/oiyshTerminal.wiki"


#
#https://github.com/jsdoc2md/jsdoc-to-markdown/wiki/How-to-document-a-ToDo-list
# https://jsdoc.app/index.html

list='{
  "mMath": {
    "title": "mMath and string helper",
    "file": "./ySS_calibration/libs/mMath.js"},
  "mOperation": {
    "title": "for .svg mOperation helper",
    "file": "./ySS_calibration/libs/mOperation.js"},
  "mDoCmd": {
    "title": "mDoCmd. for communication with tools and bash from any layer ( stdout / stdin )",
    "file": "./ySS_calibration/libs/mDoCmd.js"},
  "mApp": {
    "title": "mApp. for fast touche GUI - jQuery Mobile in yss",
    "file": "./ySS_calibration/libs/mApp.js"},
  "three4yss": {
    "title": "t4y. for Three.js sites with .obj .stl .gbl files",
    "file": "./ySS_calibration/libs/three4yss.js"},
  "t4y_ani": {
    "title": "for Three.js sites to help with animation taskers",
    "file": "./ySS_calibration/libs/t4y_ani.js"},
  "t4y_console": {
    "title": "for Three.js sites give console renderer and other ingo use on screen ? key",
    "file": "./ySS_calibration/libs/t4y_console.js"},
  "t4y_putText": {
    "title": "for Three.js sites puts text / OSD",
    "file": "./ySS_calibration/libs/t4y_putText.js"},
  "t4y_shader": {
    "title": "for Three.js sites invert / red black / postprocessor",
    "file": "./ySS_calibration/libs/t4y_shader.js"},
  "yssPageExample": {
    "title": "example ( Make your site ) - yss site .svg base data from mqtt",
    "file": "./ySS_calibration/sites/basic_sail/s_basicSailPage.js"}
}'

echo $list | jq '.'


echo "cleaning old ..."
echo -e "# Index\n\n" > ${otDir}"/yss-js-functions.md"

for js in `echo $list |  jq 'keys[]' -r`; do
  title=`echo $list | jq '.'$js'.title' -r`
  file=`echo $list | jq '.'$js'.file' -r`
  shUrl=`echo ${title}|sed 's| |-|g'|sed 's|/||g'| sed 's|\.||g' | sed 's|(||g'| \
    sed 's|)||g' | sed "s|'||g" | sed 's|?||g' | sed 's|!||g' `
  echo -e "[- "$title"](#$shUrl)\n\n" >> ${otDir}"/yss-js-functions.md"
done

echo -e "\n---\n" >> ${otDir}"/yss-js-functions.md"


for js in `echo $list |  jq 'keys[]' -r`; do
  echo "js"$js
  title=`echo $list | jq '.'$js'.title' -r`
  file=`echo $list | jq '.'$js'.file' -r`
  echo "title for file is ... "$title
  echo -e "\n---\n# "${title}"\n### "$js"\n" \
    "[To index](#)" >> ${otDir}"/yss-js-functions.md"
  echo "running ... npm run jsdoc2md-arg" $file
  npm run jsdoc2md-arg $file

done

echo -e "\n---\n**Powered by**: [jsdoc2md](https://github.com/jsdoc2md)" >> ${otDir}"/yss-js-functions.md"

cp ${otDir}"/yss-js-functions.md" ${wikiDir}"/"
#echo "------exit -------"
#exit 1
