
echo "It will build auto pages from otdm- packages."
rootDir="/OT"
wikiDir="/home/yoyo/Apps/oiyshTerminal.wiki"


. ${rootDir}/otdmBuildList.sh


if [ "$1" = "" ]; then
  echo "no arg run"
else
  echo "with arg: ["$1"]"
  if [ -d $1 ];then
    echo "dir is ok ... "$1
    echo "swaping bList to one from arg ..."
    bList=$1

  else
    exit 1

  fi
fi

echo "list to build:
"${bList}
echo "otdm dir:   "${rootDir}
echo "wiki dir:   "${wikiDir}

#exit 1
bIndex="# otdm index\n\n
This is a automatic list of family packages with subjects in them.\n\n
\n\n"

for o in ${bList}
do
  wF=${wikiDir}"/"${o}".md"
  cowsay "  wiki for: "${o}"
  "
  echo "" > ${wF}
  index=""

  bIndex=${bIndex}"\n\n---\n\n## "${o}"\n\n"


  echo "- "${o}" checking Description... "${wF}
  if [ -f ${rootDir}"/"${o}"/DEBIAN/control" ]
  then




    echo "
## Automatic information from "${o}" .deb/control
" >> ${wF}

    echo "  is .deb with control direct to .md"
    sed ':a;N;$!ba;s/\n/\n\n/g'  ${rootDir}"/"${o}"/DEBIAN/control" >> ${wF}
    #sed -i "s/\n/\n\n/g" ${wF}


    echo "checking if can build dependency list ...."
    depS=`cat ${rootDir}"/"${o}"/DEBIAN/control" | grep -v "# Depends:"| grep Depends`
    if [ $? = "0" ]
    then
      echo "
## Dependencies:
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

      echo -e "\n\n---\n\n">> ${wF}

    fi





    homPageDone="0"
    homPage=`cat ${rootDir}"/"${o}"/DEBIAN/control" | grep Homepage`
    if [ $? = "0" ]
    then




      echo "  have homepage "${homPage}

      urlIs=`echo ${homPage}|awk '{print $2}'`
      echo "  urlIs:"${urlIs}"------------------"
      if [ ${urlIs} = "https://github.com/yOyOeK1/oiyshTerminal" ]
      then
        echo "skip... it's going to main manual."
      else
        echo "ok try to extract some info...."
        pathToMd=`echo ${urlIs} | \
          sed -r 's|https://github.com/yOyOeK1/oiyshTerminal||g' | \
          sed -r 's|tree/main/||g' `
        echo "  loking in ... "${rootDir}${pathToMd}"/README.md"
        if [ -f ${rootDir}${pathToMd}"/README.md" ]
        then
          echo "have readmy!"
          #https://github.com/yOyOeK1/oiyshTerminal/raw/main/ySS_calibration/screenShots/ilooNav3D_ver0.1.png
          cat ${rootDir}${pathToMd}"/README.md" | \
            sed -r 's|]\(./|]\(https://github.com/yOyOeK1/oiyshTerminal/raw/main/'${pathToMd}'/|g' >> ${wF}
          homPageDone=1

        fi

      fi


    fi


    echo "checking if have README in home directory..."
    if [ ${homPageDone} = "1" ]; then
      echo "  skip... main is home page"
    else

      echo "----------------------"
      echo ${rootDir}
      yssSiteName=`echo ${o}| sed 's|otdm-yss-||g'`
      echo "yssSiteName: ["${yssSiteName}"]"
      if [ -d ${otDir}"/ySS_calibration/sites/"${yssSiteName} ];then
        echo "is yss-site name !! "${yssSiteName}
      else
        echo "rogular directory"
      fi

      rListInHome=`find ${rootDir}"/"${o}"/" | grep README`
      for rH in ${rListInHome}; do
        echo "found readme by find... "${rootDir}"/"${o}"/"
        echo "f: "${rH}
        #echo "wF now-------------"
        #cat ${wF}
        #echo "-------------- end wF"


        if [ -f ${rootDir}"/"${o}"/DEBIAN/isYssSite" ];
        then
          echo "have .isYssSite .... "${rootDir}"/"${o}"/DEBIAN/isYssSite"
          echo "using url from ./DEBIAN/isYssSite"
          urlToSwap=`cat ${rootDir}"/"${o}"/DEBIAN/isYssSite"`
          echo "  got url to swap from file: "${urlToSwap}
          pathToFile2="https://github.com/yOyOeK1/oiyshTerminal/raw/main/ySS_calibration/"${urlToSwap}
        else

          urlToSwap="https://github.com/yOyOeK1/oiyshTerminal/raw/main"
          pathToFile2=$pathToFile
        fi

        pathToFile=`echo ${rH} | \
          sed -r 's|'${rootDir}'|'${urlToSwap}'|g' | \
          sed -r 's|/README.md||g' | sed -r 's|/README||g'`

        echo "-------- rH ..... "${rH}
        echo "------------pathToFile ... "${pathToFile}
        echo "------------pathToFile2 ... "${pathToFile2}
        echo "------------rootDir .... "${rootDir}
        echo "------------urlToSwap .... "${urlToSwap}



        cat ${rH} | \
          sed -r 's|]\(./|]\('${pathToFile}'/|g' | \
          sed -r 's|]\(../|]\('${pathToFile2}'/../|g' >> ${wF}
        echo "
