
echo "otdm Frequent commands ...."


# $1* - message print to console fol debuging with prefix
# example $ otdmCL "Hello world" '!!'
# > otdmSh: [Hello world !!]
otdmcl(){
  m="$*"
  echo 'otdmSh: ('${#m}'): :'"$m"
}
otdmCL(){
  otdmcl "$*"
}
otdmCS(){
  cowsay -f moose ${*}
  echo -n "-------------------------oiyshTerminal otdm"
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

  '
  otdmCS "
  oiyshTerminal seysh Hi!

  Check rest of otdm family: https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-index
  "
  echo "Sh.sh"
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
