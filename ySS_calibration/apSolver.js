class apSolver{

	a0 = 0;
	a1 = 0;
	a2 = 0;




	db( msg){
		/*
		$('#sDeb').html(
			msg+"<br>"+
			$('#sDeb').html()
			);
		*/
	}

	q1(){
		var tr = "cn - NaN";
		if( this.a0 == this.a1 && this.a1 == this.a2 )
			tr = 'c1 - stable';
		else if( this.a0 > this.a1 && this.a1 == this.a2 )
			tr = 'c2 - up start';
		else if( this.a0 < this.a1 && this.a1 == this.a2 )
			tr = 'c3 - down start';

		else if( this.a0 > this.a1 && this.a1 > this.a2 )
			tr = 'c4 - up speed up';


		else if( this.a0 < this.a1 && this.a1 < this.a2 )
			tr = 'c5 - down speed up';

		else if( this.a0 < this.a1 && this.a1 > this.a2 )
			tr = 'c6 - down past peek';

		else if( this.a0 > this.a1 && this.a1 < this.a2 )
			tr = 'c7 - up past bottom';

		else if( this.a0 == this.a1 && this.a1 > this.a2 )
			tr = 'c8 - up';

		else if( this.a0 == this.a1 && this.a1 < this.a2 )
			tr = 'c9 - down';

		return tr;
	}

	tAvgs = 2;
	degSpe01 = 0
	degSpe02 = 0

	preA0DS01 = 0;
	preA0DS02 = 0;
	accels(){
		this.degSpe01 = ( parseFloat(this.a0)-parseFloat(this.a1) )/1;
		this.degSpe02 = ( parseFloat(this.a0)-parseFloat(this.a2) )/2;

		storeIt("ap_preA0DS01", ( (this.a0+(this.degSpe01*this.tPredict)) ), sec30);
		storeIt("ap_preA0DS02", ( (this.a0+(this.degSpe02*this.tPredict)) ), sec30);
		this.preA0DS01 = avgIt('ap_preA0DS01',sec1*3);
		this.preA0DS02 = avgIt('ap_preA0DS02',sec1*3);

		return "ds: "+this.degSpe01.toFixed(2)+" "+
			this.degSpe02.toFixed(2)+" deg/s";
	}


	tLastAct = 0;
	everyT = 1000;
	actType = '';
	lastDelta = 0;

	tPredict = 15;
	startTrashHold = 5;
	maxAngleSpeed = 2.0;
	errorToCorrectionGain = 0.05;
	landingAHeadGain = 1.5;

	tillerOffset = 0;
	tillerPos = 0;

	tillerTuneLast = 0;

	tillerStack = [];

	landingHardDirection = 0;

	tillerStackSum(){
		return this.tillerStack.reduce((partialSum, a) => partialSum + a, 0);

	}

	hdm = 0;
	delta = 0;
	target = 0;
	resp = 1;
	gain2 = 20;
	on = false;

	getStatusMsg(){
		return {
        hdm: this.hdm,
        target: this.target,
        delta: this.a0,
        tillerPos: this.tillerPos,
        tillerBy: this.tillerGetToSend(  ),
        time: new Date()
        };
	}

	setAuto( target ){
		this.setTarget( target );

	}

	setStandby(){

	}



	setTarget(target){
		this.target = target;
	}

	tillerBy( by ){
		if( Math.abs(by) > 0.01 ){
			this.tillerStack.push(by);
			this.tillerPos+= by;
			apTillerFake+= by*this.gain2;
			this.tillerToSend.push( by*this.gain2 );
		}
		$("#apDebTillerPos").text(apTillerFake);
		this.db(" --> tiller is:"+apTillerFake+" and offset:"+this.tillerOffset);
	}

	tillerToSend = [];
	tillerGetToSend(){
		var tr = this.tillerToSend.reduce((partialSum, a) => partialSum + a, 0);
		this.tillerToSend = [];
		return tr;
	}

	update( hdm ){
		this.hdm = hdm;
		this.delta = deg360delta( this.hdm, this.target );
		var t = new Date().getTime();
		storeIt("apDelta", this.delta, sec30 );
		this.a0 = avgIt('apDelta', sec1);
		this.a1 = avgIt('apDelta', sec1*2) ||0;
		this.a2 = avgIt('apDelta', sec1*4) ||0;

		this.db(
			"	"+ Math.round(this.a2)+
			"	"+Math.round(this.a1)+
			"	"+Math.round(this.a0)+
			"<br>		acc: "+this.accels()+
			"		q: "+ this.q1()+
			"<br> delt pred "+this.tPredict+"sec: "+
			this.preA0DS01.toFixed(0)+" "+this.preA0DS02.toFixed(0)+" "

		 );

		 /*
		 var deb0 = {'deb0':{
			'time': new Date(),

			'a0': this.a0,
			'a1': this.a1,
			'a2': this.a2,
			'hdm': apHDMFake,
			'target': $("#ap2Target").val()
		 	}};
		 sOutSend('apDeb:'+JSON.stringify(deb0));

		 var deb0 = {'debPreA0DS01':{
			'time': new Date().getTime()+(this.tPredict*1000),
			'data0': this.preA0DS01,
			'data1': this.preA0DS02,
		 	}};
		 sOutSend('apDeb:'+JSON.stringify(deb0));

		 var deb0 = {
			'time': new Date(),
			'hdm': apHDMFake,
			'target': $("#ap2Target").val()
		 	};
		 sOutSend('apDeb:'+JSON.stringify(deb0));
		 */






		 if( this.tLastAct < (t-this.everyT) || this.tLastAct == 0 ){
			 this.db("$ action ["+this.actType+"] old"+(t-this.tLastAct));

			 var trashHoldWithGain = Math.abs( Math.abs(this.degSpe01)>1? Math.abs(this.degSpe01)*this.landingAHeadGain : this.landingAHeadGain )*this.startTrashHold;
			 var tillerSum = this.tillerStackSum();

			 if( Math.abs( this.lastDelta ) < this.startTrashHold || Math.abs( this.preA0DS02 ) < this.startTrashHold )
			 	this.db(" is ok :)");





				if( this.actType == 'landing' &&
					(t-this.tLastAct) >= 4000
					){
						this.actType = '';
						this.db("[landing ABORD]");
				}

				if( this.actType == 'tune offset start' &&
					Math.abs( this.a0 ) >= this.startTrashHold
					){
						this.actType = '';
						this.tLastAct = t;

						if( this.degSpe01 > 0 ){
							this.tillerBy( -0.05 );
		 				 	this.tillerStack = [];

						}else{
							this.tillerBy( 0.05 );
		 				 	this.tillerStack = [];

						}

						this.db("[<b>tune offset ABORD</b>]");

				}

				if( this.actType == 'tune offset start' ){
					var res = "none";

					if( this.degSpe01 > 0 ){
						this.tillerBy( -0.05 );
	 				 	this.tillerStack = [];
						res = "-";
					}else{
						this.tillerBy( 0.05 );
	 				 	this.tillerStack = [];
						res = "+";
					}


					this.actType = '';
					this.tLastAct = t;
					this.db("[<b>tune offset DONE</b>] res:"+res);
				}

				if( this.actType == '' &&
					Math.abs(this.degSpe01) < 0.5 &&
					Math.abs( this.a0 ) < this.startTrashHold &&
					Math.abs( this.a1 ) < this.startTrashHold &&
					tillerSum == 0
					){

					this.tillerTuneLast = this.degSpe01;
					this.actType = 'tune offset start';
					this.tLastAct = t+sec1*3;
					this.db("[<b>tune offset start</b>]");

				}else if(
				 this.actType == 'landing hard' &&
				 this.tillerStack.length == 0
			 ){
			 		this.actType = '';
					this.tLastAct = t+sec1*2;
					this.db(" [ clean landing hard ]");
					this.db(" [landing direction ]"+this.landingHardDirection);
					this.db(" a0:"+this.a0);

				}else if(
				 this.actType != 'landing hard' &&
				 this.tillerStack.length > 0 &&
				 ( this.lastDelta > 0 ) != ( this.preA0DS02 > 0)
			 	){
				 this.actType = 'landing hard';
				 var sum = tillerSum;

				 this.tillerBy( -sum );
				 this.tillerStack = [];
				 this.tLastAct = t+sec1*3;

				 this.landingHardDirection = sum >= 0 ? 1 : -1;

				 this.db(" [landing hard] by stack tiller "+this.tillerStack.toString());


			 }else if( (
				 this.actType == 'correct' ||
				 this.actType == 'langing '
			 		) &&
			 	(
					Math.abs( this.a0 )  <= trashHoldWithGain   ||
			 		Math.abs( this.preA0DS02 ) <= trashHoldWithGain
				)
			){
				 this.actType = 'landing';
				 var newTillerStackSum = tillerSum/2;
				 this.tillerBy( -newTillerStackSum );
				 this.tillerStack = [ (newTillerStackSum) ];

				 this.tLastAct = t+sec1*0.5;
				 this.db(" [landing] by stack tiller "+this.tillerStack.toString());

				 	if(  Math.abs(newTillerStackSum) < 0.05 || Math.abs(this.degSpe01) < 0.1 ){
						this.actType = 'landing done';
						this.tLastAct = t;
						this.tLastAct = t+sec1*0.5;
						this.db("	[landing done] out of tiller stack");
					}

			 }else if( ( this.actType == '' || this.actType == 'correct' ) &&
			 	Math.abs( this.a0 ) > this.startTrashHold &&
			 	Math.abs( this.preA0DS02 ) > this.startTrashHold


			 ){
				 this.lastDelta = this.a0;
				 this.actType = 'correct';
				 var tickBy = this.errorToCorrectionGain*this.a0;
				 var maxOnStack = 3;
				 	if( tickBy > maxOnStack )
				 		tickBy = maxOnStack;
					else if( tickBy < -maxOnStack)
						tickBy = -maxOnStack;

					var tillSumAbs = Math.abs( tillerSum );
					var afterTilerSum = tillSumAbs+Math.abs(tickBy);

				 if( afterTilerSum<maxOnStack )
				 	this.tillerBy( -tickBy );
				 else{
					this.db(" correct maxt out!" + tillerSum);
					this.tillerBy(
						( maxOnStack - tillSumAbs ) * (tickBy >= 0 ? -1 : 1)
					 );
					this.db("  so max on :"+this.tillerStackSum());
				 }
				 this.tLastAct = t+sec1;
				 this.db(" [correct] by tick by:"+tickBy);


			 }

		 }


		 return this.getStatusMsg();
	}



}
