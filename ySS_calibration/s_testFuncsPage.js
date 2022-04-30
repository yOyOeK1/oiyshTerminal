
class s_testFuncsPage{

  iterCounter = 0;

  get getName(){
    return "test functions";

  }

  get getDefaultBackgroundColor(){
		return "#ffddcc";
	}


  looperIter(){
      console.log("looperIter @ s_testFuncsPage ...");
      this.iterCounter++;
      putText("looperIter", ""+this.iterCounter);
  }


  getHtml(){
    return `
<div style="display:inline;position:absolute;top:0;width:200;">
  test start: <br>
  <div id="sliTTest" width="200" height="350"></div>
  test end<br>
</div>
    `;
  }

  getHtmlAfterLoad(){
    $( "#sliTTest" ).slider({
  			slide: function( event, ui ) {
  				console.log(ui.value);

          putText("sliderVal", "slider: "+ui.value );

          rotateSvg( "objRot", true, ui.value );
          rotateSvg( "objRot2", true, ui.value );

          rotateSvgSetRC( "objRot2Shadow", "objRot2RC", ui.value );

          //$("#textDef").text("test"+ui.value);
          putText("textDef", "test"+ui.value );
          putText("textCen", "test"+Math.pow(ui.value,2), 'c', 11);
          putText("textRig", "test"+Math.pow(ui.value,2), 'r', 11);
          putText("textOnSide", Math.pow(ui.value,2), 'r', 11);


          moveOnPath( "obj2Path", "pathBase", parseFloat(ui.value)/100.0 );
          storeIt("avgTest", parseFloat(ui.value)/100.0, sec30 );
          moveOnPath( "obj2PathAvg", "pathBaseAvg",
            avgIt("avgTest", sec30)
            );



          moveOnPath( "obj2Path2", "pathBase2", parseFloat(ui.value)/100.0 );

          moveOnPath( "cirPathObj", "cirPath", deg360ToNorm(parseFloat(ui.value)) );



          rotateSvg( "guageOne", true,
            mMapVal( ui.value, 0, 180, -90,90, true )
            );
            putText("guageOneVal", Math.round(mMapVal( ui.value, 0, 180, -90,90 ))  );


          rotateSvg( "guageTwo", true, -ui.value );

          moveOnPath( "barGreen", "barGreenPath",
            mMapVal( ui.value, -180, 360, 0,1 ) );

            moveOnPath( "barRedGreen", "barGreenPath",
              mMapVal( ui.value, -180, 360, 1,0 ) );

        		},
  				min:-180,
  				max:360,
  				value:10
  			});
  }

  get svgDyno(){
    return s_testFuncs;
  }

  svgDynoAfterLoad(){

  }



  onMessageCallBack( r ){
    console.log("s_blankPage got msg ");
    if( r.topic == 'e01Mux/adc0' ){
      putText("houBatVol", (""+(r.payload*(0.02771809)) ).substring(0,5) );


    }else if( r.topic == 'thisDevice/bat/perc' ){
      putText("batPercent", r.payload+"%");
    }
  }



}



function testFunctionsPart(){
  if( 0 ){
    console.log("shoud be: -90: "+ mMapVal( 0, 0, 180, -90,90 ));
    console.log("shoud be: 0: "+ mMapVal( 90, 0, 180, -90,90 ));
    console.log("shoud be: 90: "+ mMapVal( 180, 0, 180, -90,90 ));

    console.log("shoud be: 90: "+ mMapVal( 0, 0, 180, 90,-90 ));
    console.log("shoud be: 0: "+ mMapVal( 90, 0, 180, 90,-90 ));
    console.log("shoud be: -90: "+ mMapVal( 180, 0, 180, 90,-90 ));

    console.log("shoud be: 90: "+ mMapVal( 0, 180, 0, -90,90 ));
    console.log("shoud be: 0: "+ mMapVal( 90, 180, 0, -90,90 ));
    console.log("shoud be: -90: "+ mMapVal( 180, 180, 0, -90,90 ));

    console.log("shoud be: -90: "+ mMapVal( 0, 180, 0, 90,-90 ));
    console.log("shoud be: 0: "+ mMapVal( 90, 180, 0, 90,-90 ));
    console.log("shoud be: 90: "+ mMapVal( 180, 180, 0, 90,-90 ));


    console.log("shoud be: 0: "+ mMapVal( 0, 1, 20, 0,1, true ));
    console.log("shoud be: 1: "+ mMapVal( 20, 1, 20, 0,1, true ));
    console.log("shoud be: >1: "+ mMapVal( 30, 1, 20, 0,1, true ));

    console.log("shoud be: 0: "+ mMapVal( 0, -1, -20, 0,1, true ));
    console.log("shoud be: 1: "+ mMapVal( -20, -1, -20, 0,1, true ));
    console.log("shoud be: >1: "+ mMapVal( -30, -1, -20, 0,1, true ));
  }

  if( 0 ){
    var dm = '928.80856';
    var dm = '07838.028';
    function ddmmToLdec( ddmm ){
      var dot = ddmm.indexOf('.');
      console.log("dot is at "+dot);
      var dd = parseInt(ddmm.substring(0,dot-2));
      console.log("dd:"+dd);
      var mm = parseFloat( ddmm.substring(dot-2) );
      console.log("mm.mmmm:"+mm);
      var dec = dd + ( mm/60 );
      console.log("dec:"+dec);
    }
    ddmmToLdec( dm );
  }

  if( 0 ){
    var inIs = 234.124151;
    console.log("in:"+inIs);
    console.log(" fixto 0: "+inIs.toFixed(0));
    console.log(" fixto 2: "+inIs.toFixed(2));
    console.log(" fixto 20: "+inIs.toFixed(20));

  }

  if( 0 ){
    console.log("deg delta 0 10 -> 10:"+deg360delta( 0, 10 ) );
    console.log("deg delta 0 179 -> 179:"+deg360delta( 0, 179 ) );
    console.log("deg delta 0 -10 -> -10:"+deg360delta( 0, -10 ) );
    console.log("deg delta 350 10 -> 20:"+deg360delta( 350, 10 ) );
    console.log("deg delta 10 -10 -> -20:"+deg360delta( 10, -10 ) );
    console.log("deg delta -170 170 -> -20:"+deg360delta( -170, 170 ) );
    console.log("deg delta -190 190 -> 20:"+deg360delta( -190, 190 ) );
    console.log("deg delta 370 -10 -> -20:"+deg360delta( 370, -10 ) );
    console.log("deg delta 90 270 -> -180 || 180:"+deg360delta( 90, 270 ) );
    console.log("deg delta 180 -360 -> -180 || 180:"+deg360delta( 180, -360 ) );
    console.log("deg delta 270 91-> -179:"+deg360delta( 270, 91 ) );

  }

  if( 0 ){
    console.log("try to get battery status...");
    navigator.getBattery()
      .then(function(battery) {
        console.log(battery.level);
    });

  }
}
