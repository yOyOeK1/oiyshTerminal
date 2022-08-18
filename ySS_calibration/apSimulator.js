
class apSimulator{

	// config
	speed = 2;
	delay = 3; // more then 1
	tillerOffset = 0;
	randomNois = 0.1;
	debug = false;
	drift = 0;

	tiller = 0;
	hdm = 0;
	angleForce = 0;
	target = 0;

	thisObj;
	divName;
	timeTicker=0;
	delta = 0;
	deltaH = [];
	uiUpdate = true;

	sumError = 0;
	playScen = true;
	finish = false;
	scen = [
		[1, {drift: 10,speed:9}],
		[2, {drift: 20,speed:9}],
		[2, {drift: -20,speed:9}],
		[1, {drift: 10,speed:9}],
		[3, {target:5, drift: 40,speed:9}],
		[3, {drift: -20,speed:9}],
		[3, {drift: -10,speed:9}],
		[3, {drift: -40,speed:9}],
		[3, {drift: -20,speed:9}],
		[5, {target: 10, druft:0, speed: 4, randomNois: 1.8}],
		[40, {target: 20}],
		[40, {target: 60, drift:3}],
		[40, {target: 0}],
		[60, {target: -45}],
		[60, {target: 45}],
		[60, {target: -45, drift:-3}],
		[60, {target: 45}],
		[30, {target: -10}],
		[10, {target: 15, speed:6, delay: 6, randomNois: 1.9}],
		[10, {target: 0}],
		[20, {target: 20}],
		[20, {target: -45, delay: 3, randomNois: 1.8}],
		[1, {drift: 10,speed:9}],
		[2, {drift: 20,speed:9}],
		[2, {drift: -20,speed:9}],
		[2, {target:0, drift: 0, speed:15}],
		[2, {target:5, drift: 10, speed:10}],
		[2, {target:0, drift: 20, speed:15}],
		[2, {target:-5, drift: 10, speed:5}],
		[2, {target:-10, drift: -5, speed:10}],
		[2, {target:0, drift: 0, speed:15}],
		[2, {target:5, drift: 10, speed:10}],
		[2, {target:0, drift: 20, speed:15}],
		[2, {target:-5, drift: 10, speed:5}],
		[2, {target:-10, drift: -5, speed:10}],
		[2, {target:0, drift: 0, speed:15}],
		[2, {target:5, drift: 10, speed:10}],
		[2, {target:0, drift: 20, speed:15}],
		[2, {target:-5, drift: 10, speed:5}],
		[2, {target:-10, drift: -5, speed:10}],
		[10, {drift: 5}],
		[30, {target: 10, delay: 3}],
		[20, {target: -10}],
		[2, {drift: -20,speed:14, randomNois: 1.3}],
		[2, {drift: 20,speed:9}],
		[2, {drift: -40,speed:20}],
		[30, {target: 26}], // 610 sec
		[10, {drift: -5}],
		[30, {target: -47}],
		[10, {target: -65}],
		[2, {drift: -4,speed:3}],
		[20, {target: 10}],
		[20, {target: 40}],
		[2, {drift: 20,speed:5}],
		[10, {drift: 0,speed:4}],
		[40, {target: 110}],

		//[60, {finish: true}],

		[90, {target: 10}],
		[90, {target: -20}],
		[10, {drift: -4,speed:9, randomNois: 1.6}],
		[50, {target: 49}],
		[2, {drift: -20,speed:14}],
		[2, {drift: 20,speed:9}],
		[30, {target: 90}],
		[30, {target: 120}],
		[2, {drift: 20,speed:14}],
		[2, {drift: 10,speed:9}],
		[30, {target: 140}],
		[2, {drift: -20,speed:6}],
		[2, {drift: 20,speed:7}],
		[30, {target: 100}],
		[10, {drift: 40,speed:19}],

		//[60, {finish: true}],

		[60, {target: 41}],
		[60, {target: 90}],
		[1, {drift: 20,speed:19}],
		[30, {target: 120}],
		[10, {drift: 0,speed:19}],
		[5, {drift: -20,speed:10}],
		[10, {drift: 10,speed:10}],
		[30, {target: 140}],
		[30, {drift: 0,speed:5}],
		[5, {drift: -10,speed:3}],
		[10, {drift: 10,speed:3}],
		[60, {target: 100, delay: 2, randomNois: 2}],
		[60, {target: 40}],
		[60, {target: 10}],
		[60, {finish: true}],

	];


	scen1 = [
		[20, {target: 10}],
		[30, {target: -15}],
		[20, {target: 0}],
		[20, {target: -20}],
		[20, {target: -45}],
		[10, {drift: 10,speed:9}],
		[2, {drift: 20,speed:9}],
		[2, {drift: -20,speed:9}],
		[2, {drift: -40,speed:9}],
		[10, {drift: 5}],
		[30, {target: 10}],
		[20, {target: -10}],
		[2, {drift: 20,speed:9}],
		[2, {drift: -20,speed:9}],
		[2, {drift: -40,speed:9}],
		[60, {target: 46}],
		[10, {drift: -5}],
		[60, {target: -47}],
		[10, {target: -65}],
		[10, {target: 10}],
		[10, {drift: 0,speed:4}],
		[60, {target: 110}],
		[90, {target: 10}],
		[90, {target: -20}],
		[10, {drift: -4,speed:9}],
		[90, {target: 49}],
		[30, {target: 90}],
		[30, {target: 120}],
		[30, {target: 140}],
		[30, {target: 100}],
		[10, {drift: 40,speed:19}],
		[90, {target: 41}],
		[30, {target: 90}],
		[10, {drift: 20,speed:19}],
		[30, {target: 120}],
		[10, {drift: 0,speed:19}],
		[5, {drift: -40,speed:10}],
		[10, {drift: 10,speed:10}],
		[30, {target: 140}],
		[30, {target: 100}],
		[30, {target: 10}],

	];

