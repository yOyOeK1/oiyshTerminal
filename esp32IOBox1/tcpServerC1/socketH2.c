#include <stdio.h> 
#include <netdb.h> 
#include <netinet/in.h> 
#include <stdlib.h> 
#include <string.h> 
#include <sys/socket.h> 
#include <sys/types.h> 
#include <unistd.h> // read(), write(), close()
#define MAX 80 
#define PORT 8091
#define SA struct sockaddr 
  
#include "./mRigoldsHelper.c"

char cq[512];
char cqRes[512];


// Function designed for chat between client and server. 
void func(int connfd) 
{ 
    char buff[MAX]; 
    int n; 
    // infinite loop for chat 
    strcpy(cqRes,"");
    for (;;) { 
        bzero(buff, MAX); 
  
        ssize_t bRead;
        // read the message from client and copy it in buffer 
        bRead = read(connfd, buff, sizeof(buff)); 
        // print buffer which contains the client contents 
        //printf("From client: [%s]\n", buff); 
        
        if (bRead == 0) {
            // Client gracefully disconnected (sent FIN packet)
            printf("Client disconnected from\n");
            break;
        } else if (bRead < 0) {
            // Error during read (e.g., connection reset by peer)
            perror("read error");
        }


        buff[ strlen( buff ) - 1 ] = 0;
        cqRes[0] = 0;
        mRigol( buff, cqRes );
        if( strcmp(cqRes,"") == 0 ){
            printf("cqRes - is empty\n");
            write(connfd, "1", 1);
        }else{
            //if( !fork() ){

                //cqRes[ strlen( cqRes ) ] = '\n';
                //cqRes[ strlen( cqRes )+1 ] = 0;
                printf("cqRes To send: [%s]\n",cqRes);
                //printf("1");
                write(connfd, cqRes, strlen(cqRes));
                //printf("2");
            //}
        }
        //printf("3");


        // and send that buffer to client 
        //write(connfd, buff, sizeof(buff)); 
        
        // if msg contains "Exit" then server exit and chat ended. 
        
    } 
    close(connfd);
} 
  
int main8(){
    printf("mian \n");
    return 0;
}


// Driver function 
int main() 
{ 
    int sockfd, connfd, len; 
    struct sockaddr_in servaddr, cli; 
  
    // socket create and verification 
    sockfd = socket(AF_INET, SOCK_STREAM, 0); 
    if (sockfd == -1) { 
        printf("socket creation failed...\n"); 
        exit(0); 
    } 
    else
        printf("Socket successfully created..\n"); 
    bzero(&servaddr, sizeof(servaddr)); 
  
    // assign IP, PORT 
    servaddr.sin_family = AF_INET; 
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY); 
    servaddr.sin_port = htons(PORT); 
  
    // Binding newly created socket to given IP and verification 
    if ((bind(sockfd, (SA*)&servaddr, sizeof(servaddr))) != 0) { 
        printf("socket bind failed...\n"); 
        exit(0); 
    } 
    else
        printf("Socket successfully binded..\n"); 
  
    // Now server is ready to listen and verification 
    if ((listen(sockfd, 5)) != 0) { 
        printf("Listen failed...\n"); 
        exit(0); 
    } 
    else
        printf("Server listening..\n"); 
    len = sizeof(cli); 
  
    // Accept the data packet from client and verification 
    while(1){

        connfd = accept(sockfd, (SA*)&cli, &len); 
        if (connfd < 0) {   
            printf("server accept failed...\n"); 
            exit(0); 
        } 
        else
            printf("server accept the client...\n"); 

        // Function for chatting between client and server 
        //if( !fork() )
        //write(connfd, "hello\n", 6);
        //write(connfd, "hell2\n", 6);
                        
        func(connfd); 
        //close(connfd);
    }   

// After chatting close the socket 
    close(sockfd); 
}