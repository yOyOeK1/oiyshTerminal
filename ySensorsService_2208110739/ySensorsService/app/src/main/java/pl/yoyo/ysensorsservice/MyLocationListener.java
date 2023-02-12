package pl.yoyo.ysensorsservice;

import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.util.Log;

import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class MyLocationListener implements LocationListener {

    private String TAG = "MyLocLis";
    private Context context;
    private LocationManager locationM;
    private MyService mserv = null;

    public int llCount = 0;

    public void setContext(Context c){
        this.context = c;
    }


    public void setLocationManager( LocationManager ll ){
        locationM = ll;
    }

    public void setIntervals( long everyMs, float everyM ){
        locationM.requestLocationUpdates( LocationManager.GPS_PROVIDER,
                everyMs, everyM,
                (LocationListener)this
        );
    }

    private void sendBroadcast(Intent i){
        this.context.sendBroadcast(i);
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
        Log.i(TAG,"onStatusChanged");
    }


    private String nmea = "";
    private String toDegreesMinutesAndSecconds( double coordinate ){
        double deg = Math.abs(coordinate);
        String d = Double.toString(deg);
        String df = d.substring(0, d.indexOf("."));
        String de = d.substring(d.indexOf(".")+1);
        return ""+
                (
                (Float.parseFloat(df)*100) +
                (Float.parseFloat("0."+de)*60)
                );
    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        Log.i(TAG,location.toString());
        this.llCount++;


        try {
            if (mserv.doTcpNmeaServer && mserv.tcpSer.haveClients() ) {
                String sLat = toDegreesMinutesAndSecconds(location.getLatitude());
                String sLon = toDegreesMinutesAndSecconds(location.getLongitude());
                String latNS = "N";
                if (location.getLatitude() < 0.0)
                    latNS = "S";
                String lonWE = "W";
                if (location.getLongitude() > 0.0)
                    lonWE = "E";
                nmea = "$YSRMC,,A," +
                        sLat +
                        ',' + latNS +
                        ',' +
                        sLon +
                        ',' + lonWE + ",0.0,0.0,,,,A\r\n";
                mserv.tcpSer.serverSendMessage(nmea);
            }
        }catch (Exception e){
            Log.e(TAG,"do nmea error:"+e.toString());
        }


        if( mserv!=null ) {
            mserv.mqtt.publish("lat", location.getLatitude()+"" );
            mserv.mqtt.publish("lon", location.getLongitude()+"" );
        }else{
            Log.d(TAG, "mserv = null");
        }
        /*
        try {
            Intent i = new Intent();
            i.setAction("pl.yoyo.ysensorsservice.service");
            i.putExtra("action", "latlon");
            i.putExtra("lat", location.getLatitude());
            i.putExtra("lon", location.getLongitude());
            this.sendBroadcast(i);
        }catch (Exception e){
            Log.e(TAG,e.toString());
        }

         */

    }


    public void makeItStop() {
        locationM.removeUpdates( (LocationListener)this );
    }

    public void setMyService(MyService thisMyService) {
        mserv = thisMyService;
    }
}
