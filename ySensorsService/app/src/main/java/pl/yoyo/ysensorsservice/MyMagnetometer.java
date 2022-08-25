package pl.yoyo.ysensorsservice;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.support.v4.math.MathUtils;
import android.util.Log;

public class MyMagnetometer implements SensorEventListener {

    private String TAG = "Mag";

    public MySettings msett;
    public MyTransformers mtrans;
    public MyService mserv = null;

    private int magOffset = 0;

    private SensorManager mSenMan;
    private Sensor mag,accel,orient,rotat;
    private Context context;

    private float[] mGeomagnetic = null;
    private float[] mGeomagneticCorrect = new float[3];
    private float[] mLastAccelerometer = new float[3];
    private float[] mLastAccelCorrect = new float[3];
    private float[] mLastOrientation = new float[9];
    private boolean mLastAccelerometerSet = false;
    private boolean mLastMagnetomoterSet = false;
    private float[] mOrientation = new float[3];
    private float[] mR = new float[9];

    private float[] accelCorrect = {0,0,0};
    private boolean sendMagRaw = false;
    private boolean sendAccelRaw = false;
    private boolean sendAccel = false;

    public int magCount = 0;
    public int accelCount = 0;
    public String speedSet = "standby";

    private int sbIterAcc = 0,sbIterMag = 0;
    public int sbIterEvery = 30;

    public float xRot = 0;
    public float yRot = 0;
    public float zRot = 0;


    private boolean doBroadcast = true;

    public void setMyService( MyService ms ){
        mserv = ms;
    }

    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        //Log.i(TAG, "onSensorChanged: "+sensorEvent.toString());




        if( sensorEvent.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD ){
            this.magCount++;
            mGeomagnetic = new float[3];
            System.arraycopy(sensorEvent.values, 0, mGeomagnetic, 0, 3);



            if (mGeomagnetic != null) {
                //Log.d(TAG, "mx : "+mGeomagnetic[0]+" my : "+mGeomagnetic[1]+" mz : "+mGeomagnetic[2]);
                if( !speedSet.equals("standby") || ( speedSet.equals("standby") && (sbIterMag++%sbIterEvery) == 0) ) {

                    if( mserv!=null ) {
                        //mserv.mqtt.publish("mag/raw", mGeomagnetic[0] + "," + mGeomagnetic[1] + "," + mGeomagnetic[2] );

                        if( sendMagRaw )
                            mserv.mqtt.publish("mag/raw", mGeomagnetic[0] + "," + mGeomagnetic[1] + "," + mGeomagnetic[2] );

                    }else
                        Log.d(TAG, "mag mserv = null");
                    /*
                    try {
                        Intent i = new Intent();
                        i.setAction("pl.yoyo.ysensorsservice.service");
                        i.putExtra("action", "mqPush");
                        i.putExtra("topic", "mag/raw");
                        i.putExtra("msg", "" + mGeomagnetic[0] + "," + mGeomagnetic[1] + "," + mGeomagnetic[2]);
                        this.sendBroadcast(i);
                    } catch (Exception e) {
                        Log.e(TAG, "onSenChan err : " + e.toString());
                    }
                    */
                }
                mLastMagnetomoterSet = true;
            }

        }



        if( sensorEvent.sensor.getType() == Sensor.TYPE_ACCELEROMETER ) {
            this.accelCount++;

            /*
            flat
            x - left
            y - back
            z - bottom

            portrate
            x - left
            y - bottom
            z - forward
            */

            if( !speedSet.equals("standby") || ( speedSet.equals("standby") && (sbIterAcc++%sbIterEvery) == 0) ) {

                //float[] rotat = new float[9];
                //float[] orient = new float[3];
                //SensorManager.getQuaternionFromVector( rotat, sensorEvent.values );

                System.arraycopy(sensorEvent.values, 0, mLastAccelerometer, 0, 3);
                mLastAccelerometerSet = true;



                if( mserv!=null ) {
                    //mserv.mqtt.publish("accel", mLastAccelerometer[0] + "," + mLastAccelerometer[1] + "," + mLastAccelerometer[2]);

                    mLastAccelCorrect = mtrans.rotByZXY( mLastAccelerometer[0], mLastAccelerometer[1], mLastAccelerometer[2],
                            accelCorrect[0], accelCorrect[1], accelCorrect[2] );

                    //Log.d(TAG, rotat[0] + ",   " + rotat[1] + ",  " + rotat[2]+",  "+rotat[3]+",  "+rotat[4]+",  "+rotat[5]+",  "+rotat[6]+",  "+rotat[7]+",  "+rotat[8]);
                }else {
                    Log.d(TAG, "accel mserv = null");
                }
                /*
                try {
                    Intent i = new Intent();
                    i.setAction("pl.yoyo.ysensorsservice.service");
                    i.putExtra("action", "mqPush");
                    i.putExtra("topic", "accel");
                    i.putExtra("msg", "" + mLastAccelerometer[0] + "," + mLastAccelerometer[1] + "," + mLastAccelerometer[2]);
                    this.sendBroadcast(i);
                } catch (Exception e) {
                    Log.e(TAG, "onSenChan err : " + e.toString());
                }

                 */


                if (mLastAccelerometerSet && mLastMagnetomoterSet) {

                    mGeomagneticCorrect = mtrans.rotByZXY( mGeomagnetic[0], mGeomagnetic[1], mGeomagnetic[2],
                            accelCorrect[0], accelCorrect[1], accelCorrect[2] );

                    SensorManager.getRotationMatrix(mR, null, mLastAccelCorrect, mGeomagneticCorrect);
                    SensorManager.getOrientation(mR, mOrientation);
                    float azimuthInRadians = mOrientation[0];
                    float azimuthInDegress = (float) (Math.toDegrees(azimuthInRadians) + 360 + this.magOffset) % 360;

                    if( mserv!=null ) {
                        mserv.mqtt.publish("mag", azimuthInDegress + "");
                        mserv.mqtt.publish("orient/pitch", Math.toDegrees(mOrientation[1]) + "");
                        mserv.mqtt.publish("orient/heel", Math.toDegrees(mOrientation[2]) + "");

                        if( sendAccel )
                            mserv.mqtt.publish("accel", mLastAccelCorrect[0]+","+mLastAccelCorrect[1]+","+mLastAccelCorrect[2]);

                        if( sendMagRaw )
                            mserv.mqtt.publish("mag/rawCorrect", mGeomagneticCorrect[0] + "," + mGeomagneticCorrect[1] + "," + mGeomagneticCorrect[2] );

                    }else
                        Log.d(TAG, "accelMag mserv = null");

                    /*
                    try {
                        Intent i = new Intent();
                        i.setAction("pl.yoyo.ysensorsservice.service");
                        i.putExtra("action", "mqPush");
                        i.putExtra("topic", "mag");
                        i.putExtra("msg", "" + azimuthInDegress);
                        this.sendBroadcast(i);

                        i = new Intent();
                        i.setAction("pl.yoyo.ysensorsservice.service");
                        i.putExtra("action", "mqPush");
                        i.putExtra("topic", "orient/heel");
                        i.putExtra("msg", "" + Math.toDegrees(mOrientation[1]));
                        this.sendBroadcast(i);

                        i = new Intent();
                        i.setAction("pl.yoyo.ysensorsservice.service");
                        i.putExtra("action", "mqPush");
                        i.putExtra("topic", "orient/pitch");
                        i.putExtra("msg", "" + Math.toDegrees(mOrientation[2]));
                        this.sendBroadcast(i);

                    } catch (Exception e) {
                        Log.e(TAG, "onSenChan err : " + e.toString());
                    }

                     */

                }

            }

        }

