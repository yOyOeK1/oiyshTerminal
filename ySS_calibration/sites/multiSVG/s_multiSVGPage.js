
function mulSvgOnClick( cmd ){
  pager.getCurrentPage().mulSvgOnClick( cmd );
}

class s_multiSVGPage{

  constructor(){
    this.svgsList = [
      "multiSvg01.svg",
      "multiSvg02Big.svg",
      "multiSvgFastScreen.svg",
      "igv1-16.svg",
      "monsterL.svg",
      "monsterR.svg",
      "chromeStartMenu1.svg",
      "multiSvgOM02.svg"
    ];

    this.msOid = -1;
    this.msO = -1;

    this.muSvMa = {};
    this.hdgPlotUpdater = null;

    this.app = new mApp();
  }


  get getName(){
    return 'multi SVG';
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }


  mulSvgParseGet( data, status ){
    cl("mul svg parse get --------");
    $("#htmlDyno").html('');
    pager.setHeader('');

    pager.getCurrentPage().muSvMa = {};

    $("#svgDyno").html( data.childNodes[1] );
    pager.getCurrentPage().svgDynoAfterLoad();

  }

  mulSvgOnClick( cmd ){
    cl("multi svg on click. ["+cmd+"]");
    let args = cmd.split(',');
    let toR = {};
    if( args.length > 0 ){
      cl("have args... process....");
      for( let a=0,ac=args.length; a<ac; a++ ){
        args[ a ] = args[ a ].split('=');
        toR[ args[ a ][0] ] = args[ a ][1];
      }
    }
    cl("args to process......");
    cl(toR);


    if( toR['mqtt'] && toR['mqtt'] == '1' ){
      cl("mqtt ...");
      if( toR['topic'] && toR['payload'] ){
        cl("pub: "+cmd);
        sOutSend('toMqttPub:'+cmd );
      }
    }


  }




  get getHtml(){
    cl("multiSVG getHTML ------------");
    cl("we have list of: "+this.svgsList.length);
    let tr = '';

    if( urlArgs['action'] == 'svg'){
      // selected svg
      this.msOid = urlArgs['i'];

      cl('requesting for svg.....');
      $.get( 'sites/multiSVG/'+this.svgsList[ this.msOid ] , function( data, status ){
          pager.getCurrentPage().mulSvgParseGet( data  , status );
      } );
      tr = 'loading...';

    }else{
      // default list of svg
      tr = ``;
      let items = [
      ];
      for( let s=0,sc=this.svgsList.length; s<sc; s++ ){
        items.push( this.app.lvElement(
          this.svgsList[ s ],
          {
            "img": `sites/multiSVG/`+this.svgsList[ s ],
          },
          `pager.goToByHash('pageByName=multi SVG&action=svg&i=`+s+`')`
        ) );
      }
      tr+= this.app.lvBuild({
        "header": "files in directory:",
        "headerTip": items.length,
        "items": items
      });
    }

    return this.app.appFrame({
      "title": "multi SVG",
      "content": tr
    });

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
    cl("s_multiSVGPage get svgDyno");
    return '';//s_basicSail;
  }
  svgDynoAfterLoad(){
  /*
    this.hdgPlotUpdater = m_d3PlotInit("hdgPlot",  {
      'direction': 'upDown',
      'plotType': 'area',
      'fillColor': '#0f0',
      'lineSize': 1,
      'legendX': 'no',
      'legendY': 'no',
      'fillToPoint': 0
      });
      */
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
    //putText("gpsCOG", (""+avgItKalman('cog', sec1*10).toFixed(0) ).substring(0,5) );

    var nm = getDistLLInNM( lastLat['v'], lastLon['v'], lat['v'], lon['v'] );
    var inTime = lat['t']-lastLat['t'];

    //cl("distance is "+nm);
    //cl("in time ms:"+inTime);

    var sog = nm*(3600000/inTime);
    storeIt('sog', sog, min1 );
    //putText("gpsSpeed", (""+avgItKalman('sog',sog,sec1*10).toFixed(2) ).substring(0,5) , 'c', 5);
  }






  onMessageCallBack( r ){
    //cl("s_multiSVGPage onMessageCallBack ----------------------");


    if( this.muSvMa[ r.topic ] == undefined ){
      let oname = ("#"+String(r.topic)).split("/").join("_");
      var o = $(oname);
      var s = SVG( oname );
      cl(r);
      cl("svg");
      cl(s);
      if( s == null ){
        this.muSvMa[ r.topic ] = -1;
        return 0;
      }
      cl("inner childrens:"+s.node.childNodes.length);
      let desc = '';
      for( let n=0,nc=s.node.childNodes.length; n<nc; n++ ){
        //cl("  node "+n+": "+Object.keys( s.node.childNodes[n] ) );
        cl("  node "+n+": "+s.node.childNodes[n]  );
        //cl("  node "+n+". text : "+s.node.childNodes[n].innerHTML  );
        cl("  node.node");
        cl(s.node);
        cl("  node.node.childNodes");
        cl(s.node.childNodes);

        if( String(s.node.childNodes[n]) == '[object SVGDescElement]' ){
          desc = ""+s.node.childNodes[n].innerHTML;
          cl("desc: "+desc);
          s.node.removeChild( s.node.childNodes[n] );
        }
      }


      if( typeof s == 'object' )
        this.muSvMa[ r.topic ] = {
          'oname':oname.substring(1),
          'desc': desc==''? undefined : JSON.parse(desc)
        };
      else
        this.muSvMa[ r.topic ] = -1;

      this.onMessageCallBack( r );
      return 0;

    }else if( this.muSvMa[ r.topic ] == -1 ){
      // spip..
      //cl( "topic not on svg.."+r.topic);

    }else{
      cl("put "+r.payload+" to object:"+this.muSvMa[ r.topic ]['oname']);
      if( this.muSvMa[ r.topic]['desc'] ){
        cl("desc:"+this.muSvMa[ r.topic ]['desc'] );
        let cmd = this.muSvMa[ r.topic ]['desc']['use'];
        cl("org: "+cmd);
        cmd = cmd.replace("this", `"`+this.muSvMa[ r.topic ][ 'oname' ]+`"`);
        cmd = cmd.replace( "valRaw", r.payload);
        cmd = cmd.replace("val", `"`+r.payload+`"`);
        cl("mod: "+cmd);
        eval(cmd);
      }else
        putText(""+this.muSvMa[ r.topic ][ 'oname' ], Math.round(r.payload) );
    }


    /*
    if( r.topic == 'and/lat' ){
    }
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
