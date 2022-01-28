package pl.yoyo.ysensorsservice;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.KeyguardManager;
import android.app.admin.DevicePolicyManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.PowerManager;
import android.os.SystemClock;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.WindowManager;
import android.widget.Toast;

import java.lang.reflect.InvocationTargetException;

//am broadcast --user 0 -n pl.yoyo.ysensorsservice/.MyBroadcastReceiver -a pl.yoyo.ysensorsservice.intent.START_SERVICE --es socket_output "abc"

public class MyBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "MyBroadcastReceiver";


    public static void goToSleep(Context context) {
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);

        @SuppressLint("InvalidWakeLockTag") PowerManager.WakeLock wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Your Tag");
        wl.acquire();
        wl.release();
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        StringBuilder sb = new StringBuilder();
        sb.append("Action: " + intent.getAction() + "\n");
        sb.append("URI: " + intent.toUri(Intent.URI_INTENT_SCHEME).toString() + "\n");
        String log = sb.toString();
        Log.d(TAG, log);
        Toast.makeText(context, log, Toast.LENGTH_LONG).show();





        if( intent.getAction().toString().equals("pl.yoyo.ysensorsservice.intent.START_SERVICE") ){
            Intent service = new Intent( context, MyService.class );

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(service);
            } else {
                context.startService(service);
            }

        }else if( intent.getAction().toString().equals("pl.yoyo.ysensorsservice.intent.STOP_SERVICE") ){
            Intent i = new Intent();
            i.setAction("pl.yoyo.ysensorsservice.service");
            i.putExtra("stopAll","now");
            context.sendBroadcast(i);

        }else if( intent.getAction().toString().equals("pl.yoyo.ysensorsservice.intent.DISPLAY_ON") ){
            Log.i(TAG, "display_on !");
            KeyguardManager km = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
            final KeyguardManager.KeyguardLock kl = km .newKeyguardLock("MyKeyguardLock");
            kl.disableKeyguard();

            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            PowerManager.WakeLock wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK
                    | PowerManager.ACQUIRE_CAUSES_WAKEUP
                    | PowerManager.ON_AFTER_RELEASE, "MyWakeLock");
            wakeLock.acquire();

        }else if( intent.getAction().toString().equals("pl.yoyo.ysensorsservice.intent.DISPLAY_OFF") ){
            Log.i(TAG, "display_off !");
            goToSleep( context );



        }else if( intent.getAction().toString().equals("pl.yoyo.ysensorsservice.intent.CMD") ){
            Log.i(TAG, "got cmd:");
            Log.i(TAG, "    args:"+ intent.getStringExtra("args"));
            Log.i(TAG, "    argv:"+ intent.getStringExtra("argv"));
            Intent i = new Intent();
            i.setAction("pl.yoyo.ysensorsservice.service");
            String args[] = intent.getStringExtra("args").toString().split(",");
            String argv[] = intent.getStringExtra("argv").toString().split(",");
            for (int a = 0; a < args.length; a++) {
                if (!args[a].equals("")) {
                    i.putExtra(args[a], argv[a]);
                    Log.i(TAG, "    addExtra " + args[a] + " -> " + argv[a]);
                }
            }
            context.sendBroadcast(i);

        }

    }


}