
class s_3d_action_clips{

	get getName(){
		return '3d action clips';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	getHtml(){
		cl("----- get html");
		let tr=`<div style="z-index:9;display:inline;position:absolute;top:0;width:100%;">
		  <label for="sli3DTTest">Move slider to test [and/mag]:</label>
		  <input type="range" id="sli3DTTest" name="sli3DTTest"
		    min="-100" max="360" value="0"

		    data-theme="b" data-track-theme="b">

				<label for="sli3DTTest2">Move slider to test [and/heel]:</label>
			  <input type="range" id="sli3DTTest2" name="sli3DTTest2"
			    min="-100" max="100" value="0"

			    data-theme="b" data-track-theme="b">


		</div>`;

		cl("- tr is ");
		cl(tr);
		cl("t4y is ");
		cl(t4y);

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

		

		t4y.getHtmlAfterLoad( 'sites/3d_action_clips/test1_cubes.glb',
		 	{
				//'camPos': [12.530088021598306, 62.72307047093599, 26.921712853935578],
				//'camRot': [-0.945604247598529, 0.16391450066952107, 0.22234511182624667],
				'controls': false,
				//'lightPos': [0,80,-80],
				'camDeb': false,
				//'autoRotate': true,
			}
		);
		
		this.mixer;
		this.clock = new t4y.libTHREE.Clock();

		setTimeout( ()=>{
			let grid = new t4y.libTHREE.GridHelper( 20, 20, 0x000000, 0x000000 );
			grid.material.opacity = 0.2;
			grid.material.transparent = true;
			cl(t4y.gltfLoaded);
			t4y.gltfLoaded.scene.add( grid );

			//t4y.otren.toneMappingExposure = 10;

			//t4y.otren.toneMappingExposure = 0.01;
			t4y.cActions['Act1R.002'].paused = false;
			t4y.cActions['Act1R.002'].loop = t4y.libTHREE.LoopRepeat;
			


		}, 500);
		
		//let siteNameToLook = pager.pages[pager.currentPage].getName;
		//let currentPageLook = parseInt(pager.currentPage);
		this.intervalLoop = setInterval( ( )=>{ 
			t4y.setDelaydRender("clip in the loop request");
			//cl(`forst render `);		

		 }, 1000/12 ); // 12 fps


	}

	get svgDyno(){
		return '';
	}

	svgDynoAfterLoad(){

	}




	onMessageCallBack( r ){

		if( r.topic == 'and/mag' ){
			var mag = parseFloat( r.payload );

			// run mixer on CuR
			t4y.cActions['CuR'].time = (mag/360.00) * t4y.cActions.CuR.getClip().duration;
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
			
			
			t4y.gltfLoaded.scene.children[1].children[0].power = (parseFloat(r.payload)*0.5);
			cl('light power to: '+t4y.gltfLoaded.scene.children[1].children[0].power);	
			
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
