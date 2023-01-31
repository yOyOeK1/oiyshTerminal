
/*
 *
 * mqtt to mysql handler 2
 * check mysql* and mqtt* variables to your needs
 * sufixTest - is a sufix for topic for testing on production it should be ""
 *

 CREATE TABLE `[sufixTest]TOPIC/FROM/MQTT` (       << - "/" is replace by "_"
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `msg` varchar(255) COLLATE utf8_bin NOT NULL,
     `entryDate` int(11) NOT NULL,
     PRIMARY KEY (`id`)
 ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
 AUTO_INCREMENT=1 ;

# 2022.04.15
[+] - add topic ignore filter
	compering is from start of topic not in middle
# 2022.04.14
[+] - topic message go to it's own table
	table name is [sufix][topic]  where topic have "/" replace with "_"
 */

#define VER 2022.04.15

#include <stdio.h>
#include <mysql.h>
#include <mosquitto.h>
#include <unistd.h>
#include <pthread.h>
#include <time.h>

#include "myWords.h"

char *mysqlHost = "127.0.0.1";
int mysqlPort = 3306;
char *mysqlDb = "svoiysh";
char *mysqlUser = "ykpu";
char *mysqlPasswd = "pimpimpampam";

char *mqttHost = "127.0.0.1";
int mqttPort = 10883;
char *mqttClientId = "cMqtt2Mysql";

char *sufixTest = "topic_";


char *topicDrop[] = {
	"and/",
	"NR/",
	"cIMU/",
	"subP/",
	0
	};



#define BUFMAX 4098

struct msg{
	int inDb;
	char topic[BUFMAX];
	int topicId;
	char msg[BUFMAX];
	int entryDate;

};
int msgsCount = 0;

struct topic{
	int id;
	char topic[BUFMAX];
	char tableName[BUFMAX];
};
int topicsCount = 0;

struct topic * topics;

struct msg msgs[BUFMAX];
int msgInStack = 0;

MYSQL *con;
struct mosquitto *mosq1;


bool sqlIsTable( char *tableName );
void sqlCreateTopicTable( char *tableName );
int chkIfDropIt( char *topic );



struct topic topicPut( int id, char *topic, char *tableName){
	struct topic tmp[topicsCount];
	for(int t=0;t<topicsCount;t++){
		tmp[t] = topics[t];
	}

	topics = malloc( (topicsCount+1)*sizeof(struct topic) );

	for(int t=0;t<topicsCount;t++){
		topics[t] = tmp[t];
	}


	topics[ topicsCount ].id = id;
	strcpy( topics[topicsCount].topic, topic );
	strcpy( topics[topicsCount].tableName, tableName );

	topicsCount++;

	return topics[ (topicsCount-1) ];

}



int putMsg( char *topic, char *msg){
	for(int m=0;m<BUFMAX;m++){
		//printf("msg %i -> %i\n", m, msgs[m].inDb);
		if( msgs[m].inDb == 0 ){
			msgs[m].inDb = 1;
			msgs[m].entryDate = (int)time(NULL);
			//printf("ts %i\n", msgs[m].entryDate);
			strcpy(msgs[m].topic, topic);
			strcpy(msgs[m].msg, msg);
			//printf("	put in %i\n",m);
			msgInStack++;
			return 0;
		}
	}
	return 1;
}

char qbuf[1024];

int getTopicIndex( char *topic ){
	for(int t=0;t<topicsCount;t++)
		if( strcmp(topics[t].topic, topic ) == 0 )
			return t;

	return -1;
}

struct topic getTopic(char *topic){
	int index = getTopicIndex( topic );
	if( index != -1 ){
		//printf("topic from cashe\n");
		return topics[index];
	}

	char *tableName = replaceWord(topic, "/", "_");

	if( sqlIsTable( tableName ) == false ){
		sqlCreateTopicTable( tableName );
		return topicPut( 1, topic, tableName );
	}else{
		return topicPut( 1, topic, tableName );
	}


}


