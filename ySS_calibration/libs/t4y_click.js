

class T4y_click{


    init_click(){
        console.log('T4y_click .... init');
        this.raycaster = new t4y.libTHREE.Raycaster();
        this.pointer = { "x":0, "y":0};
        this.theta = 0.0;
        //document.addEventListener( 'mousemove', this.onPointerMove );
        this.mouseBtState = false;

        document.addEventListener( 'mousedown', t4y.onMouseDown );
        document.addEventListener( 'mouseup', t4y.onMouseUp );

    }


    onMouseDown( event ){
        t4y.mouseBtState = true;

	}

	onMouseUp( event ){
        t4y.onPointerUpdate( event );
		t4y.mouseBtState = false;
	}

    onPointerUpdate( event ) {
		this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		//console.log("on pointer move");

		this.calcIntersected("pointer move");        
		t4y.setDelaydRender("intersect ... request");

	}

    calcIntersected( by ){
		//console.log("intersect ...."+by);
		let radius = 100;
		this.theta+= 0.1;
		

		//t4y.getOtCam.position.x = radius * Math.sin( t4y.libTHREE.MathUtils.degToRad( this.theta ) );
		//t4y.getOtCam.position.y = radius * Math.sin( t4y.libTHREE.MathUtils.degToRad( this.theta ) );
		//t4y.getOtCam.position.z = radius * Math.cos( t4y.libTHREE.MathUtils.degToRad( this.theta ) );
		//t4y.getOtCam.lookAt( t4y.gltfLoaded.scene.position );

		//t4y.getOtCam.updateMatrixWorld();

		// find intersections
		this.raycaster.setFromCamera( this.pointer, t4y.getOtCam );
		
		let intersects = this.raycaster.intersectObjects( t4y.gltfLoaded.scene.children, false );
		
		if ( intersects.length > 0 ) {
			
			if ( this.INTERSECTED != intersects[ 0 ].object ) {
				
				if ( this.INTERSECTED ) this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
				
				
				this.INTERSECTED = intersects[ 0 ].object;
				this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
				this.INTERSECTED.material.color.setHex( 0xff0000 );
				
				
			} else {
				
				if ( this.INTERSECTED ) this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
				
				//this.INTERSECTED = null;
				
			}
			
			//console.log([this.mouseBtState,"\n\n",this.pointer,"\n\n",this.INTERSECTED.name]);
			if( this.mouseBtState == true && this.INTERSECTED.name.length > 0 ){
				console.log(`T4y_click on: ${this.INTERSECTED.name}`);
				sOutMqttSend(
					`sites/${ pager.pages[pager.currentPage].getName}/${this.INTERSECTED.name}`,
					"click"
				);
			}

			

		}

		
	}


}

export { T4y_click };