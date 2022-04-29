class s_basicSailPage{

  get getName(){
    return 'basic sail';
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  get getHtml(){
    return ``;
  }


  navBatteryUpdate( perc ){
    putText("batPercent", perc+"%");
  }


  looperIter(){
    //console.log("basic sailing looperIter...");
    navBatteryPercent(this.navBatteryUpdate);

  }

  // to fix !!!!
  makeLoopForNav(){
    console.log("loopForNav");

    var xtet = storeGetLast['xte']['t'];
    var t = new Date().getTime();

    if( xtet < (t-sec1*5) ){
      this.onMessageCallBack({
        'topic': 'NR/nav/clien'
        });
      console.log("loopForNav clean it !");
    }


  }

  getHtmlAfterLoad(){

  }

  get svgDyno(){
    console.log("s_basicSailPage get svgDyno");
    return s_basicSail;
  }

  svgDynoAfterLoad(){

  }


  doLL(){
    var lat = storeGetLast('lat');
    var lon = storeGetLast('lon');

    var lastLat = storeGetPreLast('lat');
    var lastLon = storeGetPreLast('lon');

    /*
    console.log("-------- do LL");
    console.log(lat);
    console.log(lon);

    console.log(lastLat);
    console.log(lastLon);
    */

    if( lastLat == undefined )
      return 0;


    var cog = getAngleLL(  lastLat['v'], lastLon['v'], lat['v'], lon['v'] );
    //console.log("cog:"+cog);
    storeIt( 'cog', cog, min1 );
    putText("gpsCOG", (""+cog).substring(0,5) );

    var nm = getDistLLInNM( lastLat['v'], lastLon['v'], lat['v'], lon['v'] );
    var inTime = lat['t']-lastLat['t'];

    //console.log("distance is "+nm);
    //console.log("in time ms:"+inTime);

    var cog = nm*(3600000/inTime);
    putText("gpsSpeed", (""+cog).substring(0,5) , 'c', 5);
  }



  onMessageCallBack( r ){

    if( r.topic == 'and/lat' ){
      putText("gpsLat", r.payload.substring(0,11) );
      storeIt( 'lat', parseFloat(r.payload),  min5);

    }else if( r.topic == 'and/lon' ){
      putText("gpsLon", r.payload.substring(0,11) );
      storeIt( 'lon', parseFloat(r.payload),  min5);
      this.doLL();

    }else if( r.topic == 'and/mag' ){
      putText("magHDG", Math.round(r.payload) , 'c', 3);
      storeIt( 'hdg', parseFloat(r.payload),  sec1*10);


    }else if( r.topic == 'and/orient/heel'){
      var heelNorm = (r.payload/45)+0.5;
      //console.log("heelNorm:"+heelNorm);
      moveOnPath( "heelBall", "heelBallPath", heelNorm );
      storeIt( "heel", heelNorm, sec30 );
      moveOnPath( "heelBallAvg", "heelBallPath", avgIt("heel", sec1*10) );

      putText("heelAng", Math.round(r.payload) , 'c', 3);
      //moveOnPath( "heelAngValue", "heelBallPath", heelNorm );


    }else if( r.topic == 'NR/nav/clean' ){
      putText("gpsRNG", 0 );
      putText("gpsXTE", 0 );
      putText("gpsOnhead", 0 );
      SVG("#XTEL").attr({'fill-opacity': 0.0});
      SVG("#XTER").attr({'fill-opacity': 0.0});


    }else if( r.topic == 'NR/nav/rmb' ){
      putText("gpsRNG", (""+r.payload['rng']).substring(0,5) );

      putText("gpsXTE", (""+r.payload['xte']).substring(0,5) );
      storeIt( 'xte', r.payload['xte'], sec30 );

      putText("gpsOnhead", Math.round(r.payload['onHeading']) );
      var hdg = storeGetLast( 'hdg' )['v'];
      var delta = deg360delta( hdg, parseInt(r.payload['onHeading']) );

      SVG("#XTEL").attr({
        'fill-opacity': mMapVal( delta, -1, -10, 0, 1, true)
        });
      SVG("#XTER").attr({
        'fill-opacity': mMapVal( delta, 1, 10, 0, 1, true)
        });


      //console.log("onheadcal delta:"+delta+" lM:"+lM+" rM:"+rM);


    }


    /*
    if( r.topic == "and/mag" ){
  		var mag = Math.round( r.payload );
  		//$("#bearingV").text( Math.round(r.payload) );
  		$("#boatHDG").text( mag );
  		$("#boatHDGShadow").text( mag );
  		rotateSvg( "rosetta", true, -mag );

  	}else if( r.topic == "and/orient/heel" ){
  		var h = Math.round( r.payload );
  		$("#boatHeelVal").text( h );
  		//rotateImage( $('#heelI'), h );
  		rotateSvg( "boatHeel", true, h );

  	}else if( r.topic == "and/orient/pitch" ){
  		var p = Math.round( r.payload );
  		$("#boatPitchVal").text( p );
  		//rotateImage( $('#pitchI'), -p );
  		rotateSvg( "boatPitch", true, p );

  	}else if( r.topic == "and/stat/accelCorrect" ){
  		console.log("got accel correct");
  		$("#accCorrV").text( r.payload );
  		var cor = r.payload.split(",");
  		$("#sliX").slider( 'value', cor[0] );
  		$("#sliY").slider( 'value', cor[1] );
  		$("#sliZ").slider( 'value', cor[2] );

  	}
    */

  }


}