---
        " >> ${wF}
      done

    fi


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

    echo -n '[index](./otdm-index)  ' >> ${wF}
    for d in ${bList}; do
      echo -n "["`echo ${d}|sed 's|otdm-||g'`"](./"${d}")  " >> ${wF}
    done


    echo "building index ...."
    indexIn=`cat ${wF} | grep '# ' | sed 's|###|##|g' | sed 's|###|##|g' | sed 's|##|-|g'`
    #echo "  have keys:"${indexIn}
    indexStr=""
    while read p; do
      li=`echo ${p} | grep '# ' |  sed 's|-# ||g' | sed 's|####|#|g' | sed 's|###|##|g' | sed 's|###|##|g' |sed 's|##|#|g' | sed 's|#|-|g'| sed 's|:||g' | grep "-"`
      if [ $? = "0" ]
      then
        #echo "p["${p}"] to li["${li}"]"


        echo "["${li}"]"
        case ${li} in
          "- otdm family" )
            echo "- otdm family ... skip"
            ;;
          "- Dependencies" )
              echo "- Dependencies ... skip"
              indexStr=${indexStr}"- [x] [Dependencies](#Dependencies)"'\n\n'
              bIndex=${bIndex}"- [x] [Dependencies]("${o}"#Dependencies)"'\n\n'
            ;;
          * )

            ##Automatic-information-from-otdm-nrf-yss-debcontrol
            ##automatic-information-from--otdm-nrf-yss-debcontrol

            s=`echo ${li}| sed 's|- ||g'`
            l=`echo ${s}|sed 's| |-|g'|sed 's|/||g'| sed 's|\.||g' | sed 's|(||g'| \
              sed 's|)||g' | sed "s|'||g" | sed 's|?||g' | sed 's|!||g' `

            ## making profix for count of shashes
            pref=""
            shC=0
            for ss in `echo ${p}|sed 's|#|# |g'`; do
              if [ ${ss} = "#" ];then
                shC=$[$shC+1]
                pref="   .   "${pref}
                if [ ${shC} = "1" ]; then
                  pref=""
                fi
              fi
            done
            #echo "shCount:"${shC}

            echo ${li} | grep "Automatic information"
            if [ $? = "0" ]; then
              echo "- automatic info .... mod"
              indexStr=${indexStr}"- [x] [Info from deb package](#"${l}")"'\n\n'
              bIndex=${bIndex}"- [x] [Info from deb package]("${o}"#"${l}")"'\n\n'

            else
              indexStr=${indexStr}${pref}"- ["${s}"](#"${l}")"'\n\n'
              bIndex=${bIndex}${pref}"- ["${s}"]("${o}"#"${l}")"'\n\n'

            fi
            ;;
        esac




      fi
    done < ${wF}

    #echo "index: "
    #echo -e ${indexStr}

    echo -e "## Legend:

"${indexStr}"

" > ${wF}"_legend"
  cat ${wF} >> ${wF}"_legend"
  mv ${wF}"_legend" ${wF}


  fi

  if [ ${o} = "otdm-nrf-yss" ]; then
    #exit 1
    echo "exit no"
  fi

done


#echo "--------- exit"
#exit 1

echo -e ${bIndex} > ${wikiDir}"/otdm-index.md"
echo -e "
---
**generated**: "`date` >> ${wikiDir}"/otdm-index.md"

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
    ;;
  esac
else
  echo "nothing to push"
fi
cd ${rootDir}