bool sqlConnect(){
	printf("sql - connect to mysql\n");
	con = mysql_init(NULL);
	if( mysql_real_connect(con, mysqlHost, mysqlUser, mysqlPasswd, mysqlDb, mysqlPort, NULL, 0) == NULL)
  	{
		printf("The authentication failed with the following message:\n");
		printf("%s\n", mysql_error(con));
		return false;
	}
	printf("sql - connected :) \n");

	return true;
}


int sqlInsert( char *query ){
	int qStat = mysql_query(con, query);
	if( qStat !=0){
		printf("Query failed  with the following message:\n");
		printf("%s\n", mysql_error(con));
	}else{
		return (long) mysql_insert_id(con);
	}

	return 0;
}


MYSQL_RES * sqlQuery( char *query ){
	int qStat = mysql_query(con, query);
	if( qStat !=0){
		printf("\nee - Query failed  with the following message:\n");
		printf("%s\n", mysql_error(con));
	}else{
		//printf("The auto-generated ID is: %ld\n", (long) mysql_insert_id(con));


		return mysql_store_result( con );
	}

	return NULL;
}

int sqlGetOneInt( char *query ){
	MYSQL_RES *res = sqlQuery( query );
	if( res == 0 ) // if error
		return NULL;

	MYSQL_ROW row = mysql_fetch_row( res );

	if( mysql_fetch_lengths(res) == 0 )
		return NULL;

	if( row[0] )
		return atoi( row[0] );
	else
		return NULL;

}



int sqlGetTopicsCount(){
	printf("sql - get topics count\n");

	char *q = "select count(id) from topics";
	MYSQL_RES *res = sqlQuery( q );
	MYSQL_ROW row = mysql_fetch_row( res );

	/*
	printf("one line query %i\n",
		sqlGetOneInt( "select count(id) from msgs;" )
	);
	*/


	printf("one line query one match [%i]\n",
		sqlGetOneInt( "select id from topics where topic like \"e01Mux/C\";" )
	);

	printf("one line query no match [%i]\n",
		sqlGetOneInt( "select id from topics where topic like \"ala ma kota\";" )
	);


}



void on_connect(struct mosquitto *mosq, void *obj, int result)
{
    int rc = MOSQ_ERR_SUCCESS;

	printf("connect\n");
    if(!result){
        mosquitto_subscribe(mosq, NULL, "#", 0);
        printf("subscribed\n");
    }else{
        fprintf(stderr, "%s\n", mosquitto_connack_string(result));
    }
}


void on_message(struct mosquitto *mosq, void *obj, const struct mosquitto_message *message)
{
	//printf("mqtt msg\t%s --> [%i] %s\n", message->topic, message->payloadlen, message->payload);

	if( chkIfDropIt( message->topic ) == 0 ){
		putMsg( message->topic, message->payload );
	}else{
		//printf("---------\ndrop msg topic [%s] \n-------------\n",message->topic);
	}
}

void mqttInit(){
	printf("mqtt - init ...\n");
	mosquitto_lib_init();
	mosq1 = mosquitto_new( NULL, true, NULL);
	mosquitto_connect_callback_set( mosq1, on_connect );
	mosquitto_message_callback_set( mosq1, on_message );
	mosquitto_connect( mosq1, mqttHost, mqttPort, 60 );

}

void mqttDoIt(){
	mosquitto_loop_forever(mosq1, -1, 1);
	mosquitto_destroy(mosq1);
    mosquitto_lib_cleanup();

}

int add = 0;
char qbufB[10240];
struct topic tmpTopic;
void *myThread( void *vargp){
	while( true ){
		printf("iter...%i\n",msgInStack);
		sleep(1);
		if( msgInStack ){
			add = 0;


			for(int m=0;m<BUFMAX;m++){
				if( msgs[m].inDb == 1 ){
					tmpTopic = getTopic( msgs[m].topic );

					strcpy( qbufB, "");
					snprintf( qbuf, 1024,
						"INSERT INTO `%s%s` (msg, entryDate) VALUES ( \"%s\", %i ); ",
						sufixTest, tmpTopic.tableName, msgs[m].msg, msgs[m].entryDate
						);

					strcat(qbufB, qbuf);
					msgs[m].inDb = 0;
					msgInStack--;
					add++;

					//printf("q: %s\n",qbufB);
					int id = sqlInsert( qbufB);
					//printf("added and id is %i\n",id);

				}

			}

		}

	}

}


