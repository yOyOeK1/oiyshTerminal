class s_musicSyncPage{

	get getName(){
		return 'music sync';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	fList = [
		"http://192.168.43.1:3000/public/tmp/secondNotLast.mp3",
		"http://192.168.43.1:3000/public/tmp/-1st trimester gift.mp3",
		"http://192.168.43.1:3000/public/tmp/lofi/fall in love with your solitude [relaxing lofi_chill beats]-WEiT1sObe8o.webm",
		"http://192.168.43.1:3000/public/tmp/lofi/I think I’ll stay at home today ~ lofi cute_chill mix-_0aatnWjAMY.mp3",
		"http://192.168.43.1:3000/public/tmp/lofi/fall in love with your solitude [relaxing lofi_chill beats]-WEiT1sObe8o.mp3",
		"http://192.168.43.1:3000/public/tmp/lofi/You left me alone ~ lofi hip hop mix-UnB6ck40aCw.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Arp Ascent - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Back To The Future - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Beijaflor - Quincas Moreira.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Beyond - Patrick Patrikios.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Commander Impulse - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Cosmic Drift - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Cupids Tubes - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Dreamer - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Dusk - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Find Your Way Beat - Nana Kwabena.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Icelandic Arpeggios - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/I Feel It All So Deeply -",
		"http://192.168.43.1:3000/public/tmp/youtube/Koto San - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Landing - Godmode.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Lunar Landing - Silent Partner.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Make You Move - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Meet & Fun! - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Midnight Sun - Dyalla.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Mover - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Namaster Trip - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/One More Time - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Parisian Funk - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Polymetric Juggling - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Road Tripzzz - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Spring Field - Godmode.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Sun Awakening - Futuremono.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Sunday Rain - Cheel.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Sunrise Over Big Data Country - Dan",
		"http://192.168.43.1:3000/public/tmp/youtube/Tea Time - Ofshane.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/The Empty Moons of Jupiter - DivKid.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/The Symmetry of Sleeplessness - Dan Bodan.mp3",
		"http://192.168.43.1:3000/public/tmp/youtube/Wellington Coffee Shop - Dyalla.mp3",
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
				`onclick="pager.getCurrentPage().msSetFile('`+encodeURI(this.fList[f])+`')" `+
				'msSrc="'+this.fList[f]+'" '+
				'class="ui-btn '+
					' msFs '+
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


<h1 id="msHeaderNow"></h1>
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

</script>

		`;
	}

	getHtmlAfterLoad(){
		cl("------------------------------After Load()");
		cl("make volume touchee....");
		this.msPid = new PID2();
		this.msPid.setTarget(1.00);
		this.msPid.setGains( 0.05, 0.00001, 0.000001 );
		//this.msPid.setOutput( 0.8, 1.2, 0.0001);


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
	fNamePlayng = "";
	msPid = 0;
	msLoop( ){
		//msaabc.playbackRate = 1.00;
		let t = pager.getCurrentPage();





		//cl("check if not end of a song and play next....");
		//cl("currentTime: "+msaabc.currentTime );
		//cl("duration:"+msaabc.duration);
		if( (msaabc.duration-1.00) < msaabc.currentTime ){
			cl("less then a sec. to end of song!");
			let i = 0;
			let id = -1;
			t.fList.find( (u) =>{
				if( u == t.fNamePlayng ){
					id = i;
					return true;
				}
				i++;
			});
			cl("now plaing id:"+id);
			cl("next: "+t.fList[ id+1 ] );
			if( id != -1 ){
				cl("ok ther is next. Going it!!!!");
				msaabc.currentTime = 0.00;
				t.msSetFile( encodeURI( t.fList[ id+1 ] ) );

				return 0;

			}

		}

		if( t.msClients == [] )
			return 0;

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
				( (t.msPings[ t.msClients[c] ]*0.5) /1000.00 )+0.016
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
		//cl("this:["+String(this)+"]");

		//cl(r);
		if( r.topic == 'and/lat' ){

		}else if( r.topic == 'musicSync/cmd' ){

			switch( r.payload[0] ){
				case "setFile":
					cl("setFile:"+r.payload[1]);
					cl("html:"+$('#aabc').html());
					$('#aabc').attr('src',r.payload[1]);
					//$('#aabc').addTextTrack( "Music", "yss-music-sync: "+r.payload[1] );
					this.fNamePlayng = decodeURI( r.payload[1] );
					document.title = "Music sync: "+this.fNamePlayng;

					cl("making stuff with buttons of songs... setting selected one");
					let o = -1;
					let hName = '';
					jQuery("#msLV a").each(function(){
						o = jQuery(this);
						let cla = o.attr('class');
						if( o.attr('msSrc') == pager.getCurrentPage().fNamePlayng ){
							o.attr('class', cla.split("ui-btn-a").join("ui-btn-b ")  );
							hName = o.text();
						}else
							o.attr('class', cla.split("ui-btn-b").join("ui-btn-a")  );

					});
					cl("	... DONE");

					$("#msHeaderNow").text( hName );

					break;

				case 'seek'+sm.myNo:
					//var pbOrg = parseFloat( msaabc.playbackRate );
					//msaabc.playbackRate = 1.00;
					var ct = parseFloat(msaabc.currentTime) +parseFloat( $('#msAdv').val()/1000.00  );
					//msaabc.playbackRate = pbOrg;

					//cl("dif"+(Math.abs( ct - parseFloat( r.payload[1] ) ) ) );
					var dif = ct - parseFloat( r.payload[1] ) ;
					if( dif > 1.50 || dif < -1.50 ){
						msaabc.currentTime = parseFloat( r.payload[1] )+0.0005;
						msaabc.playbackRate = 1.0;
						var nr = 1.00;
						this.msPid.update( 1.00 );
					}else{
						var nr = 1.00+this.msPid.update( -dif+1.00 );
						msaabc.playbackRate = nr;
					}

					//var pbr = parseInt( (1000+( (dif*1000)*-0.4 ) ) )/1000.00;
					//cl("msPid");
					//cl(this.msPid);
					//cl("pid update");
					//cl( "pidres:"+nr );
					/*if( dif > 100.0 || dif < -100.0   ){
						//cl("seek to beeg diff");
						msaabc.currentTime = parseFloat(r.payload[1])+parseFloat(0.001);
						//	msaabc.playbackRate=1.0;
					}else if( dif < 200.0 && dif > -200.0 ){

						cl("new rate ..");
						cl(nr);

					}*/
					$('#msPlayRate').html( nr + " dif:"+dif.toFixed(4));
					break;

				case "ping":
					if( r.payload[1] == sm.myNo )
						sOutSend('musicSync:pong='+sm.myNo);
					break;

				case "pong":
					if( this.dyrigent == true ){
						var tn = new Date().getTime();
						var tl = this.msPLast[ r.payload[1] ];
						this.msPings[ r.payload[1] ] = tn - tl;

						$('#spPing'+r.payload[1] ).text( this.msPings[ r.payload[1] ] );

					}
					break;

				case 'client':
					if( this.dyrigent == true )
						this.msClients.push( r.payload[1] );
					break;

				case "stop":
					cl("stop:"+r.payload[1]);
					msaabc.stop();

					break;

				case "dyrigent":
					if( sm.myNo == parseInt(r.payload[1]) ){
						cl("now I'm the master of music !")
						this.msClients = [];
						this.dyrigent = true;
						msaabc.playbackRate = 1.00;
						$("#msMasterBt").text("I'm the master!");
						clearInterval( pager.getCurrentPage().loopObj );
						this.loopObj = setInterval(
							this.msLoop, 1000/pager.getCurrentPage().msLoopsEverySec );
						//msaabc.playbackRate = 1.0;

					}else{
						this.dyrigent = false;
						this.msPid.update( 2.000 );
						this.msPid.update( 2.000 );
						this.msPid.update( 2.000 );
						this.msPid.update( 2.000 );
						this.msPid.update( 2.000 );
						clearInterval( this.loopObj );
						$("#msMasterBt").text("Be master! now SpekerNo:"+sm.myNo);
						sOutSend('musicSync:client='+sm.myNo);

					}

					break;
			}

		}

	}
}
