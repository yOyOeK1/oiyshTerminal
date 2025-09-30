#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/wait.h>

#include "./mRigoldsHelper.c"

#define PORT 8089
#define BUFFER_SIZE 1024

char cq[512];
char cqRes[512];

int main() {

    printf("ok\n");
    mRigol("abc", cqRes);
    printf("now :%s\n",cqRes);


    int server_fd, new_socket, valread;
    struct sockaddr_in address;
    int opt = 0;
    int addrlen = sizeof(address);
    char buffer[BUFFER_SIZE] = {0};
    const char *hello = "Hello from server";

    // Create socket file descriptor
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    // Set socket options to reuse address and port
    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt))) {
        perror("setsockopt failed");
        exit(EXIT_FAILURE);
    }

    // Prepare the sockaddr_in structure
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY; // Listen on all available interfaces
    address.sin_port = htons(PORT); // Convert port number to network byte order

    // Bind the socket to the specified IP and port
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }

    // Listen for incoming connections
    if (listen(server_fd, 3) < 0) { // 3 is the backlog queue size
        perror("listen failed");
        exit(EXIT_FAILURE);
    }

    printf("Server listening on port %d...\n", PORT);

    // Accept a new connection
    if ((new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
        perror("accept failed");
        exit(EXIT_FAILURE);
    }

    printf("Connection accepted.\n");

    close(server_fd);
    if( !fork() ){

        while( 1 ){
            // Read data from the client
            //valread = read(new_socket, buffer, BUFFER_SIZE);
            recv(new_socket, buffer, BUFFER_SIZE, 0) ;
            valread = strlen(buffer);
            if( valread > 0){
                
                strcpy( cq, buffer );
                buffer[0] = 0;
                cq[ valread-1 ] = 0;
                printf("Client: [%s]\nval[%i]\n", cq,valread);
                
                
                //printf( "cq is [%s] ", cq);
                mRigol( cq, cqRes );
                if( 0 == strcmp( "", cqRes) ){
                    printf("cqRes - is empty\n");
                }else{
                    printf("cqRes To send: [%s]\n",cqRes);
                    cqRes[ strlen( cqRes ) ] = '\n';
                    send(new_socket, cqRes, strlen(cqRes), 1);
                }
                
                
                //strcpy( cqRes, "");
            }
            printf("loop done \n");
        }
        
    }
        
        // Send a response to the client
        //send(new_socket, hello, strlen(hello), 0);
        //printf("Hello message sent to client.\n");
        
    
    
    close(new_socket);
    
    // Close the sockets

    return 0;
}