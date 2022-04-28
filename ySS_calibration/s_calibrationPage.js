class s_calibrationPage{

  get getName(){
    return 'calibration page';
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  get getHtml(){
    return `
<table border="0" width="100%">
	<tr>
		<td>
			Accel correction:
        <input type="button" value="getCorrection" onclick="sOutSend('action:getAccelCorrect')" >

				<b><div id="accCorrV" style="display:inline;">accCorrV</div></b><br>

				x:
        <input type="button" value="-" onclick="$('#sliX').slider('value',$('#sliX').slider('value')-1);sendSetAccCor();"/>
        <input type="button" value="+" onclick="$('#sliX').slider('value',$('#sliX').slider('value')+1);sendSetAccCor();"/>
        <div id="sliX"></div>

        y:
        <input type="button" value="-" onclick="$('#sliY').slider('value',$('#sliY').slider('value')-1);sendSetAccCor();"/>
        <input type="button" value="+" onclick="$('#sliY').slider('value',$('#sliY').slider('value')+1);sendSetAccCor();"/>
        <div id="sliY"></div>

        z:
        <input type="button" value="-" onclick="$('#sliZ').slider('value',$('#sliZ').slider('value')-1);sendSetAccCor();"/>
        <input type="button" value="+" onclick="$('#sliZ').slider('value',$('#sliZ').slider('value')+1);sendSetAccCor();"/>
        <div id="sliZ"></div>

		</td>
	</tr>
</table>
<div>in pocket: 175,-82,-89</div>
<div>on tool box char port aft: -1,1,2</div>
    `;
  }

  initSlider( sliderObj ){
  	$( sliderObj ).slider({
      	slide: function( event, ui ) {
        		/*console.log( ui.value );

        		var ts = $("#sliX").slider('value')+","+
        			$("#sliY").slider('value')+","+
        			$("#sliZ").slider('value');
        		console.log("ts:"+ts);
        		sOutSend("action:setAccCor:"+ts);
        		$("#accCorrV").text( ts );
            */
            sendSetAccCor();
        		},
        	min:-180,
        	max:180,
        	value:10
        });

  }


  getHtmlAfterLoad(){
    this.initSlider( $("#sliX") );
  	this.initSlider( $("#sliY") );
  	this.initSlider( $("#sliZ") );
  }

  get svgDyno(){
    console.log("s_calibrationPage get svgDyno");
    return s_calibration;
  }

  svgDynoAfterLoad(){

  }

  onMessageCallBack( r ){
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


  }


}
