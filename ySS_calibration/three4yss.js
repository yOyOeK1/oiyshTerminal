

class Three4Yss{

  extras = {};
  frameNo = 0;
  ready = false;

  getHtml(){
    return `<div id="otThreeLogo" style="z-index:2;position:absolute;top:0;left:0;width:640px;height:320px;"></div>`;
  }

  getHtmlAfterLoad( ott, glbFileModel, extras = {} ){
    //cl("---------------- extras!");
    //cl(extras);
    t4y.frameNo = 0;
    t4y.ready = false;
    threes = {};

    t4y.extras = {
      'camPos':[1.8033587121116157,0.9660278493757173,0.500080913159443]
    };
    if( Object.keys( extras ).length != 0  ){
      cl("setting extras!");
      cl(extras);
      var k = Object.keys( extras );
      for( var ki=0,kic=k.length; ki<kic; ki++ )
        t4y.extras[ k[ki] ] = extras[ k[ki] ];
    }
    //document.createElement( 'div' );
    //container.with=200;
    //document.body.appendChild( container );

    this.init( glbFileModel );
    t4y.ready = true;

  }

  init( glbFileModel ){

    const container = document.getElementById('otThreeLogo');
    var THREE = ott['THREE'];
    var RGBELoader = ott['RGBELoader'];
    var GLTFLoader = ott['GLTFLoader'];
    var OrbitControls = ott['OrbitControls'];

    otcam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 200 );
    var ecp = t4y.extras['camPos'];
    var ecr = t4y.extras['camRot'];
    cl("cam pos:");
    cl(ecp);
    cl("rot:");
    cl(ecr);
    //cl(this.camPos);
    otcam.position.set( ecp[0], ecp[1], ecp[2] );
    if( ecr && ecr.length == 3 )
      otcam.rotation.set( ecr[0], ecr[1], ecr[2] );




    otsce = new THREE.Scene();

    cl("----- loading hdr ");

    var rgbe = new RGBELoader().setPath( '' );
    rgbe.load( './s_threeTestPage_hdr_quarry_01_1k.hdr', function ( texture ) {
        cl("-- from hdr loader ");
        //cl( texture );
        texture.mapping = THREE.EquirectangularReflectionMapping;
        //otsce.background = texture;
        otsce.background = new THREE.Color( {color: "#ffffff"} );
        otsce.environment = texture;
        t4y.renderIt( true );
    } );

    cl("----- loading hdr DONE");

    cl("----- loading glb ");

    const loader = new GLTFLoader().setPath( './' );
    loader.load( glbFileModel, function ( gltf ) {

      cl("--------------- add shadows");
      cl( "objs in scene:" );
      cl(gltf.scene.children.length);

      var c = gltf.scene.children;
      for( var ci=0,cic=c.length; ci<cic; ci++ ){
        cl("obj type: "+c[ci].type+"  name:"+c[ci].name);
        if( c[ci].type == "Mesh"){
          cl("DOING IT");
          c[ci].castShadow = true;
          c[ci].receiveShadow = true;
          t4y.renderIt( true );
        }else if( c[ci].type == "Object3D" ){
          cl("---------- ");
          //cl(c[ci]);
          c[ci].castShadow = true;
          c[ci].receiveShadow = true;
          cl("childrens: "+c[ci].children.length);
          if( c[ci].children.length>0 ){
            for( var si=0,sic=c[ci].children.length; si<sic; si++ ){
              cl("-- children "+c[ci].children[si].name );
              c[ci].children[si].castShadow = true;
              c[ci].children[si].receiveShadow = true;

            }
          }
        }else{
          cl(" NaN action");
        }
      }


      otsce.add( gltf.scene );
      t4y.renderIt( true );
    } );

    cl("----- loading glb DONE ");

    otren = new THREE.WebGLRenderer( { antialias: true } );

    otren.shadowMap.enabled = true;
    otren.shadowMap.type = THREE.PCFSoftShadowMap;
    //otren.shadowMap.type = THREE.PCFShadowMap;

    otren.setPixelRatio( window.devicePixelRatio );
    otren.setSize( window.innerWidth, window.innerHeight );
    //otren.toneMapping = THREE.ACESFilmicToneMapping;
    //otren.toneMappingExposure = 1;
    //otren.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( otren.domElement );


    cl("- extras controls: "+t4y.extras['controls']);
    if( t4y.extras['controls'] == true ){
      const controls = new OrbitControls( otcam, otren.domElement );
      controls.addEventListener( 'change', t4y.renderIt ); // use if there is no animation loop
      controls.minDistance = 0.1;
      controls.maxDistance = 100;
      if( t4y.extras['camRot'] && t4y.extras['camRot'].length == 3 ){
        controls.update();
      }else{
        controls.target.set( 0, 0.1, 0  );
        controls.update();
      }
    }


    var light = new THREE.SpotLight( 0xffffff );
    light.name = "SpotLight";
    if( t4y.extras['lightPos'] && t4y.extras['lightPos'].length == 3 )
      light.position.set( t4y.extras['lightPos'][0], t4y.extras['lightPos'][1], t4y.extras['lightPos'][2] );
    else
      light.position.set( 1.3780305608614594, 0.8400676746683658, 1.3436961748819445 );
		light.target.position.set( 0, 0, 0 );

		light.castShadow = true;
		//light.shadow.camera.near = 1;
		//light.shadow.camera.far = 200;
		//light.shadow.bias = 0.00002;
    light.shadow.bias = -0.000018;
		light.shadow.mapSize.width = 1024*2;
		light.shadow.mapSize.height = 1024*2;

