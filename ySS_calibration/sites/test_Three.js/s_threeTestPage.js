class s_threeTestPage{

	get getName(){
		return 'Three.js test page';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}

	lastData = -1;
	lObj = -1;
	lSend= -1;

	get getHtml(){
		cl("----- get html");

		this.lastData = -1;
		this.lObj = -1;
		this.lSend= -1;

		return t4y.getHtml();
	}




	updateLightToCamera(){
		if( this.lastData == -1 && t4y.otsce != undefined ){
			this.lObj = t4y.otsce.getObjectByName("light_with_shadow");
			this.lSend = new Date().getTime();
			if( this.lObj != undefined ){
				this.lastData = 1;
				t4y.setDelaydAnimation("move light");
			}
		}

		// light falow the camera
		if( this.lObj && this.lObj.position ){
			t4y.getOtCam.updateWorldMatrix();
			this.lObj.position.set(
				t4y.getOtCam.position.x-0.2,
				t4y.getOtCam.position.y-0.2,
				t4y.getOtCam.position.z-0.2 );
		}

		// stop an anges and stop at center
		if( t4y.controls != undefined ){
			//cl("cam pos");
			//cl(t4y.getOtCam.rotation.z);
			if( t4y.getOtCam.rotation.z < 0.4 )
				t4y.controls.autoRotateSpeed = -2.0;
			if( t4y.getOtCam.rotation.z > 0.9 && t4y.getOtCam.rotation.z < 1.1 )
				t4y.controls.autoRotateSpeed = 0;
			if( t4y.getOtCam.rotation.z > 3.0 )
				t4y.controls.autoRotateSpeed = 2.0;
		}

	}

	getHtmlAfterLoad(){
		cl("------- getHtmlAfterLoad");
		cl(ott);
		t4y.getHtmlAfterLoad( 'sites/test_Three.js/3dmodel_welcomeLogo4.glb',
			{
				'camPos':[1.8033587121116157,0.9660278493757173,0.500080913159443],
				'lookAt':[0.49273556568666854, 0.7646287213865852, -0.31380791831988264],
				'autoRotate': true,
				'controls': true,
				'camDeb': false,
				'onRender': ()=>{pager.getCurrentPage().updateLightToCamera();}
			}
		);


	}

	get svgDyno(){
		return '';
	}

	svgDynoAfterLoad(){

	}




	onMessageCallBack( r ){
		//cl("three test call ws back..");
		//cl( r );
		if( r.topic == 'and/mag' ){
			var mag = parseFloat( r.payload );
			var emp = t4y.otsce.getObjectByName("Empty");
			t4y.doAni( emp, { 'rotateX': mag/10} );

			/*
			//t4y.getOtCam.position.set(0,0,0);
			t4y.getOtCam.updateMatrix();

			var dist = 5.0;
			t4y.doAni( t4y.getOtCam, {
				'positionZ': dist*0.5-Math.sin(toRad(mag%90))*dist
			});
			t4y.doAni( t4y.getOtCam, {
				'positionX': 2.0+Math.cos(toRad((mag+Math.PI)%90))*dist
			});
			*/
			//cl("mas:"+(mag/12))

			t4y.putText( ""+Math.round(r.payload),{
					OSD: true,
					name :"HDGText4",
					color: 0x000000,
					size: 1,
					replace: "HDGText4",
					handle: 'cb',
					x:0.5,
					y:0.5,
					rz:0,
					extrude: .1
			});



			t4y.putText( "LT"+Math.round(r.payload)+"`",{
					OSD: true,
					name :"HDGTextLT",
					color: 0x00ffaa,
					size: .2,
					replace: "HDGTextLT",
					handle: 'lt',
					x:0,
					y:1,
					ry:1,
					extrude: .1
			});
			t4y.putText( "RT"+Math.round(r.payload)+"`",{
					OSD: true,
					name :"HDGTextRC",
					color: 0xff00ff,
					size: .2,
					replace: "HDGTextRC",
					handle: 'rt',
					x:1,
					y:1,
					ry:1,
					extrude: .1
			});
			t4y.putText( "LB"+Math.round(r.payload)+"`",{
					OSD: true,
					name :"HDGTextLB",
					color: 0x70ffa0,
					size: .2,
					replace: "HDGTextLB",
					handle: 'lb',
					x:0,
					y:0,
					ry:1,
					extrude: .1
			});

			t4y.putText( "RB"+Math.round(r.payload)+"` rz45",{
					OSD: true,
					name :"HDGTextRB",
					color: 0x0aa0ff,
					size: .2,
					replace: "HDGTextRB",
					handle: 'rb',
					x:1,
					y:0,
					rz:45,
					extrude: .1
			});

			//cl("three.js test call my animate.");
			//t4y.myAnimateStart('three.js test -> mag');


		}else if( r.topic == 'and/orient/heel'){
			var h = parseFloat( r.payload );
			var it = t4y.otsce.getObjectByName("icon_debian");
			var itd = t4y.otsce.getObjectByName("icon_debian_depth");


			var emp = t4y.otsce.getObjectByName("icon_mysql");
			t4y.doAni( emp, { 'rotateX': h} );

			//t4y.myAnimateStart('three.js test -> heel');

		}else if( r.topic == "and/orient/pitch" ){
			var p = parseFloat( r.payload );
			var emp = t4y.otsce.getObjectByName("icon_mysql_depth");
			t4y.doAni( emp, { 'rotateX': p} );

			//t4y.myAnimateStart('three.js test -> pitch');

		}

	}
}
