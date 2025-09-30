
// ver 2
#include <DHT.h>

#include <SoftwareSerial.h>
SoftwareSerial SSerial(8,9); // RX, TX

#include "Tasker.h"
Tasker tasker;

#include <Alt9SoftSerial.h>
//#include <SoftwareSerial9.h>
#define SEATALK_RX 11
#define SEATALK_TX 12
Alt9SoftSerial SerialI(SEATALK_RX, NULL);
//SoftwareSerial9 SerialO(NULL, SEATALK_TX);


int swb0 = 7;
int swb1 = 6;
int swdcdc = 5;
int swNaN = 4;
int swOn = LOW;
int swOff = HIGH;

int batteryNow = -1;
int swOutNow = -1;
int b0g = A5;
int b01 = A4;
int b1p = A3;
int outStage1 = A2;
int outStage2 = A1;
int sen2 = A0;
int offsets[6];
bool swNaNstatus = false;

int b0g_=0;
int b01_=0;
int b1p_=0;
  





int bmOnHH = 0;
int bmOnMM = 45;
int bmOnSS = 10;


int bmOnHHl = 0;
int bmOnMMl = 0;
int bmOnSSl = 0;
int bmStatus = 0;
bool bmWork = true;
int bmBatSel = 1;
int bmOutStage1 = 0;
int arb0g = 0;
int arb01 = 0;
int arb1p = 0;
int arouts1 = 0;

int arbat1 = 0;
int arbat2 = 0;

int arb0g1 = 0;
int arb011 = 0;
int arb1p1 = 0;
int arouts11 = 0;

int arb0g2 = 0;
int arb012 = 0;
int arb1p2 = 0;
int arouts12 = 0;











#define DHTPIN 10
#define DHTTYPE DHT11
DHT dht( DHTPIN, DHTTYPE );


//#include <TaskScheduler.h>
void dummyRaport();
void niceRaport();
void dhtIter();
void pachpachRaport();


void ledRevers();
bool serialAction();
void batMux();





//Tasks
//Task t4();
//Task t_dummy(200, 3, &dummyRaport);
//Task t_serial(101, TASK_FOREVER, &serialAction);
//Task t_nice(10000, TASK_FOREVER, &niceRaport);
//Task t_dht(10000, TASK_FOREVER, &dhtIter);
//Task t_batMux(997, TASK_FOREVER, &batMux);
//Task t_ppR(6473, TASK_FOREVER, &pachpachRaport);
//Task t2(3000, TASK_FOREVER, &t2Callback);
//Task t3(5000, TASK_FOREVER, &t3Callback);

//Scheduler runner;


void pachpachRaport(){
	niceRaport();
	dhtIter();
}



void ledOn(){
	digitalWrite(LED_BUILTIN, HIGH);
}
void ledOff(){
	digitalWrite(LED_BUILTIN, LOW);
}

void ledRevers(){
	digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}





bool SerialHardwareEnable = true;

bool stMesKnown = false;
int ind = 0;
char st[32];
int inbyte;

float parsDepth () {
  return ((makeWord(st[4] , st[3])) * 0.03048);// - stDepthOffset;
}


bool stkActionRunning = false;
void readSeatalk(){
  if( stkActionRunning )
    return 0;
  
  stkActionRunning = true;

	if (SerialI.available ()) {
		inbyte = (SerialI.read());
		if (inbyte & 0x100) {
			if ( !stMesKnown ) {
				//Serial.println("got seatalk line !");
			}
      if( !stMesKnown and ind > 0 ){
        //Serial.println("st not rec ind"+String(ind)+" st"+String(st[2]));

        String tr = "";
        for(int l=0; l<ind; l++)
          tr.concat( String((0xff&st[l]),HEX)+',' );
        pcs("{'stk':'"+tr+"'}");
        //pcs(st);
      }
			//Serial.println(inbyte,HEX);
			stMesKnown = false;
      ind = 0 ;
		}
		st[ind++] = (inbyte&0xff) ;


		if( ind > 30 )
			ind = 0;
		
	}

  stkActionRunning = false;

}


