function s_caliSetSliderVal( sliName, byVal ){
  sliName.val( parseInt( sliName.val()) + byVal );
  sliName.slider( "refresh" );

  sendSetAccCor();

}

class s_calibrationPage{

  get getName(){
    return 'calibration page';
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  get getHtml(){
    this.getCurrentSend = 0;
    return `

<div class="ui-field-contain">
  <label for="cgTop">Axis correction:</label>
  <input type="button" name="cgTop" value="getCurrection" onclick="sOutSend('action:getAccelCorrect')" >

	<b><div id="accCorrV" style="display:inline;">accCorrV</div></b><br>
</div>


	<div class="ui-field-contain">
    <label for="cgX">x:</label>
    <fieldset data-role="controlgroup" name="cgX" id="cgX" data-type="horizontal">
      <input type="button" value="-" onclick="s_caliSetSliderVal( $('#sliX'), -1 );"/>
      <input type="button" value="+" onclick="s_caliSetSliderVal( $('#sliX'), 1 );"/>
    </fieldset>
  </div>
  <input type="range"
    min="-180" max="180" value="10"
    id="sliX">

  <div class="ui-field-contain">
    <label for="cgY">y:</label>
    <fieldset data-role="controlgroup" name="cgY" id="cgY" data-type="horizontal">
      <input type="button" value="-" onclick="s_caliSetSliderVal( $('#sliY'), -1 );"/>
      <input type="button" value="+" onclick="s_caliSetSliderVal( $('#sliY'), 1 );"/>
    </fieldset>
  </div>
  <input type="range"
    min="-180" max="180" value="10"
    id="sliY">

  <div class="ui-field-contain">
    <label for="cgZ">z:</label>
    <fieldset data-role="controlgroup" name="cgZ" id="cgZ" data-type="horizontal">
      <input type="button" value="-" onclick="s_caliSetSliderVal( $('#sliZ'), -1 );"/>
      <input type="button" value="+" onclick="s_caliSetSliderVal( $('#sliZ'), 1 );"/>
    </fieldset>
  </div>
  <input type="range"
    min="-180" max="180" value="10"
    id="sliZ">


<div>in pocket: 175,-82,-89</div>
<div>on tool box char port aft: -1,1,2</div>
    `;
  }

  initSlider( sliderObj ){
  	$( sliderObj ).change(function(){ sendSetAccCor(); });
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

  getCurrentSend = 0;
  onMessageCallBack( r ){

    if( this.getCurrentSend++ == 0 ){
      try{
        sOutSend('action:getAccelCorrect');
        console.log("send request gor current accel settings....");
      }catch(e){
        console.log("get current accell setting errro ....");
        this.getCurrentSend = 0;
      }
    }

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
  		/*
      $("#sliX").slider( 'value', cor[0] );
  		$("#sliY").slider( 'value', cor[1] );
  		$("#sliZ").slider( 'value', cor[2] );
      */
      $("#sliX").val( parseInt(cor[0]) );
      $("#sliX").slider( "refresh" );
      $("#sliY").val( parseInt(cor[1]) );
      $("#sliY").slider( "refresh" );
      $("#sliZ").val( parseInt(cor[2]) );
      $("#sliZ").slider( "refresh" );

  	}


  }


}
