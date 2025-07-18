


#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoOTA.h>

char apCount = 2;
char apAt = 1;
char *ap_ssid[] = {  "gio", "HUAWEI Y7a",        "DIRECT-7u-SecureTether-svOiysh7"     };
char *ap_pass[] = {  "giorgio1975",  "srytyfrytybangbang", "9egHgaWh"  };
char mqAt = 1;
bool apOk = false;
char *mq_server[] = { "192.168.49.1", "192.168.43.1", "192.168.43.1"  };
int mq_port = 10883;
char *mqClient = "esp01APDrive";
#define MQMSG_BUFFER_SIZE  (50)
char mqmsg[MQMSG_BUFFER_SIZE];
bool ledStatus = false;

int apReconnects = 0;
int mqReconnects = 0;
int uaErr = 0;

long iter = 0;

long swUpTo = 0;
// Left / Right // p1 p3
long clUpTo = 0; // clutch for Autopilot actuator // p0
long ticker = 0;


void ph(String msg){
  //Serial.print(msg);
}
void phnl(String msg){
  //Serial.println(msg);
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
  String topicStr = topic;
  /*
  ph("Message arrived [");
  ph(topic);
  ph("] payload:");
  ph("[");
  ph( str );
  ph("] len:");
  phnl(String(length));
  */

  /*
  client.publish( 
      String( String(mqClient)+"/gotCmd" ).c_str(), 
      String( "topic["+String(topic)+"] msg["+String(str)+"]" ).c_str()
      );
  if( topicStr.equals("esp01APDrive/cmd") ){
     client.publish( 
      String( String(mqClient)+"/gotCmd" ).c_str(), 
      String( "topic ok" ).c_str()
      );
  }
  if( str.equals(  "led:On" ) ){
      ledOn();
      client.publish( 
        String( String(mqClient)+"/gotCmd" ).c_str(), 
        String( "msg OK...." ).c_str()
        );
  }
  */
  
  if( topicStr.equals( "NR/ap/tillerBy" ) ){
    swFor = strtol( str.c_str(), NULL, 10 );
    clUpTo = ticker+500;

    ledOn();
    digitalWrite( 1, HIGH );
    digitalWrite( 3, HIGH );
    
    if( swFor>0 ){
      digitalWrite( 1, LOW );
      swUpTo = ticker + swFor;
    }else{
      digitalWrite( 3, LOW );
      swUpTo = ticker - swFor;
      
    }
    
  }else if( topicStr.equals( "esp01APDrive/cmd" ) ){
    if( str.equals(  "led:On" ) ){
      ledOn();
    }else if( str.equals(  "led:Off" ) ){
      ledOff();
    }
    else if( str.equals(  "p0:On" ) )
      digitalWrite( 0, HIGH);
    else if( str.equals(  "p0:Off" ) )
      digitalWrite( 0, LOW);
    
    else if( str.equals(  "p1:On" ) )
      digitalWrite( 1, HIGH);
    else if( str.equals(  "p1:Off" ) )
      digitalWrite( 1, LOW);

    else if( str.equals(  "p2:On" ) )
      digitalWrite( LED_BUILTIN, HIGH);
    else if( str.equals(  "p2:Off" ) )
      digitalWrite( LED_BUILTIN, LOW);

    else if( str.equals(  "p3:On" ) )
      digitalWrite( 3, HIGH);
    else if( str.equals(  "p3:Off" ) )
      digitalWrite( 3, LOW);

  }
    
  
}

void setMqtt(){
  client.setServer(mq_server[apAt], mq_port);
  client.setCallback( mqcallback );
}

void ledOff(){
  digitalWrite( LED_BUILTIN, HIGH);
  ledStatus = false;
}

void ledOn(){
  digitalWrite( LED_BUILTIN, LOW);
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

  pinMode(LED_BUILTIN, OUTPUT);
  ledOff();
  
  /*
  pinMode(5, OUTPUT);
  digitalWrite( 5, HIGH);
  pinMode(4, OUTPUT);
  digitalWrite( 4, HIGH);
  pinMode(14, OUTPUT);
  digitalWrite( 14, HIGH);
  pinMode(12, OUTPUT);
  digitalWrite( 12, HIGH);
  */
  pinMode(1,FUNCTION_3); // TX
  pinMode(3,FUNCTION_3); // RX
  pinMode(0,OUTPUT); // GPIO0
  digitalWrite(0, HIGH);
  pinMode(1,OUTPUT);

  digitalWrite(2, HIGH);
  pinMode(2,OUTPUT); // GPIO2
  digitalWrite(2, LOW);
  pinMode(3,OUTPUT);
  
  
  //Serial.begin(115200);
  
  WiFi.mode(WIFI_STA);

  delay(1000);

  ArduinoOTA.setHostname(mqClient);
  ArduinoOTA.setPassword("pimpimpampam");
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
    // maby this ?
    // return client.loop();
    
    client.loop();
    return true;
  }
  
}


