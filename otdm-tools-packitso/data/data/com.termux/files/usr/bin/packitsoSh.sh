#! /bin/bash
set -e

packitsoShVER="0.0.7.17"

echo -n "- = [ Pack it so ($packitsoShVER)- .sh set shell command to help it making packitso.jsot to .deb process ..... "

eHelp(){
  echo 'Help ------ ($packitsoShVER)
-help - print this help
-test - do basic tests

-setPackGit pathToDir [force]- set up git repository for directory
  force [0:default|1] - to force init even if dir is in repository parent all ready
  exitCodes:
    0 - ok
    1 - if init was on directory in other repo (if you know what you are doing add force="1")
    6 - if .git is existing
    12 - wrong author in packitso.json
    128 - wrong author in packitso.json

-debianize pathToPackitso - make debiar ready directory for build from shown packitso.json file
  exitCodes:
    0 - ok



-DEBIANposti [workKey] [iKey] [iUid] [wFile] - to make DEBIAN/postinst set.
    workKey - key use in driverProto to identify worker to make the task
    iKey - installed instance of work identification string key example Node-RED flows label
    iUid - uid to use as stirng to matche example Node-RED flow name iKey="label" iUid will be flow name se put "my flow3"
    wFile - input data to installl
    # test cmd: ./packitsoSh.sh -DEBIANposti dnrfByUid label hu2p-test1 /tmp/m2.json; echo -e \\n\\n$?"<-- EXIT CODE"
    # where m2.json is correct flow with label and name

-


---- 4 developing -----
-4devUpgrade [package] - [:default|name] one command to update clean upgrade at apt system this pack or if set do it on selected pack

  '
}


doReqListRun(){
  ## fast list build
  mainList=$( ls -alht `find "$dirPath" | grep json` | \
  sed 's| '$dirPath'| .|g' )

  echo "-------------------got mainList"
  echo $mainList
  echo "============================"


  echo "$mainList" | while read -r line; do
    echo "line --"$line
    fPath=$(echo "$line" | awk '{print $9}')
    fullPath="$dirPath/$fPath"
    #if [ -d  $fullPath ]; then
    echo "------"
    echo -e "fPath: $fPath\n"

  done
    ## fast list build

}




