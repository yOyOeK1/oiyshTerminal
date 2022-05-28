




class apVPID{



	debug = false;
	dDiv = '';

	hdm = 0;
	delta = 0;
	target = 0;
	on = false;
	msgCount = 0;

	cl( msg ){
		if( !this.debug )
			return 0;
		console.log("apV3 deb: "+msg);
	}

	setDebug( status, divName ){
		this.debug = status;
		this.dDiv = divName;
	}

	getSettings(){
		return this.config;
	}
	setSettings( settings ){
		this.config = settings;
	}

	d( msg ){
		if( !this.debug )
			return '';

		var tr = '';
		for( var k in msg ){
			try{
				tr+= k+': '+
					msg[k].toFixed(4)+'<br>';
			}catch(e){
				tr+= k+': '+msg[k]+'<br>';
			}
		}

		$("#"+this.dDiv).html( tr );

	}

	getStatusMsg(){
		return {
			on: this.on ? '1' : '0',
      hdm: this.hdm,
      target: this.target,
      delta: this.delta,
      tillerBy: 'TODO',
      time: new Date(),
      msgCount: this.msgCount++
   	 };
	}

	setAuto( target ){
		this.setTarget( target );
		this.reset();
		this.on = true;
	}

	setTarget( target ){
		this.target = target;
	}

	setStandby(){
		this.on = false;
	}

	reset(){
		this.actionTo = new Date().getTime()+1000;
		this.action = [];
		this.actionStack = [];
		this.tillerPos = 0;
	}

	tillerStack = [];
	tillerBy( by ){
		this.tillerStack.push( by );
	}
	tillerGetMoves(){
		var tr = this.tillerStackSum();
		this.tillerStack = [];
		//this.cl("tiller get moves is "+tr);

		this.tillerPos+= tr;
		this.tillerPos-= (this.tillerPos/10000);

		if( tr > 1 ){
			tr = 1;
		}else if( tr < -1 )
			tr = -1;

		return tr;
	}
	tillerStackSum(){
		return this.tillerStack.reduce((partialSum, a) => partialSum + a, 0);
	}

	tillerByFromPID(){
		var sum = this.tillerStackSum();
		if( Math.abs(sum) > 0.03 ){
			this.tillerStack = [];
			return sum;
		}
		return 0;
	}

	sameSite( a, b ){
		if( ( a < 0 ) == ( b < 0 ) )
		 	return true;
		else
			return false;
	}


	action = [''];
	actionStack = [];
	actionLast = '';
	actionTo = 0;
	tillerPos = 0;

	aPush( actName, actForMs, site ){
		var t = new Date().getTime()+actForMs;
		this.cl("aPush: "+actName+" for:"+(actForMs/1000).toFixed(1)+
			" delta:"+this.delta.toFixed(2)
		);
		this.actionStack.push({
			'site': site,
			'tAdd': new Date().getTime(),
			'to': t,
			'name': actName
		});
	}
	aCan( actName ){
		var t = new Date().getTime();
		var l = this.actionStack.length-1;
		for(var i=l; i>=0; i--){
			if( this.actionStack[i]['name'] == actName && this.actionStack[i]['to']>t )
				return false;
		}
		return true;
	}

	aLast( ){
		return this.actionStack[ this.actionStack.length-1 ]||{
			'site': 1,
			'tAdd': new Date().getTime(),
			'to': 0,
			'name': ''
		};
	}

	sec1 = 1000;
	min1 = 60000;

	config = {
		'tillerGain': 1200,
		'avgSmoothing': 3000, // in millis
		'sampleGap': 2000,
		'debugToGraphana': 1,
		'P': 0.02,
		'I': 0.01,
		'D': 0.3
	};
	pid = null;
	tLast = 0;

