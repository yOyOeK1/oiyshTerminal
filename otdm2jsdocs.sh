
echo "---- otdm to yss .js files to doccumentation packer ----"
otDir="/OT"
yssDir=${otDir}"/ySS_calibration"
wikiDir="/home/yoyo/Apps/oiyshTerminal.wiki"


#
#https://github.com/jsdoc2md/jsdoc-to-markdown/wiki/How-to-document-a-ToDo-list
#

list='{
  "mMath": {"title": "mMath and string helper"},
  "mOperation": {"title": "for .svg mOperation helper"},
  "yssPageExample": {"title": "example ( Make your site ) - yss site .svg base data from mqtt"},
  "three4yss": {"title": "for Three.js sites with .obj .stl .gbl files"},
  "t4y_ani": {"title": "for Three.js sites to help with animation taskers"},
  "t4y_console": {"title": "for Three.js sites give console renderer and other ingo use on screen ? key"},
  "t4y_putText": {"title": "for Three.js sites puts text / OSD"},
  "t4y_shader": {"title": "for Three.js sites invert / red black / postprocessor"}
}'

echo $list | jq '.'


echo "cleaning old ..."
echo -e "# Index\n\n" > ${otDir}"/yss-js-functions.md"

for js in `echo $list |  jq 'keys[]' -r`; do
  title=`echo $list | jq '.'$js'.title' -r`
  shUrl=`echo ${title}|sed 's| |-|g'|sed 's|/||g'| sed 's|\.||g' | sed 's|(||g'| \
    sed 's|)||g' | sed "s|'||g" | sed 's|?||g' | sed 's|!||g' `
  echo -e "[- "$title"](#$shUrl)\n\n" >> ${otDir}"/yss-js-functions.md"
done

echo -e "\n---\n" >> ${otDir}"/yss-js-functions.md"


for js in `echo $list |  jq 'keys[]' -r`; do
  echo "js"$js
  title=`echo $list | jq '.'$js'.title' -r`
  echo "title for file is ... "$title
  echo -e "\n---\n# "${title}"\n### "$js"\n" \
    "[To index](#)" >> ${otDir}"/yss-js-functions.md"
  echo "running ... npm run jsdoc2md-"$js
  npm run "jsdoc2md-"$js

done

echo -e "\n---\n**Powered by**: [jsdoc2md](https://github.com/jsdoc2md)" >> ${otDir}"/yss-js-functions.md"

cp ${otDir}"/yss-js-functions.md" ${wikiDir}"/"
echo "------exit -------"
exit 1
