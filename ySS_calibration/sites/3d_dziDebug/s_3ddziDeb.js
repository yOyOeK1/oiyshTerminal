
class s_3ddziDebPage{

	constructor(){
		this.axes = -1;

		this.PhoneObj = -1;
		this.CamView = -1;
		this.MarkerCylinder = -1;

		this.po1 = -1;
		this.rv = {};
		this.tv = {};

	}


	get getName(){
		return '3d Dzi debug';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	getHtml(){
		cl("----- get html");
		let tr=`
		<div style="z-index:9;display:inline;position:absolute;top:0;width:100%;">
			
			<label for="sli3DTTest">Move slider to test [and/mag]:</label>
			<input type="range" id="sli3DTTest" name="sli3DTTest"
				min="-100" max="360" value="0"
				data-theme="b" data-track-theme="b">
				
			<label for="sli3DTTest2">Move slider to test [and/heel]:</label>
			<input type="range" id="sli3DTTest2" name="sli3DTTest2"
				min="-100" max="100" value="0"
				data-theme="b" data-track-theme="b">

			<label for="switchJump">Jump:</label>
			<select name="switchJump" id="switchJump" data-role="slider">
				<option value="off">Off</option>
				<option value="on">On</option>
			</select>

			<label for="switchSensors">Sensors:</label>
			<select name="switchSensors" id="switchSensors" data-role="slider">
				<option value="off">Off</option>
				<option value="on">On</option>
			</select>
		
		</div>`;

		cl("- tr is ");
		cl(tr);
		cl("t4y is ");
		cl(t4y);
		setTimeout(()=>{

			$('#switchJump').change( function(){
				let v = $(this).val();
				cl(`on change jump switch `+v);
			
				if( v == 'on' ){
					t4y.cActions['Act1R.002'].paused = false;
					t4y.cActions['Act1R.002'].loop = t4y.libTHREE.LoopRepeat;
					pager.pages[pager.currentPage].startRenderAllTime();	
				}else{
					t4y.cActions['Act1R.002'].paused = true;
					pager.pages[pager.currentPage].stopRenderAllTime();
				}
			
			});

			$('#switchSensors').change( function(){
				let v = $(this).val();
				cl(`on change switchMainTimeLine `+v);
				if( v == 'on' ){
						sOutSend(JSON.stringify({
							"topic": "dzihar/streamSwith",
							"payload": "on",
							"doIt": {
								"sender": "nodeRed02",
								"ori": true
							}
						}));

				}else{
					sOutSend(JSON.stringify({
						"topic": "dzihar/streamSwith",
						"payload": "off"
					}));
					
				}
				
			
			});


		},300);

		return tr+t4y.getHtml();
	}



	getHtmlAfterLoad(){
		cl("------- getHtmlAfterLoad");
		cl(ott);



		

		$( "#sli3DTTest" ).change(function(event, ui){
				var v = parseInt($(this).val());
				pager.subTask( ()=>{
					pager.pages[pager.currentPage].onMessageCallBack({
						"topic": "and/mag",
						"payload": v
					});
				} );
		});

		$( "#sli3DTTest2" ).change(function(event, ui){
			var v = parseInt( $(this).val() );
			pager.subTask( ()=>{
				pager.pages[pager.currentPage].onMessageCallBack({
					"topic": "and/orient/heel",
					"payload": v
				});
			});

		});

		

		t4y.getHtmlAfterLoad( 
			//'sites/3d_action_clips/test1_cubes3_4.5.glb',
			'sites/3d_dziDebug/3dsceen03.glb',
		//t4y.getHtmlAfterLoad( 'sites/3d_action_clips/test1_cubes3.glb',
		 	{
				//'camPos': [12.530088021598306, 62.72307047093599, 26.921712853935578],
				//'camRot': [-0.945604247598529, 0.16391450066952107, 0.22234511182624667],
				'controls': false,
				//'lightPos': [0,80,-80],
				'camDeb': false,
				'lightMultiplyer': 0.000015,
				'addHdr': true,
				//'autoRotate': true,
			}
		);
		
		
		setTimeout( ()=>{
			
			let grid = new t4y.libTHREE.GridHelper( 20, 20, 0x000000, 0x000000 );
			grid.material.opacity = 0.2;
			grid.material.transparent = true;
			cl(t4y.gltfLoaded);
			t4y.gltfLoaded.scene.add( grid );

			//t4y.otren.toneMappingExposure = 10;

			//t4y.otren.toneMappingExposure = 0.01;
			//t4y.cActions['Act1R.002'].paused = false;
			//t4y.cActions['Act1R.002'].loop = t4y.libTHREE.LoopRepeat;
			
			//this.suza = t4y.gltfLoaded.scene.children[9];
			
			/*this.axes = new t4y.libTHREE.AxesHelper( 1);
			t4y.gltfLoaded.scene.add( this.axes );

			this.axCam = new t4y.libTHREE.AxesHelper(7);
			t4y.gltfLoaded.scene.add( this.axCam );

			this.axPhoScr = new t4y.libTHREE.AxesHelper(1);
			t4y.gltfLoaded.scene.add( this.axPhoScr );
			*/

			this.po1 = new t4y.libTHREE.AxesHelper( 2);
			t4y.gltfLoaded.scene.add( this.po1 );

			this.po2 = new t4y.libTHREE.AxesHelper( 2);
			t4y.gltfLoaded.scene.add( this.po2 );

			for( let c=0,cc=t4y.gltfLoaded.scene.children.length; c<cc; c++){
				let chi = t4y.gltfLoaded.scene.children[c];
				if( chi.name == 'PhoneObj' )
					this.PhoneObj = chi;
				else if( chi.name == 'CamView' )
					this.CamView = chi;
				else if( chi.name == 'MarkerCylinder' )
					this.MarkerCylinder = chi;

				
			}

			t4y.init_click();
			
			this.siteLoaded = true;
		}, 1500);
		
		this.intervalLoop;
		if(0){
			this.startRenderAllTime();
		}

		setTimeout(()=>{
			sOutSend('wsClientIdent:3ddziDeb');
		},1000);

	}

	startRenderAllTime(){
		this.intervalLoop = setInterval( ( )=>{ 
			t4y.setDelaydRender("clip in the loop request");
			//cl(`forst render `);		
			
		}, 1000/12 ); // 12 fps
	}
	stopRenderAllTime(){
		clearInterval( this.intervalLoop );
	}

	get svgDyno(){
		return '';
	}

	svgDynoAfterLoad(){

	}


	onMessageCallBack=( r )=>{
		cl('got msg.topic: ['+r.topic+']');
		if( this.siteLoaded != true) return ;

		if( r.topic == 'ocvWeb/point/1' ){
			this.rv = r.rv;
			this.tv = r.tv;
			let euler = new t4y.libTHREE.Euler();
			euler.set( 
				this.rv.a, 
				this.rv.b, 
				this.rv.c, 
				'YXZ' );
			this.po1.quaternion.setFromEuler( euler );
			let multi = 2.0;
			this.po1.position.set( 1,0.2,-2);
			//this.po1.position.set( -this.tv.c*multi, -this.tv.a*multi, this.tv.b*multi );
								//	,	-z,	,x
								// a - z , 
			t4y.setDelaydRender("clip in the loop request");

			this.MarkerCylinder.position.set( 
				this.tv.b*multi, 
				-this.tv.a*multi, 
				this.tv.c*multi );
			let q3 = new t4y.libTHREE.Quaternion(
				0,Math.sqrt(0.5),0,0  // 180 over x-axis
			);
			this.MarkerCylinder.quaternion.multiply(q3);

		}

		if( r.topic == 'and/ori'){
			let ori = r.payload;
			//console.log(  ori );
			//let alphaRad = t4y.libTHREE.MathUtils.degToRad(ori.a);
			//let betaRad = t4y.libTHREE.MathUtils.degToRad(ori.b);
			//let gammaRad = t4y.libTHREE.MathUtils.degToRad(ori.g);
			
			let euler = new t4y.libTHREE.Euler();
			let q0 = new t4y.libTHREE.Quaternion();
			let q1 = new t4y.libTHREE.Quaternion(
				Math.sqrt( 1.0 ), 0,0,0  // 180 over x-axis
			);
			let q3 = new t4y.libTHREE.Quaternion(
				0,Math.sqrt(1.0),0,0  // 180 over x-axis
			);
			euler.set( 
				ori.b * (Math.PI / 180), 
				ori.a * (Math.PI / 180), 
				-ori.g * (Math.PI / 180), 
				'YXZ' );

			//console.log('alpha'+ori.a);
			//this.axes.quaternion.setFromEuler( euler );
			this.PhoneObj.quaternion.setFromEuler( euler );
			this.CamView.quaternion.setFromEuler( euler );
			//this.axPhoScr.quaternion.setFromEuler( euler );
			//this.axPhoScr.position.set( 4, 1, 0);

			//this.suza.quaternion.setFromEuler( euler );
			//this.suza.position.set( 3, 1, 3);

			//this.axCam.quaternion.setFromEuler( euler );
			//this.axCam.quaternion.multiply( q1 );
			//this.axCam.quaternion.multiply( q3 );
			//this.axCam.position.set( 4, 1, 0);

			//this.axes.rotation.x = betaRad;
			//this.axes.rotation.y = gammaRad;
			//this.axes.rotation.z = alphaRad;
			//this.axes.position.set( 3, 1, 0);
			t4y.setDelaydRender("clip in the loop request");

		}else if( r.topic == 'sites/3d action clips/CubeL' ||
			r.topic == 'sites/3d action clips/CubeR'
		 ){
			if( r.topic == 'sites/3d action clips/CubeR'){

				// to force rendering for 6 sec
				t4y.aniOnlyRender( t4y.cActions['CuR'], 6 );
				t4y.cActions['CuR'].reset()
						.setEffectiveTimeScale( 1 )
						.setEffectiveWeight( 1 )
						.fadeIn( 5 )
						.play();
			}


			cl('put click');
			t4y.putText( "\n\n\n\nRTC"+String(r.topic).substring(26),{
					OSD: true,
					name :"HDGTextRTC",
					color: 0xff0000,
					size: .25,
					replace: "HDGTextRTC",
					handle: 'rt',
					x:1,
					y:1,
					rx:-10,
					//extrude: .1
			});


		} else if( r.topic == 'and/mag' ){
			var mag = parseFloat( r.payload );

			// run mixer on CuR
			//t4y.cActions['CuR'].time = (mag/360.00) * t4y.cActions.CuR.getClip().duration;
			t4y.actionSeek( t4y.cActions['CuR'], (mag/360.00) );
			//t4y.cActions['CuR'].reset()
			//		.setEffectiveTimeScale( 1 )
			//		.setEffectiveWeight( 1 )
			//		.fadeIn( 5 )
			//		.play();
			
			var emp = t4y.otsce.getObjectByName("CubeL");
			/*
			$( emp ).attr('positionX', 'setIt');
			t4y.doAni( emp, { 'rotateX': mag} );
			*/

			emp = t4y.otsce.getObjectByName("Empty");
			t4y.doAni( emp, { 'rotateY': mag} );
			t4y.putText( "HDG: "+degToHdg(r.payload),{
					name :"HDGText",
					color: 0xf0a32a,
					size: 5,
					replace: "HDGText",
					handle: 'cb',
					x:-20,
					y:2,
					z: -43,
					ry:-20,
					extrude: .5
			});

			t4y.putText( ""+degToHdg(r.payload)+"",{
					OSD: true,
					name :"HDGText4",
					color: 0x000000+Math.round(r.payload)*1024,
					size: 1,
					replace: "HDGText4",
					handle: 'lt',
					x:0.1,
					y:0.8,
					rx:45,
					//extrude: .1
			});





			t4y.putText( "LT"+degToHdg(r.payload),{
					OSD: true,
					name :"HDGTextLT",
					color: 0x00ffaa,
					size: .1,
					replace: "HDGTextLT",
					handle: 'lt',
					x:0,
					y:1,
					ry:0,
					//extrude: .1
			});
			t4y.putText( "RT"+degToHdg(r.payload),{
					OSD: true,
					name :"HDGTextRT",
					color: 0xff00ff,
					size: .25,
					replace: "HDGTextRT",
					handle: 'rt',
					x:1,
					y:1,
					rx:-10,
					//extrude: .1
			});
			t4y.putText( "LB"+degToHdg(r.payload),{
					OSD: true,
					name :"HDGTextLB",
					color: 0x70ffa0,
					size: .3,
					replace: "HDGTextLB",
					handle: 'lb',
					x:0,
					y:0,
					ry:1,
					//extrude: .1
			});

			t4y.putText( "RB"+degToHdg(r.payload),{
					OSD: true,
					name :"HDGTextRB",
					color: 0x0aa0ff,
					size: .2,
					replace: "HDGTextRB",
					handle: 'rb',
					x:1,
					y:0,
					rx:0,
					//extrude: .1
			});


			//t4y.myAnimateStart('3d compass -> mag');


		}else if( r.topic == 'and/orient/heel'){
			

			
			try{
				t4y.gltfLoaded.scene.children[1].children[0].power = (parseFloat(r.payload)*0.5);
				cl('light power to: '+t4y.gltfLoaded.scene.children[1].children[0].power);	

			}catch(e){
	
				try{
					t4y.gltfLoaded.scene.children[3].power = (parseFloat(r.payload)*0.5);
					cl('light power to: '+t4y.gltfLoaded.scene.children[3].power);	
	
				}catch(e){}

			}
			

			/*
			var emp = t4y.otsce.getObjectByName("PointLight");
			$( emp ).attr('positionX', 'setIt');
			t4y.doAni( emp, { 'positionX': parseFloat(r.payload)} );
			*/

			t4y.cActions.CuL.time = (parseFloat(r.payload)/100.00) * t4y.cActions.CuL.getClip().duration;

			t4y.cActions['Act1R.002'].paused = false;
			clearInterval( this.intervalLoop )


			t4y.setDelaydRender("Light power change");
			
			
		}else if( r.topic == "and/orient/pitch" ){

		}

	}
}
