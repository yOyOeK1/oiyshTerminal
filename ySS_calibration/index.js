
// 4 Three.js section --------------------------
var t4y = 0;
var ott = "not set";
var mott = 0;
const otcam = 0;
const otsce = 0;
const otren = 0;
const otcom = 0;
const otframeC=0;
const threes = {};
var pager;
var sm;


// index stuff -----------------------------------

var doneFlag = 0;


function klikPageNo( No ){
  pager.setPage(No);
}

function sendSetAccCor(){
  //console.log("sendSetAccCor: "+$("#sliX").val());
  var ts = $("#sliX").val()+","+
    $("#sliY").val()+","+
    $("#sliZ").val();
  //cl("ts:"+ts);
  sOutSend("action:setAccCor:"+ts);
  $("#accCorrV").text( ts );

}

// for tests
function svgTests(  ){
  var tt = SVG.find("#textTest");
  tt.text("");
	$( "#sliRotTest" ).slider({
			slide: function( event, ui ) {
				cl(ui.value);
				rotateSvg( "boatHeel", true, ui.value );
					},
				min:-180,
				max:180,
				value:10
			});
}

function looperIter(){
  cl("looper iter ....");
  pager.makeLooperIter();
  setTimeout( looperIter, 5000 );
}

// for testing not use
function doMqtt(){
  cl("--------------mqtt");
  cl(mqtt);
  const url = 'mqtt://192.168.43.1:10883/';
  const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    clientId: 'emqx_test'
  };
  const client  = mqtt.connect(url, options)
  client.on('connect', function () {
  console.log('Connected')
  // Subscribe to a topic
  client.subscribe('test', function (err) {
      if (!err) {
        // Publish a message to a topic
        client.publish('test', 'Hello mqtt')
      }
    })
  });
  cl("--------------mqtt");

}








// realigning and resizing z-index of svg to fit in rotation mode
var svgDynoCssOrg = 0;
function setSvgFit(){
  var d = 0;
  //console.log("resize :"+$(document.body).width()+" h:"+$(document.body).height());
  //$('#svgDyno').css('width', $(document.body).width() );
  //$('#svgDyno').css('height', $(document.body).height() );

  //return 0;
  if( d )
    console.log(
      "childrens:"+$('#svgDyno').children().length+' length\n'+
      "[0]: "+$('#svgDyno').children()[0]
    );
  var div = $('#svgDyno').parent();
  var currentWidth = div.outerWidth();
  var currentHeight = div.outerHeight();
  if( d ) console.log('--------\nresize current:'+currentWidth+' x '+currentHeight);
  var availableHeight = window.innerHeight;
  var availableWidth = window.innerWidth;
  var scaleX = availableWidth / currentWidth;
  var scaleY = availableHeight / currentHeight;
  var translationX = Math.round((availableWidth - (currentWidth * scaleX)) / 2);
  var translationY = Math.round((availableHeight - (currentHeight * scaleY)) / 2);

  if (0) {
    scaleX = Math.min(scaleX, scaleY);
    scaleY = scaleX;
  }
  if( d ){
    console.log("resize scale:"+scaleX+" x "+scaleY);
    console.log("resize availabe:"+availableWidth+" x "+availableHeight);
    console.log('resize translation: '+translationX+' x '+translationY);
  }

  var sd = $('#svgDyno');
  var sdp = sd.parent();
  var lo = 'mkRotation Action: ';

  if( mkRotationAngCurrent == 90 || mkRotationAngCurrent == 270 ){
    if( svgDynoCssOrg == 0 ){
      console.log("no svgDynoCssOrg making it ....");
      try{
        svgDynoCssOrg = { 'w': sd.width(), 'h': sd.height() };
        if( d )console.log(' ok done :) now we can restore :)');
      }catch(e){
        console.log(' no :( no css error)');
      }
    }
    if( d ){
      console.log("svgDynoCssOrg:");
      console.log(svgDynoCssOrg);
    }

    sd.height(currentWidth);
    sd.width(currentHeight);
    sd.css({
      'position':'absolute',
      'top': Math.round(availableHeight/2 -currentWidth/2),
      'left': Math.round(availableWidth/2 - currentHeight/2)
    });

    if( 0 ){
      $("#otThreeLogo").height(currentHeight);
      $("#otThreeLogo").width(currentWidth);
      $("#otThreeLogo").css({
        'position':'absolute',
        'top': Math.round(availableHeight/2 -currentWidth/2),
        'left': Math.round(availableWidth/2 - currentHeight/2)
      });
    }

    lo+= ' Yes ';

  //if( mkRotationAngCurrent == 90 || mkRotationAngCurrent == 270 ){
  }else{
    lo+= ' No ';
    if( svgDynoCssOrg ){
      sd.width( '100%' );
      sd.height( '100%' );
      sd.css({
        'top':0,
        'left':0
      });

    }
  }
  if( d ) console.log(lo);

}


//testFunctionsPart();


function otdm( args ){
  $("#otdmResDyno").html("loading....");
  sOutSend( {
    "otdmRequest": args
  } );
}

var tml = 0;

function getTagname(state, event) {
  if( state == "move" ){
    var tn = new Date().getTime();
    if( tml > (tn-200) ){
      return 0;
    }
  }
  tml=tn;
  var x = event.targetTouches[0].target.tagName;
  //cl("getTagname");
  //cl(event);
  var tr = {
    "state": state,
    //"ontouchstart": JSON.stringify(event),
    "eC": event.touches.length

  }
  for( var t=0,tc=event.touches.length; t<tc; t++ ){
    tr["x"+t] = parseInt(event.touches[0].clientX);
    tr["y"+t] = parseInt(event.touches[0].clientY);
  }

  sOutSend( tr );
}
