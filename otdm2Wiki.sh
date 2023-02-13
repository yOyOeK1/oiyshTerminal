
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
  cowsay "  wiki for: "${o}"
  "

  echo "- "${o}" checking Description... "${wF}
  if [ -f ${rootDir}"/"${o}"/DEBIAN/control" ]
  then
    echo "" > ${wF}

    homPageDone="0"
    homPage=`cat ${rootDir}"/"${o}"/DEBIAN/control" | grep Homepage`
    if [ $? = "0" ]
    then
      echo "  have homepage "${homPage}
      urlIs=`echo ${homPage}|awk '{print $2}'`
      echo "  urlIs:"${urlIs}
      if [ ${urlIs} = "https://github.com/yOyOeK1/oiyshTerminal" ]
      then
        echo "skip... it's going to main manual."
      else
        echo "ok try to extract some info...."
        pathToMd=`echo ${urlIs} | sed -r 's|https://github.com/yOyOeK1/oiyshTerminal||g'`
        if [ -f ${rootDir}${pathToMd}"/README.md" ]
        then
          echo "have readmy!"
          #https://github.com/yOyOeK1/oiyshTerminal/raw/main/ySS_calibration/screenShots/ilooNav3D_ver0.1.png
          cat ${rootDir}${pathToMd}"/README.md" | \
            sed -r 's|]\(./|]\(https://github.com/yOyOeK1/oiyshTerminal/raw/main/'${pathToMd}'/|g' > ${wF}
          homPageDone=1
        fi
      fi



      echo "checking if can build dependency list ...."
      depS=`cat ${rootDir}"/"${o}"/DEBIAN/control" | grep -v "#Depends:"| grep Depends`
      if [ $? = "0" ]
      then
        echo "  have dependencys: "${depS}
        echo "
## Depends:
" >> ${wF}
        for d in ${depS}; do
          d=`echo ${d} | sed 's|,||g' | sed 's|  ||g'`
          if [ ${d} = "Depends:" ]; then
            echo "start...["${d}"]"
          elif [ ${d} = "|" ]; then
            echo "or"
          else
            known=`echo ${bList} | grep ${d}`
            if [ $? = "0" ]
            then
              echo "["${d}"](./"${d}")" >> ${wF}
            else
              echo ${d} >> ${wF}
            fi
          fi

        done

        echo "
---
        ">> ${wF}

      fi

    fi


    echo "checking if have README in home directory..."
    if [ ${homPageDone} = "1" ]; then
      echo "  skip... main is home page"
    else

      rListInHome=`find ${rootDir}"/"${o}"/" | grep README`
      for rH in ${rListInHome}; do
        echo "found readmy by find... "${rootDir}"/"${o}"/"
        echo "f: "${rH}
        echo "wF now-------------"
        cat ${wF}
        echo "-------------- end wF"
        pathToFile=`echo ${rH} | \
          sed -r 's|'${rootDir}'|https://github.com/yOyOeK1/oiyshTerminal/raw/main|g' | \
          sed -r 's|/README.md||g' | sed -r 's|/README||g'`
        cat ${rH} | \
          sed -r 's|]\(./|]\('${pathToFile}'/|g' >> ${wF}
        echo "
---
        " >> ${wF}
      done

    fi

    echo "
### Automatic information from  "${o}" .deb/control
" >> ${wF}

    echo "  is .deb with control direct to .md"
    sed ':a;N;$!ba;s/\n/\n\n/g'  ${rootDir}"/"${o}"/DEBIAN/control" >> ${wF}
    #sed -i "s/\n/\n\n/g" ${wF}

    echo "checking if have changelog..."
    if [ -f ${rootDir}"/"${o}"/DEBIAN/changelog" ]; then
      echo "  have... ading"
      echo "
## CHANGELOG
" >> ${wF}
      cat ${rootDir}"/"${o}"/DEBIAN/changelog" >> ${wF}
    fi

    echo "
---
## otdm family:
    " >> ${wF}
    for d in ${bList}; do
      echo -n "["`echo ${d}|sed 's|otdm-||g'`"](./"${d}")  " >> ${wF}
    done


  fi

  if [ ${o} = "otdm-termux-wake-lock" ]; then
    #exit 1
    echo "exit no"
  fi

done

echo "-- build done now publishing to git hub..."
cd ${wikiDir}
echo "it "${wikiDir}
fl=`git diff --raw | awk '{print $6}'`
pushIt=0
cmd="changes in wiki files: "
for f in ${fl}; do
    echo "adding ... ["${f}"]"
  git add ${f}
  cmd=${cmd}${f}", "
  pushIt=1
done

if [ ${pushIt} = 1 ]
then
  echo "there is what to commit /push ..."
  echo 'then git commit -m "command"'
  git commit -m "${cmd}"
  read -p "push it? [Y/n]" pushIt
  case ${pushIt} in
    "" | "y" | "Y" )
      echo "then git push"
      git push
  esac
else
  echo "nothing to push"
fi
cd ${rootDir}
