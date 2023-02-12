package pl.yoyo.ysensorsservice;

import android.util.Log;

import java.util.Timer;
import java.util.TimerTask;

public class MyTimeOutForOnOff extends TimerTask {

    private String TAG = "MyTimOutOnOff";
    private int toTimeOut;
    private Timer timer;
    private MainActivity ma;

    public MyTimeOutForOnOff( MainActivity ma ){
        timer = new Timer();
        this.ma = ma;
    }


    private void executeOnTimeOut(){
        ma.swOnOffSetTo( false );
    }

    public void makeItRunning(){
        timer.schedule( new MyTimeOutForOnOff( this.ma ), 1000 );
    }

    @Override
    public void run() {
        /*
        Log.i(TAG,"iter "+ma.timeOffForOnOffPing);
        ma.timeOffForOnOffPing--;

        if( ma.timeOffForOnOffPing < 0 ){
            Log.i(TAG, "timoOnOff time out....");
            this.executeOnTimeOut();
        }
        */
        makeItRunning();
    }


    public void ping(){
        //ma.timeOffForOnOffPing = ma.timeOffForOnOff;
    }



}
