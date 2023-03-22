var makeWithAnimation = false;


// [ console.log, buf ]
var clOut = "console.log";
var clBuf = [];
var clBufErr = [];

/**
 * function to  console.log ing.... try to use this one to
 * 	silence down interface
 * @param {string} msg - The msg to console.log
 */
function cl( msg ){
  switch ( clOut ) {
    case "console.log":
      console.log(msg);
      break;
    case "buf":
      clBuf.push(msg);
      break;
    default:

  }

}
function clErr( msg ){
  switch ( clOut ) {
    case "console.log":
      console.error(msg);
      break;
    case "buf":
      clBufErr.push(msg);
      break;
    default:

  }

}

function strToHtmlSafe(input) {
    input = input.replace(/&/g, '&amp;');
    input = input.replace(/</g, '&lt;');
    input = input.replace(/>/g, '&gt;');
    return input;
}

function rotateImage(obj, degree) {
	obj.css({
            '-webkit-transform':'rotate('+degree+'deg)',
            '-moz-transform':'rotate('+degree+'deg)',
            'transform':'rotate('+degree+'deg)'
        });

}



function timestampToNiceTime( ts ){
  var date = new Date(ts*1000);
  return date.getFullYear()+
    "/"+(date.getMonth()+1)+
    "/"+date.getDate()+
    " "+date.getHours()+
    ":"+date.getMinutes()+
    ":"+date.getSeconds();
}

//rotateSvgSetRC( "objRot2Shadow", "objRot2RC", ui.value );
/**
 * function to  rotate object over center of other object in .svg object by name
 * @param {string} objName - The object name in .svg
 * @param {stirng} objNameRc - The object2 name to rotate over it center
 * @param {number} ang - The angle in deg
 * @returns {nothing} - Set rotation of object over obejct in .svg on screen
 */
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
/**
 * function to  rotate object over center point in .svg object by name
 * @param {string} objName - The object name in .svg
 * @param {bool} haveRotateCenter - if true then look for [object name]RC (rotation center)
 * @param {number} ang - The angle in deg
 * @returns {nothing} - Set rotation of object over obejct in .svg on screen
 */
function rotateSvg( objName, haveRotateCenter, ang ){

  lAng = lAngels[objName];

  if( lAng == undefined ){
    console.log("new entry");
		lAngels[objName] = {
			'ang': 0,
			'obj': SVG.find("#"+objName),
			'objRC': haveRotateCenter ? SVG.find("#"+objName+"RC") : null,
			'runner': null
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
/**
 * function to  move object over path in .svg object by name
 * @param {string} objToMove - The object name in .svg to move
 * @param {string} objPath - The object name in .svg to path over
 * @param {number} posNormal - The position on the path 0...1
 * @returns {nothing} - Set position of object on the path in .svg on screen
 */
function moveOnPath( objToMove, objPath, posNormal ){

	if( movePathStartOffset[ objToMove ] == undefined ){
		var path = SVG("#"+objPath);
		var m = path.matrixify();
		var pathLength = path.length();
		var pZero = new SVG.Point( path.pointAt( pathLength*0.0 ) ).transform( m );
		var obj = SVG("#"+objToMove);

		movePathStartOffset[ objToMove ] = {
			'objToMoveName': objToMove,
			'obj': obj,
			'path': path,
			'm': m,
			'pathLength': pathLength,
			'xOffset': parseFloat( pZero.x-obj.x() ),
			'yOffset': parseFloat( pZero.y-obj.y() ),
			'pos': posNormal,
			'runner': null
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

	if( makeWithAnimation == false ){ // direct move
		d['obj'].move(
			p.x-d['xOffset'],
			p.y-d['yOffset']
		);
	} else { // animate move
		if( d['runner'] && d['runner'].active() ){
			//console.log("runner is running for "+d['objToMoveName'] );
			d['runner'].unschedule();
		}

		d['runner'] = d['obj'].animate().move(
			p.x-d['xOffset'],
			p.y-d['yOffset']
		);
	}
	//obj.move( p.x, p.y );
}

var putTextStorage = {};
// putText("textCen", "test"+ui.value, 'c', 11);
/**
 * function to  put text in .svg object by name
 * @param {string} objName - The object name in .svg
 * @param {string} text - The text to put in .svg
 * @param {string} align - The aligment definition [c|r|]
 * @param {number} chars - The to limit length
 * @returns {nothing} - Set text to .svg on screen
 */
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


function updateStyle( objName , args ){
	var obj = SVG("#"+objName);
	var s = obj.attr('style').split(";");
	var l = s.length;
	var k = "";
	for( var i=0;i<l;i++ ){
		k = s[i].substring(0,s[i].indexOf(":") );
		if( args[ k ] != undefined )
			s[i] = k+":"+args[k];
	}
	obj.attr('style', s.join(';'));
}


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// d = mDict( d, (key, val )=>{ /*do somthing;*/ return val; });
function mDict( inDic, operation ){
	for( k in inDic ){
		inDic[ k ] = operation( k, inDic[k] );
	}
	/*
	var keys = Object.keys( inDic );
	for( var k=0,kc=keys.length; k<kc; k++ ){
		inDic[ keys[k] ] = operation( keys[k], inDic[ keys[k] ] );
	}
	*/
	return inDic;
}
