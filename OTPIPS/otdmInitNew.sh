#!/usr/bin/env bash

OTPIPS_VER="0.0.1-v1"
OTPIPS_DIR="/OT/OTPIPS"
# playground overrite 
OTPIPS_DIR="/home/yoyo/Apps/oiyshTerminal/OTPIPS/playgaund/v1"
OTPIPS_BLANK="ot_blank"
OTPIPS_TNAME="$1"

argC=$#
arg2=$2

#echo "Will init new the project ... "
#echo "* otpips dir: $OTPIPS_DIR"
#echo "--------------------------------"

note_target='
- [x] checking raw OTPIPS_BLANK as template
- [x] check if target is empty
- [x] pName input dialog :)
- [x] copy to target
- [x] replace some data
'


dirBlankChk(){
    echo -n "* checking $OTPIPS_BLANK directory ... "    
    if [ -d "./$OTPIPS_BLANK" ]; then
        echo -n ":) "
    else
        echo "Error no ./$OTPIPS_BLANK EXIT 20"
        exit 20
    fi
    echo "OK"
}

dirChk(){
    tDir="$1"
    echo -n "* checking target directory ... $tDir ... "
    
    if [ -d "$tDir" ]; then
        echo "Error wrong  target directory [$tDir] EXIT 11"
        exit 11
    fi

    if [ -f "$tDir" ]; then
        echo "Error wrong  target file [$tDir] EXIT 12"
        exit 12
    fi

    if [ "$(pwd)" != "$OTPIPS_DIR" ]; then
        echo "Error need to be in $OTPIPS_DIR EXIT 13"
        exit 13
    fi

    echo "OK not existing"
}


wizardNew(){
    echo -n "So new project name is:"
    read -r OTPIPS_TNAME
    echo "$OTPIPS_TNAME ... nice name :) lect's Go oiysh pip  ..."
}

doHelp(){
    echo "Help ! argC:$argC"'

-init [projectName]
-delIt [projectName]  - to delete it

-h | h  - is for help.
-v      - version
## test section
-wNew                 - do wizard new
-mkNew 
-chkDir [projectName] - directory check if target is ok
-chkBlank             - b|lank directory check fast 
---
*current version: '"$OTPIPS_VER"''
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
    mkNew $OTPIPS_TNAME
    echo "----------- DONE"

    ;;
'-delIt')
    if [ "$argC" = "2" ]; then
        delIt $arg2
    else
        echo "Error wrong args ... EXIT 5"
        exit 5
    fi
    ;;
'-mkNew')
    #for test TODO remove this
    OTPIPS_TNAME="test2_1"
    mkNew $OTPIPS_TNAME
    echo "after wizard name is: [$OTPIPS_TNAME]"
    ;;
'-wNew')
    wizardNew
    echo "after wizard name is: [$OTPIPS_TNAME]"
    ;;
'-chkDir')
    if [ "$argC" = "2" ]; then
        dirChk $arg2
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
    echo " ok lec go ..."
    ;;
esac


