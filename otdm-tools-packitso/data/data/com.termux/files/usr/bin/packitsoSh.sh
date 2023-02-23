#! /bin/bash
echo -n "- = [ Pack it so - .sh set init to extend shell command  ..... "


eHelp(){
  echo 'Help ------
-help - print this help
-test - do basic tests

-setPackGit [pathToDir] - set up git repository for directory
  '
}

# To init directory with git hub repository in it ..
# $1 - [pathToDir] - set up git repository for directory
#
# Example
# $ -setPackGit ./p-nrf-hhbell-tts ; echo $?" < - my exit test"
# *to init git it this directory with data from if is packitso.json*
pShSetPackGit(){
  ar1="$1"

  dirPath=$(pwd)"/$ar1"
  projectDir=$(basename "$dirPath")

  echo "Setting up git in path [$dirPath]"

  #exit 9

  sPwd=$(pwd)
  echo "Start pwd: $sPwd"
  echo "Dir Path: $dirPath"
  echo "----------------------------------------"

  #exit 1


  if [ -d "$dirPath" ];then
    echo "Directory .... OK"

    echo "- change directory to ... "$dirPath
    cd $dirPath

    echo -n "- it there a git repo .... "
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

    else

      echo "Ok ish? setting it up ... "
      echo "Running git commands ... "

      #echo -n '[ '"$(git init)"'] '
      isPis=0

      if [ -f ./packitso.json ];then
        echo -n "Buf wait ! there is a packitso.json ! ... extracting email, user ..."
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

      #echo "-- [$uEmail]         [$uName] ----- EXIT 1 !!"
      #exit 1
      set -e
      echo " [init: "
      git init
      echo " :init] [user.email: "
      git config --local user.email "$uEmail"
      echo " :user.email] [user.name: "
      git config --local user.name "$uName"
      echo -n " :user.name] [yyyyy... "
      echo "Nice done! continue ..... "

      if [ "$isPis" = "1" ];then
        echo "It's a packitso.json so adding .gitignore known..."
        echo "packitso.json_*" >> ./.gitignore
        git add .gitignore

        echo "Staging packitso.json ... "
        git add packitso.json
        git commit -m "Init commit of packitso.json for [ $projectDir ]"


      fi


      echo "-------------------"
      echo "Result of operation is [$r]"
      echo "TODO - no continue? thd "
      exit 0

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
    else
      echo "Wrong arg count. EXIT 1"
      exit 1
    fi
    ;;
    "-help" )
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
