var socketIn = null;

var wsToast = null;
var wsTConInErr = null;
var wsTConOutErr = null;
var wsReconnectTime = 1000;

function wsConnectIn( onMesCallBack, wsUrl = '' ){
	// address is replace on fly by host
	let doUrl = "ws://192.168.43.1:1880/ws/accel/oriCal";
	if( wsUrl != '' ) doUrl = wsUrl
	cl("wsConnectIn connect It at "+doUrl);
	socketIn = new  WebSocket( doUrl );


	socketIn.onopen = function(){
		cl("wsConnectIn onopen");
		$("#wsInStat").text("OK");
		if( wsTConInErr != null ){
			wsTConInErr = null;
			wsToast = $.toast({
				heading: 'Success',
				text: 'WebSocket In is OK!',
				//showHideTransition: 'slide',
				//hideAfter: 800,
				icon: 'success'
			});
		}
	}

	socketIn.onclose = function(){
		cl("wsConnectIn onclose recconnect in ... "+parseInt(wsReconnectTime/1000)+"sec.");
		setTimeout( function () {wsConnectIn( onMesCallBack );}, wsReconnectTime );
		$("#wsInStat").text("X");
	}
	
	socketIn.onerror = function(e){
		cl("wsConnectIn onerror:");cl(e);
		if( wsTConInErr == null ){
			wsTConInErr = $.toast({
				heading: 'Error',
				text: 'WebSocket In have some problems.',
				//showHideTransition: 'slide',
				icon: 'error'
			});
		}
	}

	socketIn.onmessage = async function(m){
		//cl("wsConnectIn onmessage:"+m);cl(m);
		r = JSON.parse(m.data);
		//cl("	r.topic: ["+r.topic+"] r.payload: ["+r.payload+"]");

		if( r.topic == "otdmRes" ){
			cl("wsConnectIn got otdmRes !!");

			cl("	res:");
			cl( JSON.stringify( r.payload) );

			var al = r.payload;
			tr=[];
			for( var i=0,ic=al.length; i<ic; i++ ){
				tr.push( "- "+al[i]['text'] );
			}
			$("#otdmResDyno").html(tr.join("<br>"));



		} else if( r.topic == 'ws/event' ){
		    if( r.payload == 'server going down'){
		        $.toast({
			        heading: 'Server is going down',
			        text: 'Got info about server is going down ...',
			        //showHideTransition: 'slide',
			        hideAfter: 5000,
			        icon: 'info'
		        });
		        setTimeout( window.location.reload(), wsReconnectTime );
		    }
		
		}

    await onMesCallBack.wsCallback( r );

		//cl("on message .data:"+m.data);


	}
}

var socketOut = null;
function wsConnectOut(wsUrl = '' ){

	let doUrl = "ws://192.168.43.1:1880/ws/accel/oriCal_In";
	if( wsUrl != '' ) doUrl = wsUrl
	cl("wsConnectOut connect Out at "+doUrl);
	socketIn = new  WebSocket( doUrl );


	socketOut = new  WebSocket( doUrl );

	socketOut.onopen = function(){
		cl("wsConnectOut onopen");
		$("#wsOutStat").text("OK");
		if( wsTConOutErr != null ){
			wsTConOutErr = null;
			wsToast = $.toast({
				heading: 'Success',
				text: 'WebSocket Out is OK!',
				//showHideTransition: 'slide',
				//hideAfter: 800,
				icon: 'success'
				});
		}
	}

	socketOut.onclose = function(){
		cl("wsConnectOut onclose reconnect in .... "+parseInt(wsReconnectTime/1000)+"sec.");
		$("#wsOutStat").text("x");
		setTimeout( wsConnectOut, wsReconnectTime );
	}

	socketOut.onerror = function(e){
		cl("wsConnectOut onerror:");cl(e);
		if( wsTConOutErr == null ){
			wsTConOutErr = $.toast({
				heading: 'Error',
				text: 'WebSocket Out hove some problems',
				//showHideTransition: 'slide',
				icon: 'error'
			});
		}

	}

}

function sOutSend( msg ){
	//socketOut.send(JSON.stringify(msg));
	socketOut.send(msg);
}