# To init directory with git hub repository in it ..
# $1 - [pathToDir] - set up git repository for directory
# $2 - [0:default|1] - to make git init if is in different repository
#
# Example
# $ -setPackGit ./p-nrf-hhbell-tts ; echo $?" < - my exit test"
# *to init git it this directory with data from if is packitso.json*
pShSetPackGit(){
  ar1="$1"
  forceItDiff="$2"

  #echo "got force it if it s a sub directory of repo: $forceItDiff"

  if [ "$(expr index "$ar1", '/' )" = "1" ];then
    echo "use from root path ...."
    dirPath="$ar1"
  else
    echo "use ./ path ...."
    dirPath=$(pwd)"/$ar1"
  fi
  projectDir=$(basename "$dirPath")
  sPwd=$(pwd)
  echo "Setting up git in path [$dirPath]"
  echo "Start pwd: $sPwd"
  echo "Dir Path: $dirPath"
  echo "----------------------------------------"

  #exit 1


  if [ -d "$dirPath" ];then
    echo "Directory .... OK"

    if [ -d "$dirPath/.git" ];then
      echo "There is a [$dirPath/.git] it it EXIT 6"
      exit 6
    fi


    echo -n "Loading .... "
    . /data/data/com.termux/files/usr/bin/otdmFC.sh

    echo "- change directory to ... "$dirPath
    cd $dirPath

    echo -n "- it there a git repo .... "
    if [ "$forceItDiff" = "1" ];then
      echo "!! Overrite by !! not checking parent repo ...!!"

    else

      if [ "$(git rev-parse --show-toplevel 2>&1 >> /dev/null ; echo $?)" = "0" ];then
        cRepo="$(git rev-parse --show-toplevel)"
        echo "Yes part of [$cRepo] repository"

        rComRes=`expr "$dirPath" "=" "$cRepo"`
        if [ "$rComRes" = "1" ];then
          echo "  same repository so "
          echo "Directory have repository it it. EXIT 2"
          exit 2
        else
          echo "  different repository oiysh no action? EXIT 1"
          exit 1
        fi
      fi

    fi
    #echo -n '[ '"$(git init)"'] '
    isPis=0

    if [ -f ./packitso.json ];then
      echo -n "- there is a packitso.json ! ... extracting email, user ..."
      pAuth=`cat ./packitso.json | jq '.packitso.author' -r`
      echo -n ": Got author [$pAuth] :"

      eS=$(expr index "$pAuth" "<")
      eAmp=$(expr index "$pAuth" '@')
      eE=$(expr index "$pAuth" ">")

      eSETestRes0=$(expr "$eS" "<" "$eAmp")
      eSETestRes1=$(expr "$eAmp" "<" "$eE")
      eTest=$(expr "$eSETestRes0" "=" "$eSETestRes1")
      #echo "eTest result is $eTest"
      uName=$(expr substr "$pAuth" 1 $[$eS-1] )
      uEmail=$(expr substr "$pAuth" $[$eS+1] $[$eE-$eS-1])
      if [ "$eTest" = "1" ];then
        echo "Go Go Go ..."
        isPis=1

      else
        echo ""
        echo "Error"
        echo "Wrong data in packitso.json Wrong syntax or no author. Expecting \"name lastName <ema@ils.com>\" "
        echo "Extracted string [$pAuth]"
        echo "EXIT 12"
        exit 12

      fi



    else
      # getting from terminal
      # prompting
      echo "No user name for repository:"
      read uName
      echo "No user email for repository:"
      read uEmail

    fi

    set -e
    echo -n "- make carusela ..... "
    # it's a function use it as function it returns / exits !
    r=`otdmCaruselaFileOrDir "$dirPath"`
    echo "result of carusela [$?]"
    echo "DONE"
    #echo "$? --- exit code of carusela"
    #echo "--- exit testing -- EXIT 99"
    #exit 99

    #echo "-- [$uEmail]         [$uName] ----- EXIT 1 !!"
    #exit 1
    echo "- running git commands ... "

    git init
    git config --local user.email "$uEmail"
    git config --local user.name "$uName"

    if [ "$isPis" = "1" ];then
      echo "- packitso.json so stage / commit what we know ..."
      echo '/packitso.json_*' >> ./.gitignore
      #git add .gitignore
      git add packitso.json
      git commit -m "Init commit of packitso.json for [ $projectDir ]"

    fi



    echo ""
    echo "- [x] change directory starting pwd ... "$sPwd
    cd $sPwd

    echo "--- not -- finish... EXIT 0"
    exit 0

  else
    echo "Error it's not a directory. EXIT 1"
    exit 1
  fi

}


# To init directory with DEBIAN things to make build from it on base of packitso.json
# $1 - path to packitso.json
pSHDebianize(){
  packitsoJPath="$1"
  # TODO FIX THIS !!!!
  OTDir="/OT"
  #echo "got force it if it s a sub directory of repo: $forceItDiff"

  if [ "$(expr index "$packitsoJPath", '/' )" = "1" ];then
    echo "use from root path ...."
    pJPath="$packitsoJPath"
  else
    echo "use ./ path ...."
    pJPath=$(pwd)"/$packitsoJPath"
  fi
  projectDir=$(basename "$pJPath")
  sPwd=$(pwd)
  echo "pJPath Path: $pJPath"
  echo "----------------------------------------"

  echo "Pre check ......"

  if [ -f "$pJPath" ]; then
    echo "packitso.json .... exists!"
  else
    echo "No packitso.json in the path. EXIT 3"
    exit 3
  fi



  echo -n "Extracting ...."
  pAuth=`cat "$pJPath" | jq '.packitso.author' -r`
  #echo -n ": Got author [$pAuth] :"

  eS=$(expr index "$pAuth" "<")
  eAmp=$(expr index "$pAuth" '@')
  eE=$(expr index "$pAuth" ">")

  eSETestRes0=$(expr "$eS" "<" "$eAmp")
  eSETestRes1=$(expr "$eAmp" "<" "$eE")
  eTest=$(expr "$eSETestRes0" "=" "$eSETestRes1")
  #echo "eTest result is $eTest"
  uName=$(expr substr "$pAuth" 1 $[$eS-1] )
  uEmail=$(expr substr "$pAuth" $[$eS+1] $[$eE-$eS-1])
  if [ "$eTest" = "1" ];then
    echo -n " .. author OK .. "
  else
    echo "No correct data in packitso.json EXIT 4"
    exit 4
  fi

  pVer=`cat "$pJPath" | jq '.packitso.ver' -r`
  echo -n " . ver[$pVer] . "
  pName=`cat "$pJPath" | jq '.packitso.name' -r`
  echo -n " . name[$pName] . "
  pDesc=`cat "$pJPath" | jq '.packitso.desc' -r`
  echo -n " . desc(len)["$(expr length "$pDesc")]" . "
  pDeps=`cat "$pJPath" | jq '.packitso["otdm.deps"]' -r`
  echo -n " . deps[$pDeps] . "

  echo " ... extracting DONE"


  echo "Dir DEBIAN work ....."

  otdmHomeDirName="p-$pName"
  tDir="$OTDir/otdm$otdmHomeDirName"
  pInstDir="$tDir/data/data/com.termux/files/home/.otdm/$otdmHomeDirName"
  aiDir="/data/data/com.termux/files/home/.otdm/$otdmHomeDirName"
  echo -n "Dir DEBIAN target [$tDir] story is "
  echo -n "That otdm home directory name will be .otdm/$otdmHomeDirName "
  echo -n "Ather way of saing from root looking $aiDir after installation. "

  if [ -d "$tDir" ];then
    echo "Short Is existing EXIT 4"
    exit 4

  else
    echo -n "In so new that don't have a target directory. "
    echo -n "So will make it. "
    mkdir "$tDir"

    echo -n "And the directories needed to make build. "
    mkdir "$tDir/DEBIAN"
    echo -e \\n"Project installed directory $pInstDir "
    mkdir -p "$pInstDir"

    srcDirAsFiles="$(dirname $pJPath)"
    echo "Copy all project files from $srcDirAsFiles to $pInstDir .... "
    find "$srcDirAsFiles" -type "f" | while read -r line;do
      echo "file to copy: "$line;
      cp "$line" "$pInstDir/"
    done
    echo "------ Then. "

    echo -n "Will live in $pInstDir as his pre build home. "

    echo -n "Putting ./DEBIAN/control .. "
    echo 'Package: otdm'"$otdmHomeDirName"'
