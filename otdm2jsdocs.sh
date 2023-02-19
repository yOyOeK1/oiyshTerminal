
echo "---- otdm to yss .js files to doccumentation packer ----"
otDir="/OT"
yssDir=${otDir}"/ySS_calibration"
wikiDir="/home/yoyo/Apps/oiyshTerminal.wiki"


#
#https://github.com/jsdoc2md/jsdoc-to-markdown/wiki/How-to-document-a-ToDo-list
# https://jsdoc.app/index.html
echo "set no errors !!!!"
set -e
list='{
  "yssPageExample": {
    "title": "example ( Make your site ) - yss site .svg base data from mqtt",
    "file": "./ySS_calibration/sites/basic_sail/s_basicSailPage.js",
    "asFile": "yss-site-example"},
  "sPager": {
    "title": "pager. for doing some magic.. with your yss",
    "file": "./ySS_calibration/libs/sPager.js",
    "asFile": "yss-js-functions-pager"},
  "mApp": {
    "title": "mApp. for fast touche GUI - jQuery Mobile in yss",
    "file": "./ySS_calibration/libs/mApp.js",
    "asFile": "yss-js-functions-mApp"},
  "mDoCmd": {
    "title": "mDoCmd. for communication with tools and bash from any layer ( stdout / stdin )",
    "file": "./ySS_calibration/libs/mDoCmd.js",
    "asFile": "yss-js-functions-mDoCmd"},
  "mMath": {
    "title": "mMath and string helper",
    "file": "./ySS_calibration/libs/mMath.js",
    "asFile": "yss-js-functions-mMath"},
  "mOperation": {
    "title": "for .svg mOperation helper",
    "file": "./ySS_calibration/libs/mOperation.js",
    "asFile": "yss-js-functions-svg"},
  "three4yss": {
    "title": "t4y. for Three.js sites with .obj .stl .gbl files",
    "file": "./ySS_calibration/libs/three4yss.js",
    "asFile": "yss-js-functions-t4y"},
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
    "file": "./ySS_calibration/libs/t4y_shader.js"}
}'
#echo $list
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
  asFile=`echo $list | jq '.'$js'.asFile' -r`
  echo "title for file is ... "$title
  echo -e "\n---\n# "${title}"\n### "$js"\n" \
    "[To index](#)" >> ${otDir}"/yss-js-functions.md"

  echo "pre build asFile .... ["${asFile}"]"
  tmA="/tmp/abccc"
  if [ ${asFile} = 'null' ];then
    echo "no seperet file."
  else
    echo "seperet file ...."
    tmA=`tempfile`
    echo "so move current to tmp .... ["${tmA}"]"
    mv ${otDir}"/yss-js-functions.md" ${tmA}
    echo "set up clean with title ...."
    echo -e "# "${title}"\n### "$js"\n" \
      "[To index](./yss-js-functions#index)" >> ${otDir}"/yss-js-functions.md"
  fi

  echo "running ... npm run jsdoc2md-arg" $file
  npm run jsdoc2md-arg $file >> /dev/null

  echo "post build asFile .... ["${asFile}"]"
  if [ ${asFile} = 'null' ];then
    echo "no seperet file."
  else
    echo "seperet file ...."
    echo "file to asFile copy ..."
    cp ${otDir}"/yss-js-functions.md" ${wikiDir}"/"${asFile}".md"
    echo "stacking it on top of tmp .... ["${tmA}"]"
    cat ${otDir}"/yss-js-functions.md" >> ${tmA}
    echo "removing ...."
    rm ${otDir}"/yss-js-functions.md"
    echo "moving tmp ass current .."
    mv ${tmA} ${otDir}"/yss-js-functions.md"
    echo "resume ... nothing happend  :P only new file in ["${wikiDir}"/"${asFile}".md]"
  fi

done

echo -e "\n---\n**Powered by**: [jsdoc2md](https://github.com/jsdoc2md)" >> ${otDir}"/yss-js-functions.md"

cp ${otDir}"/yss-js-functions.md" ${wikiDir}"/"
#echo "------exit -------"
#exit 1
