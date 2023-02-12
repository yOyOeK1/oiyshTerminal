package pl.yoyo.ysensorsservice;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.util.Timer;

public class MyMqtt {

    private String TAG = "MyMqtt";
    private MqttAndroidClient mqc;
    private MqttConnectOptions mqtOpt;
    private MySettings msett;
    public String prefix = "";
    public int publishCount = 0;
    public int gotMsgCount = 0;
    public boolean isConnected = false;
    private MyService mserv = null;
    private boolean reconnecting = false;
    private boolean workStatus;

    public MyMqtt( Context context, MyService thisMyService ) {

        Log.i(TAG, "init...");

        msett = new MySettings(context);
        this.prefix = msett.getSett("mqttPrefix") + "/";

        this.mserv = thisMyService;

        mqtOpt = new MqttConnectOptions();
        mqc = new MqttAndroidClient(
                context,
                msett.getSett("mqttUrl"),
                msett.getSett("mqttClientId")
        );

        Log.i(TAG, "set callbacks");
        mqc.setCallback(new MqttCallback() {
            @Override
            public void connectionLost(Throwable cause) {

                Log.i(TAG, "connection lost");
                isConnected = false;
                tryToReconnect(0);
            }

            @Override
            public void messageArrived(String topic, MqttMessage message) throws Exception {
                gotMsgCount++;
                Log.i(TAG, "message arrived...");
                Log.i(TAG, "   topic:" + topic.toString());
                Log.i(TAG, "   msg:" + message.toString());
                mserv.mCmdParser( message.toString() );
            }

            @Override
            public void deliveryComplete(IMqttDeliveryToken token) {
                //Log.i(TAG,"delivered !");
            }
        });



    }

    private Handler reHandler;
    private Runnable reconnect;
    public boolean tryToReconnect(int nr ){
        Log.i(TAG,"try to reconnect ..."+nr);

        if( reconnecting || workStatus == false )
            return true;

        reconnecting = true;

        reHandler = new Handler();
        reconnect = new Runnable() {
            @Override
            public void run() {
                Log.i(TAG, "    run .... reconnect to mqtt");
                if( isConnected == false && workStatus){
                    makeItRunning();

                    reHandler.postDelayed( reconnect, 3000);
                }else{
                    Log.i(TAG, "try to reconnect quit .. is connected now !");
                }
            }
        };
        if( isConnected == false ){
            reHandler.post( reconnect );
        }

        return true;
    }

    public void makeItRunning(){
        workStatus = true;

        try{
            mqc.connect(mqtOpt, null, new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    Log.i(TAG, "onSuccess");
                    isConnected = true;
                    reconnecting = false;
                    subscribeTopic();
                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    Log.i(TAG,"onFailure");
                    isConnected = false;
                    Log.i(TAG, exception.toString());
                    tryToReconnect(10);
                }
            });

            Log.i(TAG,"connected ?");
            if( mqc.isConnected()  == false ) {
                Log.i(TAG, "no");
            }else{
                Log.i(TAG, "yes!");
            }
        } catch( MqttException e){
            Log.e(TAG,e.toString());
        }

    }

    public int pushNotiEvery = 10;

    public boolean publish( String topic, String msg){

        if( mserv.doOverTcp && mserv!= null ) {
            mserv.sendTcp(topic + ":{" + msg + "}");
            return true;
        }

        if( mserv.doOverMqtt ) {
            //Log.i(TAG, "publish topic: "+topic+" msg: "+msg);

            try {
                if (isConnected) {
                    mqc.publish(this.prefix + topic,
                            mkMsg(msg)
                    );
                    this.publishCount++;


                } else {
                    Log.i(TAG, "publish NO ! is not connected ! " + topic + " -> " + msg);
                }
            } catch (Exception e) {
                Log.e(TAG, "publish e:" + e.toString());
            }
            return true;
        }
        return false;
    }

    public MqttMessage mkMsg(String msg){
        MqttMessage tr = new MqttMessage();
        tr.setPayload( msg.getBytes() );
        tr.setQos(0);
        return tr;
    }


    public void subscribeTopic(){
        try {
            mqc.subscribe(prefix+"cmd", 0, null, new IMqttActionListener() {

                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    Log.i(TAG, " subscribe to topic - onSuccess");

                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    Log.i(TAG, " subscribe to topic - onFailure");
                }
            });
        } catch ( MqttException e){
            Log.e(TAG," subscribe to topic - e"+e.toString());
        }
    }


    public boolean makeItStop() {
        workStatus = false;

        if( isConnected == false ) {
            Log.i(TAG,"mqc is down no need to disconnect !");
            return true;
        }
        try{
            mqc.disconnect(null, new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    Log.i(TAG, "disconnect - onSuccess");
                    isConnected = false;


                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    Log.i(TAG,"disconnect - onFailure");
                    Log.i(TAG, exception.toString());
                }
            });

            Log.i(TAG,"disconnected ?");
            try {
                if (mqc.isConnected() == false)
                    Log.i(TAG, "no");
                else
                    Log.i(TAG, "yes!");
            }catch (Exception e){
                Log.e(TAG,"error when checking isConnected():"+e.toString());
            }

        } catch( MqttException e){
            Log.e(TAG,e.toString());
        }

        return true;
    }
}
