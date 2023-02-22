#! /bin/bash
echo -n "- = [ Pack it so - .sh set init to extend shell command  ..... "


eHelp(){
  echo 'Help ------
-help - print this help
-test - do basic tests
  '
}


#echo "args count ["$#"]"
if [ "$#" = "0" ];then
  echo "No args. Try -help. EXIT 1"
  exit 1
else
  echo "OK ARGS PARSING.."

  case "$1" in
    "-test" )
      echo "Arg[-test]"
      echo "runing test ...."
      echo "done"
      exit 0
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