void setup() {
	delay(200);
  
	offsets[0] = 0;
  offsets[1] = -4;
  offsets[2] = -1;
  offsets[3] = 1;
  offsets[4] = 4;
  offsets[5] = -2;
  
  pinMode(LED_BUILTIN, OUTPUT);
  ledOn();

  pinMode( A0, INPUT );
  pinMode( A1, INPUT );
  pinMode( A2, INPUT );
  pinMode( A3, INPUT );
  pinMode( A4, INPUT );
  pinMode( A5, INPUT );
  
  pinMode( swb0, OUTPUT );
  digitalWrite( swb0, swOff);
  
  pinMode( swb1, OUTPUT );
  digitalWrite( swb1, swOff);
  
  pinMode( swdcdc, OUTPUT );
  digitalWrite( swdcdc, swOff);
  
  pinMode( swNaN, OUTPUT );
  digitalWrite( swNaN, swOff);

  if( SerialHardwareEnable )
	  Serial.begin(115700);

  dht.begin();

  
  SerialI.begin(4800);
  digitalWrite( SEATALK_RX, LOW );
  
  SSerial.begin(9600);
  
  //digitalWrite( 11, LOW);
  //digitalWrite( 10, LOW);
  
  
    
  delay(1500);
  
  
  tasker.setInterval( serialAction ,208);
  //tasker.setInterval( ledRevers, 5000 );
  tasker.setInterval( dhtIter, 5531);
  tasker.setInterval( batMux, 1000 );
  tasker.setInterval( readSeatalk, 212 );
  
  ledOff();
}


void loop_test(){
	//Serial.print("x");
	//readSeatalk();
}


void dhtIter(){
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);
  
  if (isnan(h) || isnan(t) || isnan(f)) {
	//p(F("{'dht': 'error'}"));
    return;
  }
  
  pcs("{'hum':"+String(h)+","\
		  "'C':"+String(t)+","\
		  "'F':"+String(f)+\
		  "}");
  
}

void pcs(String msgg){	
	p(String(msgg+"*"+String(getChkSum(msgg), HEX)));
}

void p(String n){
	
	ledOn();
	//Serial.println(SSerial.availableForWrite());
	while( SSerial.availableForWrite() != 0);
	SSerial.println(n);
	while( SSerial.availableForWrite() != 0); 
	
	delay(210);
	
	if( SerialHardwareEnable )
		Serial.println(n);
	
	ledOff();
	
}

// -------------  MULTIPLEXER START


void batMuxswTo1(){
	digitalWrite( swb0, swOff);
	digitalWrite( swb1, swOff);
}
void batMuxswTo2(){
	digitalWrite( swb0, swOn);
	digitalWrite( swb1, swOn);
}
void batMuxswOutOn(){
	digitalWrite( swdcdc, swOn);
}
void batMuxswOutOff(){
	digitalWrite( swdcdc, swOff);
}
void batMuxAdcRaw(){
	delay(1);
	arb0g = analogRead(b0g);
	delay(1);
	arb01 = analogRead(b01);
	delay(1);
	arb1p = analogRead(b1p);
	delay(1);
	arouts1 = analogRead(outStage1);
}





/*
0 - start
1 - sw to battery 1
2 - sensing make notes
3 - sw to battery 2
4 - sensing make notes , make sw to bank
5 - sw on output
6 - wait
 */

void bmRaportSta(){
	pcs( "{"\
			"'status':"+String(bmStatus)+","\
			"'every':{"
				"'hh':"+String(bmOnHH)+","
				"'mm':"+String(bmOnMM)+","
				"'ss':"+String(bmOnSS)+\
			"}}");
	pcs("{"\
			"'left':{"
				"'hh':"+String(bmOnHHl)+","
				"'mm':"+String(bmOnMMl)+","
				"'ss':"+String(bmOnSSl)+\
			"}}");
	pcs( "{"\	
			"'batSel':"+String(bmBatSel)+","
			"'outStage1':"+String(bmOutStage1)+","
			"'arb0g':"+String(arb0g)+","
			"'arb01':"+String(arb01)+","
			"'arb1p':"+String(arb1p)+","
			"'arouts1':"+String(arouts1)+\	
		"}");
}

