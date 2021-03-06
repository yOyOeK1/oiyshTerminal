var socketIn = null;
function wsConnectIn( onMesCallBack ){
	socketIn = new  WebSocket("ws://192.168.43.1:1880/ws/accel/oriCal");


	socketIn.onopen = function(){
		cl("WS_In on open");
		$("#wsInStat").text("OK");
	}

	socketIn.onclose = function(){
		cl("WS_In on close");
		cl("WS_In will try to recconnect...");
		setTimeout( wsConnectIn( onMesCallBack ), 1000 );
		$("#wsInStat").text("X");
	}

	socketIn.onerror = function(e){
		cl("WS_In on error:"+e);
	}

	socketIn.onmessage = function(m){
		//cl("on message:"+m);
		r = JSON.parse(m.data);
		//cl("on message r.payload:"+r.payload);

    onMesCallBack.wsCallback( r );

		//cl("on message .data:"+m.data);


	}
}

var socketOut = null;
function wsConnectOut(){
	socketOut = new  WebSocket("ws://192.168.43.1:1880/ws/accel/oriCal_In");

	socketOut.onopen = function(){
		cl("WS_Out on open");
		$("#wsOutStat").text("OK");
	}

	socketOut.onclose = function(){
		cl("WS_Out on close");
		$("#wsOutStat").text("x");
		setTimeout( wsConnectOut(), 1000 );
	}

	socketOut.onerror = function(e){
		cl("WS_Out on error:"+e);
	}

}

function sOutSend( msg ){
	socketOut.send(msg);
}
