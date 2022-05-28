class PIDController {

    //PID coefficients
    proportionalGain;
    integralGain;
    derivativeGain;

    outputMin = -1;
    outputMax = 1;
    integralSaturation = 10;

    valueLast = 0;
    errorLast = 0;
    integrationStored = 0;
    derivativeInitialized = false;
		dtLast = 0;

    Reset() {
        this.derivativeInitialized = false;
				this.dtLast = 0;
    }

		Clamp( num, min, max ){
			//cl("clamp "+num+" min"+min+" max");
			//cl( Math.min(Math.max(num, min), max) );
			return Math.min(Math.max(num, min), max);
		}

    Update( currentValue, targetValue) {
				var t = new Date().getTime();
				var dt = (t - this.dtLast)/1000;

        var error = targetValue - currentValue;

        //calculate P term
        var P = this.proportionalGain * error;

        //calculate I term
        this.integrationStored = this.Clamp(
					this.integrationStored + (error * dt),
					-this.integralSaturation, this.integralSaturation
				);
        var I = this.integralGain * this.integrationStored;

        //calculate both D terms
        var errorRateOfChange = (error - this.errorLast) / dt;
        this.errorLast = error;

        var valueRateOfChange = (currentValue - this.valueLast) / dt;
        this.valueLast = currentValue;

        //choose D term to use
        var deriveMeasure = 0;

        if (this.derivativeInitialized) {
            if ( 1 /*derivativeMeasurement == DerivativeMeasurement.Velocity */) {
                deriveMeasure = -valueRateOfChange;
            } else {
                deriveMeasure = errorRateOfChange;
            }
        } else {
            this.derivativeInitialized = true;
        }

        var D = this.derivativeGain * deriveMeasure;

        var result = P + I + D;

				this.dtLast = t;
        return this.Clamp(result, this.outputMin, this.outputMax);
    }

    AngleDifference( a,  b) {
        return (a - b + 540) % 360 - 180;   //calculate modular difference, and remap to [-180, 180]
    }

    UpdateAngle(  currentAngle, targetAngle ) {
				var t = new Date().getTime();
				var dt = (t - this.dtLast)/1000;
				//cl("updateangle current:"+currentAngle+" target:"+targetAngle);


        var error = this.AngleDifference(targetAngle, currentAngle);
        this.errorLast = error;

        //calculate P term
        var P = this.proportionalGain * error;

				this.integrationStored = this.Clamp(
					this.integrationStored + (error * dt),
					-this.integralSaturation, this.integralSaturation
				);
        var I = this.integralGain * this.integrationStored;

        //calculate both D terms
        var errorRateOfChange = this.AngleDifference(error, this.errorLast) / dt;
        this.errorLast = error;

        var valueRateOfChange = this.AngleDifference(currentAngle, this.valueLast) / dt;
        this.valueLast = currentAngle;

        //choose D term to use
        var deriveMeasure = 0;

        if(this.derivativeInitialized ) {
            if ( false/*derivativeMeasurement == DerivativeMeasurement.Velocity*/) {
                deriveMeasure = -valueRateOfChange;
            } else {
                deriveMeasure = errorRateOfChange;
            }
        } else {
            this.derivativeInitialized = true;
        }

        var D = this.derivativeGain * deriveMeasure;

        var result = P + I + D;

				this.dtLast = t;
				cl("P:"+P+" I:"+I+" D:"+D);
				//cl("Clamp:"+result);
        return this.Clamp(result, this.outputMin, this.outputMax);
    }
}
