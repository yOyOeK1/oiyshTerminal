

float tScale = 0.01;



String mRigol( String cq){
    //printf("mRigol got [%s] target now[%s] ok\n", cq,resultTarget);
    //printf("mRigol got [%s] target now[%s] ok\n", cq,resultTarget);
    //printf("Client: [%s] len [%li]\n", cq,strlen(cq));
    String resultTarget = String('1');
    
    if( cq == "*IDN?" ){
        //printf("cq - 1\n");
        resultTarget =  "RIGOL TECHNOLOGIES,DS1104Z,DS1ZB163351133,0";
        
    }else if( 
        cq == ":CHAN1:DISP?" ||
        cq == ":CHAN2:DISP?" ||
        cq == ":CHAN3:DISP?" ||
        cq == ":CHAN4:DISP?"
    ){
        resultTarget = "ON";


    }else if( cq.equals(":TIM:OFFS?" ) ){
        resultTarget = ".001";
    


        
        
   
        
        
    }else if( cq.equals(":TRIG:EDGE:SOUR?" ) ){
        resultTarget = "CHAN1";
    }else if( cq.equals(":TRIG:EDGE:SWE?" ) ){
        resultTarget = "SING";
    }else if( cq.equals(":TRIG:EDGE:COUP?" ) ){
        resultTarget = "DC";
    }else if( cq.equals(":TRIG:EDGE:SLOP?" ) ){
        resultTarget = "NEG";
    }else if( cq.equals(":TRIG:EDGE:SOUR?" ) ){
        resultTarget = "CHAN1";
    }else if( cq.equals(":TRIG:EDGE:LEV?" ) ){
        resultTarget = "2.5";

    
        
    }else if( 
        cq.equals(":CHAN1:SCAL?") ||
        cq.equals(":CHAN2:SCAL?") ||
        cq.equals(":CHAN3:SCAL?") ||
        cq.equals(":CHAN4:SCAL?")
    ){
        resultTarget = "1";
        
    }else if( 
        cq.equals(":CHAN1:OFFS?") ||
        cq.equals(":CHAN2:OFFS?") ||
        cq.equals(":CHAN3:OFFS?") ||
        cq.equals(":CHAN4:OFFS?")
        ){
        resultTarget = "0";
    
    }else if( 
        cq.equals(":CHAN1:PROB?") ||
        cq.equals(":CHAN2:PROB?") ||
        cq.equals(":CHAN3:PROB?") ||
        cq.equals(":CHAN4:PROB?") 
    ){
        resultTarget = "100";
    }else if( 
        cq.equals(":CHAN1:COUP?") ||
        cq.equals(":CHAN2:COUP?") ||
        cq.equals(":CHAN3:COUP?") ||
        cq.equals(":CHAN4:COUP?")
    ){
        resultTarget = "DC";
    

     }else if( cq.equals(":TIM:SCAL?" ) ){
        resultTarget = String(tScale,8);
        
    }else if( cq.startsWith(":TIM:SCAL ") ){
        resultTarget = "1";
        cq = cq.substring(cq.indexOf(" "));
        //Serial.println("on start work with: "+cq);
        //tScale = atof( cq.c_str() );
        tScale = cq.toFloat();
        Serial.print("Got scale: ["+cq+"]   new scale: ");
        Serial.println(tScale,8);
   
    }else{
        //printf("cq - not processd\n");
        Serial.println("No: "+cq);
        
    }
    return resultTarget;
    
    
}