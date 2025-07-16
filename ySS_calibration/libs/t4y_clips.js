
import * as THREE from "../three/three.module.js";


class T4y_clips{

    /** seekTo - 0 ... 1 */
    actionSeek( action, seekTo ){
        action.time = seekTo * action.getClip().duration;
        //console.log("do");			
    }

    initMixerAndActions( gltf ){
        cl(`----------------------Extracting initMixerAndActions ${gltf.animations.length}\n\n\n`);
        //cl(gltf);
        t4y.cMixer = new THREE.AnimationMixer( gltf.scene );
        t4y.cActions = {};
        for( let i=0,il=gltf.animations.length; i<il; i++ ){
        let nClip = gltf.animations[i];
        cl(`* animation [${nClip.name}]`);
        let nAction = t4y.cMixer.clipAction( nClip );
        t4y.cActions[ nClip.name ] = nAction;

        nAction.clampWhenFinished = true;
        nAction.loop = THREE.LoopOnce;
        nAction.play();
        nAction.paused = true;

        }
        cl(`----------------------Extracting initMixerAndActions DONE with ${Object.keys( t4y.cActions ).length } clips\n\n\n`);

    }


}

export { T4y_clips };