        /*
        if (mLastAccelerometer != null && mGeomagnetic != null) {
            float R[] = new float[9];
            float I[] = new float[9];
            boolean success = SensorManager.getRotationMatrix(R, I, mGeomagnetic,mLastAccelerometer);
            if (success) {
                float orientation[] = new float[3];
                SensorManager.getOrientation(R, orientation);

                try {
                    Intent i = new Intent();
                    i.setAction("pl.yoyo.ysensorsservice.service");
                    i.putExtra("action", "mqPush");
                    i.putExtra("topic", "orien/azimut");
                    i.putExtra("msg", "" + orientation[0]);
                    this.sendBroadcast(i);

                    i = new Intent();
                    i.setAction("pl.yoyo.ysensorsservice.service");
                    i.putExtra("action", "mqPush");
                    i.putExtra("topic", "orien/pitch");
                    i.putExtra("msg", "" + orientation[1]);
                    this.sendBroadcast(i);

                    i = new Intent();
                    i.setAction("pl.yoyo.ysensorsservice.service");
                    i.putExtra("action", "mqPush");
                    i.putExtra("topic", "orien/roll");
                    i.putExtra("msg", "" + orientation[2]);
                    this.sendBroadcast(i);

                } catch (Exception e) {
                    Log.e(TAG, "onSenChan err : " + e.toString());
                }


            }

        }
        */
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {
        Log.i(TAG, "onAccurChan: "+sensor.toString());
    }

    public void setSensorManager(SensorManager systemService) {
        Log.i(TAG,"setSensorManager....");
        mSenMan = systemService;

        mag = mSenMan.getDefaultSensor( Sensor.TYPE_MAGNETIC_FIELD );
        accel = mSenMan.getDefaultSensor( Sensor.TYPE_ACCELEROMETER );

        Log.i(TAG," DONE");
    }

    public void registerListeners( String speed ){
        this.speedSet = speed;
        int speedToSet = SensorManager.SENSOR_DELAY_NORMAL;
        if( speed.equals("standby") )
            speedToSet = SensorManager.SENSOR_DELAY_UI;
        if( speed.equals("fast") )
            speedToSet = SensorManager.SENSOR_DELAY_FASTEST;

        mSenMan.registerListener(
                this,
                mag,
                speedToSet
        );
        mSenMan.registerListener(
                this,
                accel,
                speedToSet
        );

    }



    public void setContext(Context baseContext) {
        this.context = baseContext;
        this.msett = new MySettings( this.context );
        this.mtrans = new MyTransformers();

        updateCorrection();

    }

    private void sendBroadcast( Intent i ){ this.context.sendBroadcast(i); }

    public void makeItStop() {
        mSenMan.unregisterListener( this );
    }

    public void updateCorrection() {
        accelCorrect[0] = mtrans.deg2rad( Float.parseFloat( msett.getSett("xAccel") ) );
        accelCorrect[1] = mtrans.deg2rad( Float.parseFloat( msett.getSett("yAccel") ) );
        accelCorrect[2] = mtrans.deg2rad( Float.parseFloat( msett.getSett("zAccel") ) );
        sendAccel = Boolean.parseBoolean( msett.getSett("sendAccel") );
        sendAccelRaw = Boolean.parseBoolean( msett.getSett("sendAccelRaw") );
        sendMagRaw = Boolean.parseBoolean( msett.getSett("sendMagRaw") );

        try {
            magOffset = Integer.parseInt( this.msett.getSett("magOffset").toString() );
        }catch (Exception e){
            magOffset = 0;
        }

    }
}