Version: '"$pVer"'
Section: otdm
Priority: optional
Architecture: all
Depends: '"$pDeps"'
#Recommends: python3-pip, python3-apt | python-apt
#Pre-Depends: otdm-installer (>=0.1) | otdm-installer-dummy (>=0.1)
Maintainer: '"$uName"' <'"$uEmail"'>
Tag: oiyshTerminal, otdm, packitso
Description: '"$( echo -n "$pDesc" )"'   *This is a automatic build from packitso.json to .deb '`date`' packitsoSh.sh ('"$packitsoShVER"')*
' > "$tDir/DEBIAN/control"

  fi

  echo ""

  echo -n "Pre Build RC ... "
  canDoPre="0"
  if [ -f $tDir"/DEBIAN/preBuildRC" ]; then
    echo "pressent"
  else
    echo "not there so can do."
    canDoPre="1"
  fi



  if [ "$canDoPre" = "1" ];then
    pWorksLen=`cat "$pJPath" | jq '.works | length' -r`
    echo "Checking works list... $pWorksLen"
    tf=$tDir"/DEBIAN/preBuildRC"
    if [ "$pWorksLen" = "0" ]; then
      echo "  empty."
    else
      echo "  leths go ..."
      wi=0

      ## TODO make universal install / remove base on existing otdm-nrf- otdm-grafana-
      ##
      echo -e '# packitso automatic build
