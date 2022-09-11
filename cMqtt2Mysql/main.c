
/*
 *
 * mqtt to mysql handler
 * check mysql* and mqtt* variables to your needs
 * sufixTest - is a sufix for topic for testing on production it should be ""
 *

 CREATE TABLE `topics` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `topic` varchar(255) COLLATE utf8_bin NOT NULL,
     `entryDate` int(11) NOT NULL,
     PRIMARY KEY (`id`)
 ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
 AUTO_INCREMENT=1 ;

 CREATE TABLE `msgs` (
     `id` int(11) NOT NULL AUTO_INCREMENT,

     `idTopic` int(11) NOT NULL,
     `idUser` int(11) NOT NULL,

     `msg` varchar(255) COLLATE utf8_bin NOT NULL,
     `entryDate` int(11) NOT NULL,
     PRIMARY KEY (`id`)
 ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
 AUTO_INCREMENT=1 ;


 */

#define VER 2022.02.09

#include <stdio.h>
#include <mysql.h>
#include <mosquitto.h>
#include <unistd.h>
#include <pthread.h>
#include <time.h>

char *mysqlHost = "192.168.43.1";
int mysqlPort = 3306;
char *mysqlDb = "svoiysh";
char *mysqlUser = "ykpu";
char *mysqlPasswd = "pimpimpampam";

char *mqttHost = "192.168.43.1";
int mqttPort = 10883;
char *mqttClientId = "cMqtt2Mysql";

char *sufixTest = "cP";

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
};
int topicsCount = 0;

struct topic * topics;

struct msg msgs[BUFMAX];
int msgInStack = 0;

MYSQL *con;
struct mosquitto *mosq1;



int topicIdIs( char *topic ){
	for(int t=0;t<topicsCount;t++)
		if( strcmp(topics[t].topic, topic ) == 0 )
			return topics[t].id;

	return NULL;
}

void topicPut( int id, char *topic){
	//printf("topicPut id:%i topic:%s\n",id,topic);

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

	topicsCount++;
	//free(tmp);

	//for(int t=0;t<topicsCount;t++)
	//	printf("top: %i id[%i] -> %s\n",t,topics[t].id, topics[t].topic);

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

int getTopicId(char *topic){
	int id = topicIdIs( topic );
	if( id != NULL ){
		//printf("topic from cashe\n");
		return id;
	}

	snprintf( qbuf, 1024, "select id from topics where topic like \"%s%s\";", sufixTest, topic );
	id = sqlGetOneInt( qbuf );

	if( id == NULL ){
		printf("no topic in db add it...[%s]\n",topic);
		snprintf( qbuf, 1024,
			"insert into topics ( topic, entryDate ) values ( \"%s%s\", %i );",
			sufixTest,
			topic,
			(int)time(NULL)
			);

		id = sqlInsert( qbuf);
		topicPut( id, topic );
		printf("topic from insert\n");

	}else{
		topicPut( id, topic );
		printf("topic from select\n");

	}



	return id;
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

	return NULL;
}


MYSQL_RES * sqlQuery( char *query ){
	int qStat = mysql_query(con, query);
	if( qStat !=0){
		printf("Query failed  with the following message:\n");
		printf("%s\n", mysql_error(con));
	}else{
		//printf("The auto-generated ID is: %ld\n", (long) mysql_insert_id(con));


		return mysql_store_result( con );
	}

	return NULL;
}

int sqlGetOneInt( char *query ){
	MYSQL_RES *res = sqlQuery( query );
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
	putMsg( message->topic, message->payload );

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
void *myThread( void *vargp){
	while( true ){
		printf("iter...%i\n",msgInStack);
		sleep(1);
		if( msgInStack ){
			add = 0;

			strcpy( qbufB, "insert into msgs ( idTopic, msg, idUser, entryDate ) values ");

			for(int m=0;m<BUFMAX;m++){
				if( msgs[m].inDb == 1 ){
					msgs[m].topicId = getTopicId( msgs[m].topic );

					//insert into msgs ( idTopic, msg, idUser, entryDate ) values ( 127, "10158", 999, 1644411965 ),( 127, "10158", 999, 1644411965 ),( 127, "10158", 999, 1644411965 );

					//printf("add msg ...[%s] -> [%s]\n",msgs[m].topic,msgs[m].msg);
					/*snprintf( qbuf, 1024,
						"insert into msgs \
							( idTopic, msg, idUser, entryDate ) values \
							( %i, \"%s\", 0, %i );",
						msgs[m].topicId, msgs[m].msg, msgs[m].entryDate
						);
						*/

					if( add == 0 )
						snprintf( qbuf, 1024,
							" ( %i, \"%s\", 999, %i ) ",
							msgs[m].topicId, msgs[m].msg, msgs[m].entryDate
							);
					else
						snprintf( qbuf, 1024,
							", ( %i, \"%s\", 999, %i ) ",
							msgs[m].topicId, msgs[m].msg, msgs[m].entryDate
							);

					strcat(qbufB, qbuf);

					msgs[m].inDb = 0;
					msgInStack--;
					add++;
				}

			}
			if( add > 0 ){
				strcat(qbufB,";");
				//printf("q: %s\n",qbufB);
				int id = sqlInsert( qbufB);
				printf("added %i\n",add);
			}
		}

	}

}


int main(){

	printf("hello it's a c mqtt 2 mysql demon!\n");

	//msgs[0].inDb = 10;
	//strcpy(msgs[0].topic, "ala ma kota");
	//printf("[0] of inDB %i\n", msgs[0].inDb);
	//printf("[0] of topic %s\n", msgs[0].topic);


	if( 0 ){ // topic casher tests
		printf("topics size %i\n",topicsCount );

		topicPut(1, "abc1");
		printf("topics size %i\n",topicsCount );

		//printf("topic[0].id %i 1: %i\n", topics[0].id, topics[1].id);

		topicPut(2, "abc2");
		topicPut(21, "abc/abc");
		printf("topics size %i\n",topicsCount );


		printf("get id of abc2: %i",topicIdIs("abc2"));

		exit(0);
	}

	sqlConnect();
	sqlGetTopicsCount();

	pthread_t thread_id;
	pthread_create( &thread_id, NULL, myThread, NULL );
	//pthread_join( thread_id, NULL );

	mqttInit();
	mqttDoIt();

}
