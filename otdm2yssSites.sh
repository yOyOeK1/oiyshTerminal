
echo "---- otdm to yss sites packer ----"
otDir="/OT"
yssDir=${otDir}"/ySS_calibration"

sites=`cat ${yssDir}"/sites/sites.json"`


function buildYssSite(){
  echo "buildYssSite "
  #echo "path to site: "$1
  bName=`basename $1`
  echo "bName: "${bName}

  dpkgCorName=`echo "$bName"$2 | tr '[:upper:]' '[:lower:]' | sed 's|_|-|g' | sed 's|\.|-|g'`
  echo "dpkg correct name: ["${dpkgCorName}"]"

  raport=${raport}" otdm-yss-"${dpkgCorName}

  srcDir=$1
  sDir=${otDir}"/otdm-yss-"${dpkgCorName}
  phDir=${sDir}"/data/data/com.termux/files/home/.otdm/yss-"${dpkgCorName}
  phSite=${phDir}"/site.json"
  lSrc="/data/data/com.termux/files/home/.otdm/yss-"${dpkgCorName}
  lDest=${sDir}"/data/data/com.termux/files/home/.otdm/yss/sites/"${bName}

  echo "checking if have dir .... "${phDir}
  if [ -d ${phDir} ];then
    echo "OK"

  else
    echo "not there!"
    mkdir ${sDir}
    mkdir ${sDir}"/DEBIAN"
    mkdir -p ${phDir}
    mkdir -p ${sDir}"/data/data/com.termux/files/home/.otdm/yss/sites/"
    ln -s ${lSrc} ${lDest}
  fi

  # clear and copy all stuff
  rm -rf ${phDir}"/"
  echo "src: "${srcDir}" to "${phDir}
  cp -rf ${srcDir}"/" ${phDir}


  if [ -f ${phSite} ];then
    echo "have ./site.json info ...."
    cat ${phSite} | jq '.'
    echo "building control...."
    cont="Package: otdm-yss-"${dpkgCorName}"\n\
Version: "`cat ${phSite}| jq '.ver' -r`"\n\
Section: base\n\
Priority: optional\n\
Architecture: all\n\
Maintainer: `cat ${phSite}| jq '.author' -r`\n"
    cat ${phSite} | jq '.otdm."url-home"' -r | grep "http" > /dev/null
    if [ $? = "0" ];then
      cont=${cont}"Homepage: "`cat ${phSite} |  jq '.otdm."url-home"' -r`"\n"
    fi
    cont=${cont}"Description: "`cat ${phSite}| jq '.desc' -r`"\n"


    echo -e ${cont} > ${sDir}"/DEBIAN/control"

  fi


  #cat `cat ./config.json | jq '.otdm.prefix' -r`"/yss/sites/sites.json" | jq '. .dirs+=["${dpkgDir}"]'

  echo "cp post inst|rm ..."
  echo 'dpkgDir="'${bName}'"' > ${sDir}"/DEBIAN/postinst"
  #echo 'ln -s "'${lSrc}'" "'${lDest}'"' >> ${sDir}"/DEBIAN/postinst"
  cat ${otDir}"/otdm2yssSiteDebian_postinst" >> ${sDir}"/DEBIAN/postinst"
  chmod +x ${sDir}"/DEBIAN/postinst"

  echo 'dpkgDir="'${bName}'"' > ${sDir}"/DEBIAN/prerm"
  #echo 'rm "'${lDest}'"' >> ${sDir}"/DEBIAN/prerm"
  cat ${otDir}"/otdm2yssSiteDebian_prerm" >> ${sDir}"/DEBIAN/prerm"
  chmod +x ${sDir}"/DEBIAN/prerm"

}

raport=""

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