# ver ('"$packitsoShVER"') build  '"$(date)"'
#
# '\\n > $tf
      cat "$tf" > $tDir"/DEBIAN/preinst"
      cat "$tf" > $tDir"/DEBIAN/prerm"
      cat "$tf" > $tDir"/DEBIAN/postinst"
      cat "$tf" > $tDir"/DEBIAN/postrm"

      chmod +x $tDir"/DEBIAN/preinst"
      chmod +x $tDir"/DEBIAN/prerm"
      chmod +x $tDir"/DEBIAN/postinst"
      chmod +x $tDir"/DEBIAN/postrm"



      seq 0 1 $[$pWorksLen-1] | while read -r line; do

        echo "# in work [$wi] --------- "

        wSrcName=`cat "$pJPath" | jq ".works[$wi].srcName" -r`
        aiUid=`cat "$pJPath" | jq ".works[$wi].name" -r`
        wKeyWord=`cat "$pJPath" | jq ".works[$wi].keyWord" -r`
        wIdent=`cat "$pJPath" | jq ".works[$wi].ident" -r`
        aiKey=`cat "$pJPath" | jq ".works[$wi].iKey" -r`
        #aiUid=`cat "$pJPath" | jq ".works[$wi].iUid" -r`
        wOFile=`cat "$pJPath" | jq ".works[$wi].oFile" -r`
        wExtraArgs=`cat "$pJPath" | jq ".works[$wi].extArgs" -r`
        wIdentUid=`cat "$pJPath" | jq ".works[$wi].identUid" -r`
        wDoIt="1"


        if [ "$wSrcName" = "null" ]; then
          wDoIt="0"
        fi
        if [ "$wIdent" = "null" ]; then
          wDoIt="0"
        fi

        if [ "$wOFile" = "" ]; then
          wOFile="work_""$wi""_""$wSrcName""_""$wIdentUid"".result"
          echo "- oFile is empty so will use ... $wOFile"
        else
          echo "- oFile is ... $wOFile"
        fi

        if [ "$wExtraArgs" = "" ]; then
          wExtArg=""
        elif [ "$wExtraArgs" = "null" ]; then
          wExtArg=""
        else
          echo "- setting extra args"
          wExtArg=" $wExtraArgs"
        fi


        wHeader="# in work [$wi] : [ $wSrcName ( $wKeyWord ) ] / [ $wIdent ] extraArgs[$wExtArg] then to [ $wOFile ]
#       driverProto use iKey [$aiKey] : [ $aiUid ] is identificator of installed instance "
        echo "$wHeader"

        if [ "$wDoIt" = "1" ];then
          echo "GREEN light - go with stacking .... "

          # to preBuildRC
          echo -e \\n'#'"$wHeader"'
# getting product in prebuild ...
#
'"otdmTools.py -$wKeyWord \"$wIdentUid\" -oFile \"$pInstDir/$wOFile\"$wExtArg"'
if [ "$('"cat \"$pInstDir/$wOFile\" "')" = "false" ];then
  echo "Error when prebuilding geting data ... EXIT 3"
  exit 3
fi


'\\n >> $tf

          # to DEBIAN/postinst
          fileToInject="$aiDir""/""$wOFile"
          echo -e \\n'#'"$wHeader"'
# post install steps ...
#
echo "packitso automatic postinst script for "

/data/data/com.termux/files/usr/bin/packitsoSh.sh \
-DEBIANposti "'"$wKeyWord"'" "'"$aiKey"'" "'"$aiUid"'" "'"$fileToInject"'";
r="$?"
if [ "$r" = "0" ];then
  echo "OK"
else
  echo -e \\n\\n$r"<-- EXIT CODE"
  exit $r
fi


echo "--------------------------------------------------"
'\\n >> $tDir"/DEBIAN/postinst"

          #echo -e \\n'#'"$wHeader" >> $tDir"/DEBIAN/postinst_$wi"


        fi


        wi=$[$wi+1]

      done


      echo -e \\n\\n'#
#
# packitso automatic build
# ver ('"$packitsoShVER"') build  '"$(date)"'
#' >> $tf



    fi

  fi

  echo "So it is going nice with the debianization."
  echo "Tree of $tDir"
  tree -a "$tDir"


  echo "... Dir DEBIAN work DONE"


  exit 0

}


