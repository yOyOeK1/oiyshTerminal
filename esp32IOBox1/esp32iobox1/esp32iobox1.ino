

//#include <ESP8266WiFi.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoOTA.h>

char *ap_ssid[] = {  "apHome",        "DIRECT-7u-SecureTether-svOiysh7" , "HUAWEI Y7a"           };
char *ap_pass[] = {  "123456789",     "9egHgaWh",                        "srytyfrytybangbang"  };
char *mq_server[] = { "192.168.1.1",  "192.168.49.1",                   "192.168.43.1"  };
char apCount = 2; // count of Access points starting from 0 
char *mqClient = "boxio11";
int boxioNo = 1;

char apAt = 2; // start from 0 !!! for debug force 
char mqAt = 1;
bool apOk = false;
int mq_port = 10883;
#define MQMSG_BUFFER_SIZE  (50)
char mqmsg[MQMSG_BUFFER_SIZE];
bool ledStatus = false;

int apReconnects = 0;
int mqReconnects = 0;
int uaErr = 0;
long adcHz = 1;


long iter = 0;

long swUpTo = 0;
long ticker = 0;


void ph(String msg){
  Serial.print(msg);
}
void phnl(String msg){
  Serial.println(msg);
}


WiFiClient espClient;

PubSubClient client(espClient);
String uamsg = "";



char* tmpPayload;
long swFor = 0;
void mqcallback(char* topic, byte* payload, unsigned int length){
  
  tmpPayload = (char*)payload;
  tmpPayload[length] = 0;
  String str = String(tmpPayload);
  ph("\ngot topic:["+String(topic)+"] msg:["+str+"]");
  //ph( str );
  /*
  ph("Message arrived [");
  ph("] payload:");
  ph("[");
  ph("] len:");
  phnl(String(length));
  */
  
  if( String( topic ) == "NR/ap/tillerBy" ){
    swFor = strtol( str.c_str(), NULL, 10 );
    

    ledOn();
    digitalWrite( 5, HIGH );
    digitalWrite( 4, HIGH );
    
    if( swFor>0 ){
      digitalWrite( 5, LOW );
      swUpTo = ticker + swFor;
    }else{
      digitalWrite( 4, LOW );
      swUpTo = ticker - swFor;
      
    }
  
  }else if(String( topic ).equals("iobox/adcHz") ){
    adcHz = atoi( str.c_str() );

  }else if(String( topic ).equals("iobox/p") ){
    String piStr = str.substring(0, str.indexOf(':') );
    int pi = atoi( piStr.c_str() );
    String stateT = str.substring(str.indexOf(':')+1);
    if( stateT.equals( "1" ) ){
      ph("\nGPIO"+String(pi)+" to HI\n");
      digitalWrite( pi, HIGH);
    }else{
      ph("\nGPIO"+String(pi)+" to LOW\n");
      digitalWrite( pi, LOW);
    }

  }else if( String( topic ) == "boxio1/cmd" ){
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



void setup() {
  // put your setup code here, to run once:

  delay(1000);
  // out  ledPin,   4,  5,  12, 14
  // stTO H              H   H   H   H
  pinMode(2, OUTPUT);
  ledOff();
  pinMode(4, OUTPUT);       // PIN 20
  digitalWrite( 4, HIGH);
  pinMode(5, OUTPUT);       // PIN 23
  digitalWrite( 5, HIGH);   
  pinMode(12, OUTPUT);      // PIN 12
  digitalWrite( 12, HIGH);  
  pinMode(14, OUTPUT);      // PIN 11
  digitalWrite( 14, HIGH);  
  
  // INPUTS 23, 22, 21, 19
  pinMode( 23 , INPUT);     // PING 30
  pinMode( 22 , INPUT);     // PING 29
  pinMode( 21 , INPUT);     // PING 26
  pinMode( 19 , INPUT);     // PING 25

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

  ArduinoOTA.setHostname(mqClient);
  ArduinoOTA.setPassword("box");
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
    
    if (client.connect(String(mqClient).c_str())) {
      ph("connected");
      String topic = String(mqClient)+"/cmd";
      client.subscribe( topic.c_str() );
      client.subscribe( "NR/ap/tillerBy" );
      client.subscribe( "iobox/p" );
      client.subscribe( "boxio1/#" );

      client.publish( 
        String( String(mqClient)+"/status/apReconnects" ).c_str(), 
        String( apReconnects ).c_str()
        );
      client.publish( 
        String( String(mqClient)+"/status/mqReconnects" ).c_str(), 
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
        String( String(mqClient)+"/suart/raw" ).c_str(),
        uamsg.c_str() 
        );
      uaErr++;
      client.publish( 
        String(String(mqClient)+"/suart/chkSumErr").c_str(), 
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
void loop() {
  ArduinoOTA.handle();

  if( doWifi() ){
    if( doMqtt() ){

      if( (iter%(10000/adcHz)) == 0 ){
        // ADC  36, 39, 34, 35
        client.publish( String("and/boxio/"+String(boxioNo)+"/adc/36").c_str(), String( analogRead( 36 ) ).c_str() );
        client.publish( String("and/boxio/"+String(boxioNo)+"/adc/39").c_str(), String( analogRead( 39 ) ).c_str() );
        client.publish( String("and/boxio/"+String(boxioNo)+"/adc/34").c_str(), String( analogRead( 34 ) ).c_str() );
        client.publish( String("and/boxio/"+String(boxioNo)+"/adc/35").c_str(), String( analogRead( 35 ) ).c_str() );
      
        //digitalRead( gpio );
        // INPUTS 23, 22, 21, 19
        client.publish(
          String("and/boxio/"+String(boxioNo)+"/in").c_str(),
          String("{23:"+String( digitalRead(23) )+","+
            "22:"+String( digitalRead(22) )+","+
            "21:"+String( digitalRead(21) )+","+
            "19:"+String( digitalRead(19) )+"}").c_str()
        );

      }

      if( (iter%500000) == 0 )
        client.publish( 
          String(String(mqClient)+"/cpu/percent").c_str(), 
          String(pushIter++).c_str() 
          );

        
        
      //doUart();
      
    }
     
    
  }  

  ticker = millis();

  if( ticker > swUpTo ){
    digitalWrite( 5, HIGH );
    digitalWrite( 4, HIGH );
    ledOff();
  }
  
  iter++;
  //delay(1);
}