void doUart(){

  if( 0/*Serial.available()*/ ){
    //uamsg = Serial.readStringUntil('\n');
    //Serial.flush();

      
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

int pushIter = 0;
void loop() {
  ArduinoOTA.handle();

  if( doWifi() ){
    if( doMqtt() ){
      if( (iter%100000) == 0 ){
        client.publish( 
          String(String(mqClient)+"/cpu/percent").c_str(), 
          String(pushIter++).c_str() 
          );
      }
      if( (iter%10000) == 0 ){
        client.loop();
      }
        
      //doUart();
      
    }
     
    
  }  

  ticker = millis();

  if( ticker > clUpTo ){
    digitalWrite(0,HIGH);
  }else{
    digitalWrite(0,LOW);
  }

  if( ticker > swUpTo ){
    digitalWrite( 1, HIGH );
    digitalWrite( 3, HIGH );
    ledOff();
  }
  
  iter++;
  //delay(1);
}



/*
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoOTA.h>

char apCount = 1;
char apAt = 1;
char *ap_ssid[] = {  "DIRECT-7u-SecureTether-svOiysh7" , "HUAWEI Y7a"           };
char *ap_pass[] = {  "9egHgaWh",                        "srytyfrytybangbang"  };
char mqAt = 1;
bool apOk = false;
char *mq_server[] = { "192.168.49.1", "192.168.43.1"  };
int mq_port = 10883;
char *mqClient = "esp01APDrive";
#define MQMSG_BUFFER_SIZE  (50)
char mqmsg[MQMSG_BUFFER_SIZE];
bool ledStatus = false;

int apReconnects = 0;
int mqReconnects = 0;
int uaErr = 0;

long iter = 0;

long swUpTo = 0;
long ticker = 0;

WiFiClient espClient;
PubSubClient client(espClient);


void ph(String msg){
  client.publish( 
      String( String(mqClient)+"/sto" ).c_str(), 
      String( msg ).c_str()
      );
}
void phnl(String msg){
  ph( msg+"\n" );
}





String uamsg = "";



char* tmpPayload;
long swFor = 0;
void mqcallback(char* topic, byte* payload, unsigned int length){
  
  tmpPayload = (char*)payload;
  tmpPayload[length] = 0;
  String str = String(tmpPayload);

  client.publish( 
    String( String(mqClient)+"/gotCmd" ).c_str(), 
    String( "3topic["+String(topic)+"] msg["+str+"]" ).c_str()
    );
  
  if( String( topic ) == String("esp01APDrive/cmd") ){
    ph("yes got cmd");
    if( str == String("led:On") ){
      ledOn();
      delay(300);
      ph("yes led on");
    }else if( str == String("s0:Off") ){
      digitalWrite(0,LOW);
      client.publish( 
        String( String(mqClient)+"/gotCmds01" ).c_str(),
        String("cmd["+str+"]" ).c_str()
        );
    }else if( str == String("s0:On") ){
      digitalWrite(0,HIGH);
      client.publish( 
        String( String(mqClient)+"/gotCmds00" ).c_str(),
        String("cmd["+str+"]" ).c_str()
        );
      
    
      
    }else if( str == String("led:Off") ){
      ledOff();
      delay(300);
      ph("yes led off");
    }

    
      
  }
    
  
}

void setMqtt(){
  client.setServer(mq_server[apAt], mq_port);
  client.setCallback( mqcallback );
}

void ledOff(){
  digitalWrite( LED_BUILTIN, HIGH);
  ledStatus = false;
}

void ledOn(){
  digitalWrite( LED_BUILTIN, LOW);
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


  pinMode(1,FUNCTION_3); 
  pinMode(3,FUNCTION_3);
  pinMode(1,OUTPUT);
  pinMode(3,OUTPUT);

  
  pinMode(LED_BUILTIN, OUTPUT);
  ledOff();

  
  
  
  
  
  WiFi.mode(WIFI_STA);

  delay(1000);

  ArduinoOTA.setHostname(mqClient);
  ArduinoOTA.setPassword("pimpimpampam");
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
      //client.subscribe( "NR/ap/tillerBy" );

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

 
}

int pushIter = 0;
void loop() {
  ArduinoOTA.handle();

  if( doWifi() ){
    if( doMqtt() ){
      if( (iter%500000) == 0 )
        client.publish( 
          String(String(mqClient)+"/cpu/percent").c_str(), 
          String(pushIter++).c_str() 
          );
        
      //doUart();
      
    }
     
    
  }  

  
  digitalWrite(1,HIGH);
  digitalWrite(3,HIGH);
  delay(2500);
  digitalWrite(1,LOW);
  digitalWrite(3,LOW);
  delay(2500);
   
 
  
  iter++;
  //delay(1);
}

*/
