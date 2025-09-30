#include <stdio.h>


int mychkprefix(char *pre, char *strToChk)
{
    //printf("chk str prefix [%s]\non str:[%s]\n",pre, strToChk);
    char strTrim [ strlen(strToChk) ];
    strcpy( strTrim, strToChk );
    //printf("    strTrim 1:%s\n",strTrim);
    strTrim[ strlen(pre) ] = 0;
    //printf("    strTrim 2:[%s]\n",strTrim);

    int tr = strcmp( pre, strTrim );  
    if( tr == 0 ){
       // printf("    tr compare 0res: %i\n",tr);
        return 0;

    }else{
       // printf("    tr compare 1res: %i\n",tr);
        return 1;
    }
}
