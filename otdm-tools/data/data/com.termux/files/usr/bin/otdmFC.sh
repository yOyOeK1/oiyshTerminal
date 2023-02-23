
echo "otdm Frequent commands ...."


# $1* - message print to console fol debuging with prefix
# example $ otdmCL "Hello world" '!!'
# > otdmSh: [Hello world !!]
otdmcl(){
  m="$*"
  echo 'otCL: ('${#m}'): :'"$m"
}
otdmCL(){
  otdmcl "$*"
}
otdmCS(){
  cowsay -f moose ${*}
  echo -n "-------------------------oiyshTerminal otdm"
}

otdmNowTimeStamp(){
  echo `date +%s`
}

otdmNowTimeNiceFN(){
  echo `date +%y%m%d_%H%M%S`
}

otdmHelp(){
  echo -e '
  Help of - otdmSh.sh  oiyshTerminal otdmTools family.

  otdmHelp - return help.
  otdmNameSpace - enter terminal to not enter otdm in profix

  otdm name space -> \
      CL|cl $* - ConsoleLog with addition nal info like str len
      CS $* - cowsay wraper echo it end live \\r in it so you can finish with yours..
      ExitMsg $1 $2
        $1 - msg on exit
        $2 - exit code to exit default 1
      NowTimeStamp - echo timestamp now
      NowTimeNiceFN - echo nice time for file name no spaces no special characters
      ExitWithCode $1 - code of exit you want

  '
  otdmCS "
  oiyshTerminal seysh Hi!

  Check rest of otdm family: https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-index
  "
  echo "Sh.sh"
}

otdmExitWithCode(){
  a1="$1"
  otdmCL "Will exit on request with code [$a1]"
  exit $1
}

otdmNameSpace(){
  while (( 1 ));do
    echo -n "-> in otdm Name space: "'$ otdm'
    read cmdIn
    echo "after read "${cmdIn}" ......"
    if [ ${cmdIn} = "q" ];then
      otdmCL "Exit otdm name space"
      break

    else
      echo "--------- will do->["'$'" otdm"${cmdIn}"]"
      "otdm"${cmdIn}
      if [ $? = "0" ];then
        echo "------- name space exec OK"
      else
        echo "No cmd in namespace."
        echo "Help"
      fi

    fi

  done

}

# $1 - file to carusela count
otdmCaruselaCountNow(){
  ftw="$1"
  ftwDn=`dirname "$ftw"`
  ftwFn=`basename "$ftw"`
  echo `find "$ftwDn" | grep "$ftwFn"'_' | wc -w`
}

# $1 - file / directory to carusela
otdmCaruselaIt(){
  ftw="$1"
  cp -rf "$ftw" "$ftw"'_'$(otdmNowTimeNiceFN)

}

# $1 - file to trim if more then $2
# $2 - max count delete older
otdmCaruselaTrim(){
  ftw="$1"
  fcm="$2"
  ftwBN=`basename "$ftw"`
  fcn=$( otdmCaruselaCountNow "$ftw" )
  if [  "$(expr $fcn '>' $fcm)" = "0" ];then
    echo "still left space it tail for ..."$[$fcm-$fcn]

  else
    echo "there is more in carusela ... triming it"
    echo "base name use [$ftwBN]"
    fln=`ls -t | grep "$ftwBN"'_'`
    fn=1
    for f in $fln; do
      echo -n "file no: $fn -> f: $f ... "

      if [ $(expr "$fcm" '>=' "$fn") = "0" ];then
        echo "  remove it ..."
        echo "  will rm $f"
        rm -rvf "$f"
      else
        echo "  skip it's ..."
      fi
      fn=$[$fn+1]
    done
  fi
}

# $1 - file to carusela
# $2 - $2:10 how many to live in tail
otdmCaruselaFileOrDir(){
  ftw="$1"
  fc="$2"
  if [ "$fc" = "" ];then
    ## DEFAULT COUNT
    fc=20
  fi

  echo "fc: [$fc]"
  echo "file to work with: $ftw"

  filInCarNow=`otdmCaruselaCountNow "$ftw"`

  if [ -f $ftw ];then
    echo "Target is file .... have now: $filInCarNow"
    otdmCaruselaIt "$ftw"
    otdmCaruselaTrim "$ftw" "$fc"

  elif [ -d $ftw ];then
    echo "Target is directory .... have now: $filInCarNow"
    otdmCaruselaIt "$ftw"
    otdmCaruselaTrim "$ftw" "$fc"

  else
    echo "Error target unknown type no file no dir."
  fi
  #exit 0
}
