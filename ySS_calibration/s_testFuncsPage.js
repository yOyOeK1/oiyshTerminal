
class s_testFuncsPage{

  iterCounter = 0;
  d3plot01data = new Array();

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

      this.d3plot01data.push({'x':this.iterCounter,'y':Math.random()*360});
      if( this.d3plot01data.length > 5 )
        this.d3plot01data = this.d3plot01data.slice( 1 );

      this.d3plot01(this.d3plot01data);

  }


  getHtml(){
    return `
<div style="display:inline;position:absolute;top:0;width:100%;"

  >
  <label for="sliTTest">Move slider to test:</label>
  <input type="range" id="sliTTest" name="sliTTest"
    min="-100" max="360" value="0"

    data-theme="b" data-track-theme="b">

</div>
<!--
<button class="ui-btn" onclick="$('#sliTTest').trigger('create');">
  trigger create
</button>
-->
    `;
  }

  pushDataToPlot( no, val ){
    this.d3plot01data.push({'x':no,'y':val});

    if( this.d3plot01data.length > 20 )
      this.d3plot01data = this.d3plot01data.slice( 1 );

    this.d3plot01(this.d3plot01data );

  }


  getHtmlAfterLoad(){
    //$( "#sliTTest" ).slider({
    //  theme:"b",
    //  trackTheme: "b"
    //});
    //$( "#sliTTest" ).slider( "refresh" );
    $( "#sliTTest" ).change(function(event, ui){
  	   var v = parseInt($(this).val());
			//console.log("val of v:"+v+" , ");


      pager.pages[ pager.currentPage ].pushDataToPlot(
        pager.pages[ pager.currentPage ].iterCounter++,v
      );


      updateStyle("shaderTester", {
        'fill': shaderColor( rgbToHex(
            0,
            Math.round(mMapVal( v, -180, 360, 0,255 )),
            0
          ) )
        } );
      //cl("set color");

      putText("sliderVal", "slider: "+v );

      rotateSvg( "objRot", true, v );
      rotateSvg( "objRot2", true, v );

      rotateSvgSetRC( "objRot2Shadow", "objRot2RC", v );

      //$("#textDef").text("test"+v);
      putText("textDef", "test"+v );
      putText("textCen", "test"+Math.pow(v,2), 'c', 11);
      putText("textRig", "test"+Math.pow(v,2), 'r', 11);
      putText("textOnSide", Math.pow(v,2), 'r', 11);


      moveOnPath( "obj2Path", "pathBase", parseFloat(v)/100.0 );
      storeIt("avgTest", parseFloat(v)/100.0, sec30 );
      moveOnPath( "obj2PathAvg", "pathBaseAvg",
        avgIt("avgTest", sec30)
        );



      moveOnPath( "obj2Path2", "pathBase2", parseFloat(v)/100.0 );

      moveOnPath( "cirPathObj", "cirPath", deg360ToNorm(parseFloat(v)) );


      pager.getCurrentPage().justGage1.refresh( parseInt( v) );
      pager.getCurrentPage().justGage2.refresh( deg360Pos(parseInt( v)) );



      rotateSvg( "guageOne", true,
        mMapVal( v, 0, 180, -90,90, true )
        );
        putText("guageOneVal", Math.round(mMapVal( v, 0, 180, -90,90 ))  );


      rotateSvg( "guageTwo", true, -v );

      moveOnPath( "barGreen", "barGreenPath",
        mMapVal( v, -180, 360, 0,1 ) );

        moveOnPath( "barRedGreen", "barGreenPath",
          mMapVal( v, -180, 360, 1,0 ) );
        });/*
        		},
  				min:-180,
  				max:360,
  				value:10
  			});*/
  }

  get svgDyno(){
    return s_testFuncs;
  }

  d3plot01 = null;
  justGage1 = null;
  justGage2 = null;




  svgDynoAfterLoad(){
    this.d3plot01 = m_d3PlotInit("d3PlotLine",{
      'direction': 'upDown',

      //'legendX': 'no',
      //'legendY': 'no',

      'lineColor': "#f00",
      'lineSize': 5,
      'plotSubPix': 4,

      //'plotType': 'line'

      'plotType': 'area',
      'fillColor': '#0f0',
      'fillToPoint': 100

      });

    this.d3plot01data.push({'x':-20, 'y':0});
    this.d3plot01data.push({'x':-16, 'y':100});
    this.d3plot01data.push({'x':-13, 'y':50});
    this.d3plot01data.push({'x':-11, 'y':60});
    this.d3plot01data.push({'x':-9, 'y':60});
    this.d3plot01data.push({'x':-7, 'y':60});
    this.d3plot01data.push({'x':-6, 'y':80});
    this.d3plot01data.push({'x':-2, 'y':90});
    this.d3plot01(this.d3plot01data );

    cl("justGage1 init.");
    // chk it out https://github.com/toorshia/justgage
    this.justGage1 = MyJustGage({
      id: 'justGuage1',
      value: 10,
      min: 0,
      max: 100,
      title: 'just guage 1',
      showInnerShadow: true
    });
    cl('justGage1 done');

    this.justGage2 = MyJustGage({
      id: 'justGuage2',
      value: 10,
      min: 0,
      max: 360,
      title: 'guage2',
      donut: true
    });


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