char qCreateTopic[1024];
void sqlCreateTopicTable( char *tableName ){

	snprintf( qCreateTopic, 1024,
			"CREATE TABLE `%s%s` (`id` int(11) NOT NULL AUTO_INCREMENT,"
				"`msg` varchar(255) COLLATE utf8_bin NOT NULL,"
				"`entryDate` int(11) NOT NULL,"
				"PRIMARY KEY (`id`)"
	 	 	 	") ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin "
				"AUTO_INCREMENT=1 ;",
			sufixTest, tableName
			);
	printf("table to make %s\n",qCreateTopic);
	sqlQuery( qCreateTopic );
}


char qIsTable[1024];
bool sqlIsTable( char *tableName ){
	snprintf( qIsTable, 1024,
		"select 1 from `%s%s` limit 1;",
		sufixTest,
		tableName
		);

	MYSQL_RES *res = sqlQuery( qIsTable );
	if( res != 0 ){
		return true;
	}else{
		return false;
	}

}





int chkIfDropIt( char *topic ){
	//printf("chkIfDropIt %s ",topic);
	int ttd = 0;
	char strToComp[ 1024 ];
	int topicLen;
	while( true ){
		if( topicDrop[ttd] != 0 ){
			topicLen = strlen(topicDrop[ttd]);
			strncpy( strToComp, topic, topicLen );
			strToComp[ topicLen ] = 0;
			/*
			printf("\n	[%s] strToComp [%s] [%c] res is [%i]",
					topicDrop[ttd],strToComp, strToComp[topicLen-1],
					strcmp(strToComp, topicDrop[ttd])
					);
			*/
			if( strcmp(strToComp, topicDrop[ttd]) == 0 ){
				//printf(" score is %d ", strcmp(strToComp, topicDrop[ttd]));

				return 1;
			}

			ttd++;
		}else
			break;
	}

	return 0;
}


int main(){

	printf("hello it's a c mqtt 2 mysql demon!\n");


	if( sqlConnect() == false ){
		printf("sql server is down :( so bay :..(\n");
		exit(1);
	}

	if( 0 ){
		printf("testing topic ignore filter \n");
		printf("have topics to drop:\n");

		int i = 0;
		while( true ){
			if( topicDrop[i] != 0 ){
				printf("- %s\n",topicDrop[i]);
				i++;
			}else
				break;
		}


		printf("test func\n");
		printf( "res %i\n", chkIfDropIt("ala/ma/kota") );
		printf( "res %i\n", chkIfDropIt("test1/ma/kota") );
		printf( "res %i\n", chkIfDropIt("ttest2/ma/kota") );
		printf( "res %i\n", chkIfDropIt("test2/ma/kota") );
		exit(0);

	}

	if( 0 ){
		char strIn[512];
		strcpy( strIn, "ala maxx/xx kota");
		printf("test strreplace\n");
		printf("org:%s\n",strIn);
		char *strNew = replaceWord(strIn, "/", "_aa__");
		printf("mod:%s\n",strNew);

		exit(0);
	}

	if( 0 ){
		sqlIsTable("msgs");
		if( sqlIsTable("msgss") == false ){
			printf("it not existing create it then\n");
			sqlCreateTopicTable("msgss");
		}

		if( sqlIsTable("msgs2") == false ){
			printf("it not existing create it then\n");
			sqlCreateTopicTable("msgs2");
		}


		printf("see you ! papa\n");
		exit(0);
	}



	pthread_t thread_id;
	pthread_create( &thread_id, NULL, myThread, NULL );
	//pthread_join( thread_id, NULL );

	mqttInit();
	mqttDoIt();

}
