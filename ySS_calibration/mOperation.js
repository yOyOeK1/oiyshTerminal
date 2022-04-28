function rotateImage(obj, degree) {
	obj.css({
            '-webkit-transform':'rotate('+degree+'deg)',
            '-moz-transform':'rotate('+degree+'deg)',
            'transform':'rotate('+degree+'deg)'
        });

}

//rotateSvgSetRC( "objRot2Shadow", "objRot2RC", ui.value );
function rotateSvgSetRC( objName, objNameRc, ang ){
	lAng = lAngels[objName];

	if( lAng == undefined ){
		console.log("new entry");
		lAngels[objName] = {
			'ang': 0,
			'obj': SVG.find("#"+objName),
			'objRC': SVG.find("#"+objNameRc)
		}
	}

	lAngels[objName]['obj'].rotate( ang - lAngels[objName]['ang'],
		lAngels[objName]['objRC'].x()[0],
		lAngels[objName]['objRC'].y()[0]
		);


	lAngels[objName]['ang'] = ang;

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


/*
morpheFromTo( "shape01", "shape02", norm );
*/
function morpheFromTo( objMin, objMax, norm ){
	console.log("morpheFromTo: "+norm);


}



/*
posNormal - 0.0 - 1.0
*/
var movePathStartOffset = {};

function moveOnPath( objToMove, objPath, posNormal ){

	if( movePathStartOffset[ objToMove ] == undefined ){
		var path = SVG("#"+objPath);
		var m = path.matrixify();
		var pathLength = path.length();
		var pZero = new SVG.Point( path.pointAt( pathLength*0.0 ) ).transform( m );
		var obj = SVG("#"+objToMove);

		movePathStartOffset[ objToMove ] = {
			'obj': obj,
			'path': path,
			'm': m,
			'pathLength': pathLength,
			'xOffset': parseFloat( pZero.x-obj.x() ),
			'yOffset': parseFloat( pZero.y-obj.y() ),
			'pos': posNormal
		};

		d = movePathStartOffset[ objToMove ];

	}else{

		if( movePathStartOffset[ objToMove ]['pos'] == posNormal ){
			//console.log("moveOnPath pos Norm same skip.");
			return 0;
		}else{
			//console.log("moveOnPath pos "+posNormal);
			movePathStartOffset[ objToMove ]['pos'] = posNormal;
			d = movePathStartOffset[ objToMove ];
		}

	}


	var p = new SVG.Point(
		d['path'].pointAt(
			d['pathLength']*posNormal
			)
		).transform( d['m'] );

	//console.log("----------------");
	//console.log("p "+p.x+" , "+p.y+"	offsets"+d['xOffset']+" , "+d['yOffset']);

	d['obj'].move(
		p.x-d['xOffset'],
		p.y-d['yOffset']
	);
	//obj.move( p.x, p.y );
}

var putTextStorage = {};
// putText("textCen", "test"+ui.value, 'c', 11);
function putText( objName, text, align, chars ){

	if( putTextStorage[ objName ] == text ){
		//console.log("putText simple same");
		return 0;
	}else
		putTextStorage[ objName ] = text;


	var tl = ("a"+text).length-1;
	//console.log(" putText tl:"+tl+" for:"+text);
	var addIt = '';

	if( align == 'c' ){
		var add = parseInt(chars-tl)/2;
		for(var i=0; i<add; i++)
			addIt+= ' ';

		//console.log("children for "+objName+": " );
		//console.log( $("#"+objName).children()[0] );

		//console.log( $("#"+objName).children()[0].innerHTML );
		$("#"+objName).children()[0].innerHTML = addIt + text;
		//$("#"+objName).text( addIt+text	);

	}else if( align == 'r' ){
		var add = parseInt(chars-tl);
		for(var i=0; i<add; i++)
			addIt+= ' ';

		//$("#"+objName).text( addIt+text );
		$("#"+objName).children()[0].innerHTML = addIt+text;
	}else{
		$("#"+objName).children()[0].innerHTML = text;
	}


}
