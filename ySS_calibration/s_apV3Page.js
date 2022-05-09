


class s_apV3Page{

	apInDebug = true;

	get getName(){
		return 'auto pilot V3';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	get getHtml(){
		return `

<b>Autopilot V3</b> Device battery: <b><div style="display:inline;" id="batPerc">- - -</div></b><br>
<hr>
Autopilot status:
 <b><div id="apStatus" style="display:inline">- - -</div></b><br>
Mag compas:
	<b><div id="apHDM" style="display:inline">- - -</div></b><br>

<input type="button" id="apStandby" value="STANDBY" onclick="sOutSend('ap:standby')">

<input type="button" value="-5" onclick="sOutSend('ap:correctTarget:-5')">
<input type="button" value="+5" onclick="sOutSend('ap:correctTarget:5')">


<input type="button" id="apAuto" value="AUTO" onclick="sOutSend('ap:auto:'+$('#apHDM').text());$('#apDebTillerBy').html('')">

<hr>
Autopilot settings:
<div id="apSettings"></div>
<hr>
`+(this.apInDebug ? `
Simulotor:
<input type="checkbox" checked="true" id="apHDMDebFake" onclick="pager.getCurrentPage().apHDMDeb()">
<div id="apSimControls">---</div>
<div id="apDebug"></div>
<hr>
`:'')+

`
Debug:<br>
tiller pos: <b><div style="display:inline;" id="apDebTillerPos">- - -</div></b><br>

tiller by:
<div id="apDebTillerBy">- - -</div>


		`;
	}

	apHDMDeb(){
		if( this.apInDebug == false )
			return 0;
		//cl("apHDMDeb");
		if( $('#apHDMDebFake').prop("checked") ){
			setTimeout( pager.getCurrentPage().apHDMDeb, 500 );
			var sim = pager.getCurrentPage().apSim;
			var ap = pager.getCurrentPage().apV3;

			sim.iter();
			var apres = ap.update( sim.hdm );
			if( apres['tillerBy'] != 0 ){
				sim.TillerFake( apres['tillerBy'] );
				$('#apDebTillerBy').html(
					(new Date().getMinutes()+":"+new Date().getSeconds())+" -> "+
					apres['tillerBy'].toFixed(2)+"<br>"+
					$('#apDebTillerBy').html().substring(0,100)
				);
			}

			$("#apHDM").html( "sim:"+sim.hdm.toFixed(1) );
			if( this.apInDebug )
				$("#apDebTillerPos").html( "sim:"+sim.tiller.toFixed(3) );

		}
	}

	buildApSettings( settings ){
		var tr = ''
		var varToCollect = [];
		for( var k in settings ){
			tr+= k+': <input type="input" id="apSett_'+k+'" value="'+settings[k]+'" style="display:inline;"><br>';
			varToCollect.push('$(\'#apSett_'+k+'\').val()');
		}
		tr+= '<input type="button" value="SET" onclick="sOutSend(\'ap:setSetting:\'+'+
			varToCollect.join('+\',\'+')+
			')">';
		/*
		<input type="button" id="apPidSet" value="SET"
			onclick="sOutSend('ap:pid:'+
				$('#apPid_p').val()+','+
				$('#apPid_i').val()+','+
				$('#apPid_d').val()+','+
				$('#apPid_resp').val()+','+
				$('#apPid_gain2').val()
			)">
		*/
		$('#apSettings').html(tr);
	}

	apSim;
	apV3;
	getHtmlAfterLoad(){
		cl("s_apV3Page - getHtmlAfterLoad start...");
		if( this.apInDebug == true ){
			this.apSim = new apSimulator("apSimControls", 'pager.getCurrentPage().apSim');
			this.apV3 = new apV3();
			this.apV3.setDebug( true, 'apDebug' );
			this.apV3.setAuto(45);

			var apSettings = this.apV3.getSettings();
			this.buildApSettings(apSettings);

			this.apHDMDeb();
		}
		cl("s_apV3Page - getHtmlAfterLoad ... DONE");


		/*
		var acc = 5; // j/s^2
		var t = 100; // 1 sec w mill
		var sec = 10;

		//for(var tt=0;tt<1000;tt+=10){
			var dis = 0;
			var speed = 0;
			//cl("dystans z accerelacja");
			for( var i=0;i<(10000*sec);i++){
				speed+= acc/10000;
				dis+= speed*(1/10000);
			}
			cl("inTime:"+(sec).toFixed(1)+" sec. dystans res:"+
				dis.toFixed(2)+" end speed:"+
				speed.toFixed(2));

		//}
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
			if( this.apInDebug ){
				apHDMFake = parseFloat( r.payload );
				var apres = this.apV3.update( mag );
			}
			$('#apHDM').text(mag);
			//apS.update( deg360delta( $("#ap2Target").val(), mag ) );


		}else if( r.topic == 'ap/status'){
				$("#apStatus").text( r.payload );

		}else if( r.topic == 'ap/settings'){
			var set = r.settings;
			this.buildApSettings(set);

		}else if( r.topic == 'thisDevice/bat/perc'){
			$("#batPerc").text( r.payload+"%" );

		}else if( r.topic == 'ap/workStat'){
				$("#apDebDelta").text( r.payload.delta );
				$('#apDebTillerPos').text( r.payload.tillerPos.toFixed(4) );
				apTillerFake = parseFloat( r.payload.tillerPos );
				if( r.payload.tillerBy != 0 )
					$('#apDebTillerBy').html(
						(new Date().getMinutes()+":"+new Date().getSeconds())+" -> "+r.payload.tillerBy.toFixed(4)+"<br>"+
						$('#apDebTillerBy').html().substring(0,100)
						);

		}

	}

}
