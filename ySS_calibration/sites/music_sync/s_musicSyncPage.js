class s_musicSyncPage{

	get getName(){
		return 'music sync';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	fList = [
		"http://192.168.43.1:3000/public/tmp/secondNotLast.mp3",
		"http://192.168.43.1:3000/public/tmp/m.mp3",
		"http://192.168.43.1:3000/public/tmp/Koto San - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/-1st trimester gift.mp3",
		"http://192.168.43.1:3000/public/tmp/lofi/fall in love with your solitude [relaxing lofi_chill beats]-WEiT1sObe8o.webm",
		"http://192.168.43.1:3000/public/tmp/lofi/I think I’ll stay at home today ~ lofi cute_chill mix-_0aatnWjAMY.mp3",
		"http://192.168.43.1:3000/public/tmp/lofi/fall in love with your solitude [relaxing lofi_chill beats]-WEiT1sObe8o.mp3",
		"http://192.168.43.1:3000/public/tmp/lofi/You left me alone ~ lofi hip hop mix-UnB6ck40aCw.mp3",
	];

	doFileList(){
		var tr=`
		<form class="ui-filterable">
			<input id="filterBasic-input" data-type="search" />
		</form>
		<div id="msLV" data-role="controlgroup" data-filter="true" data-input="#filterBasic-input">
		`;

		for( var f=0,fc=this.fList.length; f<fc; f++ ){
			cl("wtf"+f+" -> f:"+this.fList[f]);
			var fName = this.fList[f].substring( this.fList[f].lastIndexOf("/")+1  );
			cl("fName ->"+fName );

			tr+= '<a href="#" '+
				//'onclick="pager.getCurrentPage().doAppDetails(\'yssPages\','+p+')" '+
				`onclick="pager.getCurrentPage().msSetFile('`+this.fList[f]+`')" `+
				'class="ui-btn '+
					'ui-btn-a'+
					//'ui-btn-b' )+
					' ui-btn-icon-right ui-icon-carat-r">'+
				fName+
				'</a>';

		}

		tr+= `
		</div>
		`;

		return tr;
	}

	get getHtml(){
		return `
<audio controls id="aabc" autoplay style="width:100%">

Your browser does not support the audio element.
</audio>
<div id="msPlayRate"></div>
<!--
<button onclick="document.getElementById('aabc').play()">clki</button>
<button onclick="document.getElementById('aabc').currentTime=30">seek</button>
<button onclick="sOutSend('musicSync:seek=10,play=1')">sync play</button>
<button onclick="sOutSend('musicSync:seek='+document.getElementById('aabc').currentTime)">sync</button>
<button onclick="pager.getCurrentPage().msSetFileTest()">setFile</button>
<button onclick="pager.getCurrentPage().msStop()">stop</button>
-->

<button onclick="pager.getCurrentPage().msPlay()" id="msMasterBt">Me master!</button>
<label for="msAdv">My delay:</label>
<input type="range" name="msAdv" id="msAdv" value="0" min="-500" max="500"
onchange="pager.getCurrentPage().msSetAdvance()">

<h4>Speakers:</h4>
<div id="msSpekers" ></div>

`+this.doFileList()+`



<script>
cl("making music player objects references....");
var msaabc = document.getElementById('aabc');

		`;
	}

	getHtmlAfterLoad(){
	}

	get svgDyno(){
		return '';
	}

	svgDynoAfterLoad(){

	}


	dyrigent = false;

	msFile = 'http://192.168.43.1:3000/public/tmp/m.mp3';

	msSetFile( file ){
		this.msFile = file;
		sOutSend('musicSync:setFile='+file);

	}

	msSetFileTest(){
		this.msSetFile( 'http://192.168.43.1:3000/public/tmp/m.mp3' );
	}

	msPlay(){
		cl("msPlay myNo:"+sm.myNo);
		sOutSend('musicSync:dyrigent='+sm.myNo+',play=1');
	}

	msStop(){
		cl("msStop myNo:"+sm.myNo);
		sOutSend('musicSync:stop=1');
	}

	cAdv = 0;
	msSetAdvance(){
		this.cAdv = $("#msAdv").val()/1000;
	}

	loopObj = -1;
	lStart = 0;
	msClients = [];
	msPings = {};
	msPLast = {};
	msSpekersA = {};
	msTimeNow = 0;
	msNowPlay = true;
	msLoopsEverySec = 4;
	msLoop( ){
		msaabc.playbackRate = 1.00;
		let t = pager.getCurrentPage();
		let mAdv = parseFloat( parseInt( $("#msAdv").val() )/1000.00 );
		//msaabc.currentTime = parseFloat( ( t.msTimeNow ) / t.msLoopsEverySec );
		//msaabc = document.getElementById('aabc');


		//cl( "play now:"+msaabc.currentTime+" shood:"+ (( t.msTimeNow ) / t.msLoopsEverySec) );
		//t.msTimeNow++;

		//cl("msLoop dirigent:"+t.dyrigent+" lStart:"+t.lStart+" cAdv:"+t.cAdv);
		//cl("clients:");
		//cl(t.msClients);
		//cl("cur:"+msaabc.currentTime);

		let advPerSpe;
		for( let c=0,cc=t.msClients.length; c<cc; c++ ){
			advPerSpe = mAdv+parseFloat(
				msaabc.currentTime+
				t.msSpekersA[ t.msClients[c] ]+
				( t.msPings[ t.msClients[c] ]/1000.00 )
			);
			sOutSend('musicSync:seek'+t.msClients[c]+'='+advPerSpe );

		}

		if( ( t.lStart% 5) == 0 ){
			//cl('ping lash');
			//cl(t.msPings);
			//$("#msPlayRate").html( JSON.stringify(t.msPings) );
			let ss = '';
			for( let c=0,cc=t.msClients.length; c<cc; c++ ){
				let spNo = t.msClients[c];
				let spA;

				t.msPLast[ spNo ] = new Date().getTime();
				sOutSend('musicSync:ping='+spNo);

				if( t.msSpekersA[ spNo ] == undefined ){
					spA = 0;
					t.msSpekersA[ spNo ] = 0;
				}else
					spA = parseInt(t.msSpekersA[ spNo ]*1000);

				ss+= `
					<label for="msSpAdv`+spNo+`">
						Advanced for speaker ( `+spNo+` ) ping: <div id="spPing`+spNo+`" style="display:inline;"></div>ms
					</label>
					<input type="range" name="msSpAdv`+spNo+`" id="msSpAdv`+spNo+`"
						value="`+spA+`" min="-500" max="500"
						onchange="pager.getCurrentPage().msSetSpeakerAdvance( `+spNo+`, $(this).val() )">`;

			}

			$('#msSpekers').html(ss).enhanceWithin();

		}

		t.lStart++;

	}


	msSetSpeakerAdvance( spNo, valMs ){
		pager.getCurrentPage().msSpekersA[ spNo ] = parseFloat( parseInt( valMs )/1000.00 );

	}


	onMessageCallBack( r ){

		//cl("onMessageCallBack");
		//cl(r);
		if( r.topic == 'and/lat' ){

		}else if( r.topic == 'musicSync/cmd' ){

			switch( r.payload[0] ){
				case "setFile":
					cl("setFile:"+r.payload[1]);
					cl("html:"+$('#aabc').html());
					$('#aabc').attr('src',r.payload[1]);
					//$('#aabc').addTextTrack( "Music", "yss-music-sync: "+r.payload[1] );

					break;

				case 'seek'+sm.myNo:
					var pbOrg = parseFloat( msaabc.playbackRate );
					msaabc.playbackRate = 1.00;
					var ct = parseFloat(msaabc.currentTime)+
						parseFloat( $('#msAdv').val()/1000.00  );
					msaabc.playbackRate = pbOrg;

					//cl("dif"+(Math.abs( ct - parseFloat( r.payload[1] ) ) ) );
					var dif = ct - parseFloat( r.payload[1] ) ;
					var pbr = parseInt( (1000+( (dif*1000)*-0.4 ) ) )/1000.00;
					if( dif > 1.0 || dif < -1.0   ){
						//cl("seek to beeg diff");
						msaabc.currentTime = parseFloat(r.payload[1])+parseFloat(0.001);
						//	msaabc.playbackRate=1.0;
					}else if( dif < 2.0 && dif > -2.0 ){
			 			msaabc.playbackRate = pbr*0.3 + msaabc.playbackRate*0.7;

					}
					$('#msPlayRate').html( pbr + " d:"+dif.toFixed(4));
					break;

				case "ping":
					if( r.payload[1] == sm.myNo )
						sOutSend('musicSync:pong='+sm.myNo);
					break;

				case "pong":
					if( pager.getCurrentPage().dyrigent == true ){
						var tn = new Date().getTime();
						var tl = pager.getCurrentPage().msPLast[ r.payload[1] ];
						pager.getCurrentPage().msPings[ r.payload[1] ] = tn - tl;

						$('#spPing'+r.payload[1] ).text( pager.getCurrentPage().msPings[ r.payload[1] ] );

					}
					break;

				case 'client':
					if( pager.getCurrentPage().dyrigent == true )
						pager.getCurrentPage().msClients.push( r.payload[1] );
					break;

				case "stop":
					cl("stop:"+r.payload[1]);
					msaabc.stop();

					break;
				case "dyrigent":

					if( sm.myNo == parseInt(r.payload[1]) ){
						cl("now I'm the master of music !")
						pager.getCurrentPage().msClients = [];
						pager.getCurrentPage().dyrigent = true;
						msaabc.playbackRate = 1.00;
						$("#msMasterBt").text("I'm the master!");
						clearInterval( pager.getCurrentPage().loopObj );
						pager.getCurrentPage().loopObj = setInterval(
							pager.getCurrentPage().msLoop, 1000/pager.getCurrentPage().msLoopsEverySec );
						//msaabc.playbackRate = 1.0;

					}else{
						pager.getCurrentPage().dyrigent = false;
						clearInterval( pager.getCurrentPage().loopObj );
						$("#msMasterBt").text("Be master! now SpekerNo:"+sm.myNo);
						sOutSend('musicSync:client='+sm.myNo);

					}

					break;
			}

		}

	}
}
