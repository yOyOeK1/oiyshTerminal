#!/usr/bin/env bash

OTPIPS_VER="0.0.1"
OTPIPS_DIR="/OT/OTPIPS"
# playground overwrite
#OTPIPS_DIR="/OT/OTPIPS/playground/v1"

OTPIPS_TNAME="$1"

argC=$#
arg2=$2

#echo "Will build and reinstall it globaly as root on this machine ... "
#echo "* otpips dir: $OTPIPS_DIR"
#echo "--------------------------------"

note_target='
- [ ] check if target is ok with .tar.gz
- [ ] pip3 uninstall
- [ ] pip3 install from .tar.gz
'

dirChk(){
    p="$1"
    if [ -f "$p" ]; then
        echo "* source is ok: $p"
    else
        echo "Error wrong src EXIT 11"
        exit 11    
    fi

    pLen=`expr length "$p"`
    pExt=`expr substr "$p" $[$pLen-3] $pLen`
    if [ "$pExt" = ".whl" ]; then
        echo "* extension .whl is ok"
    else
        echo "Error wrong sorurce / extension expecteding .whl  EXIT 11"
        exit 11    
    fi
}


wizardNew(){
    echo -n "So new project name is:"
    read -r OTPIPS_TNAME
    echo "$OTPIPS_TNAME ... nice name :) lect's Go oiysh pip  ..."
}

doHelp(){
    echo "Help ! argC:$argC        ver: $OTPIPS_VER"'
                         '"$(date)"'       
-init [projectName]
-delIt [projectName]     - to delete it

-h | h  - is for help.
-v      - version
## test section
-wNew                    - do wizard new
-mkNew         ...       - make new directory steps
-chkDir [projectName]    - directory check if target is ok
-chkBlank      ...       - blank directory check fast 
---
*current version: '"$OTPIPS_VER"' '
}

mkNew(){
    p="$1"
    echo "* make new ... "

    echo "* copy from $OTPIPS_BLANK to $OTPIPS_TNAME ..."
    cp -r "$OTPIPS_BLANK" "$OTPIPS_TNAME" 
    echo "  [deb] $? end with"

    echo "* rename ..."
    mv "$OTPIPS_TNAME/src/$OTPIPS_BLANK" "$OTPIPS_TNAME/src/$OTPIPS_TNAME"

    echo "* replace stuff ..."
    sed "s/$OTPIPS_BLANK/$OTPIPS_TNAME/g" -i "$OTPIPS_TNAME/pyproject.toml"
    sed "s/$OTPIPS_BLANK/$OTPIPS_TNAME/g" -i "$OTPIPS_TNAME/README.md"
    sed "s/$OTPIPS_BLANK/$OTPIPS_TNAME/g" -i "$OTPIPS_TNAME/src/$OTPIPS_TNAME/__init__.py"
    sed "s/$OTPIPS_BLANK/$OTPIPS_TNAME/g" -i "$OTPIPS_TNAME/src/$OTPIPS_TNAME/example.py"

    echo "* remove .gitignore ..."
    rm "$OTPIPS_TNAME/src/.gitignore"
    rm "$OTPIPS_TNAME/src/$OTPIPS_TNAME/.gitignore"

}

delIt(){
    p="$1"
    echo "Remove it?"
    echo "$p"
    echo "Are you shure you want to remove it ? [yes] "
    read -r ans
    if [ "$ans" = "yes" ];then
        echo "rm -rvf $p"
        rm -rvf "$p"
        echo "  [deb] $? end with"
    fi

}


case $OTPIPS_TNAME in
'-init')
    echo "Init new ..."

    if [ "$argC" = "2" ]; then
        OTPIPS_TNAME=$arg2
        echo "* name is [$OTPIPS_TNAME]"
    else
        wizardNew
    fi

    dirBlankChk
    dirChk
    mkNew "$OTPIPS_TNAME"
    echo "----------- DONE"

    ;;
'-delIt')
    if [ "$argC" = "2" ]; then
        delIt "$arg2"
    else
        echo "Error wrong args ... EXIT 5"
        exit 5
    fi
    ;;
'-mkNew')
    #for test TODO remove this
    OTPIPS_TNAME="test2_1"
    mkNew "$OTPIPS_TNAME"
    echo "after wizard name is: [$OTPIPS_TNAME]"
    ;;
'-wNew')
    wizardNew
    echo "after wizard name is: [$OTPIPS_TNAME]"
    ;;
'-chkDir')
    if [ "$argC" = "2" ]; then
        dirChk "$arg2"
    else
        echo "Error wrong args ... EXIT 5"
        exit 5
    fi
    ;;
'-chkBlank')
    dirBlankChk
    ;;
'h'|'-h'|'--help'|'-help')
    doHelp
    ;;
*)
    echo " ok lec go ... exit0 try -h"
    ;;
esac


