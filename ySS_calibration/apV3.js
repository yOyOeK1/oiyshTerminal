
class apV3{

	config = {
		'tillerGain': 1200,
		'avgSmoothing': 3000, // in millis
		'sampleGap': 2000
	};

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

	aPush( actName, actForMs ){
		var t = new Date().getTime()+actForMs;
		this.cl("aPush: "+actName+" for:"+(actForMs/1000).toFixed(1));
		this.actionStack.push({
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

	sec1 = 1000;
	min1 = 60000;

	update( hdm ){
		if( !this.on )
			return '';

		var t = new Date().getTime();
		this.hdm = hdm;
		this.delta = this.deg360delta( this.hdm, this.target );
		this.storeIt("ap3Delta", this.delta, this.min1 );

		var deltaS = this.avgIt("ap3Delta", this.config['avgSmoothing'] );
		var deltaOld = this.avgIt("ap3Delta",
			this.config['avgSmoothing']+this.config['sampleGap'] //,this.config['avgSmoothing']
			);

		var siteOn = deltaS >= 0 ? 1 : -1;
		//deltaS*= site;
		//deltaOld*= site;

		var angSpeed = ( ( deltaS-deltaOld ) / (this.config['avgSmoothing']/1500) );


		this.storeIt("ap3AngSpeed", angSpeed, this.min1 );
		var angSpeedOldStare = this.storeGetFirstOlderThen('ap3AngSpeed', 1000 );
		if( angSpeedOldStare != undefined ){
			var angAccel = ( angSpeed - angSpeedOldStare['v'] ) / ((t-angSpeedOldStare['t'])/1000);
			this.storeIt("ap3AngAccel", angAccel, this.min1 );
			var angAccelOld = this.avgIt("ap3AngAccel", this.config['avgSmoothing'] );
			var angSpeedOld = angSpeedOldStare['v'];
		}else{
			var angAccel = 0;
			var angAccelOld = 0;
			var angSpeedOld = 0;
		}

		var deltaPred5 = deltaS+( angSpeed*5 );
		var deltaPred10 = deltaS+( angSpeed*10 );
		var deltaPred15 = deltaS+( angSpeed*15 );


		var accTrend = Math.abs(angAccel) - Math.abs(angAccelOld);



		if(
			Math.abs( deltaS ) > 1 &&
			(
				this.sameSite( deltaS, angSpeed ) ||
				angSpeed == 0
			) &&
			this.aCan('to target')
		){
			this.tillerBy( (deltaS < 0 ? -0.01: 0.01)*Math.abs( deltaS ) );
			this.aPush('to target', this.sec1*5 );

		}

		if(
			 !this.sameSite( deltaS, deltaPred15 ) &&
			 Math.abs( angSpeed ) > 0.1 &&
			 this.aCan('langing far')
		){
			this.tillerBy( (deltaS > 0 ? -0.1 : 0.1 )*Math.abs(angSpeed) );
			this.aPush('langing far', this.sec1*3 );
		}

		if(
			 accTrend <= 0 &&
			 this.sameSite( deltaS, angSpeed ) &&
			 //Math.abs( angSpeed )> 0.2 &&
			 this.aCan('stop run away')
		){
			this.tillerBy( (deltaS < 0 ? -0.2 : 0.2)*Math.abs(angSpeed) );
			this.aPush('stop run away', this.sec1*4 );
		}


		this.d({
			'delta': this.delta,
			'deltaS': deltaS.toFixed(2)+" siteOn:"+siteOn,
			'deltaPredict 5, 10, 15 -> ': deltaPred5.toFixed(0)+" , "+deltaPred10.toFixed(0)+" , "+deltaPred15.toFixed(0),
			'angSpeed': angSpeed,
			'angSpeedOld': angSpeedOld,
			'angAccel': angAccel.toFixed(2)+" , "+angAccelOld.toFixed(2),
			'accTrend': accTrend,
			'tillerSum': this.tillerStackSum().toFixed(2)+" pos:"+this.tillerPos.toFixed(3)
			});

		return {
			'delta': this.delta,
			'tillerPos': this.tillerPos,
			'tillerBy': this.tillerGetMoves()
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





}
module.exports = apV3
