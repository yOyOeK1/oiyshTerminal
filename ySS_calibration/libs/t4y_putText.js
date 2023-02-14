import * as THREE from "three";
import { FontLoader } from "FontLoader";

/**
 * Three.js for yss - put text
 * is accessable by t4y global object. It's a instance of it to use.
 */
class T4y_putText{

  bindToCam=0;
  oldCamPos = null;
  t2w = [];
  osdUpdate = [];

  constructor( fromw ){
    cl("T4y_putText constructor. fromw["+fromw+"]");
  }


  putText_init(){
    t4y.t2w = [];
  }

  getDiffReferenceStr(){
    return t4y.getOtCam.position.x+","+t4y.getOtCam.position.y+","+t4y.getOtCam.position.z+
      ","+window.innerHeight/window.innerWidth;
  }

  textOsdUpdate(){
    //cl(" t4y - > textOsdUpdate");
    //cl(t4y.getOtCam);
    //cl("text 2 work count:"+t4y.t2w.length);
    if( t4y.oldCamPos == null ){
      t4y.oldCamPos = t4y.getDiffReferenceStr();

    }else if( t4y.oldCamPos == t4y.getDiffReferenceStr() ){
      //cl("textUpdate skipp...");
      return 0;
    }else{
      //cl("textUpdate doing..... only position");
      t4y.oldCamPos = t4y.getDiffReferenceStr();

      for( var t=0,tc=t4y.t2w.length; t<tc; t++ ){
        //cl("updating position of text "+t);
        //t4y.t2w[t].applyMatrix4(t4y.getOtCam.matrixWorld );
        t4y.osdTextPosition( t4y.t2w[t] );

      }
    }
  }



  osdTextPosition( obj ){
    if( obj == undefined || obj['args'] == undefined )
      return 0;

    var args = obj['args'];
    var otCam = t4y.getOtCam;
    otCam.updateMatrixWorld();

    obj.position.set(0,0,0);
    obj.rotation.set(0,0,0);
    if( otCam.parent == null ){
      obj.applyMatrix4(otCam.matrixWorld );
    }//else
    //obj.updateMatrix();
  //  else
    //  text.applyMatrix4(t4y.getOtCam.parent.matrixWorld );
    var asp =  window.innerHeight/window.innerWidth;
    var fovS = ( 35.00 / otCam.fov );
    var fac = 1.0;
    var tx = (args['x'] != null ? args['x'] : 0 );
    var ty = (args['y'] != null ? args['y'] : 0 );
    var ms = 0.31;
    tx = mMapVal( tx, 0.0, 1.0, -ms/asp, ms/asp );
    ty = mMapVal( ty, 0.0, 1.0, -ms, ms );


    //cl("asp:"+asp+" fovS:"+fovS+" tx:"+tx+" ty:"+ty+" asp/fovS:"+(fovS/asp));
    var fact = fovS/asp*0.6;
    obj.translateX( tx );
    obj.translateY( ty );
    obj.translateZ( -fovS );

    var axis;
    if( args['rx'] != undefined ){
      axis = new THREE.Vector3( 1, 0, 0 );
      obj.rotateOnAxis( axis, -toRad( args['rx'] != undefined ? args['rx'] : 0 ) );
    };
    if( args['ry'] != undefined ){
      axis = new THREE.Vector3( 0, 1, 0 );
      obj.rotateOnAxis( axis, -toRad( args['ry'] != undefined ? args['ry'] : 0 ) );
    };
    if( args['rz'] != undefined ){
      axis = new THREE.Vector3( 0, 0, 1 );
      obj.rotateOnAxis( axis, -toRad( args['rz'] != undefined ? args['rz'] : 0 ) );
    };



    //obj.updateMatrix();

  }


 textChkIfOnlyMove( argNow, argsOld ){
   //cl("text checking if move only .... ")
   //cl("argNow");
   //cl(argNow);
   //cl("argsOld");
   //cl(argsOld);

    if( argsOld == undefined )
      return false;

    if( argNow['name'] != argsOld['name'] )
      return false;

    if( argNow['msgToDo'] != argsOld['msgToDo'] )
      return false;

    if( argNow['OSD'] != argsOld['OSD'] )
      return false;

    if( argNow['color'] != argsOld['color'] )
      return false;


    return true;
 }

  textChkIfNotSkipSomething( args ){
    //cl("text checking if not skip something...."+args['name']);
    //cl("looking for args");
    //cl(args);
    for( var t=0,tc=t4y.t2w.length; t<tc; t++ ){
      //cl("have ");
      //cl(t4y.t2w[t]);
      if( JSON.stringify(t4y.t2w[t]['args']) == JSON.stringify(args) ){
          //cl(" t "+t+" is simmilar / same then chicking...");
          return 'skip';
      }else if( args['OSD'] == true && t4y.textChkIfOnlyMove( args, t4y.t2w[t]['args'] ) ){
        return 'move Only';
      }
    }
    return 0;
  }

  /**
   * methode to put text on screen
   * @param {string} msg - The msg to put
   * @param {json} args - The arguments
   * example:
   {
   * name :"HDGText", - name of object in scren
       color: 0xf0a32a,
       size: 5,
       replace: "HDGText",
       handle: 'cb',
       x:-20,
       y:2,
       z: -43,
       ry:-20,
       extrude: .5
   }
   *
   */
  putText( msg, args = {}){
    args['msgToDo'] = msg;
    pager.myCallCheet().then( t4y.putTextInThene1( msg, args ) );
  }

