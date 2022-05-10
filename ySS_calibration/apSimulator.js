
class apSimulator{

	// config
	speed = 4;
	delay = 6; // more then 1
	tillerOffset = 0;
	randomNois = 0;
	debug = false;

	tiller = 0;
	hdm = 0;
	angleForce = 0;

	thisObj;

	constructor( divName, holder ){
		this.thisObj = holder;
		$("#"+divName).html(`
			hdm:
			<input type="button" value="-1" onclick="`+this.thisObj+`.HDMFakeBy(-1)">
			<input type="button" value="+1" onclick="`+this.thisObj+`.HDMFakeBy(1)">

			tiller: <input type="button" value="-1" onclick="`+this.thisObj+`.TillerFake(-1)">
			<input type="button" value="-0.2" onclick="`+this.thisObj+`.TillerFake(-0.2)">
			<input type="button" value="+0.2" onclick="`+this.thisObj+`.TillerFake(0.2)">
			<input type="button" value="+1" onclick="`+this.thisObj+`.TillerFake(1)">
			`);
	}

	HDMFakeBy( by ){
		this.hdm+= parseFloat(by);
	}
	TillerFake( by ){
		this.tiller+= parseFloat(by);
	}

	iter(){
		this.angleForce = ( this.angleForce*this.delay +
			( this.tillerOffset+this.tiller )
			) / (this.delay+1);
		this.hdm = deg360Pos( this.hdm +
			( this.angleForce*this.speed )+
			( Math.random() - 0.5 )*this.randomNois
			);

	}

	setTillerBy( by ){
		this.tiller+= by;
	}


}
module.exports = apSimulator
