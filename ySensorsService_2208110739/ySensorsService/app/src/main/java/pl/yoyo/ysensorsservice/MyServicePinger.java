package pl.yoyo.ysensorsservice;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.util.Timer;
import java.util.TimerTask;

public class MyServicePinger extends TimerTask {

    private String TAG = "MySPinger";
    private Context context;
    private int iter = 0;
    private Timer timer;
    private MyService myS;


    public MyServicePinger( Context context, int iterIs, MyService myS ){
        this.context = context;
        timer = new Timer();
        this.iter = iterIs;
        this.myS = myS;
    }

    public void makeItRunning(){
        myS.servPingerWork = true;
        timer.schedule( new MyServicePinger( context, iter+1, this.myS ), 5000 );
    }


    public void run(){
        if( myS != null ){
            myS.mqtt.publish("stat/ping",""+iter);
            myS.mqtt.publish("stat/accel",""+myS.mMag.accelCount);
            myS.mqtt.publish("stat/mag",""+myS.mMag.magCount);
            myS.mqtt.publish("stat/ll",""+myS.mll.llCount);
            myS.mqtt.publish("stat/mqttPub",""+myS.mqtt.publishCount);
            myS.mqtt.publish("stat/mqttGot",""+myS.mqtt.gotMsgCount);
            myS.mqtt.publish("stat/speedSet",""+myS.speedSet);

        }else{
            Log.d(TAG,"mserv = null");
        }
        /*
        try {
            Intent i = new Intent();
            i.setAction("pl.yoyo.ysensorsservice.service");
            i.putExtra("action", "mqPush");
            i.putExtra("topic", "stat");
            i.putExtra("statList","ping,accel,mag,ll,mqttPub,mqttGot,speedSet");
            i.putExtra("stat",
                    iter+","+
                    myS.mMag.accelCount+","+ myS.mMag.magCount+","+myS.mll.llCount+","+
                    myS.mqtt.publishCount+","+myS.mqtt.gotMsgCount+","+myS.speedSet);
            context.sendBroadcast(i);
        } catch (Exception e) {
            Log.e(TAG, "onSenChan err : " + e.toString());
        }

         */

        if( myS.servPingerWork )
            makeItRunning();
    }


    public void makeItStop() {
        myS.servPingerWork = false;
    }

}
