class s_threeTestPage{

	get getName(){
		return 'Three.js test page';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	get getHtml(){
		cl("----- get html");
		return t4y.getHtml();
	}



	getHtmlAfterLoad(){
		cl("------- getHtmlAfterLoad");
		cl(ott);
		t4y.getHtmlAfterLoad( ott,
			'3dmodel_welcomeLogo2.glb',
			{
				'controls': true,
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
			var emp = otsce.getObjectByName("Empty");
			t4y.doAni( emp, { 'rotateX': mag/10} );
			//cl("mas:"+(mag/12))

		}else if( r.topic == 'and/orient/heel'){
			var h = parseFloat( r.payload );
			var it = otsce.getObjectByName("icon_debian");
			var itd = otsce.getObjectByName("icon_debian_depth");

			if( itd != undefined ){
				it.rotateX( h/6 );
				//itd.rotateX( toRad( h ) );

				//cl("set targetto: "+h);

				$( itd ).clearQueue();
				t4y.doAni( itd, { 'rotateX': h} );
			}

			var emp = otsce.getObjectByName("icon_mysql");
			t4y.doAni( emp, { 'rotateX': h} );



		}else if( r.topic == "and/orient/pitch" ){
			var p = parseFloat( r.payload );
			var emp = otsce.getObjectByName("icon_mysql_depth");
			t4y.doAni( emp, { 'rotateX': p} );

		}

	}
}