	logStack = [];
	update( hdm ){
		if( !this.on )
			return '';
		if( this.pid == null )
			this.pid = new PIDController();


		this.pid.proportionalGain = this.config['P'];
		this.pid.integralGain = this.config['I'];
		this.pid.derivativeGain = this.config['D'];

		cl("ap iter...");
		var t = new Date().getTime();
		this.hdm = this.pid.AngleDifference(hdm,0);
		this.delta = this.deg360delta(this.hdm, this.target) ;
		this.storeIt("ap3Delta", this.delta, this.min1 );

		var deltaS = this.avgItKalman("ap3Delta", this.config['avgSmoothing'] );
		var deltaOld = this.avgItKalman("ap3Delta",
			this.config['avgSmoothing']+this.config['sampleGap'] //,this.config['avgSmoothing']
			);

		var siteOn = deltaS >= 0 ? 1 : -1;

		var angSpeed = ( ( deltaS-deltaOld ) / (this.config['avgSmoothing']/1500) );
		this.storeIt("ap3AngSpeed", angSpeed, this.min1 );

		var angSpeedOldStare = this.storeGetFirstOlderThen('ap3AngSpeed', 1000 );
		if( angSpeedOldStare != undefined ){
			var angAccel = ( angSpeed - angSpeedOldStare['v'] ) / ((t-angSpeedOldStare['t'])/1000);
			this.storeIt("ap3AngAccel", angAccel, this.min1 );
			var angAccelOld = this.avgItKalman("ap3AngAccel", this.config['avgSmoothing'] );
			var angSpeedOld = angSpeedOldStare['v'];
		}else{
			var angAccel = 0;
			var angAccelOld = 0;
			var angSpeedOld = 0;
		}

		var deltaPred5 = deltaS+( angSpeed*5 );
		var deltaPred10 = deltaS+( angSpeed*10 );
		var deltaPred15 = deltaS+( angSpeed*15 );

		var angAccDelta = angAccel-angAccelOld;
		var accTrend = Math.abs(angAccel) - Math.abs(angAccelOld);


		var til = this.pid.UpdateAngle(
			parseFloat(deltaS),parseFloat(0)
		);
		this.tillerBy( ( this.tLast-til ) );
		var tillerMoves = this.tillerByFromPID();
		this.tLast = til;

		//this.tillerBy( (deltaS < 0 ? -0.1 : 0.1)*Math.abs(angSpeed)*trendGainSRA );


		var tillerSum = this.tillerStackSum().toFixed(2);

		var debVals = {
			'hdm': hdm,
			'target': this.target,
			'delta': this.delta,
			'deltaS': deltaS.toFixed(2)+" siteOn:"+siteOn,

		};
		this.d(debVals);
		/*cl("ap iter DONE d:"+deltaS.toFixed(2)+
			" angSpeed:"+angSpeed.toFixed(2)+
			" angAccDelta:"+angAccDelta.toFixed(3)+
			" SRA:"+trendGainSRA
		);
		*/

		if( 0 )
			this.logStack.push({
				'deltaS': parseFloat(deltaS.toFixed(2)),
				'deltaOld': parseFloat(deltaOld.toFixed(2)),
				'tillerPos': parseFloat(this.tillerPos.toFixed(2)),
				'tiller': tillerMoves.toFixed(2)
			});

		return {
			'delta': this.delta,
			'tillerPos': this.tillerPos,
			'tillerBy': tillerMoves
		};

	}


	//
	deg360Pos( deg ){
	  deg = deg%360;
	  if( deg < 0 )
	    deg+=360;
	  return deg;
	}

	deg360delta( deg0, deg1 ){
	  //console.log("deg to Pos in:"+deg0+" -> "+deg360Pos(deg0) );
	  //console.log("deg to Pos in:"+deg1+" -> "+deg360Pos(deg1) );
	  deg0 = this.deg360Pos(deg1)-this.deg360Pos(deg0);

	  if( deg0 > 180 )
	    deg0-=360;
	  if( deg0 < -180 )
	    deg0+=360;

	  return deg0;
	}



