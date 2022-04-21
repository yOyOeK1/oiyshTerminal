
/*
cIMUExtractor


*/

#define VER 2022.02.19

#include <stdio.h>
#include <stdlib.h>
#include <mysql.h>
#include <mosquitto.h>
#include <unistd.h>
#include <pthread.h>
#include <time.h>


#include "appConfig.h"
/*
char *mqttHost = "192.168.43.1";
int mqttPort = 10883;
char *mqttClientId = "cIMUExtractor";
char *ItPrefix = "IMU";
char *IMUsrc = "and";
char *sufixTest = "IMU";
*/


#define BUFMAX 4098

struct mosquitto *mosq1;
int mqMsgCount = 0;

char *topic = NULL;
char *message = NULL;
int mid_sent = 0;


int avgTotal = 0;

bool heelZeroSet = false;
char *heelTopic;
float heelLast;
float heelDeadZero;
float heelAvg1;
float heelMin,heelMax;


bool pitchZeroSet = false;
char *pitchTopic;
float pitchLast;
float pitchDeadZero;
float pitchAvg1;

bool hdgZeroSet = false;
char *hdgTopic;
float hdgLast;
int hdg;

float hdgToHeel[360];




struct timespec tv;
long getMs(){
	clock_gettime(CLOCK_REALTIME, &tv);
	//tv.tv_sec*1000+
	return tv.tv_sec*1000 + tv.tv_nsec/1e6;
}

void on_connect(struct mosquitto *mosq, void *obj, int result)
{
  int rc = MOSQ_ERR_SUCCESS;

	printf("connect\n");
    if(!result){
        mosquitto_subscribe(mosq, NULL, "e01Mux/#", 0);
        printf("subscribed\n");

				char *IMUsrcSubTopic;
				asprintf( &IMUsrcSubTopic, "%s/#", IMUsrc );
				mosquitto_subscribe(mosq, NULL, IMUsrcSubTopic, 0);
        printf("subscribed [%s]\n",IMUsrcSubTopic);

				char *ItPrefixSubTopic;
				asprintf( &ItPrefixSubTopic, "%s/#", ItPrefix );
				mosquitto_subscribe(mosq, NULL, ItPrefixSubTopic, 0);
				printf("subscribed [%s]\n",ItPrefixSubTopic);


    }else{
        fprintf(stderr, "%s\n", mosquitto_connack_string(result));
    }
}


void on_publish_callback(struct mosquitto *mosq, void *obj, int mid)
{
	//printf("on_publish\n");
}



void on_message(struct mosquitto *mosq, void *obj, const struct mosquitto_message *message)
{
	//printf("mqtt msg\t%s --> [%i] %s\n", message->topic, message->payloadlen, message->payload);
	mqMsgCount++;


	if( strcmp( message->topic, heelTopic ) == 0 ){
		heelLast = atof(message->payload);
		if( heelZeroSet == false ){
			printf("got heel!\n");
			heelZeroSet = heelLast;
			heelDeadZero = heelLast;
			heelAvg1 = heelLast;
			heelMin = heelLast;
			heelMax = heelMax;
			heelZeroSet = true;

			for(int h=0;h<360;h++)
				hdgToHeel[h] = (float)0;

		}

		avgTotal++;

		if( heelMin > heelLast )
			heelMin = heelLast;
		if( heelMax < heelLast )
			heelMax = heelLast;


		heelAvg1 = heelAvg1*0.9 + heelLast*0.1;

	} else if( strcmp( message->topic, pitchTopic ) == 0 ){
			pitchLast = atof(message->payload);
			if( pitchZeroSet == false ){
				printf("got pitch!\n");
				pitchZeroSet = pitchLast;
				pitchAvg1 = pitchLast;
				pitchDeadZero = pitchLast;
				pitchZeroSet = true;

			}

		pitchAvg1 = pitchAvg1*0.999 + pitchLast*0.001;

	}	else if( strcmp( message->topic, hdgTopic ) == 0 ){
		hdgLast = atof(message->payload);
		hdg = (int)hdgLast;

		if( hdgZeroSet == false ){
			printf("got hdg!\n");
			hdgZeroSet = true;

		}

		if( heelZeroSet ){
			//printf("set heel: %f to hdg: %i\n", heelLast, hdg);
			hdgToHeel[ hdg ] = hdgToHeel[ hdg ]*0.99 + heelLast*0.01;
		}

	}






}

void mqttInit(){
	printf("mqtt - init ...\n");
	mosquitto_lib_init();
	mosq1 = mosquitto_new( NULL, true, NULL);
	mosquitto_connect_callback_set( mosq1, on_connect );
	mosquitto_message_callback_set( mosq1, on_message );
	mosquitto_publish_callback_set( mosq1, on_publish_callback);
	mosquitto_connect( mosq1, mqttHost, mqttPort, 60 );

}

