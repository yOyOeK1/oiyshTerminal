
struct bGPIO{
  uint8_t pinNo;
  char pinType;
  long pinState;
};

//#include <ESP8266WiFi.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoOTA.h>

char *boardModel = "esp32_30pin";
int boxioNo = 1; 
char *OTAPass = "bob"; // OTA password
char *ap_ssid[] = {  "apHome",        "DIRECT-7u-SecureTether-svOiysh7" , "HUAWEI Y7a"           };
char *ap_pass[] = {  "123456789",     "9egHgaWh",                        "srytyfrytybangbang"  };
char *mq_server[] = { "192.168.1.1",  "192.168.49.1",                   "192.168.43.1"  };
char apCount = 2; // count of Access points starting from 0 

int mq_port = 10883;

String mqClient = String("and/boxio/"+String(boxioNo) );
String mqClientIn = String("and/boxio/cmd/"+String(boxioNo) );

char apAt = 2; // 0 to start from accesspoint 2 for debug force 
long adcHz = 1;
int touchRound = 10; // round touch readings to make network less noisy



bool logicAnalizer = false;
int laPin = 18;
int laIndex = 0;
int laLenght = 500;
int laBuffFrom = 0;
struct laItem{
  uint32_t tTime;
  bool pState;
};
struct laItem laItems[500];

void IRAM_ATTR myLAChange(){

  laItems[ laIndex++ ] = { micros(), digitalRead( laPin ) };
  laIndex = laIndex%laLenght;

}



bool apOk = false;

// 32, 33 interupt puls counter
// OUTPUTS 15, 4, 16, 17, 5
// dac 25, 26
// INPUTS 23, 22, 21, 19, 18
// ADC  36, 39, 34, 35
int gpiosPins = 22;
struct bGPIO bGPIOS[22] = {
  { 32,  'R',      0 }, // rpm / interrupt counter on 
  { 33,  'R',      0 }, // rpm / interrupt counter on 
  { 4,  'O',      0 }, 
  { 5,  'O',      0 }, 
  { 15,  'O',      0 }, 
  { 16,  'O',      0 }, 
  { 17,  'O',      0 }, 
  { 25,  'D',      0 }, 
  { 26,  'D',      0 }, 

  { 18,  'I',      0 },
  { 19,  'I',      0 },
  { 21,  'I',      0 },
  { 22,  'I',      0 },
  { 23,  'I',      0 },
  { 34,  'A',      0 },
  { 35,  'A',      0 },
  { 36,  'A',      0 },
  { 39,  'A',      0 },
  { 13,  'T',      0 },
  { 12,  'T',      0 },
  { 14,  'T',      0 },
  { 27,  'T',      0 } // 22

};


char mqAt = 1;
#define MQMSG_BUFFER_SIZE  (1024)
char mqmsg[MQMSG_BUFFER_SIZE];
bool ledStatus = false;

int apReconnects = 0;
int mqReconnects = 0;
int uaErr = 0;

long iter = 0;

long swUpTo = 0;
int pulsCount32 = 0;
int pulsCount33 = 0;

void ph(String msg){
  Serial.print(msg);
}
void phnl(String msg){
  Serial.println(msg);
}


WiFiClient espClient;

PubSubClient client(espClient);
String uamsg = "";

uint gsb;
void setbGPIO( int pNo, int nState){
  for( gsb=0;gsb<gpiosPins;gsb++){
    if( bGPIOS[gsb].pinNo == pNo ){
      if( bGPIOS[gsb].pinState != nState ){
        bGPIOS[gsb].pinState = nState;
         //client.publish( 
         // String( mqClient+"/s/"+String(bGPIOS[gsb].pinNo ) ).c_str(), 
         // String( nState ).c_str()
         // );
        break;

      }

    }
  }
 
}


char* tmpPayload;
long swFor = 0;
void mqcallback(char* topic, byte* payloadB, unsigned int length){
  
  tmpPayload = (char*)payloadB;
  tmpPayload[length] = 0;
  String payload = String(tmpPayload);
  String myTopic = String( mqClientIn+"/" );
  String subTopic = String(topic).substring( myTopic.length() );
  //ph("\n["+myTopic+"] got subTopic:["+subTopic+"] payload:["+payload+"]");
  //ph( str );
  /*
  ph("Message arrived [");
  ph("] payload:");
  ph("[");
  ph("] len:");
  phnl(String(length));
  */
  
  if( subTopic == "adcHz" ){
    adcHz = payload.toInt();
  
  }else if( subTopic == "la" ){

    if( payload == "1" ){
      logicAnalizer = true;
      laIndex = 0;
      laBuffFrom = 0;
      attachInterrupt( digitalPinToInterrupt( laPin ), myLAChange, CHANGE );

    }else{
      logicAnalizer = false;
      detachInterrupt( laPin );
    }


  // dac 25 26
  }else if( subTopic == "d" ){
    String piStr = payload.substring(0, payload.indexOf(':') );
    int pi = piStr.toInt();
    int stateT = String(payload.substring( payload.indexOf(':')+1) ).toInt();;
    dacWrite( pi, stateT);
    //ph( String("\nDAC GPIO"+String(pi)+":"+String(stateT) ) );  
    setbGPIO( pi, stateT );
  


    // 4 all time high
  // // OUTPUTS 15, 4, 16, 17, 5
  }else if( subTopic == "p" ){
    String piStr = payload.substring(0, payload.indexOf(':') );
    int pi = piStr.toInt();
    String stateT = payload.substring(payload.indexOf(':')+1 );
    if( stateT.equals( "1" ) ){
      //ph("\nGPIO"+String(pi)+" to HI\n");
      digitalWrite( pi, HIGH);
      setbGPIO( pi, 1 );
    }else{
      //ph("\nGPIO"+String(pi)+" to LOW\n");
      digitalWrite( pi, LOW);
      setbGPIO( pi, 0 );
    }

  }
 
  
}

