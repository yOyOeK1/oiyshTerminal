

console.log("---- start import ");
import * as THREE from "three";
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { RGBELoader } from 'RGBELoader';
import { FontLoader } from "FontLoader";
import { SVGLoader } from "SVGLoader";
import { EffectComposer } from "EffectComposer";
import { RenderPass } from "RenderPass";
import { GlitchPass } from 'GlitchPass';
import { ShaderPass } from 'ShaderPass';
import { OutlinePass } from "OutlinePass";


class Three4Yss{

  extras = {};
  frameNo = 0;
  ready = false;
  mixer = 0;
  mixers = [];
  clock;
  aniDutation = 0.5;
  isRunLast = false;
  animationIsRunning = false;


  constructor(){
    cl("Three4Yss constructor");
    cl("t4y :");
    cl(t4y);
    this.clock = new THREE.Clock();
    this.otren=null;
    this.otcam=null;
    this.otcom=null;
    this.otsce=null;
    this.isRunLast=false;
    this.animationIsRunning=false;
  }


  getHtml(){
    return `<div id="otThreeLogo" style="z-index:2;position:absolute;top:0;left:0;"></div>


    `;
  }

  shaderStack = [];
  DotScreenShader;
  RedShader;
  InvertShader;

  redEffect;
  invertEffect;
  redInvertEffect;
  subPixel = 1;



  putText( msg, args = {} ){
    // color - 0xffaacc;
    // size - 20
    // name - of object to call later
    // replace - name of object to swap with
    // x y z - position of text hendler
    // rx ry rz - rotate
    // handle - def center bottom
    //  option [cb|lb|lt]
    const loader = new FontLoader();
    loader.load( 'three/fonts/helvetiker_regular.typeface.json', function ( font ) {
  		const color = new THREE.Color( args['color'] != undefined ? args['color'] : 0x006699 );
  		const matDark = new THREE.MeshBasicMaterial( {
  			color: color,
  			side: THREE.DoubleSide
  		} );
  		const matLite = new THREE.MeshBasicMaterial( {
  			color: color,
  			transparent: true,
  			opacity: 0.9,
  			side: THREE.DoubleSide
  		} );
			const message = msg;
			const shapes = font.generateShapes( message, args['size'] !=undefined ? args['size'] : 20 );
      if( args['extrude'] != undefined ){
        const extrudeSettings = args['extrudeArgs'] != undefined ? args['extrudeArgs'] : {
        	steps: 2,
        	depth: args['extrude'],
        	bevelEnabled: true,
        	bevelThickness: 1,
        	bevelSize: 0,
        	bevelOffset: 0,
        	bevelSegments: 0
        };
        var geometry = new THREE.ExtrudeGeometry( shapes, extrudeSettings );
        }else{
        var geometry = new THREE.ShapeGeometry( shapes );
      }
			geometry.computeBoundingBox();
      if( args['handle'] != undefined && (args['handle'] == "cb" || args['handle'] == "" )   ){
  			const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  			geometry.translate( xMid, 0, 0 );
      }else if( args['handle'] != undefined && args['handle'] == "lb" ){
        //const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  			geometry.translate( 0, 0, 0 );
      }else if( args['handle'] != undefined && args['handle'] == "lt" ){
        //const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  			geometry.translate( 0, args['size'] !=undefined ? -args['size'] : -20, 0 );
      }
      // make shape ( N.B. edge view not visible )
			const text = new THREE.Mesh( geometry, matLite );

      text.name = args['name'] != undefined ? args['name'] : "text4del";
      text.castShadow = true;
      text.receiveShadow = true;
      text.position.x = args['x'] ? args['x'] : 0;
      text.position.y = args['y'] ? args['y'] : 0;
			text.position.z = args['z'] ? args['z'] : 0;
      if( args['rx'] != undefined ) text.rotation.x+= toRad( -args['rx'] );
      if( args['ry'] != undefined ) text.rotation.y+= toRad( -args['ry'] );
      if( args['rz'] != undefined ) text.rotation.z+= toRad( -args['rz'] );
      if( args['replace'] != undefined ){
        var old = t4y.otsce.getObjectByName(args['replace']);
        t4y.otsce.remove( old );
      }
	    t4y.otsce.add( text );
      // make line shape ( N.B. edge view remains visible )
			const holeShapes = [];
			for ( let i = 0; i < shapes.length; i ++ ) {
    		const shape = shapes[ i ];
    		if ( shape.holes && shape.holes.length > 0 ) {
					for ( let j = 0; j < shape.holes.length; j ++ ) {
							const hole = shape.holes[ j ];
							holeShapes.push( hole );
					}
				}
			}

      /*
			shapes.push.apply( shapes, holeShapes );
		  const style = SVGLoader.getStrokeStyle( 5, color.getStyle() );
			const strokeText = new THREE.Group();
			for ( let i = 0; i < shapes.length; i ++ ) {
				const shape = shapes[ i ];
				const points = shape.getPoints();
				const geometry = SVGLoader.pointsToStroke( points, style );
				geometry.translate( xMid, 20, 0 );
				const strokeMesh = new THREE.Mesh( geometry, matDark );
				strokeText.add( strokeMesh );
			}
			t4y.otsce.add( strokeText );
      */
			t4y.renderIt();
		} ); //end load function


  }