void mqttDoIt(){
	mosquitto_loop_forever(mosq1, -1, 1);
	mosquitto_destroy(mosq1);
    mosquitto_lib_cleanup();

}

float windComs = -1;
float hthLast = -1;
float avgEntrys = 0;
int avgCount = 0;
float avgLast = 0;

long tLast = 0;
long tNow = 0;
long tCount = 0;

float thdgLast;
float thdgDiff;

float hdgAngleSpeed = 0; // rad / sec
float hdgAngleSpeedLast = 0;
float hdgAngleAccel = 0; // rad / sec^2

void displayIt(){
	//printf("\e[1;1H\e[2J");
	tNow = getMs();


	tCount = tNow - tLast;
	thdgDiff = hdgLast - thdgLast;
	hdgAngleSpeed = 1000*thdgDiff / tCount;

	asprintf( &message, "%f", hdgAngleSpeed);
	mosquitto_publish( mosq1, &mid_sent, "cIMU/hdgAngleSpeed", sizeof(message), message, 0, 0 );


	hdgAngleAccel = 1000*( hdgAngleSpeed - hdgAngleSpeedLast ) / tCount;

	asprintf( &message, "%f", hdgAngleAccel);
	mosquitto_publish( mosq1, &mid_sent, "cIMU/hdgAngleAccel", sizeof(message), message, 0, 0 );



	printf("ms: %lld sinceLast: %lld ms\n", tNow, tCount );
	printf("\n-------------------- avg count: %i\n",avgTotal);
	printf("hdgLast: %f	speed: %f	accel: %f",hdgLast, hdgAngleSpeed, hdgAngleAccel);
	printf("\n");

	printf("heelLast: %f	",heelLast);
	printf("pitchLast: %f	",pitchLast);

	printf("heel min max %f %f",heelMin, heelMax);
	printf("\n");

	printf("heelAvg1: %f	",heelAvg1);
	printf("pitchAvg1: %f	",pitchAvg1);

	printf("accelCorrect:%f,%f,0", pitchAvg1, heelAvg1);

	printf("\n");

	printf("heelDelt: %f	",heelLast-heelAvg1);
	printf("pitchDelt: %f	",pitchLast-pitchAvg1);


	printf("\n--------------------\n");




	for(int h=0; h<360; h++ ){
		if( hdgToHeel[h] > 0 || hdgToHeel[h]<0 ){
			avgEntrys+= hdgToHeel[h];
			avgCount++;


			if( h>0 && hdgToHeel[h-1] < avgLast && hdgToHeel[h] > avgLast  ){
				if( windComs == -1 )
					windComs = h;
				windComs = windComs*0.92 + h*0.08;
			}

			if( (h%2) == 0 ){
				if( h == hdg )
					printf("*");

				printf("h: %i	->	%f\n", h, hdgToHeel[h]);
			}
		}
	}

	avgLast = avgEntrys/(float)avgCount;
	printf("avgLast: %f\n",avgLast);





	asprintf( &message, "hello %i hdg", hdg);
	mosquitto_publish( mosq1, &mid_sent, "cIMU/test1", sizeof(message), message, 0, 0 );
	asprintf( &message, "%i", (int)windComs);
	mosquitto_publish( mosq1, &mid_sent, "cIMU/windComs", sizeof(message), message, 0, 0 );


	hdgAngleSpeedLast = hdgAngleSpeed;
	thdgLast = hdgLast;
	tLast = tNow;

}

int add = 0;
char qbufB[10240];
void *myThread( void *vargp){
	while( true ){
		printf("iter...%i\n",mqMsgCount);
		mqMsgCount = 0;

		displayIt();

		heelMin = 180.0;
		heelMax = -180.0;

		sleep(1);

	}

}



int main(  int argc, char *argv[] ){

	printf("hello it's a c imu extractor\n");

	printf("argc:	%i\n",argc);
	for( int a=0; a<argc; a++){
		printf("argv[%i]: %s\n",a, argv[a]);

	}



	//exit(0);

	//msgs[0].inDb = 10;
	//strcpy(msgs[0].topic, "ala ma kota");
	//printf("[0] of inDB %i\n", msgs[0].inDb);
	//printf("[0] of topic %s\n", msgs[0].topic);



	asprintf( &heelTopic, "%s/orient/heel", IMUsrc );
	asprintf( &pitchTopic, "%s/orient/pitch", IMUsrc );
	asprintf( &hdgTopic, "%s/mag", IMUsrc );


	pthread_t thread_id;
	pthread_create( &thread_id, NULL, myThread, NULL );
	//pthread_join( thread_id, NULL );

	mqttInit();
	mqttDoIt();

}
