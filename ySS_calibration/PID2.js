

class PID2{

    privateScope = {
      target:null,
      gains: {
        P: null,
        I: null,
        D: null
      },
      Iterm: 0,
      ItermLimit: {
        min: -1000,
        max: 1000
      },
      previousError: 0,
      output: {
        min: null,
        max: null,
        minThreshold: null
      },
      tLast: null
    };

    setTarget(value) {
        this.privateScope.target = value;
    };

    setGains(Pgain, Igain, Dgain) {
        this.privateScope.gains.P = Pgain;
        this.privateScope.gains.I = Igain;
        this.privateScope.gains.D = Dgain;
    };

    setOutput(min, max, minThreshold) {
        this.privateScope.output.min = min;
        this.privateScope.output.max = max;
        this.privateScope.output.minThreshold = minThreshold;
    };

    setItermLimit(min, max) {
        this.privateScope.ItermLimit.min = min;
        this.privateScope.ItermLimit.max = max;
    };

    update(current) {
        var t = new Date().getTime();
        if( this.privateScope.tLast == null)
          this.privateScope.tLast = t;
        var dt = (t - this.privateScope.tLast)/1000;


        var error = current - this.privateScope.target;

        var Pterm = error * this.privateScope.gains.P;

        var Dterm = ( (error - this.privateScope.previousError)/dt * this.privateScope.gains.D );
        var output;

        //e2:0.00194 Iterm:0.01080 Dte:-0.01509 curr0.19
        //e2:0.00122 Iterm:0.02524 Dte:-0.00584 curr0.12

        this.privateScope.previousError = error;

        this.privateScope.Iterm += (error *dt * this.privateScope.gains.I);
        if (this.privateScope.Iterm > this.privateScope.ItermLimit.max) {
            this.privateScope.Iterm = this.privateScope.ItermLimit.max;
        } else if (this.privateScope.Iterm < this.privateScope.ItermLimit.min) {
            this.privateScope.Iterm = this.privateScope.ItermLimit.min;
        }


        cl("e2:"+Pterm.toFixed(5)+
          " Iterm:"+this.privateScope.Iterm.toFixed(5)+
          " Dte:"+Dterm.toFixed(5)+
          " curr"+current.toFixed(2)
          );
        

        output = Pterm + this.privateScope.Iterm + Dterm;
        if (output < this.privateScope.output.minThreshold) {
            output = this.privateScope.output.min;
        } else if (output > this.privateScope.output.max) {
            output = this.privateScope.output.max;
        }

        this.privateScope.tLast = t;
        return output;
    };


};
