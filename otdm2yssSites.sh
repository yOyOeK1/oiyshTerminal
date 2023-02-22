
echo "---- otdm to yss sites packer ----"
otDir="/OT"
yssDir=${otDir}"/ySS_calibration"

sites=`cat ${yssDir}"/sites/sites.json"`


function buildYssSite(){
  echo "buildYssSite ----------------------------------"
  #echo "path to site: "$1
  buildDir=$1
  bName=`basename $1`
  echo "bName:              ["${bName}"]"

  dpkgCorName=`echo "$bName"$2 | tr '[:upper:]' '[:lower:]' | sed 's|_|-|g' | sed 's|\.|-|g'`
  echo "dpkg correct name:  ["${dpkgCorName}"]"

  raport=${raport}" otdm-yss-"${dpkgCorName}

  srcDir=$1
  sDir=${otDir}"/otdm-yss-"${dpkgCorName}
  phDir=${sDir}"/data/data/com.termux/files/home/.otdm/yss-"${dpkgCorName}
  phSite=${phDir}"/site.json"
  lSrc="/data/data/com.termux/files/home/.otdm/yss-"${dpkgCorName}
  lDest=${sDir}"/data/data/com.termux/files/home/.otdm/yss/sites/"${bName}


  if [ ${deepClean} = "1" ]; then
    if [ -d ${sDir} ]; then
      echo " [x] - deep clean...."
      #echo "rm -rf ${sDir}"
      rm -rf ${sDir}
    fi
  fi

  echo "checking if have dir .... "${phDir}
  if [ -d ${phDir} ];then
    echo "OK"

  else
    echo "not there!"
    mkdir ${sDir}
    mkdir ${sDir}"/DEBIAN"
    #echo "bName:"${bName}
    #echo "buildDir:"${buildDir}
    buildDirBN=`basename ${buildDir}`
    #echo "buildDirBN:"${buildDirBN}
    tgpd=`echo ${buildDir} | sed 's|/'${buildDirBN}'||g'`
    #echo "to get parent dir: "$tgpd
    parentDir=`basename $tgpd`
    echo "parent dir:       ["${parentDir}"]"
    echo ${parentDir}"/"${bName} > ${sDir}"/DEBIAN/isYssSite"
    #exit 1

    #echo "make debian/source .."
    #mkdir -p ${sDir}"/DEBIAN/source"
    #echo "    /options for ignoring .gitignore ...."
    #echo 'tar-ignore = ".gitignore"' > ${sDir}"/DEBIAN/source/optaions"

    mkdir -p ${phDir}
    mkdir -p ${sDir}"/data/data/com.termux/files/home/.otdm/yss/sites/"
    ln -s ${lSrc} ${lDest}


  fi

  echo '*' > ${sDir}"/.gitignore"
  echo `date +%y%m%d%H%M%S` > ${sDir}"/DEBIAN/otdm_bNR"

  # clear and copy all stuff
  rm -rf ${phDir}"/"
  echo "src: "${srcDir}" to "${phDir}
  cp -rf ${srcDir}"/" ${phDir}



  if [ -f ${phSite} ];then
    echo " [x] - have ./site.json info ...."
    #cat ${phSite} | jq '.'
    echo "  building control...."

    phSite=${srcDir}"/site.json"
    echo "  settin new phSite ... "${phSite}
    echo "  looking for defined .otdm.depends .... phSite .. "${phSite}
    depsFromJ=`cat ${phSite} | jq '.otdm.depends' -r`

    cont="Package: otdm-yss-"${dpkgCorName}"\n\
Version: "`cat ${phSite}| jq '.ver' -r`"\n\
Section: base\n\
Priority: optional\n\
Architecture: all\n\
Maintainer: `cat ${phSite}| jq '.author' -r`\n"

    set +e
    cat ${phSite} | jq '.otdm."url-home"' -r | grep "http" > /dev/null
    if [ "$?" = "0" ]
    then
      cont=${cont}"Homepage: "`cat ${phSite} |  jq '.otdm."url-home"' -r `"\n"
    else
      echo "no Homepage in site.json use auto...."
      #
      cont=${cont}"Homepage: https://github.com/yOyOeK1/oiyshTerminal/tree/main/ySS_calibration/sites/"${bName}"\n"
    fi
    set -e
    #echo "--- exit ----"
    #exit 1

    echo "  [?] - dependencies from .site.json ... "${depsFromJ}
    if [ "${depsFromJ}" = "null" ]
    then
      echo " [ ] - no dependency defined using only otdm-yss"
      cont=${cont}"Depends: otdm-yss\n"
    else
      echo "  [x] - using from .site.json .... "${depsFromJ}
      cont=${cont}"Depends: "${depsFromJ}"\n"
    fi

    cont=${cont}"Description: "`cat ${phSite}| jq '.desc' -r`"\n"


    echo -e ${cont} > ${sDir}"/DEBIAN/control"

  fi


  #cat `cat ./config.json | jq '.otdm.prefix' -r`"/yss/sites/sites.json" | jq '. .dirs+=["${dpkgDir}"]'

  echo " [x] - cp post inst|rm ..."
  echo 'dpkgDir="'${bName}'"' > ${sDir}"/DEBIAN/postinst"
  #echo 'ln -s "'${lSrc}'" "'${lDest}'"' >> ${sDir}"/DEBIAN/postinst"
  cat ${otDir}"/otdm2yssSiteDebian_postinst" >> ${sDir}"/DEBIAN/postinst"
  chmod +x ${sDir}"/DEBIAN/postinst"

  echo 'dpkgDir="'${bName}'"' > ${sDir}"/DEBIAN/prerm"
  #echo 'rm "'${lDest}'"' >> ${sDir}"/DEBIAN/prerm"
  cat ${otDir}"/otdm2yssSiteDebian_prerm" >> ${sDir}"/DEBIAN/prerm"
  chmod +x ${sDir}"/DEBIAN/prerm"

  echo "build after this is set to ..."${buildAfterThis}
  if [ ${buildAfterThis} = "1" ]; then
    echo " [x] - build after this is set ..... building"
    #echo ${otDir}"/otdmMake.sh" "otdm-yss-"${dpkgCorName}
    ${otDir}"/otdmMake.sh" "otdm-yss-"${dpkgCorName}
    echo "      ....... build done status "$?
  fi

}

raport=""

deepClean=0
buildAfterThis=0

echo "loop over args"
for ar in $*; do
  echo "arg:["${ar}"]"

  case $ar in
    "-d")
      echo "Arg: set -d clean target directory before build"
      deepClean="1"
    ;;
    "-b")
      echo "Arg: set -b build after this prebuild is done"
      buildAfterThis="1"
    ;;
    "?" | "-h" )
      echo "HELP----------

    -d - clean target directory before build
    -b - build after this prebuild is done
      "

      exit 1

    ;;
  esac

done

#exit 1

echo "every error exit ....."
set -e


for d in `echo ${sites} | jq '.dirs[]' -r`; do
  echo "internal ... "${yssDir}"/sites/"${d}
  buildYssSite ${yssDir}"/sites/"${d}
done

for d in `echo ${sites} | jq '.externals[]' -r`; do
  echo "external ... "${d}
  buildYssSite ${d} "E"
done

echo "End raport"
echo ${raport}

echo "Stored in.. "${otDir}"/otdmBuildYssSitesList.sh"
echo "  as bYssSitesList"
echo 'bYssSitesList="'${raport}'"' > ${otDir}"/otdmBuildYssSitesList.sh"