		otsce.add( light );



    window.addEventListener( 'resize', this.onWindowResize );


    t4y.lastRender = new Date().getTime();
  //setTimeout( doAni, 1000 );
    cl('-------- three TEST PAGE ----------------');

  }


 onWindowResize() {




    otcam.aspect = window.innerWidth / window.innerHeight;
    otcam.updateProjectionMatrix();

    otren.setSize( window.innerWidth, window.innerHeight );

    t4y.renderIt();

  }
  animate(){
      requestAnimationFrame( this.animate );
      t4y.render();
  }

  mixer = 0;



  lastRender = 0;
  loadRender = 0;
  maxFps = 30;

  willRender(){
    var tn = new Date().getTime();
    //var maxFps = 30;
    if( t4y.lastRender+(1000/t4y.maxFps) > tn  ){
      return 0;
    }
    return tn;
  }

  renderIt( force=false ) {
    //cl("call renderIt!");
    var tn = t4y.willRender();
    if( force == true ){
      cl("renderIt forced!");
    }else{
      if( tn == 0 )
        return 0;
    }

    if( ( t4y.frameNo % (t4y.maxFps*2) ) == 0 ){
      var loadRend = Math.round((t4y.maxFps*(tn-t4y.loadRender))/100,3);
      cl("loadRender: "+loadRend+"% load at "+
        "fps: "+t4y.maxFps+
        " will addjust fps if needed.");

      if( loadRend > 20 )
        t4y.maxFps*=0.5;
      else if( loadRend > 18 )
        t4y.maxFps--;
      else if( loadRend < 10 )
        t4y.maxFps++;

      t4y.maxFps = Math.round( t4y.maxFps );

      if( t4y.maxFps < 5 )
        t4y.maxFps = 5;

    }

    t4y.lastRender = tn;

    if( t4y.extras['camDeb'] ){ // cam position
      var c = otcam.position;
      var cr = otcam.rotation;
      cl( "c: "+c.x+", "+c.y+", "+c.z );
      cl( "cr: "+cr.x+", "+cr.y+", "+cr.z );

    }

    if( t4y.mixer != 0 ){
      //cl("mixe is --------");
      //cl(t4y.mixer);
      t4y.mixer.update();

    }

    otren.render( otsce, otcam );
    t4y.frameNo++;
    t4y.loadRender = new Date().getTime();

    //cl("renderIt frame: ["+t4y.frameNo+"] ready:["+t4y.ready+"]");
  }


  doAni( itd, whatToDo ){
    //cl("whatToDo");
    //cl(whatToDo);
    //cl("itd----");
    //cl(itd);
    if( t4y.ready == false || itd == undefined )
      return 0;

    //cl("looking for aInst...");
    if( $( itd ).attr('aInst') != undefined ){
      $( itd ).attr('aInst').stop();
      $( itd ).removeAttr('aInst');
    }
    //$( itd ).stop();
    //cl( $( itd) );

		var aInst = $( itd ).animate( whatToDo, {
      duration: 2000,
      specialEasing: {
        width: "swing"
      },
      start: function( animation ){
        //cl("animation start -----------");
        //cl( animation );
      },

      done: function( ani, jump ){
        //cl("animation done -----------");
        //cl( ani );
        $( ani['elem'] ).removeAttr('aInst');
      },

      step: function ( now, fx ){
        //cl(fx['start']+"   "+fx['now']+"     "+fx['end']);


        if( fx['ot'] == undefined ){
          fx['ot'] = 1;
          var hPi = Math.PI*5;

          if( fx['prop'].substring(0,6) == "rotate" ){
            if( (fx['end']-fx['start']) > hPi ){
              fx['end']-=hPi*2;
            } else if( (fx['end']-fx['start']) < -hPi ){
              fx['end']+=hPi*2;
              //cl(fx);
            }
          }else if( fx['prop'].substring(0,8) == "position" ){

          }
        }


				var prop = ""+this['name']+""+fx['prop'];
        //var ic = otsce.getObjectByName( fx['elem']['userData']['name'] );
        var ic = fx['elem'];

        if( ic == undefined )
          return 0;


        //ts = toRad(ts*10);
        //cl(fx);
				switch( fx['prop'] ){
          case 'positionX':
            var ts = mMapVal( now, 0, fx['end'], ic.position.x, fx['end'] );
            //cl("pos:"+ts);
  					ic.position.set( ts, ic.position.y, ic.position.z );
            break;
          case 'rotateX':
            var ts = ic.rotation.x-now;
  					ic.rotation.set( toRad(ts*10), ic.rotation.y, ic.rotation.z );
            break;
          case 'rotateY':
            var ts = ic.rotation.y-now;
            //cl("ts:"+ts+" icry:"+ic.rotation.y+" now:"+now+" prop:"+threes[ prop ]);
  					ic.rotation.set( ic.rotation.x, toRad(ts*10), ic.rotation.z );
            break;
          case 'rotateZ':
            var ts = ic.rotation.z-now;

  					ic.rotation.set( ic.rotation.x, ic.rotation.y, toRad(ts*10) );
            break;
          default:
            cl("not implemented :( 99889");
            return 0;
        }
        t4y.renderIt();


			}}
		 );

    //$( itd ).

    $( aInst ).attr('aInst', aInst);
		t4y.renderIt();

	}



}