void bmRaportBat12(){
	pcs("{"\
		"'bat1':"+String(arbat1)+","
		"'bat2':"+String(arbat2)+\
		"}");
}


int bmRaportSkip = 2;
int bmRaportIter = 0;
void batMux(){
	//if( bmStatus != 7 or (bmRaportIter%bmRaportSkip) == 0 )
	//	bmRaportSta();
		//niceRaport();
		//dhtIter();
	pcs( "{'status':"+String(bmStatus)+"}");
	//adcRaportCompact();
	
	
	if( bmStatus == 0 ){
		//p(F("0 - start sequence"));
		batMuxswOutOff();
		bmOnHHl = bmOnHH;
		bmOnMMl = bmOnMM;
		bmOnSSl = bmOnSS;
	}else if( bmStatus == 1 ){
		//p(F("1 - sw to battery 1"));
		batMuxswTo1();
		bmBatSel = 1;
	}else if( bmStatus == 2 ){
		//p(F("2 - sensing battery 1, make notes"));
		batMuxAdcRaw();
		arb0g1 = arb0g;
		arb011 = arb01;
		arb1p1 = arb1p;
		arouts11 = arouts1;
		arbat1 = arouts1;
	}else if( bmStatus == 3 ){
		//p(F("3 - sw to battery 2"));
		batMuxswTo2();
		bmBatSel = 2;
	}else if( bmStatus == 4 ){
		//p(F("4 - sensing battery 2, make notes"));
		batMuxAdcRaw();
		arb0g2 = arb0g;
		arb012 = arb01;
		arb1p2 = arb1p;
		arouts12 = arouts1;
		arbat2 = arouts1;
		bmRaportBat12();
		
		//p("  - adc for bat 1:"+String(arouts11)+" bat 2:"+String(arouts12));
		if( arouts11 > arouts12 ){
			//p(F("... use battery 1 for output"));
			batMuxswTo1();
		}else{
			//p(F("... use battery 2 for output"));
			batMuxswTo2();
		}
		
	}else if( bmStatus == 5 ){
		//p(F("5 - sw output On"));
		// ---- after test uncomment
		batMuxswOutOn();
		bmOutStage1 = 1;
	}else if( bmStatus == 6 ){
		//p(F("6 - start counter"));
		
		bmOnHHl = bmOnHH;
		bmOnMMl = bmOnMM;
		bmOnSSl = bmOnSS;
	}else if( bmStatus == 7 ){
		//p("7 - waiting for end of cycle..."\
			"("+String(bmOnHH)+":"+String(bmOnMM)+":"+String(bmOnSS)+") "+\
			"left: "+\
			"("+String(bmOnHHl)+":"+String(bmOnMMl)+":"+String(bmOnSSl)+")"\
			);
		if( (bmRaportIter%bmRaportSkip) == 0 )
			adcRaportCompact();

		
		if( bmOnSSl <= 0 && bmOnMMl <= 0 && bmOnHHl <= 0 ){
			//p(F("end of waiting !"));
		}else
			bmStatus = 6;
		
		bmOnSSl-= 1;
		
		if( bmOnSSl<0 ){
			bmOnMMl-=1;
			bmOnSSl = 59;
		}
		if( bmOnMMl<0 ){
			bmOnHHl-=1;
			bmOnMMl = 59;
		}
		
		
	}else if( bmStatus == 8 ){
		//p(F("8 - sw off output stage 1"));
		
		batMuxswOutOff();
		bmOutStage1 = 0;
	}else if( bmStatus == 9 ){
		//p(F("9 - end work :)"));
		
		bmOnHHl = 0;
		bmOnMMl = 0;
		bmOnSSl = 0;
		
		if( bmWork )
			bmStatus = -1;
		else
			bmStatus = 8;
		
	}else{
		//p("battery Multiplexer status("+String(bmStatus)+")");	
		;
	}

	if( bmWork ) 
		bmStatus++;
	
	bmRaportIter++;
	
	
}

