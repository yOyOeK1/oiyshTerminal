class s_3dcompass1{

	get getName(){
		return '3d Compass 1';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	get getHtml(){
		cl("----- get html");
		tr=`<div style="z-index:9;display:inline;position:absolute;top:0;width:100%;">
		  <label for="sli3DTTest">Move slider to test:</label>
		  <input type="range" id="sli3DTTest" name="sli3DTTest"
		    min="-100" max="360" value="0"

		    data-theme="b" data-track-theme="b">

				<label for="sli3DTTest2">Move slider to test:</label>
			  <input type="range" id="sli3DTTest2" name="sli3DTTest2"
			    min="-100" max="100" value="0"

			    data-theme="b" data-track-theme="b">


		</div>`;
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


		t4y.getHtmlAfterLoad( 'sites/3d_compass1/s_3dcompass_blender4.glb',
		 	{
				//'camPos': [12.530088021598306, 62.72307047093599, 26.921712853935578],
				//'camRot': [-0.945604247598529, 0.16391450066952107, 0.22234511182624667],
				'controls': false,
				'lightPos': [0,80,-80],
				'camDeb': false
			}
		);

		/*
		var em = t4y.otsce.getObjectByName("Empty");
		cl("em");
		cl(em);
		for( var d=0; d<360; d+=20 ){
			t4y.putText( ""+d,{
					name :"HDGText3"+d,
					color: 0x000000,
					size: 15,
					handle: 'cb',
					x: Math.sin( toRad(d) )*80,
					y:7,
					z: -Math.cos( toRad(d) )*80,
					ry:d,
					rz:-90,
					extrude: .5
			});
		}
		*/




	}

	get svgDyno(){
		return '';
	}

	svgDynoAfterLoad(){

	}




	onMessageCallBack( r ){

		if( r.topic == 'and/mag' ){
			var mag = parseFloat( r.payload );
			var emp = t4y.otsce.getObjectByName("Empty");
			t4y.doAni( emp, { 'rotateY': mag} );
			t4y.putText( "HDG: "+degToHdg(r.payload)+"`\nyouyou",{
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
			var emp = t4y.otsce.getObjectByName("SpotLight");
			$( emp ).attr('positionX', 'setIt');
			//cl("start ------------");
			t4y.doAni( emp, { 'positionX': parseFloat(r.payload)} );
			//cl("end -----------------");
			//t4y.myAnimateStart('3d compass -> heel');

		}else if( r.topic == "and/orient/pitch" ){

		}

	}
}
