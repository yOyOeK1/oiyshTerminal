
var apv3svgRMB = false;
function apv3bt( cmd ){
	cl("apv3bt send["+cmd+"]");

	if( cmd == 'auto' )
		sOutSend('ap:auto:'+pager.getCurrentPage().lastHDM);
	else if( cmd == 'stb' )
		sOutSend('ap:standby');
	else if( cmd == 'toRMB' && apv3svgRMB )
		sOutSend('ap:toRMB');

	else if( cmd == 'settings' ){
		if( $("#apSettings").is(":visible") ){
				$("#apSettings").hide();
		}else{
			$("#apSettings").show();
		}

	}else if( cmd == '-1')
		sOutSend('ap:correctTarget:-1');
	else if( cmd == '+1')
		sOutSend('ap:correctTarget:1');
	else if( cmd == '-10')
		sOutSend('ap:correctTarget:-10');
	else if( cmd == '+10')
		sOutSend('ap:correctTarget:10');


}

class s_apV3SvgPage{

	apInDebug = true;
	lastHDM = 0;

	get getName(){
		return 'auto pilot V3 Svg';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	get getHtml(){
		return `<div id="apSettings"
		style="z-index:90;position:absolute;top:0;left:0;border:10px;margin:10px;padding:10px;
		background-color:white;border:1px solid gray;">abc</div>`;
	}



	buildApSettings( settings ){
		var tr = '<b>Autopilot settings:</b><br>';
		var varToCollect = [];
		for( var k in settings ){
			tr+= k+': <input type="input" id="apSett_'+k+'" value="'+settings[k]+'" style="display:inline;"><br>';
			varToCollect.push('$(\'#apSett_'+k+'\').val()');
		}
		tr+= '<input type="button" value="SET" onclick="sOutSend(\'ap:setSetting:\'+'+
			varToCollect.join('+\',\'+')+
			');$(\'#apSettings\').hide()">';
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

	getHtmlAfterLoad(){
		cl("s_apV3SvgPage - getHtmlAfterLoad start...");
		cl("s_apV3SvgPage - getHtmlAfterLoad ... DONE");

	}

	get svgDyno(){
		return s_apV3Svg;
	}

	svgDynoAfterLoad(){
		moveOnPath( "rudderPos", "pathRudder", 0.5 );
		putText("textRMB", '- -' );
		SVG("#rmbBT").opacity(0.3);
		putText("textInfoRMB", '' );
		SVG("#textInfoRMB").hide();
		$("#apSettings").hide();
	}


	onMessageCallBack( r ){
		cl("ap call back msg:");
		cl(r);
		if( r.topic == 'and/mag' ){
			var mag = Math.round( r.payload );
			this.lastHDM = mag;
			putText( 'apHDM', mag );

		}else if( r.topic == 'ap/status'){
				putText( 'apStatus', r.payload );

		}else if( r.topic == 'ap/settings'){
			var set = r.settings;
			this.buildApSettings(set);

		}else if( r.topic == 'thisDevice/bat/perc'){
			putText("batPercent", r.payload+"%" );

		}else if( r.topic == 'ap/workStat'){
			if( r.payload.tillerBy != 0 ){
				//cl("tillerPos:"+r.payload.tillerBy);
				//cl("tillerPos after map:"+mMapVal( parseFloat(r.payload.tillerBy), -1.2, 1.2, 0,1, true ));
				moveOnPath( "rudderPos", "pathRudder", mMapVal( parseFloat(r.payload.tillerBy), -1.2, 1.2, 0,1, true ) );
			}

			if( r.payload.mode == 'toRMB' ){
				SVG("#textInfoRMB").show();
			}else{
				SVG("#textInfoRMB").hide();
			}


		}else if( r.topic == 'NR/nav/rmb' ){
			SVG("#rmbBT").opacity(1.0);
			apv3svgRMB = true;

			putText("textRMB", Math.round(r.payload.onHeading) );
			SVG("#textInfoRMB").text( `RMB at:`+r.payload.lat.toFixed(6)+`   `+r.payload.lon.toFixed(6)+`
To: `+r.payload.to+`
Rng: `+r.payload.rng+` [NM]
XTE: `+r.payload.xte );
		}

	}

}
