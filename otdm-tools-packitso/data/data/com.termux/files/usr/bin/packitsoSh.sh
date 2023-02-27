#! /bin/bash
set -e

echo -n "- = [ Pack it so - .sh set init to extend shell command  ..... "

eHelp(){
  echo 'Help ------
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
