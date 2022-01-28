package pl.yoyo.ysensorsservice;

import java.util.ArrayList;

public class MinMaxAvg {

    public ArrayList history;

    public void reset(){
        history = new ArrayList();
    }

    public void iter( float v){
        history.add( v );

    }

    public float getLast(){
        return (float) history.get( history.size()-1 );
    }

    public float getAvg(){
        float tr = 0;
        for(int i=0;i<history.size();i++) {
            tr+= (float) history.get(i);
        }

        return tr/history.size();
    }

    public float getMax(){
        float tr = 0;
        for(int i=0;i<history.size();i++) {
            if (i == 0)
                tr = (float) history.get(i);
            else if( (float) history.get(i)>tr )
                tr = (float) history.get(i);

        }

        return tr;
    }


    public float getMin(){
        float tr = 0;
        for(int i=0;i<history.size();i++) {
            if (i == 0)
                tr = (float) history.get(i);
            else if( (float) history.get(i)<tr )
                tr = (float) history.get(i);

        }

        return tr;
    }


}
