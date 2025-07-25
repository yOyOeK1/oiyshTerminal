

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
char *mqClient = "espSTRX";
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
    String( "topic["+String(topic)+"] msg["+str+"]" ).c_str()
    );
  
  if( String( topic ) == String("espSTRX/cmd") ){
    ph("yes got cmd");
    if( str == String("led:On") ){
      ledOn();
      delay(300);
      ph("yes led on");
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

  
  pinMode(LED_BUILTIN, OUTPUT);
  ledOff();
  /*pinMode(5, OUTPUT);
  digitalWrite( 5, HIGH);
  pinMode(4, OUTPUT);
  digitalWrite( 4, HIGH);
  pinMode(14, OUTPUT);
  digitalWrite( 14, HIGH);
  pinMode(12, OUTPUT);
  digitalWrite( 12, HIGH);
  */
  
  
  
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

  /*
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
  */
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

 
  
  iter++;
  //delay(1);
}
