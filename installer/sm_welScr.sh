#!/bin/sh

dialog \
  --title "Welcome! in oiyshTerminal SM 0.1" \
  --msgbox  "Hello!\nIt's a oiyshTerminal installer stateMachine.\nDo you want to continue?" 10 45

if [ $? -eq 255 ]
then
  echo "esc ! exit!"
  exit 1
fi

./sm_cheOfSta.sh