  getHtmlAfterLoad( ott, glbFileModel, extras = {} ){
    //cl("---------------- extras!");
    //cl(extras);

    if( window.innerWidth > 500 )
      this.subPixel = 2;
    if( window.innerWidth >= 600 )
      this.subPixel = 4;
    cl("subpixel set to :"+this.subPixel+" wi:"+window.innerWidth);

    this.frameNo = 0;
    this.ready = false;


    this.RedShader = {
      vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }`,
      fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 rgb = texture2D( tDiffuse, vUv );
        float c = (rgb[0]+rgb[1]+rgb[2])/3.0;
        gl_FragColor = vec4( c, rgb[1]*0.1, rgb[2]*0.1, rgb[3] );
      }`
    };
    this.RedInvertShader = {
      vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }`,
      fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 rgb = texture2D( tDiffuse, vUv );
        float m = float(1.0);
        vec4 inv = vec4( m-rgb[0], m-rgb[1], m-rgb[2], rgb[3] );
        float c = inv[0];
        gl_FragColor = vec4( c, inv[1]*0.1, inv[2]*0.1, inv[3] );
      }`
    };
    this.InvertShader = {
      vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }`,
      fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 rgb = texture2D( tDiffuse, vUv );
        float m = float(1.0);
        gl_FragColor = vec4( m-rgb[0], m-rgb[1], m-rgb[2], rgb[3] );
      }`
    };

    this.DotScreenShader = {
    	uniforms: {
    		'tDiffuse': { value: null },
    		'tSize': { value: new THREE.Vector2( 256, 256 ) },
    		'center': { value: new THREE.Vector2( 0.5, 0.5 ) },
    		'angle': { value: 1.57 },
    		'scale': { value: 1.0 }
    	},
    	vertexShader: /* glsl */`
    		varying vec2 vUv;
    		void main() {
    			vUv = uv;
    			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    		}`,

    	fragmentShader: /* glsl */`
    		uniform vec2 center;
    		uniform float angle;
    		uniform float scale;
    		uniform vec2 tSize;
    		uniform sampler2D tDiffuse;
    		varying vec2 vUv;
    		float pattern() {
    			float s = sin( angle ), c = cos( angle );
    			vec2 tex = vUv * tSize - center;
    			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;
    			return ( sin( point.x ) * sin( point.y ) ) * 4.0;
    		}
    		void main() {
    			vec4 color = texture2D( tDiffuse, vUv );
    			float average = ( color.r + color.g + color.b ) / 3.0;
    			gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );
    		}`
    };


    this.extras = {
      'camPos':[1.8033587121116157,0.9660278493757173,0.500080913159443]
    };
    if( Object.keys( extras ).length != 0  ){
      cl("setting extras!");
      cl(extras);
      var k = Object.keys( extras );
      for( var ki=0,kic=k.length; ki<kic; ki++ )
        this.extras[ k[ki] ] = extras[ k[ki] ];
    }
    //document.createElement( 'div' );
    //container.with=200;
    //document.body.appendChild( container );

    this.init( glbFileModel );
    this.animate();
    this.ready = true;

  }
  postScene;
  postMaterial;

  init( glbFileModel ){

    const container = document.getElementById('otThreeLogo');

    this.otcam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 1000 );



    var ecp = this.extras['camPos'];
    var ecr = this.extras['camRot'];
    //cl("cam pos:");
    //cl(ecp);
    //cl("rot:");
    //cl(ecr);
    //cl(this.otcam);
    this.otcam.position.set( ecp[0], ecp[1], ecp[2] );
    if( ecr && ecr.length == 3 )
      this.otcam.rotation.set( ecr[0], ecr[1], ecr[2] );





    this.otsce = new THREE.Scene();

    cl("----- loading hdr ");

    var rgbe = new RGBELoader().setPath( '' );
    rgbe.load( './s_threeTestPage_hdr_quarry_01_1k.hdr', function ( texture ) {
        cl("-- from hdr loader ");
        //cl( texture );
        texture.mapping = THREE.EquirectangularReflectionMapping;
        //texture.mapping = this.postMaterial;
        //otsce.background = texture;
        t4y.otsce.background = new THREE.Color( {color: "#ffffff"} );
        t4y.otsce.environment = texture;
        t4y.renderIt( true );
    } );

    cl("----- loading hdr DONE");

    cl("----- loading glb ");

    const loader = new GLTFLoader().setPath( './' );

    loader.load( glbFileModel, function ( gltf ) {

      //cl("--------------- add shadows");
      //cl( "objs in scene:" );
      //cl(gltf.scene.children.length);

      var c = gltf.scene.children;
      for( var ci=0,cic=c.length; ci<cic; ci++ ){
        //cl("obj type: "+c[ci].type+"  name:"+c[ci].name);
        if( c[ci].type == "Mesh"){
          //cl("DOING IT");
          c[ci].castShadow = true;
          c[ci].receiveShadow = true;
          //t4y.renderIt( true );
        }else if( c[ci].type == "Object3D" ){
          //cl("---------- ");
          //cl(c[ci]);
          c[ci].castShadow = true;
          c[ci].receiveShadow = true;
          //cl("childrens: "+c[ci].children.length);
          if( c[ci].children.length>0 ){
            for( var si=0,sic=c[ci].children.length; si<sic; si++ ){
              //cl("-- children "+c[ci].children[si].name );
              c[ci].children[si].castShadow = true;
              c[ci].children[si].receiveShadow = true;

            }
          }
        }else{
          cl(" NaN action");
        }
      }


      t4y.otsce.add( gltf.scene );
      t4y.renderIt( true );
    } );

    cl("----- loading glb DONE ");




    this.mixer = new THREE.AnimationMixer( otsce );


    this.otren = new THREE.WebGLRenderer( { antialias: true } );

    this.otren.shadowMap.enabled = true;
    this.otren.shadowMap.type = THREE.PCFSoftShadowMap;
    //this.otren.shadowMap.type = THREE.PCFShadowMap;

    this.otren.setPixelRatio( window.devicePixelRatio );
    this.otren.setSize( window.innerWidth/this.subPixel, window.innerHeight/this.subPixel );
    //this.otren.toneMapping = THREE.ACESFilmicToneMapping;
    //this.otren.toneMappingExposure = 1;
    //this.otren.outputEncoding = THREE.sRGBEncoding;
    var dre = this.otren.domElement;
    $(dre).attr('style',"width:100vw;height:100vh;");
    container.appendChild( this.otren.domElement );


    cl("- extras controls: "+this.extras['controls']);
    if( this.extras['controls'] == true ){
      const controls = new OrbitControls( t4y.otcam, dre );
      controls.addEventListener( 'change', t4y.renderIt ); // use if there is no animation loop
      controls.minDistance = 0.1;
      controls.maxDistance = 200;
      if( this.extras['camRot'] && this.extras['camRot'].length == 3 ){
        controls.update();
      }else{
        controls.target.set( 0, 0.1, 0  );
        controls.update();
      }
    }


    var light = new THREE.SpotLight( 0xffffff );
    light.name = "SpotLight";
    if( this.extras['lightPos'] && this.extras['lightPos'].length == 3 )
      light.position.set( this.extras['lightPos'][0], this.extras['lightPos'][1], this.extras['lightPos'][2] );
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

		this.otsce.add( light );




    this.otcom = new EffectComposer( this.otren );
		this.otcom.addPass( new RenderPass( this.otsce, this.otcam ) );

    var effect1 = new ShaderPass( this.DotScreenShader );
    effect1['yssName'] = 'effect1';
    effect1.uniforms[ 'scale' ].value = 1;
    this.otcom.addPass( effect1 );


    this.redEffect = new ShaderPass( this.RedShader );
    this.redEffect['yssName'] = 'red';
    this.redEffect.enabled = false;
    this.otcom.addPass( this.redEffect );

    this.invertEffect = new ShaderPass( this.InvertShader );
    this.invertEffect['yssName'] = 'invert';
    this.invertEffect.enabled = false;
    this.otcom.addPass( this.invertEffect );

    this.redInvertEffect = new ShaderPass( this.RedInvertShader );
    this.redInvertEffect['yssName'] = 'redInvert';
    this.redInvertEffect.enabled = false;
    this.otcom.addPass( this.redInvertEffect );





    window.addEventListener( 'resize', this.onWindowResize );

    window.addEventListener( 'resize', this.fitCanvasToScreenDelay );


    this.lastRender = new Date().getTime();
    setTimeout( t4y.animate, 200 );
    cl('-------- three TEST PAGE ----------------');

  }


