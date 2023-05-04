class s_ilooNavPage{

	get getName(){
		return 'iloo nav';
	}

	get getDefaultBackgroundColor(){
		return "#000000";
	}


	get getHtml(){
		if(0){
			cl("this experiment------------------");
			cl("this experiment------------------");
			cl("this,	");
			cl([this,	]);
			cl("this.getName: "+this.getName);
			cl("this experiment------------------");
			cl("this experiment------------------");
		}
		return ``;
	}

	getHtmlAfterLoad(){
	}

	get svgDyno(){
		console.log("s_ilooNavPage get svgDyno");
		return s_ilooNav;
	}

	svgDynoAfterLoad(){

	}

	doLL(){
		var lat = storeGetLast('lat');
		var lon = storeGetLast('lon');

		var lastLat = storeGetPreLast('lat');
		var lastLon = storeGetPreLast('lon');

		var hdg = storeGetLast('hdg');


		if( lastLat == undefined )
			return 0;

		var cog = getAngleLL(  lastLat['v'], lastLon['v'], lat['v'], lon['v'] );
		storeIt( 'cog', Math.round(cog), min1 );
		putText("boatCOG", (""+Math.abs(cog).toFixed(0)).substring(0,3) );
		rotateSvgSetRC( "boatCogMarker", "rosettaRc",
			cog - storeGetLast('hdg')['v']
			);

		var nm = getDistLLInNM( lastLat['v'], lastLon['v'], lat['v'], lon['v'] );
		var inTime = lat['t']-lastLat['t'];

		//console.log("distance is "+nm);
		//console.log("in time ms:"+inTime);

		var sog = nm*(3600000/inTime);
		$("#boatSOG").text( (""+sog.toFixed(1)).substring(0,3) );
	}


	onMessageCallBack( r ){

		if( r.topic == 'and/lat' ){
			//putText("gpsLat", r.payload.substring(0,11) );
			storeIt( 'lat', parseFloat(r.payload),  min5);

		}else if( r.topic == 'and/lon' ){
			//putText("gpsLon", r.payload.substring(0,11) );
			storeIt( 'lon', parseFloat(r.payload),  min5);
			this.doLL();

		}else if( r.topic == 'and/mag' ){
			storeIt( 'hdg', parseFloat(r.payload),  sec1*10);
			var mag = Math.round( r.payload );
			$("#boatHDG").text( mag+'' ); // 3 zera jak baza i stopnie ze jednostki
			rotateSvg( "rosetta", true, -mag );

		}else if( r.topic == 'NR/nav/rmb' ){
	    //BRG test
			var brg = Math.round( r.payload['onHeading'] );
			$("#boatBRG").text( brg );
			rotateSvgSetRC( "boatBrgMarker", "rosettaRc",
				brg - storeGetLast('hdg')['v']
				);
			//console.log("hdg:");
			//console.log( storeGetLast('hdg')['v'] );

		}else if( r.topic == 'and/orient/heel'){
			var h = Math.round( r.payload );
			$("#boatHeelVal").text( h );
			rotateSvg( "boatHeel", true, h );

		}else if( r.topic == "and/orient/pitch" ){
			var p = Math.round( r.payload );
			$("#boatPitchVal").text( p );
			rotateSvgSetRC( "boatPitch", "boatPitchRC", p );

		}
	}
}