// -------------  MULTIPLEXER END

/*
void swTest(){
  p("swTest ----------------");
  digitalWrite( swb0, swOn);
  digitalWrite( swb1, swOn);
  digitalWrite( swdcdc, swOn);
  digitalWrite( swNaN, swOn);
  
  delay(1000);                       // wait for a second
  
  digitalWrite( swb0, swOff);
  digitalWrite( swb1, swOff);
  digitalWrite( swdcdc, swOff);
  digitalWrite( swNaN, swOff);
}

int adcReadAvg( int apin ){
  return (
    analogRead( apin) +
    analogRead( apin) +
    analogRead( apin) \
    )/3;
}
*/

void adcRaportCompact(){
	pcs("{'adc':{"\
			"0:"+String( analogRead(A0) )+","\
			"1:"+String( analogRead(A1) )+","\
			"2:"+String( analogRead(A2) )+","\
			"3:"+String( analogRead(A3) )+","\
			"4:"+String( analogRead(A4) )+","\
			"5:"+String( analogRead(A5) )+""\
			"}}");
}

String adcToH( int ap ){
  int a = analogRead( ap );
  String tr = "{'raw':"+String(a)+",";
  
  if( ap == b0g ){
    a-= offsets[5];
  }else if( ap == b01 ){
    a-= offsets[4];
  }else if( ap == b1p ){
    a-= offsets[3];
  }else if( ap == outStage1 ){
    a-= offsets[2];
  }else if( ap == outStage2 ){
    a-= offsets[1];
  }
  tr+= "'now':"+String(a)+",";
  float res = (1200.000/1024.000)*(float(a))-600.000;
  tr+="'volts':"+String(res)+"}";
 
  return tr;
  
}

void adcRaw(){
  pcs("{'ard01':{'a0':"+adcToH( A0 )+"}}");
  pcs("{'ard01':{'a1':"+adcToH( A1 )+"}}");
  pcs("{'ard01':{'a2':"+adcToH( A2 )+"}}");
  pcs("{'ard01':{'a3':"+adcToH( A3 )+"}}");
  pcs("{'ard01':{'a4':"+adcToH( A4 )+"}}");
  pcs("{'ard01':{'a5':"+adcToH( A5 )+"}}");
    
  
}

void adcNice(){
  p("{'adcNice':{"\
	"'b0g':  "+adcToH( b0g )+"}}");
  
  p("{'adcNice':{"\
  	"'b01':  "+adcToH( b01 )+"}}");
  
  p("{'adcNice':{"\
  	"'b1p':  "+adcToH( b1p )+"}}");
  
  p("{'adcNice':{"\
  	"'outStage1':  "+adcToH( outStage1 )+"}}");
  
  p("{'adcNice':{"\
  	"'outStage2':  "+adcToH( outStage2 )+"}}");
    
}



void niceRaport(){
  adcRaw();
  //adcNice();
  
}

int bmpiter = 0;


bool cmdLed(String cmd){
	if(cmd.substring(0,4) == "led:"){
		if(cmd.substring(4,5)=="1"){
			digitalWrite(LED_BUILTIN, HIGH);
			//delay(5000);
			return true;
		}else if(cmd.substring(4,5)=="0"){
			digitalWrite(LED_BUILTIN, LOW);
			//delay(5000);
			return true;
		}
	}else if(cmd.substring(0,4) == "ping"){
		p(F("#ping"));
		pcs(F("pong"));
		
	}else if(cmd.substring(0,4) == "wait"){
		p(F("#wait"));
		pcs(F("wait"));
		delay(5000);
		
		
	}else if(cmd.substring(0,4) == "echo"){
		//p(F("#echo"));
		delay(100);
		p(String(cmd.substring(5)));
		delay(100);		
	}
	
	return false;
}


String cmd = "";
char nc;
char buf[33];
int charN = 0;



char getChkSum(String msg){
	int crc = 0;
	int i;
		for (i = 0; i < msg.length(); i ++) {
		crc ^= msg[i];
	}

	return crc;
}

