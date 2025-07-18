
//var a = new Array(0, 150, 30, 20, -8, -200);
//Math.min.apply(null,a);

/**
 * function to  radian to convert to degrees
 * @param {number} rad - The radian to convert to degrees
 * @returns {number} - The degrees
 */
function toDegrees ( rad ) {
  return rad * (180 / Math.PI);
}

/**
 * function to  degrees to convert to radians
 * @param {number} angle - The degrees to convert to radian
 * @returns {number} - The radian
 */
function toRad (angle) {
  return angle * (Math.PI / 180);
}

function getDist( x1, y1, x2, y2 ){
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt( a*a + b*b );
}

function getDistLLInNM( lastLat, lastLon, lat, lon ){
  return ( 3440.064794816 * Math.acos(
    Math.cos( toRad( lastLat) )
    * Math.cos( toRad( lat ) )
    * Math.cos( toRad( lon ) - toRad( lastLon ) )
    + Math.sin( toRad( lastLat ) )
    * Math.sin( toRad( lat ) )
    ) );

}

function getAngleLL( lastLat, lastLon, lat, lon ){
  var dy = lat-lastLat;
  var dx = lon-lastLon;
  return toDegrees( Math.atan2( dx, dy ) );
}

/**
 * function to  get degrees to "001" 3 char str
 * @param {number} deg - The degrees
 * @returns {String} - The 3 char degrees "001"
 */
function degToHdg( deg ){
  deg = String(Math.round( deg360Pos( deg ) ));
  deg = "0".repeat( 3-deg.length )+deg;
  return deg;
}

function deg360ToNorm( deg ){
	var n = (deg%360.0)/360.0;
	//console.log("n:"+n);
	if( n < 0 )
		n = 1.0 + n;
	return n;
}

function deg360Pos( deg ){
  deg = deg%360;
  if( deg < 0 )
    deg+=360;
  return deg;
}

function deg360delta( deg0, deg1 ){
  //console.log("deg to Pos in:"+deg0+" -> "+deg360Pos(deg0) );
  //console.log("deg to Pos in:"+deg1+" -> "+deg360Pos(deg1) );
  deg0 = deg360Pos(deg1)-deg360Pos(deg0);

  if( deg0 > 180 )
    deg0-=360;
  if( deg0 < -180 )
    deg0+=360;

  return deg0;
}


// mMapVal( ui.value, 0, 180, -90,90 )
/**
 * function to  making map in range
 * @param {number} val - The value to convert
 * @param {number} minI - The minimum on input
 * @param {number} maxI - The maximum on input
 * @param {number} minO - The minimum on output
 * @param {number} maxO - The maximum on output
 * @param {bool} inLimits = (def: false) - The maximum on output
 * @returns {number} - The value with map set ..
 */
function mMapVal( val, minI, maxI, minO, maxO, inLimits = false){
  var dI = maxI - minI;
  var dO = maxO - minO;
  var nI = ( val - minI )/dI;

  if( inLimits ){
    var tr = minO + ( nI*dO );
    if( tr < minO )
      return minO;
    else if( tr > maxO )
      return maxO;
    else
      return tr;

  }else
    return minO + ( nI*dO );

}



var sec1 = 1000;
var sec30 = sec1*30;
var min1 = 2*sec30;
var min5 = min1*5;

var storeData = {};

/**
 * function to store data for later...
 * @param {number} key - The key to identyfy this value
 * @param {number} val - The value to store
 * @param {number} forMs - The store for how many ms.
 * @param {bool} inLimits = (def: false) - The maximum on output
 */
function storeIt( key, val, forMs ){
  var t = new Date().getTime();
  //new Date().getTime() / 1000
  //console.log("t:"+t);
  // todo
  if( storeData[key] == undefined )
    storeData[key] = new Array();

    storeData[key].push({
      'v': val,
      't': t
      });

    var tOld = t - forMs;
    while( true ){
      if( storeData[key][0]['t'] < tOld ){
        //console.log("storeIt key:"+key+" drop to old!");
        storeData[key].shift();

      }else{
        //console.log("storeIt key:"+key+" is up to date..."+len);
        break;
      }

    }


}
function storeGetLast( key ){
  return storeData[key][ storeData[key].length-1 ];
}
function storeGetPreLast( key ){
  return storeData[key][ storeData[key].length-2 ];
}


function storeGetFirstOlderThen( key, ms ){
  var d = storeData[key];
  if( d == undefined )
    return undefined;

  var t = new Date().getTime()-ms;
  var l = d.length-1;
  for( var i=l;i>0;i-- ){
    if( d[i]['t']<=t ){
      return d[i];
    }
  }

  return undefined;
}

/*
if only forMs set thin
[0] |__________[forMs]++++| [now]

if forMs and toMs set thin
[0] |___[forMs]++++[forMS+toMs]____________| [now]
*/

/**
 * function to avg it - to avg key value in storage
 * @param {number} key - The key to identyfy the value in storage
 * @param {number} forMs - The ms of sample to avg
 * @param {number} toMs - The ms o point
 * @returns {number} - The avg of key value ..
 */
function avgIt( key, forMs, toMs ){
  var now = new Date().getTime();

  var t = now-forMs;

  var tFrom = now;
  if( toMs != undefined )
    tFrom = t+toMs;

  var d = storeData[key];
  var l = d.length-1;
  var tr = 0;
  var trC = 0;


  for( var i=l; i>=0; i-- ){
    if( t <= d[i]['t'] && d[i]['t'] <= tFrom ){
      tr+= d[i]['v'];
      trC++;
    }

  }

  //console.log("avgIt tr"+tr+" trC"+trC+" res"+(tr/trC));
  return tr/trC;

}
function avgItKalman( key, forMs, toMs ){
  var now = new Date().getTime();

  var kal = new KalmanFilter();
  var t = now-forMs;

  var tFrom = now;
  if( toMs != undefined )
    tFrom = t+toMs;

  var d = storeData[key];
  var l = d.length-1;
  var tf = [];
  var tfC = 0;

  for( var i=l; i>=0; i-- ){
    if( t <= d[i]['t'] && d[i]['t'] <= tFrom ){
      tf.push( kal.filter(d[i]['v']) );
      tfC++;
    }

  }


  //console.log("avgIt tr"+tr+" trC"+trC+" res"+(tr/trC));
  return tf.reduce((partialSum, a) => partialSum + a, 0)/tfC;

}

console.log("Make module ... mMath");
try{
  module.exports = {
    toDegrees,
    toRad,
    getDist,

    getDistLLInNM,
    getAngleLL,
    degToHdg,
    deg360ToNorm,
    deg360Pos,
    deg360delta,
    mMapVal,
    storeIt,
    storeGetLast,
    storeGetPreLast,
    storeGetFirstOlderThen,
    avgIt,
    avgItKalman

  };
  console.log(" ... OK");
}catch(e){
  console.log(" ... No module");
}
