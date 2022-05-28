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


  looperIter(){
    //cl("basic sailing looperIter...");
    //navBatteryPercent(this.navBatteryUpdate);
  }

  // to fix !!!!
  makeLoopForNav(){
    cl("loopForNav");

    var xtet = storeGetLast['xte']['t'];
    var t = new Date().getTime();

    if( xtet < (t-sec1*5) ){
      this.onMessageCallBack({
        'topic': 'NR/nav/clien'
        });
      cl("loopForNav clean it !");
    }


  }

  getHtmlAfterLoad(){

  }

  get svgDyno(){
    cl("s_basicSailPage get svgDyno");
    return s_basicSail;
  }

  hdgPlotUpdater = null;
  svgDynoAfterLoad(){
    this.hdgPlotUpdater = m_d3PlotInit("hdgPlot",  {
      'direction': 'upDown',
      'plotType': 'area',
      'fillColor': '#0f0',
      'lineSize': 1,
      'legendX': 'no',
      'legendY': 'no',
      'fillToPoint': 0
      });
  }


  doLL(){
    var lat = storeGetLast('lat');
    var lon = storeGetLast('lon');

    var lastLat = storeGetPreLast('lat');
    var lastLon = storeGetPreLast('lon');

    /*
    cl("-------- do LL");
    cl(lat);
    cl(lon);

    cl(lastLat);
    cl(lastLon);
    */

    if( lastLat == undefined )
      return 0;


    var cog = deg360Pos(
      getAngleLL(  lastLat['v'], lastLon['v'], lat['v'], lon['v'] )
      );
    //cl("cog:"+cog);
    storeIt( 'cog', cog, min1 );
    putText("gpsCOG", (""+avgItKalman('cog', sec1*10)).substring(0,5) );

    var nm = getDistLLInNM( lastLat['v'], lastLon['v'], lat['v'], lon['v'] );
    var inTime = lat['t']-lastLat['t'];

    //cl("distance is "+nm);
    //cl("in time ms:"+inTime);

    var sog = nm*(3600000/inTime);
    storeIt('sog', sog, min1 );
    putText("gpsSpeed", (""+avgItKalman('sog',sog,sec1*10)).substring(0,5) , 'c', 5);
  }



  onMessageCallBack( r ){
    //cl("s_basicSailPage onMessageCallBack ");
    //cl("s_bas... :"+r.topic);
    if( r.topic == 'and/lat' ){
      putText("gpsLat", r.payload.substring(0,11) );
      storeIt( 'lat', parseFloat(r.payload),  min5);

    }else if( r.topic == 'and/lon' ){
      putText("gpsLon", r.payload.substring(0,11) );
      storeIt( 'lon', parseFloat(r.payload),  min5);
      this.doLL();

    }else if( r.topic == 'and/mag' ){
      //putText("magHDG", Math.round(r.payload) , 'c', 3);
      putText("magHDG", Math.round(r.payload) );
      var hdg = parseFloat(r.payload)
      storeIt( 'hdg', hdg,  sec30);
      var hdgAvg =  avgIt("hdg", sec30);
      storeIt( 'hdgDeltaFromAvg', deg360delta( hdgAvg, hdg ), sec30  );

      //cl("avgIt hdg min1: "+ avgIt("hdg", min1));
      this.hdgPlotUpdater( storeData[ 'hdgDeltaFromAvg' ], {
        'fillToPoint': 0
        });

    }else if( r.topic == 'and/orient/heel'){
      var heelNorm = (r.payload/45)+0.5;
      //cl("heelNorm:"+heelNorm);
      moveOnPath( "heelBall", "heelBallPath", heelNorm );
      storeIt( "heel", heelNorm, sec30 );
      moveOnPath( "heelBallAvg", "heelBallPath", avgIt("heel", sec1*10) );

      putText("heelAng", Math.round(r.payload));
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


      //cl("onheadcal delta:"+delta+" lM:"+lM+" rM:"+rM);

    }else if( r.topic == 'thisDevice/bat/perc' ){
        putText("batPercent", r.payload+"%" );

    }else{
      cl("s_basicSailPage on ws message NaN");
      cl(r);
      cl("---------------");
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
  		cl("got accel correct");
  		$("#accCorrV").text( r.payload );
  		var cor = r.payload.split(",");
  		$("#sliX").slider( 'value', cor[0] );
  		$("#sliY").slider( 'value', cor[1] );
  		$("#sliZ").slider( 'value', cor[2] );

  	}
    */

  }


}
