
var apSTarget = 0;


//var apS = new apSolver();

var apHDMFake = 0;
var apTillerFake = 0;
var apTillerDrifft = 0;
var apAngleForce = 0;
function apHDMDeb(){
	cl('apHDMDeb fake ['+apHDMFake+']');

	if( $('#apHDMDebFake').prop("checked") ){
		setTimeout( apHDMDeb, 500 );

		apAngleForce = (apAngleForce*30+ (-apTillerFake+apTillerDrifft) )/31;

		sOutSend('apDebHDMFake:'+(apHDMFake+(Math.random()-0.5)-apAngleForce) );
	}


}
function apHDMFakeBy( v ){
	cl('apHDMFakeBy:'+(v));
	apHDMFake+= parseFloat(v);
}


class s_apPage{


	get getName(){
		return 'auto pilot';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	get getHtml(){
		return `
Device battery: <b><div style="display:inline;" id="batPerc">- - -</div></b><br>
<hr>
Autopilot status:
<b><div id="apStatus">- - -</div></b>
Mag compas:
<b><div id="apHDM">- - -</div></b>

<input type="button" id="apStandby" value="STANDBY" onclick="sOutSend('ap:standby')">

<input type="button" value="-5" onclick="sOutSend('ap:correctTarget:-5')">
<input type="button" value="+5" onclick="sOutSend('ap:correctTarget:5')">


<input type="button" id="apAuto" value="AUTO" onclick="sOutSend('ap:auto:'+$('#apHDM').text());$('#apDebTillerBy').html('')">

<hr>
Update count: <b><div style="display:inline;" id="apUpdatesCount">- - -</div></b><br
PID settings:<br>
P: <input type="text" id="apPid_p"><br>
I: <input type="text" id="apPid_i"><br>
D: <input type="text" id="apPid_d"><br>
Resp: <input type="text" id="apPid_resp"><br>
Gain2: <input type="text" id="apPid_gain2"><br>
<input type="button" id="apPidSet" value="SET"
	onclick="sOutSend('ap:pid:'+
		$('#apPid_p').val()+','+
		$('#apPid_i').val()+','+
		$('#apPid_d').val()+','+
		$('#apPid_resp').val()+','+
		$('#apPid_gain2').val()
	)">


<hr>

Debug:<br>
<input type="checkbox" id="apHDMDebFake" onclick="apHDMDeb()">use fake hdm
<input type="button" value="-1" onclick="apHDMFakeBy('-1')">
<input type="button" value="+1" onclick="apHDMFakeBy('1')">
tiller: <input type="button" value="-1" onclick="apTillerFake-=1">
<input type="button" value="+1" onclick="apTillerFake+=1">
<input type="text" value="10" id="ap2Target">

<hr>

delta: <b><div style="display:inline;" id="apDebDelta">- - -</div></b><br>
pidRes: <b><div style="display:inline;" id="apDebPidRes">- - -</div></b><br>
pidAng: <b><div style="display:inline;" id="apDebPidAng">- - -</div></b><br>
tiller pos: <b><div style="display:inline;" id="apDebTillerPos">- - -</div></b><br>

Solver:<br>
<div style="border:1" id="sDeb">- - -</div>

tiller by:
<div id="apDebTillerBy">- - -</div>


		`;
	}

	getHtmlAfterLoad(){
		/*
		var acc = 3; // j/s^2
		var t = 100; // 1 sec w mill


		for(var tt=1;tt<1000;tt+=2){
			var dis = 0;
			var speed = 0;
			//cl("dystans z accerelacja");
			for( var i=0;i<(t*tt);i++){
				speed+= acc/1000;
				dis+= speed*(1/1000);
			}
			cl("inTime:"+(tt/10).toFixed(1)+" sec. dystans res:"+
				dis.toFixed(2)+" end speed:"+
				speed.toFixed(2));

		}
		*/
		/*
		var m = new mutil2();
		cl("add: "+m.add(11,9));
		cl("pim1:"+m.getPim());
		m.addPim();
		cl("pim2:"+m.getPim());
		*/

	}

	get svgDyno(){
		cl("s_ap get svgDyno");
		return '';
	}

	svgDynoAfterLoad(){
	}


	onMessageCallBack( r ){
		cl("ap call back msg:");
		cl(r);
		if( r.topic == 'and/mag' ){
			var mag = Math.round( r.payload );
			apHDMFake = parseFloat( r.payload );
			$('#apHDM').text(mag);

			//apS.update( deg360delta( $("#ap2Target").val(), mag ) );


		}else if( r.topic == 'ap/status'){
				$("#apStatus").text( r.payload );

		}else if( r.topic == 'ap/pid'){
				$("#apPid_p").val( r.p );
				$("#apPid_i").val( r.i );
				$("#apPid_d").val( r.d );
				$("#apPid_resp").val( r.resp );
				$("#apPid_gain2").val( r.gain2 );
				$("#apUpdatesCount").text( r.updatesCount );

		}else if( r.topic == 'thisDevice/bat/perc'){
			$("#batPerc").text( r.payload+"%" );

		}else if( r.topic == 'ap/workStat'){
				$("#apDebDelta").text( r.payload.delta );
				$('#apDebPidRes').text( r.payload.pidRes );
				$('#apDebPidAng').text( r.payload.pidAng );
				$('#apDebTillerPos').text( r.payload.tillerPos );
				apTillerFake = parseFloat( r.payload.tillerPos );
				if( r.payload.tillerBy != 0 )
					$('#apDebTillerBy').html(
						(new Date().getMinutes()+":"+new Date().getSeconds())+" -> "+r.payload.tillerBy+"<br>"+
						$('#apDebTillerBy').html()
						);

		}

	}

}
