
echo "It will build auto pages from otdm- packages."
rootDir="/OT"
wikiDir="/home/yoyo/Apps/oiyshTerminal.wiki"

. ${rootDir}/otdmBuildList.sh

echo "list to build:
"${bList}
echo "otdm dir:   "${rootDir}
echo "wiki dir:   "${wikiDir}

for o in ${bList}
do
  wF=${wikiDir}"/"${o}".md"

  echo "- "${o}" checking Description..."${wF}
  if [ -f ${rootDir}"/"${o}"/DEBIAN/control" ]
  then
    echo "  is .deb with control direct to .md"
    cat ${rootDir}"/"${o}"/DEBIAN/control" > ${wF}

  fi

done