int serialGot(){
	String bs = "";
	bs = String(buf);
	p("ard serialGot:"+bs+"<<");

	int bl = bs.length();
	//pS("msg:"+String(bs.substring(0,bl-3)));
	//pS("*:"+String(bs.substring(bl-3,bl-2)));
	//pS("chks:"+String(bs.substring(bl-2,bl)));
	
	if( bl> 2 and bs.substring(bl-3,bl-2)== "*"){ // a*93
		String m = bs.substring(0,bl-3);
		String ch = bs.substring(bl-2,bl);
		p("chk:"+ch);
		p("chkLocal:"+getChkSum(m));
	}
	
	//return 0;
	if( buf[0] == '$' ){
		//p(F("got command, processing ..."));
		cmd = bs.substring(1);
		//p("command:"+String(cmd));
		
		if( cmdLed(cmd) )
			return 0;
		
	}
		
	return -1;

}

bool serialActionRunning = false;

bool serialAction(){
	
	if( serialActionRunning )
		return 0;
	
	serialActionRunning = true;
	
	
	if( 1 ){
		while(SSerial.available()){
			nc = char(SSerial.read());
			buf[charN] = nc;
			if( nc == '\n' || nc == '\r' || charN > 32 ){
				buf[charN] = 0;
				if( SerialHardwareEnable ){
					//Serial.println("got Line");
				}
        //Serial.print(buf);
				serialGot();
				charN=0;
			}else
				charN++;
		}
	}
	
	
	if( SerialHardwareEnable ){
		//Serial.print("#");
		while(Serial.available()){
			nc = char(Serial.read());
			buf[charN] = nc;
			if( nc == '\n' || charN > 32 ){
				buf[charN] = 0;
				Serial.println("got Line");
				serialGot();
				charN=0;
			}else
				charN++;
		}
	}
	serialActionRunning = false;
}


long getMsMore(long every){
	return ((getMs()+every));//%5000);
}
long getMs(){
	return millis();//(millis()%5000);
}

bool ticchk(long sMs, long target, long every ){
    if( sMs > target and (target+every)<sMs )
        return true;
    //else if( sMs < target and ( target-every ) > sMs )
    //    return true;
    
    return false;
}

// the loop function runs over and over again forever

long dLs = 0;
long dLloopEvery = 5000;
long dLloopNext = 0;
long dLbatMuxEvery = 1000;
long dLbatMuxNext = 0;
long dLpachREvery = 5000;
long dLpachRNext = 0;
long dLserEvery = 1;
long dLserNext = 0;

long dLiters = 0;
int loIter = 0;

void loop(){
	tasker.loop();
	//delay(500);
	//SSerial.print("abc");
}
/*
void loop_old() {
	
	
	
	while( 0 ){
		//if( (loIter++%100) == 0 )
		//	Serial.println(String(loIter));
		serialAction();
		
				
	}
	
	dLs = getMs();
	dLiters++;
	
	if( ticchk(dLs, dLloopNext, dLloopEvery) ){
		ledOn();
		//p("l"+String(dLiters)+" ms:"+String(dLs));
		pcs("{'batMux':{'iter':"+String(loIter)+"}}");
		//p("dLs"+String(dLs)+"	next"+String(dLloopNext)+"	every"+String(dLloopEvery));
		loIter++;
		dLiters = 0;
		
		dLloopNext = getMsMore(dLloopEvery);
		ledOff();
	}
	

	serialAction();
	
	
	if( ticchk(dLs, dLbatMuxNext, dLbatMuxEvery) ){
		batMux();
		dLbatMuxNext = millis()+dLbatMuxEvery;
	}
	
	
	if( ticchk(dLs, dLpachRNext, dLpachREvery ) ) {
		pachpachRaport();
		dLpachRNext = millis()+dLpachREvery;
	}
	
  //runner.execute();
  //adcRaw();
  //adcNice();

  //basicMultiplexer();
  
  //b0b1Test();
  //digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)

  //swTest();
  
  //delay(100); // wait for a second
   
}
*/
