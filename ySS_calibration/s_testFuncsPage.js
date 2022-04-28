
class s_testFuncsPage{

  get getName(){
    return "test functions";

  }

  get getDefaultBackgroundColor(){
		return "#ffddcc";
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


    }
  }



}
