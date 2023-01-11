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
			console.log("val of v:"+v+" , ");
			pager.pages[pager.currentPage].onMessageCallBack({
				"topic": "and/mag",
				"payload": v
			});
		});

		$( "#sli3DTTest2" ).change(function(event, ui){
			var v = parseInt( $(this).val() );
			pager.pages[pager.currentPage].onMessageCallBack({
				"topic": "and/orient/heel",
				"payload": v
			});

		});


		t4y.getHtmlAfterLoad( ott,
			's_3dcompass_blender2.glb',
		 	{
				'camPos': [12.530088021598306, 62.72307047093599, 26.921712853935578],
				'camRot': [-0.945604247598529, 0.16391450066952107, 0.22234511182624667],
				'controls': false,
				'lightPos': [0,80,-80],
				'camDeb': false
			}
		);
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
			t4y.putText( "HDG: "+Math.round(r.payload)+"`",{
					name :"HDGText",
					color: 0x000000,
					size: 5,
					replace: "HDGText",
					handle: 'cb',
					x:-20,
					y:-7,
					z: -43,
					ry:-20,
					extrude: .5
			});

		}else if( r.topic == 'and/orient/heel'){
			var emp = t4y.otsce.getObjectByName("SpotLight");
			$( emp ).attr('positionX', 'setIt');
			//cl("start ------------");
			t4y.doAni( emp, { 'positionX': parseFloat(r.payload)} );
			//cl("end -----------------");

		}else if( r.topic == "and/orient/pitch" ){

		}

	}
}