  putTextInThene1( msg, args ){
    switch( t4y.textChkIfNotSkipSomething( args ) ){
      case 'skip':
        //cl("fast skip same..");
        return 0;
        break;
      case 'move Only':
        cl("fast skip move Only..");
        t4y.osdTextPosition( t4y.otsce.getObjectByName(args['name']) );
        return 0;
        break;
      default:
        //cl(" checker return NaN");
        "nothing to do";
        pager.myCallCheet().then( t4y.putTextInThene2( msg, args ) );
    };

  }

  putTextInThene2( msg, args = {} ){
  const loader = new FontLoader();
  loader.load( 'three/fonts/helvetiker_regular.typeface.json', function ( font ) {
    var asp =  window.innerHeight/window.innerWidth;
    const color = new THREE.Color( args['color'] != undefined ? args['color'] : 0x006699 );
    const matDark = new THREE.MeshBasicMaterial( {
      color: color,
      side: args['OSD'] == true ? THREE.FrontSide : THREE.DoubleSide
    } );
    const matLite = new THREE.MeshBasicMaterial( {
      color: color,
      //transparent: true,
      //opacity: 0.9,
      side: args['OSD'] == true ? THREE.FrontSide : THREE.DoubleSide
    } );
    var size = args['size'] !=undefined ? args['size'] : 20;
    size*= ( args['OSD']==true ? 0.1 : 1 );
    const shapes = font.generateShapes( msg, size );
    var geometry;
    pager.myCallCheet().then(()=>{
      if( 0 && args['extrude'] != undefined && args['OSD'] != true ){
        const extrudeSettings = args['extrudeArgs'] != undefined ? args['extrudeArgs'] : {
          steps: 1,
          depth: args['extrude'] * ( args['OSD']==true ? 0.01 : 1 ),
          bevelEnabled: false,
          //bevelThickness: 1,
          //bevelSize: 0,
          //bevelOffset: 0,
          //bevelSegments: 0
        };
        geometry = new THREE.ExtrudeGeometry( shapes, extrudeSettings );
        }else{
        geometry = new THREE.ShapeGeometry( shapes );
      }

      geometry.computeBoundingBox();
      var sW = ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
      var sH = ( geometry.boundingBox.max.y - geometry.boundingBox.min.y );
      if( args['handle'] != undefined && (args['handle'] == "cb" || args['handle'] == "" )   ){
        const xMid = - 0.5 * sW;
        geometry.translate( xMid, 0, 0 );
      }else if( args['handle'] != undefined && args['handle'] == "rb" ){
        geometry.translate( -sW, sH-size, 0 );
      }else if( args['handle'] != undefined && args['handle'] == "lt" ){
        geometry.translate( 0, -size, 0 );
      }else if( args['handle'] != undefined && args['handle'] == "lb" ){
        geometry.translate( 0, sH-size, 0 );
      }else if( args['handle'] != undefined && args['handle'] == "rt" ){
        geometry.translate( -sW, -size, 0 );
      }

      // make shape ( N.B. edge view not visible )
      const text = new THREE.Mesh( geometry, matLite );
      text.name = args['name'] != undefined ? args['name'] : "text4del";
      if( args['OSD'] == true ){
        text.castShadow = false;
        text.receiveShadow = false;
      }else{
        text.castShadow = true;
        text.receiveShadow = true;
      }
      var old = t4y.otsce.getObjectByName(args['replace']);
      if( args['replace'] != undefined ){
        t4y.otsce.remove( old );
      }


      // cleaning old text 2 work
      //cl("--- looking for one to romeve");
      //cl( old );
      var fi = t4y.t2w.indexOf( old );
      //cl("found in stack? "+fi);
      if( fi != -1 ){
        //cl("remove it");
        t4y.t2w = t4y.removeElementFromArray( t4y.t2w, fi );
      }else{
        //cl("not found :( ["+old+"]");
      }


      if( args['OSD'] == true ){
        t4y.getOtCam.remove( old );
        if( t4y.getOtCam.parent != null )
          t4y.getOtCam.add( text );
        else
          t4y.otsce.add( text );
        t4y.t2w.push( text );
        $( text ).attr('args',args);

        t4y.osdTextPosition( text );

        // -2 for cam from glb
        //text.updateMatrix();
        //cl("text");
        //cl(text);
        //cl("text.position");
        //cl(text.position);

      }else{

        t4y.otsce.add( text );
        t4y.t2w.push( text );
        text.position.x = args['x'] ? args['x'] : 0;
        text.position.y = args['y'] ? args['y'] : 0;
        text.position.z = args['z'] ? args['z'] : 0;
        if( args['rx'] != undefined ) text.rotation.x+= toRad( -args['rx'] );
        if( args['ry'] != undefined ) text.rotation.y+= toRad( -args['ry'] );
        if( args['rz'] != undefined ) text.rotation.z+= toRad( -args['rz'] );
      }


      // make line shape ( N.B. edge view remains visible )
      const holeShapes = [];
      for ( let i = 0; i < shapes.length; i ++ ) {
        const shape = shapes[ i ];
        if ( shape.holes && shape.holes.length > 0 ) {
          for ( let j = 0,jc=shape.holes.length; j < jc; j ++ ) {
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
      //t4y.renderIt();
      pager.subTask( ()=>{ t4y.setDelaydRender("putText request"); });
      });
      //return text;

    } ); //end load function

  }
}


export { T4y_putText };