fitCanvasToScreenDelay(){
  setTimeout( t4y.fitCanvasToScreen, 200 );
}

fitCanvasToScreen(){
  //cl("-----ot three logo --");
  //cl($("#otThreeLogo"));
  //cl("c:")
  var c = $("#otThreeLogo").children()[0];
  //cl(c);
  //$(c).attr("width", "100vw");
  //$(c).attr("height", "100vh");
  $(c).attr('style',"width:100vw;height:100vh;");
}

 onWindowResize() {
    t4y.otcam.aspect = window.innerWidth / window.innerHeight;
    t4y.otcam.updateProjectionMatrix();

    t4y.otcom.aspect = t4y.otcam.aspect;
    var di = t4y.subPixel;
    //this.otcom.setSize( window.innerWidth, window.innerHeight );

    t4y.otren.setSize( window.innerWidth/di, window.innerHeight/di );



    t4y.renderIt();


  }






  lastRender = 0;
  loadRender = 0;
  maxFps = 30;

  willRender(){
    var tn = new Date().getTime();
    //var maxFps = 30;
    if( this.lastRender+(1000/this.maxFps) > tn  ){
      return 0;
    }
    return tn;
  }

  shaderLocalClean(){
    cl(this.redEffect);
    if( this.redEffect == undefined )
      return 0;
    this.redEffect.enabled = false;
    this.redInvertEffect.enabled = false;
    this.invertEffect.enabled = false;

  }

  removeElementFromArray( arr, index ){
    for( var i = 0; i < arr.length; i++){
        if ( i === index) {
            arr.splice(i, 1);
        }
    }
    return arr;
  }

  shaderAction( action ){
    if( otcom == undefined ){
      return 0;
    }

    this.shaderLocalClean();

    switch (action) {
      case "normal":
        this.shaderLocalClean();
        this.shaderStack = [];
        break;
      case "invert":
        if( this.shaderStack.indexOf('invert') != -1 ){
          this.removeElementFromArray( this.shaderStack, this.shaderStack.indexOf('invert') );
        }else{
          this.shaderStack.push('invert');
        }
        break;
      case "blackRed":
        if( this.shaderStack.indexOf('red') != -1 ){
          this.removeElementFromArray( this.shaderStack, this.shaderStack.indexOf('red') );
        }else{
          this.shaderStack.push('red');
        }
        break;
      default:
        cl(" no action");
    };

    var s = this.shaderStack;


    if(
      s.indexOf('invert') != -1 &&
      s.indexOf('red') == -1
    ){
      this.invertEffect.enabled = true;
    }else if(
      s.indexOf('invert') == -1 &&
      s.indexOf('red') != -1
    ){
      this.redEffect.enabled = true;
    }else if(
      s.indexOf('invert') != -1 &&
      s.indexOf('red') != -1
    ){
      this.redInvertEffect.enabled = true;
    }



    t4y.renderIt();
    cl("---------t4y shaderStack is :");
    cl(this.shaderStack);

  }


  animate(){
      t4y.animationIsRunning = true;
      //cl("animate....");
      //cl(t4y.animete);

      //cl("mixer");
      //cl(t4y.mixer);

      if( t4y.mixers.length > 0 ){
        for( var mi=0; mi<t4y.mixers.length; mi++ ){
          //cl("mixer "+mi);
          //cl(t4y.mixers[mi]);
          if(
              t4y.mixers[ mi ]._actions &&
              t4y.mixers[ mi ]._actions[0].isRunning() == false
            ){
            //cl( "mixer ["+mi+"] not running...");
            t4y.mixers = t4y.removeElementFromArray( t4y.mixers, mi );
          }
        }
      }else{
        t4y.animationIsRunning = false;
        return 0;
      }

      requestAnimationFrame( t4y.animate );
      t4y.renderIt();
  }

  renderIt( force=false ) {
    //cl("call renderIt!");
    //cl("renderIt");
    //cl("t4y.otcom");
    //cl(t4y.otcom);
    if( t4y.otcom == undefined )
      return 0;


    var tn = t4y.willRender();
    if( force == true ){
      cl("renderIt forced!");
    }else{
      if( tn == 0 )
        return 0;
    }


    const delta = t4y.clock.getDelta();
    //t4y.clock = new THREE.Clock();
    if( t4y.mixers.length > 0 ){
      t4y.mixer.update( delta );
      for( var mi=0,mic=t4y.mixers.length; mi<mic; mi++ ){
        t4y.mixers[ mi ].update( delta );
      }

      if( t4y.animationIsRunning == false ){
        t4y.animate();
        return 0;
      }

    }
      /*
      if( t4y.isRunLast == false ){
        if( t4y.mixer._actions[0] ){
          if( t4y.mixer._actions[0].isRunning() ){
              t4y.animate();
          }
        }
      }
      */



    if( t4y.extras['camDeb'] ){ // cam position
      var c = otcam.position;
      var cr = otcam.rotation;
      cl( "c: "+c.x+", "+c.y+", "+c.z );
      cl( "cr: "+cr.x+", "+cr.y+", "+cr.z );

    }



    if( 0 )
      t4y.otcom.render();
    else{
      if( t4y.frameNo > 2 && t4y.shaderStack.length > 0 )
        t4y.otcom.render();
      else
        t4y.otren.render( t4y.otsce, t4y.otcam );
    }

    t4y.frameNo++;

    //cl("renderIt frame: ["+t4y.frameNo+"] ready:["+t4y.ready+"]");

    t4y.lastRender = new Date().getTime();
    //cl("fNo:"+t4y.frameNo+" maxFps:"+t4y.maxFps);
    if( ( t4y.frameNo % (t4y.maxFps*1) ) == 0 ){
      var frameIn = (t4y.lastRender-tn)*1.2;
      var loadRend =  (t4y.maxFps*frameIn)/10 ;
      t4y.loadRender = t4y.loadRender*0.7+loadRend*0.3;
      cl("load now: "+Math.round(loadRend)+"% "+
        "fps: "+t4y.maxFps+
        " avg:"+Math.round(t4y.loadRender,3)+"%");

      if( t4y.loadRender > 30.0 )
        t4y.maxFps*=0.7;
      else if( t4y.loadRender > 25.0 )
        t4y.maxFps--;
      else if( t4y.loadRender < 12.0 )
        t4y.maxFps++;

      t4y.maxFps = Math.round( t4y.maxFps );


      if( t4y.maxFps < 5.0 ){
        t4y.maxFps = 5;
        t4y.subPixel*=2;
      }
      if( t4y.maxFps > 60 )
        t4y.maxFps = 60;


    }

  }



  aniOncePosition(obj, action='x',val=0){
    var icp = obj.position;
    const times = [0,this.aniDutation];
    const values = [ icp.x, icp.y, icp.z ];
    if( action == 'x' ){ values.push( val ); values.push( icp.y ); values.push( icp.z ); };
    if( action == 'y' ){ values.push( icp.x ); values.push( val ); values.push( icp.z ); };
    if( action == 'z' ){ values.push( icp.x ); values.push( icp.y ); values.push( val ); };
    const positionKF = new THREE.VectorKeyframeTrack(".position", times, values);
    const tracks = [positionKF];
    const clip = new THREE.AnimationClip("slowmove", -1, tracks);
    var mixer = new THREE.AnimationMixer( obj );
    var ca = mixer.clipAction(clip);
    ca.setLoop( THREE.LoopOnce );
    ca.clampWhenFinished = true;
    ca.play();

    t4y.mixers.push( mixer );
  }
  aniOnceRotation(obj, action='x',val=0){
    var icr = obj.rotation;
    const times = [0,this.aniDutation];
    var xAxis = 0;
    if( action == 'x' ){ xAxis = new THREE.Vector3( 1, 0, 0 ); };
    if( action == 'y' ){ xAxis = new THREE.Vector3( 0, 1, 0 ); };
    if( action == 'z' ){ xAxis = new THREE.Vector3( 0, 0, 1 ); };
    const qInitial = obj.quaternion;//.setFromAxisAngle( xAxis, 0 );
		const qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, toRad( val ) );
		const quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, this.aniDutation ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w ] );
    const tracks = [quaternionKF];
    const clip = new THREE.AnimationClip("slowmove", -1, tracks);
    var mixer = new THREE.AnimationMixer( obj );
    var ca = mixer.clipAction(clip);
    ca.setLoop( THREE.LoopOnce );
    ca.clampWhenFinished = true;
    ca.play();

    this.mixers.push( mixer );
  }

  doAni( itd, whatToDo ){

    if(1){
      //cl("whatToDo");
      //cl(whatToDo);
      //cl("itd----");
      //cl(itd);
      if( itd == undefined )
        return 0;

      var what = Object.keys( whatToDo )[0];
      switch( what ){
        case 'positionX':
          t4y.aniOncePosition( itd, 'x', whatToDo[what] );
          break;
        case 'positionY':
          t4y.aniOncePosition( itd, 'y', whatToDo[what] );
          break;
        case 'positionZ':
          t4y.aniOncePosition( itd, 'z', whatToDo[what] );
          break;
        case 'rotateX':
          t4y.aniOnceRotation( itd, 'x', whatToDo[what] );
          break;
        case 'rotateY':
          t4y.aniOnceRotation( itd, 'y', whatToDo[what] );
          break;
        case 'rotateZ':
          t4y.aniOnceRotation( itd, 'z', whatToDo[what] );
          break;
        default:
          cl("not implemented :( 99889");
          return 0;
      }

      t4y.renderIt();
      return 0;

    }


	}



}

export { Three4Yss };
