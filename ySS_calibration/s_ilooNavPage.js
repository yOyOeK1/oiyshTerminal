class s_ilooNavPage{

	get getName(){
		return 'iloo nav';
	}

	get getDefaultBackgroundColor(){
		return "#000000";
	}


	get getHtml(){
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
		storeIt( 'cog', cog, min1 );
		putText("boatCOG", (""+Math.abs(cog)).substring(0,3) );
		rotateSvgSetRC( "boatCogMarker", "rosettaRc", cog-hdg );

		var nm = getDistLLInNM( lastLat['v'], lastLon['v'], lat['v'], lon['v'] );
		var inTime = lat['t']-lastLat['t'];

		//console.log("distance is "+nm);
		//console.log("in time ms:"+inTime);

		var sog = nm*(3600000/inTime);
		$("#boatSOG").text( (""+sog).substring(0,3) );
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
			$("#boatHDG").text( mag );
			rotateSvg( "rosetta", true, -mag );

			//BRG test
			var brg = 20
			$("#boatBrg").text( brg );
			rotateSvgSetRC( "boatBrgMarker", "rosettaRc", brg );

		}else if( r.topic == 'and/orient/heel'){
			var h = Math.round( r.payload );
			$("#boatHeelVal").text( h );
			rotateSvg( "boatHeel", true, h );
		}
	}
}
