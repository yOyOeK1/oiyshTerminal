
#include <stdio.h>
#include "./myHelpers.c"

float tScale = 0.0100;



void mRigol( char *cq, char *resultTarget ){
    //printf("mRigol got [%s] target now[%s] ok\n", cq,resultTarget);
    strcpy(resultTarget, "");
    //printf("mRigol got [%s] target now[%s] ok\n", cq,resultTarget);
    printf("Client: [%s] len [%li]\n", cq,strlen(cq));


    if( 0 == strcmp( cq, "*IDN?" ) ){
        printf("cq - 1\n");
        strcpy(resultTarget, "RIGOL TECHNOLOGIES,DS1104Z,DS1ZB163351133,0");
        
    }else if( 0 == strcmp( cq, ":TIM:OFFS?" ) ){
        strcpy(resultTarget, ".001");
    


    }else if( mychkprefix( ":TIM:SCAL ", cq ) == 0 ){
        for( int i=0; i<10 ;i++)
            cq[i] = '0';
        tScale = atof( cq );
        printf("Got scale: %s   new scale: %f\n\n",cq,tScale);

    
    }else if( 0 == strcmp( cq, ":TIM:SCAL?" ) ){
        char ts[20];
        sprintf( ts, "%f", tScale );
        strcpy(resultTarget, ts);



    }else if( 0 == strcmp( cq, ":TRIG:EDGE:SOUR?" ) ){
        strcpy(resultTarget, "CHAN1");
    }else if( 0 == strcmp( cq, ":TRIG:EDGE:SWE?" ) ){
        strcpy(resultTarget, "SING");
    }else if( 0 == strcmp( cq, ":TRIG:EDGE:COUP?" ) ){
        strcpy(resultTarget, "DC");
    }else if( 0 == strcmp( cq, ":TRIG:EDGE:SLOP?" ) ){
        strcpy(resultTarget, "NEG");
    }else if( 0 == strcmp( cq, ":TRIG:EDGE:SOUR?" ) ){
        strcpy(resultTarget, "CHAN1");
    }else if( 0 == strcmp( cq, ":TRIG:EDGE:LEV?" ) ){
        strcpy(resultTarget, "2.5");

    
    }else if( 
        0 == strcmp( cq, ":CHAN1:DISP?") ||
        0 == strcmp( cq, ":CHAN2:DISP?") ||
        0 == strcmp( cq, ":CHAN3:DISP?") ||
        0 == strcmp( cq, ":CHAN4:DISP?")
        ){
        strcpy(resultTarget, "ON");
    
    }else if( 
        0 == strcmp( cq, ":CHAN1:SCAL?") ||
        0 == strcmp( cq, ":CHAN2:SCAL?") ||
        0 == strcmp( cq, ":CHAN3:SCAL?") ||
        0 == strcmp( cq, ":CHAN4:SCAL?")
        ){
        strcpy(resultTarget, "1");
    
    }else if( 
        0 == strcmp( cq, ":CHAN1:OFFS?") ||
        0 == strcmp( cq, ":CHAN2:OFFS?") ||
        0 == strcmp( cq, ":CHAN3:OFFS?") ||
        0 == strcmp( cq, ":CHAN4:OFFS?")
        ){
        strcpy(resultTarget, "0");
    
    }else if( 
        0 == strcmp( cq, ":CHAN1:PROB?") ||
        0 == strcmp( cq, ":CHAN2:PROB?") ||
        0 == strcmp( cq, ":CHAN3:PROB?") ||
        0 == strcmp( cq, ":CHAN4:PROB?") 
        ){
        strcpy(resultTarget, "100");
    }else if( 
        0 == strcmp( cq, ":CHAN1:COUP?") ||
        0 == strcmp( cq, ":CHAN2:COUP?") ||
        0 == strcmp( cq, ":CHAN3:COUP?") ||
        0 == strcmp( cq, ":CHAN4:COUP?")
        ){
        strcpy(resultTarget, "DC");
    
    }else{
        //printf("cq - not processd\n");
        
    }
    
    

}