#"[workKey] [iKey] [iUid] [wFile]"
#pDebPostInst "$2" "$3" "$4" "$5"
#
# test cmd: ./packitsoSh.sh -DEBIANposti dnrfByUid label hu2p-test1 /tmp/m2.json; echo -e \\n\\n$?"<-- EXIT CODE"
# where m2.json is correct flow with label and name
#
pDebPostInst(){
  workKey="$1"
  iKey="$2"
  iUid="$3"
  wFile="$4"

  echo "OT - DEBIAN/postinst : universal ....."
  echo "As onput: [workKey]   [iKey]  [iUid]     [wFile]"
  echo "          [$workKey]  [$iKey] [$iUid]  [$wFile]"



  echo "Pre check ...."
  echo -n "- work file ... "
  if [ -f "$wFile" ];then
    echo "in place OK"
  else
    echo "No wFile in shown argument [$wFile] EXIT 11"
    exit 11
  fi


  otc="/data/data/com.termux/files/usr/bin/otdmTools.py"
  set +e
  r=`which "$otc" >> /dev/null; echo $?`
  set -e
  if [ "$r" != "0" ];then
    echo "No otdmTools.py calling it as $otc EXIT 11"
    exit 11
  fi



  echo "Run otdmTools.py -testEcho2 ...."
  $otc -testEcho2 " its a test of short command to odtmTools.py with offset :) `date`" | while read -r line; do echo -e  '     \_ ot ->  '$line;done
  echo -e "    DONE"\\n\\n



  echo -n "Running -$workKey chkHost ... "
  #set +e
  r=`$otc -$workKey "chkHost" >> /dev/null; echo $?`
  #set -e
  if [ "$r" = "0" ]; then
    echo "OK"
  else
    echo "Eror EXIT 11"
    exit 11
  fi


  echo -n "Checking if work  iKey[$iKey] iUid[$iUid] is not installed now ... "
  oFileT=`tempfile`
  $otc -$workKey "*" -oFile "$oFileT" >> /dev/null
  rJ=`cat "$oFileT" | jq '.[] | select( .'"$iKey"' == "'"$iUid"'")'`
  if [ "$rJ" = "" ];then
    echo "driverProto says it's OK"
  else
    echo -e "is existing ....."\\n"Worker returnd ..."
    echo -e "$rJ"
    echo "So EXIT 21"
    exit 21
  fi


  echo -n "POST'ing it ...."
  $otc -$workKey "1" -act "POST" -iFile "$wFile"



  echo -n "Making reference for uninstallor after POST status ... "
  oFileT="$wFile""_this_"
  $otc -$workKey "*" -oFile "$oFileT"
  echo "will do "'.[] | select( .'"$iKey"' == "'"$iUid"'")'
  rJ=`cat "$oFileT" | jq '.[] | select( .'"$iKey"' == "'"$iUid"'")'`
  if [ "$rJ" = "" ];then
    echo "It not POST correctly EXIT 22"
    exit 22
  else
    md5sum "$oFileT" | awk '{print $1}' > "$oFileT""_md5"
    echo " extracting keys .."
    #echo "got : $rJ"
    echo "$rJ" | jq '. | keys | .[]' -r | while read -r key; do
      val=$(echo "$rJ" | jq ".$key")
      echo " _this__$key : $val"
      echo $val > "$oFileT""_$key"
    done


    ls -alh "$oFileT"*


  fi


  echo ".... OT - DEBIAN/postinst : universal ...DONE"

}




#echo "args count ["$#"]"
if [ "$#" = "0" ];then
  echo "No args. Try -help. EXIT 1"
  exit 1
else
  echo "OK ARGS PARSING.."

  echo -n "[ arg case selector ] --> "
  case "$1" in
    "-test" )
      echo "Arg[-test]"
      echo "runing test ...."
      echo "done"
      exit 0
    ;;
    "-4devUpgrade" )
      echo "Arg[-4devUpgrade]"

      if [ "$#" = "1" ]; then
        pack="otdm-tools-packitso"
      elif [ "$#" = "2" ]; then
        pack="$2"
      else
        echo "Wrong argument count EXIT 10"
        exit 10
      fi


      echo "Will make on [ $pack ] ... purge, update repo, clean, install ... Go"
      uts=`date +%s`
      apt update
      apt clean
      apt reinstall "$pack"
      echo -e \\n\\n"Upgade from packitso of [ $pack ] DONE "$[`date +%s`-$uts]" sec."
      echo


      exit 0
    ;;
    "-setPackGit" )
      echo "Arg[-setPackGit]"
      if [ "$#" = "2" ]; then
        pShSetPackGit "$2"
      elif [ "$#" = "3" ]; then
        echo "force in sub git repo ?"
        pShSetPackGit "$2" "$3"
      else
        echo "Wrong arg count. EXIT 1"
        exit 1
      fi
    ;;
    "-DEBIANposti" )
     echo "Arg[-DEBIANposti]"
     if [ "$#" = "5" ]; then
       echo "ARGS count OK"
                    ##"[workKey] [iKey] [iUid] [wFile]"
       pDebPostInst "$2" "$3" "$4" "$5"
       exit 0
     else
       echo "Wrong arg count. EXIT 1"
       exit 1
     fi

    ;;
    "-debianize" )
      echo "Arg[-debianize]"
      if [ "$#" = "2" ]; then
        pSHDebianize "$2"
      else
        echo "Wrong arg count. EXIT 1"
        exit 1
      fi
    ;;
    "-help"|"-h"|"--help" )
      echo "Arg[-help]"
      eHelp
    ;;
    * )
      echo "NaN arg. Try -help. EXIT 1"
      exit 1
    ;;
  esac


fi

echo " ] = - DONE"
