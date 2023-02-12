package pl.yoyo.ysensorsservice;

public class MyTransformers {

    private double cosDeg,sinDeg;


    public float [] rotByZ( float x,float y,float z, float degR ){
        cosDeg = Math.cos(degR);
        sinDeg = Math.sin(degR);

        return new float[]{
                (float) (x * cosDeg - y * sinDeg),
                (float) (x * sinDeg + y * cosDeg),
                z
            };
    }

    public float [] rotByX( float x, float y, float z, float degR){
        cosDeg = Math.cos(degR);
        sinDeg = Math.sin(degR);

        return new float[]{
                x,
                (float) (y * cosDeg - z * sinDeg),
                (float) (y * sinDeg + z * cosDeg)
            };
    }

    public float [] rotByY( float x, float y, float z, float degR){
        cosDeg = Math.cos(degR);
        sinDeg = Math.sin(degR);

        return new float[]{
                (float) (z * sinDeg + x * cosDeg),
                y,
                (float) (z * cosDeg - x * sinDeg)
            };
    }

    public float [] rotByZXY( float x, float y, float z, float degXR,float degYR, float degZR){
        float [] p = rotByZ( x, y,z, degZR );
        p = rotByX( p[0],p[1],p[2], degXR );
        return rotByY( p[0], p[1], p[2], degYR );
    }

    public float deg2rad( float deg)
    {
        return (float) Math.toRadians( deg );
    }




}
