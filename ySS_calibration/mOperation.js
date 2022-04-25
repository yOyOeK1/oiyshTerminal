function rotateImage(obj, degree) {
	obj.css({
            '-webkit-transform':'rotate('+degree+'deg)',
            '-moz-transform':'rotate('+degree+'deg)',
            'transform':'rotate('+degree+'deg)'
        });

}

var lAngels = {}
function rotateSvg( objName, haveRotateCenter, ang ){
  lAng = lAngels[objName];

  if( lAng == undefined ){
    console.log("new entry");
		lAngels[objName] = {
			'ang': 0,
			'obj': SVG.find("#"+objName),
			'objRC': haveRotateCenter ? SVG.find("#"+objName+"RC") : null
		}
	}

  if( haveRotateCenter ){
    lAngels[objName]['obj'].rotate( ang - lAngels[objName]['ang'],
			lAngels[objName]['objRC'].x()[0],
			lAngels[objName]['objRC'].y()[0]
			);
  }else{
    lAngels[objName]['obj'].rotate( ang - lAngels[objName]['ang'] );
  }

  lAngels[objName]['ang'] = ang;

}


function deg360ToNorm( deg ){
	var n = (deg%360.0)/360.0;
	//console.log("n:"+n);
	if( n < 0 )
		n = 1.0 + n;
	return n;
}

/*
posNormal - 0.0 - 1.0
*/
var movePathStartOffset = {};
function moveOnPath( objToMove, objPath, posNormal ){
	var path = SVG("#"+objPath);
	//console.log("path length:"+path.length());
	var m = path.matrixify();
	var p = new SVG.Point( path.pointAt( path.length()*posNormal ) ).transform( m );
	//console.log("new point xy"+ p.x+" , "+p.y);
	var obj = SVG("#"+objToMove);

	if( movePathStartOffset[objToMove] == undefined ){
		//console.log("notDef");
		var pZero = new SVG.Point( path.pointAt( path.length()*0.0 ) ).transform( m );
		//console.log("obj xy "+obj.x()+" , "+obj.y());
		var xOff = pZero.x-obj.x();
		var yOff = pZero.y-obj.y();
		movePathStartOffset[ objToMove ] = {
			'x': xOff,
			'y': yOff
		};
		//console.log("have offset "+movePathStartOffset[ objToMove ]['x']+" , "+movePathStartOffset[ objToMove ]['y']);
		//console.log("have offset2 "+xOff+" , "+yOff);
	}


	//console.log("obj height"+obj.height());
	obj.move(
		p.x-movePathStartOffset[ objToMove ]['x'],
		p.y-movePathStartOffset[ objToMove ]['y']
	);
	//obj.move( p.x, p.y );
}