	storeData = {};
	storeIt( key, val, forMs ){
	  var t = new Date().getTime();
	  //new Date().getTime() / 1000
	  //console.log("t:"+t);
	  // todo
	  if( this.storeData[key] == undefined )
	    this.storeData[key] = new Array();

	    this.storeData[key].push({
	      'v': val,
	      't': t
	      });

	    var tOld = t - forMs;
	    while( true ){
	      if( this.storeData[key][0]['t'] < tOld ){
	        //console.log("storeIt key:"+key+" drop to old!");
	        this.storeData[key].shift();

	      }else{
	        //console.log("storeIt key:"+key+" is up to date..."+len);
	        break;
	      }

	    }


	}
	storeGetLast( key ){
	  return this.storeData[key][ this.storeData[key].length-1 ];
	}
	storeGetPreLast( key ){
	  return this.storeData[key][ this.storeData[key].length-2 ];
	}


	storeGetFirstOlderThen( key, ms ){
	  var d = this.storeData[key];
	  if( d == undefined )
	    return undefined;

	  var t = new Date().getTime()-ms;
	  var l = d.length-1;
	  for( var i=l;i>0;i-- ){
	    if( d[i]['t']<=t ){
	      return d[i];
	    }
	  }

	  return undefined;
	}

	/*
	if only forMs set thin
	[0] |__________[forMs]++++| [now]

	if forMs and toMs set thin
	[0] |___[forMs]++++[forMS+toMs]____________| [now]
	*/
	avgIt( key, forMs, toMs ){
	  var now = new Date().getTime();

	  var t = now-forMs;

	  var tFrom = now;
	  if( toMs != undefined )
	    tFrom = t+toMs;

	  var d = this.storeData[key];
	  var l = d.length-1;
	  var tr = 0;
	  var trC = 0;


	  for( var i=l; i>=0; i-- ){
	    if( t <= d[i]['t'] && d[i]['t'] <= tFrom ){
	      tr+= d[i]['v'];
	      trC++;
	    }

	  }

	  //console.log("avgIt tr"+tr+" trC"+trC+" res"+(tr/trC));
	  return tr/trC;

	}


	/*kalmanjs, Wouter Bulten, MIT, https://github.com/wouterbulten/kalmanjs */
	/*kalmanjs, Wouter Bulten, MIT, https://github.com/wouterbulten/kalmanjs */
	KalmanFilter2=function(){"use strict";function s(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(){function v(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i=t.R,e=void 0===i?1:i,s=t.Q,n=void 0===s?1:s,r=t.A,h=void 0===r?1:r,a=t.B,o=void 0===a?0:a,u=t.C,c=void 0===u?1:u;!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,v),this.R=e,this.Q=n,this.A=h,this.C=c,this.B=o,this.cov=NaN,this.x=NaN}var t,i,e;return t=v,(i=[{key:"filter",value:function(t){var i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;if(isNaN(this.x))this.x=1/this.C*t,this.cov=1/this.C*this.Q*(1/this.C);else{var e=this.predict(i),s=this.uncertainty(),n=s*this.C*(1/(this.C*s*this.C+this.Q));this.x=e+n*(t-this.C*e),this.cov=s-n*this.C*s}return this.x}},{key:"predict",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0;return this.A*this.x+this.B*t}},{key:"uncertainty",value:function(){return this.A*this.cov*this.A+this.R}},{key:"lastMeasurement",value:function(){return this.x}},{key:"setMeasurementNoise",value:function(t){this.Q=t}},{key:"setProcessNoise",value:function(t){this.R=t}}])&&s(t.prototype,i),e&&s(t,e),v}()}();


	avgItKalman( key, forMs, toMs ){
	  var now = new Date().getTime();

		var kal = new this.KalmanFilter2();
	  var t = now-forMs;

	  var tFrom = now;
	  if( toMs != undefined )
	    tFrom = t+toMs;

	  var d = this.storeData[key];
	  var l = d.length-1;
	  var tf = [];
	  var tfC = 0;

	  for( var i=l; i>=0; i-- ){
	    if( t <= d[i]['t'] && d[i]['t'] <= tFrom ){
	      tf.push( kal.filter(d[i]['v']) );
	      tfC++;
			}

	  }


	  //console.log("avgIt tr"+tr+" trC"+trC+" res"+(tr/trC));
	  return tf.reduce((partialSum, a) => partialSum + a, 0)/tfC;

	}






}
module.exports = apV3
