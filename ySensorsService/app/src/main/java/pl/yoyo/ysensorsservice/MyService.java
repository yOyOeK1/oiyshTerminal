package pl.yoyo.ysensorsservice;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.hardware.SensorManager;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.os.PowerManager;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;

import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class MyService extends Service {

    private String TAG = "MySer";
    private Looper serviceLooper;
    public MyMqtt mqtt;
    public MyLocationListener mll;
    public MyMagnetometer mMag;
    public MyServicePinger mSerPin;
    public boolean servPingerWork;
    public String speedSet = "standby";

    public ConnectTcpTask conTcpTask;

    public TcpMyServer tcpSer;

    public int mTcpCounter = 0;
    public boolean doOverTcp = false;
    public boolean doOverMqtt = true;
    public boolean doTcpNmeaServer = true;

    private BroadcastReceiver broadcastReceiver;



    public void sensorsStop(){
        mll.makeItStop();
        mMag.makeItStop();


    }
    public void sensorsStart(){
        mMag.registerListeners(speedSet);
        if( speedSet.equals("standby") ) {
            mll.setIntervals(5000, 5);

        }else{
            mll.setIntervals(0, 0);

        }
    }

    public void thingsStart(){
        Log.i(TAG, "thingsStart()....speedSet:"+speedSet);

        if( doOverMqtt )
            mqtt.makeItRunning();

        if( doOverTcp ) {
            Log.i(TAG, "    tcp client....");
            conTcpTask = new ConnectTcpTask();
            conTcpTask.execute("");
        }

        Log.i(TAG,"     server pinger");
        mSerPin.makeItRunning();

        Log.i(TAG,"     sensors......");
        sensorsStart();


        new Thread() {
            @Override
            public void run() {
                tcpSer.start();
            }
        }.start();



    }


    public void thingsStop(){
        Log.i(TAG,"thingsStop().....");
        mSerPin.makeItStop();

        if( doOverMqtt ) {
            Log.i(TAG, "thingsStop().....mqtt ...");
            mqtt.makeItStop();
        }

        if( doOverTcp ) {
            Log.i(TAG, "tcp task stop .....");
            if (conTcpTask.mTcpClient != null) {
                conTcpTask.mTcpClient.stopClient();
            } else {
                Log.i(TAG, "tcp task is null ! no stop action");
            }
        }

        Log.i(TAG,"thingsStop()..... sensors ...");
        sensorsStop();
    }

    public void killAll(){
        Log.i(TAG, "killAll ....");
        thingsStop();
        stopSelf();
        try {
            finalize();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        Log.i(TAG, "killAll .... DONE");
    }


    private Handler handler;
    private Runnable runnable;
    private final int runTime = 5000;

    @Override
    public void onCreate() {
        super.onCreate();

        Log.i(TAG, "onCreate");




        mqtt = new MyMqtt( getBaseContext(), getThisMyService() );
        mSerPin = new MyServicePinger( getBaseContext(), 0, this );


        tcpSer = new TcpMyServer();



        mll = new MyLocationListener();
        mll.setLocationManager( (LocationManager) getSystemService(Context.LOCATION_SERVICE) );
        mll.setContext( getBaseContext() );


        mMag = new MyMagnetometer();
        mMag.setContext( getBaseContext() );
        mMag.setSensorManager( (SensorManager)getSystemService(SENSOR_SERVICE) );



        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            String CHANNEL_ID = "ySS";
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
                    "Channel human readable title",
                    NotificationManager.IMPORTANCE_DEFAULT);

            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(channel);

            Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("ySS service")
                    .setContentText("starting ....").build();

            startForeground(1, notification);

        }


        broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                //Log.i("inMS","got broadcast !!");
                //Log.i("inMS", intent.toUri(Intent.URI_INTENT_SCHEME).toString() );

                if( intent.hasExtra("action") ) {

                    String action = intent.getStringExtra("action");
                    //Log.i("inMs", "hase action !");
                    //Log.i("inMs", "action is:" + action);

                    if (action.equals("public")) {
                        Log.i("inMs", "public to mqtt... DEPRICATED !!!");


                    } else if (action.equals("mqPush") && intent.hasExtra("topic") && intent.hasExtra("msg")) {
                        //Log.i(TAG,"got mqPush: "+
                        //        intent.getStringExtra("topic").toString()+" -> "+
                        //        intent.getStringExtra("msg").toString()
                        //    );
                        mqtt.publish(
                                intent.getStringExtra("topic"),
                                intent.getStringExtra("msg")
                        );

                    } else if (action.equals("mqPush") && intent.hasExtra("topic") && intent.hasExtra("statList") && intent.hasExtra("stat")) {
                        String stat[] = intent.getStringExtra("statList").split(",");
                        String vals[] = intent.getStringExtra("stat").split(",");
                        String topic = intent.getStringExtra("topic");
                        for (int i = 0; i < stat.length; i++) {
                            mqtt.publish(
                                    topic + "/" + stat[i],
                                    vals[i]
                            );
                        }


                    } else if (action.equals("latlon")) {
                        Log.i("inMs", "got lat and long");
                        mqtt.publish("lat",
                                Double.toString(intent.getDoubleExtra("lat", 0.00))
                        );

                        mqtt.publish("lon",
                                Double.toString(intent.getDoubleExtra("lon", 0.00))
                        );

                    } else if (action.equals("speedSet")) {
                        Log.i(TAG, "speedSet");
                        sensorsStop();
                        speedSet = intent.getStringExtra("status");
                        sensorsStart();

                    } else if (action.equals("onOffSet")) {
                        Log.i(TAG, "onOffSet");
                        if (intent.getStringExtra("status").equals("on")) {
                            thingsStart();
                        } else {
                            thingsStop();
                        }

                    }
                }else if( intent.hasExtra("stopAll") ){
                    Log.i(TAG, " ------- stop all ----- and dyyy");
                    killAll();

                }else{
                    Log.i("inMs","don't hase action :(");
                    try{
                        Log.i("inMs","ping:"+intent.getIntExtra("ping",0));
                    }catch (Exception e){}
                }

            }
        };

        getApplicationContext().registerReceiver(
                broadcastReceiver,
                new IntentFilter("pl.yoyo.ysensorsservice.service")
                );

        thingsStart();


        Log.i(TAG,"hand - init...");
        handler = new Handler();
        runnable = new Runnable() {
            @Override
            public void run() {
                Log.i(TAG,"hand - run()");
                Log.i(TAG, "hand - mqtt is connected ?: "+mqtt.isConnected);
                //Log.i(TAG, "hand - mag count: "+mMag.magCount );

                if( mMag.mserv == null ) {
                    mMag.setMyService(getThisMyService());
                    mll.setMyService(getThisMyService());
                }


                if( doOverTcp ) {
                    Log.i(TAG, "hand - mTcpClient.....");

                    if (conTcpTask.mTcpClient != null) {
                        conTcpTask.mTcpClient.sendMessage("ping:{" + mTcpCounter++ + "}");
                    } else {
                        Log.i(TAG, "hand - mTcpClient = null");
                    }
                }

                handler.postDelayed(runnable, runTime);
            }
        };
        Log.i(TAG,"hand - post pre");
        handler.post(runnable);
        Log.i(TAG,"hand - post post");


    }

    public void sendTcp(String msg){
        if( conTcpTask.mTcpClient!=null){
            conTcpTask.mTcpClient.sendMessage(msg);
        }else{
            Log.i(TAG, "sendTcp - mTcpClient = null");
        }
    }

    public MyService getThisMyService(){
        return this;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Toast.makeText(this, "service starting", Toast.LENGTH_SHORT).show();

        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        PowerManager.WakeLock wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MyApp::MyWakelockTag");
        wakeLock.acquire();

        return START_STICKY;
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onStart(Intent intent, int startId) {
        super.onStart(intent, startId);
        Log.i(TAG, "onStart");
    }



    @Override
    public IBinder onBind(Intent intent) {
        // We don't provide binding, so return null
        return null;
    }

    @Override
    public void onDestroy() {
        Toast.makeText(this, "service done", Toast.LENGTH_SHORT).show();
        if (handler != null) {
            handler.removeCallbacks(runnable);
        }
        super.onDestroy();
        getApplicationContext().unregisterReceiver( broadcastReceiver );
    }

    public void mCmdParser(String cmd) {
        Log.i(TAG, "mCmdParser ...");

        if( cmd.equals("ping") ){
            mqtt.publish("resp","pong");

        }else if( cmd.equals("sensorsEvery:?") ){
            mqtt.publish("stat/sensorsEvery",""+mMag.sbIterEvery);

        }else if( cmd.indexOf("sensorsEvery:") == 0 ){
            Integer every = Integer.parseInt( cmd.substring( "sensorsEvery:".length() )  );
            Log.i(TAG,"sensors every now:"+every);
            mMag.sbIterEvery = every;

        }else if( cmd.equals("accelCorrect:?") ){
            mqtt.publish("stat/accelCorrect",mMag.msett.getSett("xAccel")+","+mMag.msett.getSett("yAccel")+","+mMag.msett.getSett("zAccel"));


        }else if( cmd.indexOf("accelCorrect:") == 0 ){
            String[] vars = cmd.substring( "accelCorrect:".length() ).split(",");

            Log.i(TAG,"accelCorrect now:"+vars[0]+" "+vars[1]+" "+vars[2]);
            mMag.msett.setSett("xAccel", vars[0] );
            mMag.msett.setSett("yAccel", vars[1] );
            mMag.msett.setSett("zAccel", vars[2] );
            mMag.updateCorrection();



        }else if( cmd.equals("magOffset:?") ){
            mqtt.publish("stat/magOffset",mMag.msett.getSett("magOffset") );

        }else if( cmd.indexOf("magOffset:") == 0 ){
            String vars = cmd.substring( "magOffset:".length() );

            Log.i(TAG,"magOffset now:"+vars);
            mMag.msett.setSett("magOffset", vars );
            mMag.updateCorrection();




        }else{
            mqtt.publish("resp","ping - to get pong\n" +
                    "sensorsEvery:? - get current sensor broadcast every iter\n"+
                    "sensorsEvery:10 - 10 is how often it will push sensors to mqtt\n" +
                    "magOffset:? - get current magnetic hdg offset\n"+
                    "magOffset:10 - set magnetic offset to 10\n"+
                    "accelCorrect:? - get current accel rotation correction\n"+
                    "accelCorrect:90,0,180 - set correction accel rotation by 90,0,180\n"+
                    "\nall stdout is at topic: " +mqtt.prefix+"resp\n"+
                    "cdn... :)\n");


        }

    }
}
