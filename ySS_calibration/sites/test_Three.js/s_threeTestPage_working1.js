class s_threeTestPage{

	get getName(){
		return 'Three.js test page';
	}

	get getDefaultBackgroundColor(){
		return "#ffffff";
	}


	get getHtml(){
		cl("----- get html");
		return `<div id="otThreeLogo" style="z-index:2;position:absolute;top:0;left:0;width:640px;height:320px;"></div>`;
	}




	renTime = 0;
	getHtmlAfterLoad(){
		cl("------- getHtmlAfterLoad");
		cl(ott);

		const container = document.getElementById('otThreeLogo');
		//document.createElement( 'div' );
		//container.with=200;
		//document.body.appendChild( container );

		otcam = new ott['THREE'].PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 200 );
		otcam.position.set( 1.8033587121116157,0.9660278493757173,0.500080913159443 );
		otcam.rotation.set( -0.778129456198272,1.1536498638089243,0.7333969220807653 );

		otsce = new ott['THREE'].Scene();

		new ott['RGBELoader']()
			.setPath( './3dmodels/' )
			.load( 'quarry_01_1k.hdr', function ( texture ) {

				texture.mapping = ott['THREE'].EquirectangularReflectionMapping;

				//otsce.background = texture;
				otsce.background = new ott['THREE'].Color( {color: "#ffffff"} );
				otsce.environment = texture;

				render();

				// model

				const loader = new ott['GLTFLoader']().setPath( './3dmodels/' );
				loader.load( 'welcomeLogo2.glb', function ( gltf ) {
				//const loader = new ott['GLTFLoader']().setPath( './3dmodels/viko-20-sailboat/source/' );
				//loader.load( 'Viko_20-per-tel.glb', function ( gltf ) {

					otsce.add( gltf.scene );

					render();

				} );

			} );


		otren = new ott['THREE'].WebGLRenderer( { antialias: true } );
		otren.setPixelRatio( window.devicePixelRatio );
		otren.setSize( window.innerWidth, window.innerHeight );
		otren.toneMapping = ott['THREE'].ACESFilmicToneMapping;
		otren.toneMappingExposure = 1;
		otren.outputEncoding = ott['THREE'].sRGBEncoding;
		container.appendChild( otren.domElement );

		const controls = new ott['OrbitControls']( otcam, otren.domElement );
		controls.addEventListener( 'change', render ); // use if there is no animation loop
		controls.minDistance = 2;
		controls.maxDistance = 5000;
		controls.target.set( 0, 0.1, 0  );
		controls.update();

		window.addEventListener( 'resize', onWindowResize );



		function onWindowResize() {

			otcam.aspect = window.innerWidth / window.innerHeight;
			otcam.updateProjectionMatrix();

			otren.setSize( window.innerWidth, window.innerHeight );

			render();

		}

		function degToRad( deg ){
				return deg * ( Math.PI / 180 );
		}


		function doAni(){
				//otframeC+=2;
				var cont = document.getElementById('otThreeLogo');
				var c = otcam.position;
				var cr = otcam.rotation;

				//var c = otcam.position;
				//console.log("cam:");
				//console.log("pos: ["+c.x+","+c.y+","+c.z+"]");
				//console.log("rot: ["+cr.x+","+cr.y+","+cr.z+"]");
				//otcam.position.set( c.x, c.y, S+0.1*Math.sin( degToRad( f ) ) );

				if( cont ){
					if( pager.pages[pager.currentPage]['renTime'] )
							clearTimeout( pager.pages[pager.currentPage]['renTime'] )
					pager.pages[pager.currentPage]['renTime'] = setTimeout( doAni, 100 );
				}

				var tobj = pager.pages[pager.currentPage]['tobj'];
				if( otframeC == 1 ){
					tobj['c.p.x']=c.x;
					tobj['c.p.y']=c.y;
					tobj['c.p.z']=c.z;
					tobj['c.r.x']=cr.x;
				}


				if( otframeC > 2 ){
					if( tobj['camX'] ){
						var it = otsce.getObjectByName("Empty");
						it.rotateX( toRad(tobj['mag'] )/100 );

						var id = otsce.getObjectByName("icon_debian");
						id.rotateY( -toRad(tobj['mag'] )/30 );

					}
				}


				if(0){
					if( otframeC > 2 ){
						if( tobj['camX'] ){
							var cx = ( ((tobj['c.p.x']+c.x)/2)*0.95 + tobj['camX']*0.05 );
							var cz = ( ((tobj['c.p.z']+c.z)/2)*0.95 + tobj['camZ']*0.05 );
							otcam.position.set( cx, tobj['c.p.y'], cz );
						}
						if( tobj['mag'] ){
							//cl("mag:"+toRad(tobj['mag']));
							var it = otsce.getObjectByName("ico_bug_512_512");
							//cl(it);
							//var itr = it.rotation;
							//it.rotation.set(tobj['mag']*0.5, itr.y, itr.z);
							otcam.rotation.set(
								( ((tobj['c.r.x']+cr.x)/2)*0.95 + tobj['mag']*0.01 ),
							cr.y, cr.z );
						}


					}
				}

				render();

		}

			//

			function render() {
				otren.render( otsce, otcam );
				//console.log( otcam.position );
				//console.log( otcam.rotation );
				//doAni();



				if( otframeC++ == 0 )
					doAni();
			}


		//setTimeout( doAni, 1000 );
		cl('-------- three TEST PAGE ----------------');


		setTimeout( doAni, 200 );

	}

	tobj={};

	get svgDyno(){
		return '';
	}

	svgDynoAfterLoad(){

	}

	camZOrg=0;
	camXOrg=0;

	onMessageCallBack( r ){

		if( r.topic == 'and/mag' ){
			var mag = parseFloat( r.payload );
			pager.pages[pager.currentPage]['tobj']['mag']=(mag);


		}else if( r.topic == 'and/orient/heel'){
			var h = parseFloat( r.payload );
			pager.pages[pager.currentPage]['tobj']['camZ']=(0.1*h);
			/*
			if( otframeC > 1 ){
				if( pager.pages[pager.currentPage]['camZOrg'] == 0){
					pager.pages[pager.currentPage]['camZOrg'] = c.z;
					var zo = c.z;
				}else{
					var zo = pager.pages[pager.currentPage]['camZOrg'];
				}
				otcam.position.set( c.x, c.y, zo+(0.01*h) );
				//otren.render();
			}
			*/


		}else if( r.topic == "and/orient/pitch" ){
			//var p = Math.round( r.payload );
			//$("#boatPitchVal").text( p );
			//rotateSvgSetRC( "boatPitch", "boatPitchRC", p );
			var p = parseFloat( r.payload );
			pager.pages[pager.currentPage]['tobj']['camX']=(0.1*p);
			/*
			if( otframeC > 1 ){
				if( pager.pages[pager.currentPage]['camXOrg'] == 0){
					pager.pages[pager.currentPage]['camXOrg'] = c.x;
					var xo = c.x;
				}else{
					var xo = pager.pages[pager.currentPage]['camXOrg'];
				}
				otcam.position.set( xo+(0.01*p), c.y, c.z );
			}
			*/

		}

	}
}
