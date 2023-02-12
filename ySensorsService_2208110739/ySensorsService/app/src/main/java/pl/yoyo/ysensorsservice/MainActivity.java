package pl.yoyo.ysensorsservice;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    public String TAG = "MA";
    private final Handler handler = new Handler();
    private int msgCount = 0;
    private MySettings msett;
    private boolean changingSwOnOff = false;

    //public int timeOffForOnOff = 2;
    //public int timeOffForOnOffPing = timeOffForOnOff;
    //public MyTimeOutForOnOff myTimeOutOnOffTimer;

    private Switch swOnOff;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout);
        Log.i("main", "test1");

        msett = new MySettings(getBaseContext());
        EditText et = (EditText) findViewById(R.id.etMqttUrl);
        et.setText(msett.getSett("mqttUrl"), TextView.BufferType.EDITABLE);
        et = (EditText) findViewById(R.id.etMqttClientId);
        et.setText(msett.getSett("mqttClientId"), TextView.BufferType.EDITABLE);
        et = (EditText) findViewById(R.id.etMqttTopicPrefix);
        et.setText(msett.getSett("mqttPrefix"), TextView.BufferType.EDITABLE);





        getApplicationContext().registerReceiver(
                new BroadcastReceiver() {
                    @Override
                    public void onReceive(Context context, Intent intent) {
                        if( intent.hasExtra("ping") ){
                            //myTimeOutOnOffTimer.ping();
                            swOnOffSetTo( true );

                            if( intent.hasExtra("statList") ) {
                                String stat[] = intent.getStringExtra("statList").split(",");
                                String vals[] = intent.getStringExtra("stat").split(",");
                                String tr = "";
                                for(int i=0;i<stat.length;i++){
                                    tr+= "["+stat[i]+"]->"+vals[i]+"\t";
                                }
                                Log.i(TAG,tr);
                            }
                        }

                    }
                },
                new IntentFilter("pl.yoyo.ysensorsservice.service")


        );



        //myTimeOutOnOffTimer = new MyTimeOutForOnOff( this );
        //myTimeOutOnOffTimer.makeItRunning();

    }

    public void swOnOffSetTo( boolean status ){
        changingSwOnOff = true;
        try {
            swOnOff.setChecked(status);
        }catch (Exception e){
            Log.e(TAG, "swOnOffSetTo error:"+e.toString());
        }
            changingSwOnOff = false;
    }

    @Override
    protected void onStart() {
        super.onStart();
        Log.i(TAG,"1");
        ActivityCompat.requestPermissions( this,
                new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_BACKGROUND_LOCATION
                },
                99);
        Log.i(TAG,"2");
    }

    public void onBtSaveSettings( View mv ){
        Log.i(TAG, "onBtSaveSettings");

        EditText et = (EditText) findViewById(R.id.etMqttUrl);
        msett.setSett("mqttUrl", et.getText().toString() );
        et = (EditText) findViewById(R.id.etMqttClientId);
        msett.setSett("mqttClientId", et.getText().toString() );
        et = (EditText) findViewById(R.id.etMqttTopicPrefix);
        msett.setSett("mqttPrefix", et.getText().toString() );

    }



    public void onBtPing( View mv ){
        this.msgCount+=1;
        Log.i("bt_ping","click" );
        Intent i = new Intent();
        i.setAction("pl.yoyo.ysensorsservice.service");
        i.putExtra("ping",this.msgCount);
        sendBroadcast(i);

    }
    public void onBtPublic( View mv ){
        Log.i("bt_public","click" );
        Intent i = new Intent();
        i.setAction("pl.yoyo.ysensorsservice.service");
        i.putExtra("action","mqPush");
        i.putExtra("topic","test");
        i.putExtra("msg","ala ma androida");

        sendBroadcast(i);

    }

    public void onBtStopService(View mv ){
        Log.i("bt_stopService", "click");
        Intent in = new Intent();
        in.setAction( "pl.yoyo.ysensorsservice.intent.STOP_SERVICE" );
        sendBroadcast( in );

    }

    public void onBtStartService( View mv ){
        Log.i("bt_startService", "click");
        /*
        Intent in = new Intent("pl.yoyo.ysensorsservice/.MyBroadcastReceiver");
        in.setAction( "pl.yoyo.ysensorsservice.intent.START_SERVICE" );
        sendBroadcast( in );
        */

        Intent service = new Intent( getBaseContext(), MyService.class );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getBaseContext().startForegroundService(service);
        } else {
            getBaseContext().startService(service);
        }
    }

}