void setMqtt(){
  client.setServer(mq_server[apAt], mq_port);
  client.setCallback( mqcallback );
}

void ledOff(){
  digitalWrite( 2, HIGH);
  ledStatus = false;
}

void ledOn(){
  digitalWrite( 2, LOW);
  ledStatus = true;
}

void ledToggle(){
  if( ledStatus ){
    ledOff();
  }else{
    ledOn();
  }
  
}

void IRAM_ATTR myInterruptCounter33(){
  pulsCount33++;
}
void IRAM_ATTR myInterruptCounter32(){
  pulsCount32++;
}

void setup() {
  // put your setup code here, to run once:

  delay(1000);
  pinMode(2, OUTPUT);
  ledOff();
 
  
  for( int i=0,ic=gpiosPins; i<ic; i++ ){
    //bGPIOS[i].pinNo bGPIOS[i].pinType bGPIOS[i].pinState 
    
    if( bGPIOS[i].pinType == 'O' ){
      pinMode( bGPIOS[i].pinNo, OUTPUT);      
      digitalWrite( 
        bGPIOS[i].pinNo, 
        bGPIOS[i].pinState ? HIGH : LOW 
      );   
      
      
    }else if( bGPIOS[i].pinType == 'I' ){
      pinMode( bGPIOS[i].pinNo, INPUT );
      
    }
    
  }
  
  
  
  Serial.begin(38400);
  
  WiFi.mode(WIFI_STA);
  
  delay(1000);
  
  ArduinoOTA.setHostname( mqClient.c_str() );
  ArduinoOTA.setPassword( OTAPass );
  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else { // U_FS
      type = "filesystem";
    }
    
  });
  ArduinoOTA.onEnd([]() {
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
  });
  ArduinoOTA.onError([](ota_error_t error) {
  });
  ArduinoOTA.begin();
  
  
  
  //pinMode( 32, INPUT_PULLUP ); // for interrupt counter
  pinMode( 32, INPUT );
  attachInterrupt( digitalPinToInterrupt( 32 ), myInterruptCounter32, RISING );
  pinMode( 33, INPUT );
  attachInterrupt( digitalPinToInterrupt( 33 ), myInterruptCounter33, RISING );

}

char apMaxLoops = 15;
char apLoop = 0;
bool doWifi(){
  if( WiFi.status() != WL_CONNECTED ){
    apOk = false;
    apReconnects++;
    phnl("WiFi try to connect to...");
    phnl(ap_ssid[apAt]);
    WiFi.begin( ap_ssid[apAt], ap_pass[apAt] );
    apOk = false;
    for( apLoop=0; apLoop<apMaxLoops; apLoop++ ){
      ledToggle();      
      delay(1000);
      ph(".");
      if (WiFi.status() == WL_CONNECTED) {
        apOk = true;

        setMqtt();
        
        break;
      }
    }
    if( apOk == false ){
      phnl("WiFi not found try different next time");
      apAt++;
      if( apAt > apCount )
        apAt = 0;   
      return false;
    }else{
      ph( "status...");
      phnl( String((int)WiFi.status()) );
      ph( "ip...");
      phnl( WiFi.localIP().toString() );
      ledOff();
      return true;
    }
    
  }else
    return true;
  
}

char mqRecMax = 10;
char mqLoop = 0;
bool mqReconnect() {
  // Loop until we're reconnected
  mqLoop = 0;
  while (!client.connected()) {
    ph("Attempting MQTT connection...");
    ledToggle();
    if( mqLoop>mqRecMax)
      return false;
    
    if( client.connect( mqClient.c_str() ) ) {
      ph("connected");
      
      client.subscribe( String(mqClientIn+"/#").c_str() );
      

      client.publish( 
        String( mqClient+"/status/apReconnects" ).c_str(), 
        String( apReconnects ).c_str()
        );
      client.publish( 
        String( mqClient+"/status/mqReconnects" ).c_str(), 
        String( mqReconnects ).c_str()
        );
      ledOff();
      return true;
      
    } else {
      ph("failed, rc=");
      ph( String( (char*)client.state() ) );
      phnl(" try again in 1 seconds");
      // Wait 5 seconds before retrying
      delay(1000);
      mqLoop++;
    }
  }
  return true;
}

