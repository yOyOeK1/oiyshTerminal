
struct bGPIO{
  uint8_t pinNo;
  char pinType;
  long pinState;
};

//#include <ESP8266WiFi.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoOTA.h>

char *ap_ssid[] = {  "apHome",        "DIRECT-7u-SecureTether-svOiysh7" , "HUAWEI Y7a"           };
char *ap_pass[] = {  "123456789",     "9egHgaWh",                        "srytyfrytybangbang"  };
char *mq_server[] = { "192.168.1.1",  "192.168.49.1",                   "192.168.43.1"  };
char apCount = 2; // count of Access points starting from 0 
bool apOk = false;
char *OTAPass = "bob";
int boxioNo = 1;
String mqClient = String("and/boxio/"+String(boxioNo) );
String mqClientIn = String("and/boxio/cmd/"+String(boxioNo) );


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


char apAt = 2; // 0 to start from accesspoint 2 for debug force 
char mqAt = 1;
int mq_port = 10883;
#define MQMSG_BUFFER_SIZE  (50)
char mqmsg[MQMSG_BUFFER_SIZE];
bool ledStatus = false;

int apReconnects = 0;
int mqReconnects = 0;
int uaErr = 0;
long adcHz = 1;
int touchRound = 10; // round touch readings to make network less noisy

long iter = 0;

long swUpTo = 0;
long ticker = 0;
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
         client.publish( 
          String( mqClient+"/s/"+String(bGPIOS[gsb].pinNo ) ).c_str(), 
          String( nState ).c_str()
          );
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
  /*else if( String( topic ) == "boxio1/cmd" ){
    if( str == "led:On" )
      ledOn();
    else if( str == "led:Off" )
      ledOff();

    else if( str == "p5:On" )
      digitalWrite( 5, HIGH);
    else if( str == "p5:Off" )
      digitalWrite( 5, LOW);
    
    else if( str == "p4:On" )
      digitalWrite( 4, HIGH);
    else if( str == "p4:Off" )
      digitalWrite( 4, LOW);
    
    else if( str == "p14:On" )
      digitalWrite( 14, HIGH);
    else if( str == "p14:Off" )
      digitalWrite( 14, LOW);
    
    else if( str == "p12:On" )
      digitalWrite( 12, HIGH);
    else if( str == "p12:Off" )
      digitalWrite( 12, LOW);
      
  }
  */
  
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
  /*
  pinMode(15, OUTPUT);    
  pinMode(4, OUTPUT);       
  //digitalWrite( 4, HIGH);
  pinMode(16, OUTPUT);       
  //digitalWrite( 5, HIGH);   
  pinMode(17, OUTPUT);      
  //digitalWrite( 12, HIGH);  
  pinMode(5, OUTPUT);      
  //digitalWrite( 14, HIGH); 
  // OUTPUTS 15, 4, 16, 17, 5
  // dac 25, 26
  
  
  // INPUTS 23, 22, 21, 19, 18
  pinMode( 23 , INPUT);     // PING 30
  pinMode( 22 , INPUT);     // PING 29
  pinMode( 21 , INPUT);     // PING 26
  pinMode( 19 , INPUT);     // PING 25
  pinMode( 18 , INPUT);     
  */
  /*
  // ADC  36, 39, 34, 35
  pinMode(36, INPUT);      // PIN 2
  pinMode(39, INPUT);      // PIN 3
  pinMode(34, INPUT);      // PIN 4
  pinMode(35, INPUT);      // PIN 5
  // int potValue = analogRead(potPin);
  */
  
  
  Serial.begin(115200);
  
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

void loop() {
  ArduinoOTA.handle();

  if( doWifi() ){
    if( doMqtt() ){

      if( 0 && (iter%(100000/adcHz)) == 0 ){
        // ADC  36, 39, 34, 35
        client.publish( String("and/boxio/"+String(boxioNo)+"/adc/36").c_str(), String( analogRead( 36 ) ).c_str() );
        client.publish( String("and/boxio/"+String(boxioNo)+"/adc/39").c_str(), String( analogRead( 39 ) ).c_str() );
        client.publish( String("and/boxio/"+String(boxioNo)+"/adc/34").c_str(), String( analogRead( 34 ) ).c_str() );
        client.publish( String("and/boxio/"+String(boxioNo)+"/adc/35").c_str(), String( analogRead( 35 ) ).c_str() );
      
        //digitalRead( gpio );
        // INPUTS 23, 22, 21, 19, 18
        client.publish(
          String("and/boxio/"+String(boxioNo)+"/in").c_str(),
          String("{23:"+String( digitalRead(23) )+","+
            "22:"+String( digitalRead(22) )+","+
            "21:"+String( digitalRead(21) )+","+
            "19:"+String( digitalRead(19) )+","+
            "18:"+String( digitalRead(18) )+"}").c_str()
        );

      }


      if( (iter%300) == 0 ){
        //for(int gpioi=0;gpioi<gpiosPins;gpioi++){
        //ph(String("\nGPIO IN  "+String(bGPIOS[gpioi].pinNo)+" : "));
        if( bGPIOS[gpioi].pinType == 'I' ){
          //ph("I "+String(digitalRead( bGPIOS[gpioi].pinNo) ));
          setbGPIO( bGPIOS[gpioi].pinNo, digitalRead( bGPIOS[gpioi].pinNo ) );
        
        }else if( bGPIOS[gpioi].pinType == 'A' ){
          //ph("A "+String(analogRead( bGPIOS[gpioi].pinNo) ));
          setbGPIO( bGPIOS[gpioi].pinNo, analogRead( bGPIOS[gpioi].pinNo ) );

        }else if( bGPIOS[gpioi].pinType == 'T' ){
          //ph("T "+String(touchRead( bGPIOS[gpioi].pinNo) ));
          setbGPIO( bGPIOS[gpioi].pinNo, touchRead( bGPIOS[gpioi].pinNo )/touchRound );

        }
        
        
        gpioi++;
        if( gpioi > gpiosPins ){
          //ph(".");
          gpioi = 2;

        }

        //}
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
          String( mqClient+"/ip").c_str(), 
          WiFi.localIP().toString().c_str() 
        );
        client.publish(
          String( mqClient+"/wifi/dbm").c_str(),
          String( WiFi.RSSI() ).c_str()
        );
        client.publish(
          String( mqClient+"/chipTemp").c_str(),
          String( temperatureRead() ).c_str()
        );


        setbGPIO( 32, pulsCount32 );// rpm / interrupt counter
        pulsCount32 = 0;
        setbGPIO( 33, pulsCount33 );// rpm / interrupt counter
        pulsCount33 = 0;
        
        String pl = String("");
        for( int i=0,ic=gpiosPins; i<ic; i++ ){
          pl = String( pl+
            bGPIOS[i].pinNo+":"+bGPIOS[i].pinType+":"+bGPIOS[i].pinState+"," 
          );
        }
        client.publish(
          String( mqClient+"/settings" ).c_str(),
          pl.c_str()
        );
        
      }
        
        
      //doUart();
      
    }
     
    
  }  

  ticker = millis();

  if( ticker > swUpTo ){
   // digitalWrite( 5, HIGH );
    //digitalWrite( 4, HIGH );
    ledOff();
  }
  
  iter++;
  //delay(1);
}
