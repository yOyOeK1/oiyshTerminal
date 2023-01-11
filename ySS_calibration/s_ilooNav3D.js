class s_ilooNav3D{

	get getName(){
		return 'iloo nav 3D';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	get getHtml(){
		cl("----- get html");
		tr=`
		<div style="display:none;">
		<div style="z-index:9;display:inline;position:absolute;top:0;width:100%;">
		  <label for="sli3DTTest">Move slider to test:</label>
		  <input type="range" id="sli3DTTest" name="sli3DTTest"
		    min="-100" max="360" value="0"

		    data-theme="b" data-track-theme="b">

				<label for="sli3DTTest2">Move slider to test:</label>
			  <input type="range" id="sli3DTTest2" name="sli3DTTest2"
			    min="-100" max="100" value="0"

			    data-theme="b" data-track-theme="b">


		</div></div>`;
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
				"topic": "and/orient/pitch",
				"payload": v
			});

		});


		t4y.getHtmlAfterLoad( ott,
			's_ilooNav3D.glb',
		 	{
				'camPos': [0.028763731041237167, 103.44550962401865, -93.74328394639551],
				'camRot': [-1.909218085730232, -0.0015954765259057495, -0.0],
				'controls': false,
				'lightPos': [0,100,-190],
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

		}else if( r.topic == 'and/orient/heel'){
			var emp = t4y.otsce.getObjectByName("SpotLight");
			var h = parseFloat( r.payload );
			$( emp ).attr('positionX', 'setIt');
			//cl("start ------------");
			t4y.doAni( emp, { 'positionX': 40+h*-2} );
			//cl("end -----------------");

			var emp = t4y.otsce.getObjectByName("heel");
			t4y.doAni( emp, { 'rotateY':  -h } );


			t4y.putText( Math.round(r.payload)+"`",{
					name :"HeelText",
					color: 0x000000,
					size: 6,
					replace: "HeelText",
					handle: 'cb',
					x:15,
					y: -5,
					z: -52,
					rx:90,
					extrude: .5

			});


		}else if( r.topic == "and/orient/pitch" ){
			var h = parseFloat( r.payload );
			var emp = t4y.otsce.getObjectByName("pitch");
			t4y.doAni( emp, { 'rotateY': -h} );

			t4y.putText( Math.round(r.payload)+"`",{
					name :"PitchText",
					color: 0x000000,
					size: 5,
					replace: "PitchText",
					handle: 'cb',
					x:-15,
					y: -5,
					z: -52,
					rx:90,
					extrude: .5

			});

		}

	}
}