	reset(){
		this.angleForce = 0;
		this.hdm = 0;
		this.target = 0;

		this.lTarget = null;
		this.onError = 0;

		this.delta = 0;
		this.tiller = 0;
		this.timeTicker = 0;
		sim.finish = false;
		this.scenLast = 0;
		this.scenLastTime = 0;
		this.randomNois = 0;
		this.sumError = 0;
		this.uiUpdate = true;
		this.tillerMovesSum = 0;
		this.deltaH = Array(20).fill(0);
		this.hdmH = Array(20).fill(0);
		this.tilleryByH = Array(20).fill(0);
	}


	constructor( divName, holder ){
		this.divName = divName;
		this.thisObj = holder;
		$("#"+divName).html(`

			hdm: <div id="apSimHDM"  style="display:inline;"></div>
			time: <div id="apSimTime"  style="display:inline;"></div>sec.
			<input type="button" value="-1" onclick="`+this.thisObj+`.HDMFakeBy(-1)">
			<input type="button" value="+1" onclick="`+this.thisObj+`.HDMFakeBy(1)">
			<br>
			target: <div id="apSimTarget"  style="display:inline;"></div>
			delta: <div id="apSimDelta"  style="display:inline;"></div>
			<br>
			tiller: <input type="button" value="-1" onclick="`+this.thisObj+`.TillerFake(-1)">
			<input type="button" value="-0.2" onclick="`+this.thisObj+`.TillerFake(-0.2)">
			<div id="apSimTillerPos" style="display:inline;"></div>
			<input type="button" value="+0.2" onclick="`+this.thisObj+`.TillerFake(0.2)">
			<input type="button" value="+1" onclick="`+this.thisObj+`.TillerFake(1)">
			<br>
			speed: <input type="text" value="`+this.speed+`" id="apSimSpeed" style="width:30px">
			drifft: <input type="text" value="`+this.drift+`" id="apSimDrift" style="width:30px">
			`);
	}

	HDMFakeBy( by ){
		this.hdm+= parseFloat(by);
	}
	TillerFake( by ){
		this.tiller+= parseFloat(by);
	}


	scenLast = 0;
	scenLastTime = 0;
	iter(){

		this.angleForce = ( this.angleForce*this.delay +
			( this.tillerOffset+this.tiller )
			) / (this.delay+1);
		this.hdm = deg360Pos( this.hdm +
			( this.angleForce*
			( this.playScen == false ?	parseFloat( $('#apSimSpeed').val()||2 ):
				this.speed
			)
			 )+
			( Math.random() - 0.5 )*this.randomNois +
			( this.playScen == false ?	parseFloat( $('#apSimDrift').val()||0 )/10:
				this.drift / 10
			)
			);

		this.delta = deg360delta(this.hdm, this.target );
		this.deltaH.push(this.delta);
		if( this.deltaH.length>20 )
			this.deltaH.shift();

		this.hdmH.push(this.hdm);
		if( this.hdmH.length>20 )
			this.hdmH.shift();


		if( this.lTarget == null )
			this.lTarget = this.target;
		if( this.lTarget != this.target ){
			this.onError = 0;
			this.lTarget = this.target;
		}
		this.onError+=0.1;

		var onErrorGain = Math.abs(this.delta)*this.onError;
		//console.log( "onErrorGain:"+onError);
		this.sumError+= Math.abs(this.delta)*onErrorGain;


		// fittnes v1
		//this.sumError+= Math.abs(this.delta)*Math.abs(this.delta);



		if( this.uiUpdate ){
			$('#apSimTarget').text( this.target );
			$('#apSimDelta').text( this.delta.toFixed(2) );
			$('#apSimHDM').text( this.hdm.toFixed(1) );
			$('#apSimTillerPos').text( this.tiller.toFixed(5) );
			$('#apSimTime').text( (this.timeTicker/1000).toFixed(0) );
		}
		this.timeTicker+=500;


		if( this.playScen ){
			if( this.timeTicker >= (this.scenLastTime+ (this.scen[ this.scenLast ][0]*1000) ) ){
				this.scenLastTime = this.timeTicker;
				var act = this.scen[ this.scenLast ][1];
				for( var k in act ){
					//console.log("set "+k+" to "+act[k]+" at delta:"+this.delta.toFixed(2)+" sumError:"+this.sumError.toFixed(2));
					this[ k ] = act[k];
				}
				this.scenLast++;
			}
		}

	}

	setTillerBy( by ){
		//console.log("setTillerBy"+by+" type"+type(by));

		this.tilleryByH.push(by);
		if( this.tilleryByH.length>20 )
			this.tilleryByH.shift();

		this.tiller+= by;
		if( this.tiller > 1 )
			this.tiller = 1;
		if( this.tiller < -1)
			this.tiller = -1;

		this.tillerMovesSum += Math.abs(by);
	}


}
module.exports = apSimulator
