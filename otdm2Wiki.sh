
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

  echo "- "${o}" checking Description... "${wF}
  if [ -f ${rootDir}"/"${o}"/DEBIAN/control" ]
  then
    echo "" > ${wF}

    homPage=`cat ${rootDir}"/"${o}"/DEBIAN/control" | grep Homepage`
    if [ $? = "0" ]
    then
      #echo "  have homepage "${homPage}
      urlIs=`echo ${homPage}|awk '{print $2}'`
      #echo "  urlIs:"${urlIs}
      if [ $urlIs = "https://github.com/yOyOeK1/oiyshTerminal" ]
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
        fi
      fi


      echo "checking if can build dependency list ...."
      depS=`cat ${rootDir}"/"${o}"/DEBIAN/control" | grep Depends`
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
              echo "["${d}"](./"${d}".md)" >> ${wF}
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

    echo "
### Automatic information from  "${o}" .deb/control
" >> ${wF}

    echo "  is .deb with control direct to .md"
    sed ':a;N;$!ba;s/\n/\n\n/g'  ${rootDir}"/"${o}"/DEBIAN/control" >> ${wF}
    #sed -i "s/\n/\n\n/g" ${wF}

  fi

done
