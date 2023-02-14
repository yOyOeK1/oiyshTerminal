import * as THREE from "three";

/**
 * Three.js for yss - animation helper and tasker
 * is accessable by t4y global object. It's a instance of it to use.
 */
class T4y_ani{

  mixer = 0;
  mixers = [];
  aniDutation = 0.3;
  animationIsRunning = false;
  isRunLast = false;


  constructor( fromw ){
    cl("T4y_ani constructor. fromw["+fromw+"]");
    return this;
  }

  init_ani(){
    this.isRunLast=false;
    this.animationIsRunning=false;
    this.mixer = new THREE.AnimationMixer( otsce );
  }

  aniOnceRotation(obj, action='x',val=0){
    var mixerNameKey = 'mix_rot_'+action;
    var axis = 0;
    if( action == 'x' ){ axis = new THREE.Vector3( 1, 0, 0 ); };
    if( action == 'y' ){ axis = new THREE.Vector3( 0, 1, 0 ); };
    if( action == 'z' ){ axis = new THREE.Vector3( 0, 0, 1 ); };
    //cl("matrix auto update "+obj.matrixAutoUpdate);
    //obj.updateMatrix();
    //cl("obj r "+obj.name+"  -->> "+obj.rotation.y);
    //cl("obj r "+obj.name+"  -->> "+obj.rotation.y);
    const qInitial = obj.quaternion;
    const qFinal = new THREE.Quaternion().setFromAxisAngle( axis, toRad( val ) );
    const quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, t4y.aniDutation ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w ] );
    const tracks = [quaternionKF];
    const clip = new THREE.AnimationClip("slowmove", -1, tracks);

    var mixer = undefined;
    if( obj[mixerNameKey] ){
      // loking for clip with this action of object have in arg
      mixer = t4y.mixers.find( mix => {
        if( Array.isArray( mix._actionsByClip ) ){
          return mix._actionsByClip.find( ca => {
            if( String( Object.keys( ca )[0] ) == String( Object.keys( obj[mixerNameKey]._actionsByClip )[0] ) ) {
              //obj[mixerNameKey] = null;
              return [mix, ca];
            }
          });
        }
      });
    }
    //var seek = 0.0;
    //cl("got mixer");
    //cl(mixer);
    if( mixer != undefined ){
      var ca = mixer[1];
      mixer = mixer[0];
      mixer._actionsByClip = t4y.removeElementFromArray( mixer._actionsByClip, mixer._actionsByClip.indexOf( ca )  );
      ca.stop();
      ca = mixer.clipAction( clip );
      //t4y.delta = t4y.clock.getDelta();
      //mixer.update( t4y.delta );
      //seek = 0.8;
      //t4y.delta = t4y.clock.getDelta();
      //mixer.update( t4y.delta );
    }else{
      mixer = new THREE.AnimationMixer( obj );
      var ca = mixer.clipAction(clip);
      t4y.mixers.push( mixer );
    }

    //cl("mix valid?"+clip.validate());
    ca.setLoop( THREE.LoopOnce );
    ca.clampWhenFinished = true;
    ca.play();
    //cl("seek"+seek);
    mixer.setTime(t4y.aniDutation/10);
    //var t4yAni = {'ani': 'rot', action, val};
    //$( mixer ).attr('t4yAni',  t4yAni );
    //$( obj ).attr( 't4yAni', t4yAni );
    obj[mixerNameKey] = mixer;
  }

  aniOncePosition(obj, action='x',val=0){
    var mixerNameKey = 'mix_pos_'+action;
    var icp = obj.position;
    const times = [0,t4y.aniDutation];
    const values = [ icp.x, icp.y, icp.z ];
    if( action == 'x' ){ values.push( val ); values.push( icp.y ); values.push( icp.z ); };
    if( action == 'y' ){ values.push( icp.x ); values.push( val ); values.push( icp.z ); };
    if( action == 'z' ){ values.push( icp.x ); values.push( icp.y ); values.push( val ); };
    const positionKF = new THREE.VectorKeyframeTrack(".position", times, values);
    const tracks = [positionKF];
    const clip = new THREE.AnimationClip("slowmove", -1, tracks);

    var mixer = undefined;
    if( obj[mixerNameKey] ){
      // loking for clip with this action of object have in arg
      mixer = t4y.mixers.find( mix => {
        if( Array.isArray( mix._actionsByClip ) ){
          return mix._actionsByClip.find( ca => {
            if( String( Object.keys( ca )[0] ) == String( Object.keys( obj[mixerNameKey]._actionsByClip )[0] ) ) {
              //obj[mixerNameKey] = null;
              return [mix, ca];
            }
          });
        }
      });
    }
    //var seek = 0.0;
    //cl("got mixer");
    //cl(mixer);
    if( mixer != undefined ){
      var ca = mixer[1];
      mixer = mixer[0];
      mixer._actionsByClip = t4y.removeElementFromArray( mixer._actionsByClip, mixer._actionsByClip.indexOf( ca )  );
      ca.stop();
      ca = mixer.clipAction( clip );
      //t4y.delta = t4y.clock.getDelta();
      //mixer.update( t4y.delta );
      //seek = 0.8;
      //t4y.delta = t4y.clock.getDelta();
      //mixer.update( t4y.delta );
    }else{
      mixer = new THREE.AnimationMixer( obj );
      var ca = mixer.clipAction(clip);
      t4y.mixers.push( mixer );
    }

    //cl("mix valid?"+clip.validate());
    ca.setLoop( THREE.LoopOnce );
    ca.clampWhenFinished = true;
    ca.play();
    //cl("seek"+seek);
    mixer.setTime(t4y.aniDutation/10);
    //var t4yAni = {'ani': 'rot', action, val};
    //$( mixer ).attr('t4yAni',  t4yAni );
    //$( obj ).attr( 't4yAni', t4yAni );
    obj[mixerNameKey] = mixer;
  }


  /**
   * methode to animate object in scene
   * @param {object} itd - The object t4y.otsce.getObjectByName("nameOfObjectInScane")
   * @param {json} whatToDo - can make:
   * { 'rotateY': mag }
   *
   */
  doAni( itd, whatToDo ){
    t4y.doingNowAni = true;
    t4y.delta = t4y.clock.getDelta();
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

      //t4y.myAnimate();
      //t4y.doingNowAni = false;
      pager.subTask( ()=>{ t4y.setDelaydAnimation("doAni request"); });
      return 0;

    }


	}




};

export { T4y_ani };
