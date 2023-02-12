package pl.yoyo.ysensorsservice;

import static android.content.Context.MODE_PRIVATE;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.Editable;
import android.util.Log;

public class MySettings {

    private String TAG = "MySett";
    private SharedPreferences sett;
    private Context context;

    public MySettings(Context context){

        Log.i(TAG, "chk if we have defaults...");

        this.context = context;

        sett = context.getSharedPreferences("mysettings", MODE_PRIVATE);
        if( sett.contains("mqttUrl") == false ){
            Log.i(TAG, "no setting making defaults....");

            SharedPreferences.Editor editor = context.getSharedPreferences("mysettings", MODE_PRIVATE).edit();
            editor.putString("mqttUrl","tcp://192.168.43.1:10883");
            editor.putString("mqttClientId", "myService");
            editor.putString("mqttPrefix", "and");
            editor.putString("xAccel", "0");
            editor.putString("yAccel", "0");
            editor.putString("zAccel", "0");
            editor.apply();

            sett = context.getSharedPreferences("mysettings", MODE_PRIVATE);


        }else{
            Log.i(TAG,"got some settings :)");
        }

        if( sett.contains("magOffset") == false ){
            this.setSett("magOffset", "0");
        }
        if( sett.contains("xAccel") == false ){
            this.setSett("xAccel","0");
            this.setSett("yAccel","0");
            this.setSett("zAccel","0");
        }



    }

    public String getSett(String mqttUrl) {
        return sett.getString(mqttUrl,"?");
    }

    public void setSett(String varName, String varItSelf) {
        SharedPreferences.Editor editor = context.getSharedPreferences("mysettings", MODE_PRIVATE).edit();
        editor.putString(varName, varItSelf );
        editor.apply();
        sett = context.getSharedPreferences("mysettings", MODE_PRIVATE);
    }
}
