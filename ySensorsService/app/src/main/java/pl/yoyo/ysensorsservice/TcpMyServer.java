package pl.yoyo.ysensorsservice;

import android.os.Handler;
import android.util.Log;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public class TcpMyServer extends Thread{

    private static String TAGi = "TcpSer -> sRead";
    private String TAG = "TcpSer";
    private static List<Socket> clients;


    public TcpMyServer(){
        clients = new ArrayList<Socket>();
    }

    @Override
    public void run(){
        try {
            Log.i(TAG,"socket ...");
            ServerSocket serverSocket = new ServerSocket(19889 );

            while( true ){
                Log.i(TAG, "iter ...");
                Socket socket = serverSocket.accept();
                Log.i(TAG, "start reader ....");
                clients.add( socket );
                startPinger();
                startReader( socket );

            }

        } catch (IOException e) {
            Log.e(TAG,"server socket error:"+e.toString());
        }

    }

    private int pingerRunning = 0;

    private void startPinger() {
        Thread t = new Thread() {
            @Override
            public void run() {
                pingerRunning++;
                if (haveClients()) {
                    serverSendMessage("$YSPING,,\r\n");
                }
                try {
                    sleep(1000);
                    pingerRunning--;
                    if( pingerRunning == 0)
                        startPinger();

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };
        t.start();
    }


    private static void startReader( final Socket mSoc ){
        Log.i(TAGi, "start Reader in");
        new Thread(){
            @Override
            public void run() {
                try {

                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(mSoc.getInputStream(),"utf-8")
                        );
                    String line="";
                    while ((line = in.readLine()) != null) {
                        Log.i(TAGi,"got line :"+ line);
                    }
                    Log.i(TAGi, "lost connectien ?");
                    clients.remove( mSoc );
                } catch (IOException e) {
                    Log.e(TAGi," got error :"+e.toString() );
                }
            }
        }.start();
        Log.i(TAGi, "start Reader DONE");
    }

    public static void serverSendMessage(String mServerSendMessage) {
        Log.i(TAGi,"send msg got clients:"+clients.size());
        new Thread() {
            @Override
            public void run() {
                PrintWriter out;
                try {
                    for( int c=0; c<clients.size(); c++ ) {
                        Socket mSoc = clients.get(c);
                        out = new PrintWriter(
                                new BufferedWriter(
                                        new OutputStreamWriter(mSoc.getOutputStream())),
                                true
                        );
                        out.println(mServerSendMessage);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    public boolean haveClients() {
        if( clients.size() > 0 )
            return true;
        return false;
    }
}