bool doMqtt(){
  if (!client.connected()) {
    mqReconnects++;
    return mqReconnect();
    
  }else{
    client.loop();
    return true;
  }
  
}


void doUart(){

  if( Serial.available() ){
    uamsg = Serial.readStringUntil('\n');
    Serial.flush();

      
    }else{
      client.publish(
        String( mqClient+"/suart/raw" ).c_str(),
        uamsg.c_str() 
        );
      uaErr++;
      client.publish( 
        String( mqClient+"/suart/chkSumErr").c_str(), 
        String(uaErr).c_str() 
        );
      
    
    
    
  }
  
}

/*
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/in', ... (21 bytes))
{23:0,22:0,21:0,19:0}
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/adc/36', ... (1 bytes))
0
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/adc/39', ... (1 bytes))
0
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/adc/34', ... (1 bytes))
0
Client mosq-zq88SrLuBPZgPDmUn4 received PUBLISH (d0, q0, r0, m0, 'and/boxio/1/adc/35', ... (1 bytes))


*/


int pushIter = 0;

int gpioi = 1;
String pl = String("");
String abcx = String("");
int abci = 1;

void loop() {
  ArduinoOTA.handle();
  
  if( doWifi() ){
    if( doMqtt() ){

      
      /*if( (iter%(10000/adcHz)) == 0 ){
        abcx.concat( String(abci++) );
        ph( abcx+",\n"  );
      }*/

      if( (iter%300) == 0 ){
        if( bGPIOS[gpioi].pinType == 'I' ){
          setbGPIO( bGPIOS[gpioi].pinNo, digitalRead( bGPIOS[gpioi].pinNo ) );
        
        }else if( bGPIOS[gpioi].pinType == 'A' ){
          setbGPIO( bGPIOS[gpioi].pinNo, analogRead( bGPIOS[gpioi].pinNo ) );

        }else if( bGPIOS[gpioi].pinType == 'T' ){
          setbGPIO( bGPIOS[gpioi].pinNo, touchRead( bGPIOS[gpioi].pinNo )/touchRound );
        }
                
        gpioi++;
        if( gpioi > gpiosPins ){
          gpioi = 2;
        }
      }



      // if logicAnalizer is on and ther is some in buffer send
      if( logicAnalizer == true && (iter%500) == 0 && laIndex != laBuffFrom ){
        pl = "";
        int doSteps = 0;
        if( laBuffFrom > laIndex ){
          doSteps = laLenght-laBuffFrom+laIndex;
          //pl.concat("buf>inx ");
        }else{
          doSteps = laIndex-laBuffFrom;
          //pl.concat("buf<inx ");
        }
        //doSteps--;
        //pl.concat("steps:"+String(doSteps)+"\t\n");

        for(int lai=0; lai<doSteps; lai++ ){
          if( (lai%10)==1 ){
            client.publish( 
              String( mqClient+"/la").c_str(), 
              pl.c_str() 
            );
            pl = "";
          }
          pl.concat( 
            String( laItems[ laBuffFrom ].tTime )+":"+
            String( laItems[ laBuffFrom ].pState )+"\n" 
          );

          laBuffFrom = ( laBuffFrom+1 )%laLenght;
        }

        //pl.concat("\nnow laBuf: "+String(laBuffFrom)+" index:"+String(laIndex));

        if( pl != "" ){
          client.publish( 
            String( mqClient+"/la").c_str(), 
            pl.c_str() 
          );
          pl = "";
        }
      }




      if( (iter%(50000/adcHz)) == 0 ){
        client.publish( 
         String( mqClient+"/cpu/percent").c_str(), 
         String(pushIter++).c_str() 
         );
         
      }


      //WiFi.localIP()
      if( (iter%90000) == 0 ){        
        client.publish( 
          String( mqClient+"/box").c_str(), 
          String(String("{")+
            "\"ip\":\""+WiFi.localIP().toString()+"\","+ 
            "\"dbm\":"+String( WiFi.RSSI() )+","+ 
            "\"chipTemp\":"+String( temperatureRead() )+","+ 
            "\"boardModel\":\""+boardModel+"\","+ 
            "\"adcHz\":"+String(adcHz)+","+
            "\"laPin\":"+String(logicAnalizer?laPin:-1)+","+
            "\"touchRou\":"+String(touchRound)+
            "}").c_str()
        );
       

        setbGPIO( 32, pulsCount32 );// rpm / interrupt counter
        pulsCount32 = 0;
        setbGPIO( 33, pulsCount33 );// rpm / interrupt counter
        pulsCount33 = 0;
        
        pl = "";
        for( int i=0,ic=gpiosPins; i<ic; i++ ){
          pl.concat(String(bGPIOS[i].pinNo)+":"+bGPIOS[i].pinType+":"+bGPIOS[i].pinState+",");
        }

        client.publish(
          String( mqClient+"/settings" ).c_str(),
          pl.c_str()
        );
        pl = "";
        
      }
        
        
      //doUart();
      
    }
     
    
  }  

  
  iter++;
  //delay(1);
}
