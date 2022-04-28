function toDegrees ( rad ) {
  return rad * (180 / Math.PI);
}

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


function deg360ToNorm( deg ){
	var n = (deg%360.0)/360.0;
	//console.log("n:"+n);
	if( n < 0 )
		n = 1.0 + n;
	return n;
}

// mMapVal( ui.value, 0, 180, -90,90 )
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

function avgIt( key, forMs ){
  var t = new Date().getTime()-forMs;
  var d = storeData[key];
  var l = d.length-1;
  var tr = 0;
  var trC = 0;

  for( var i=l; i>=0; i-- ){
    if( d[i]['t'] >= t ){
      tr+= d[i]['v'];
      trC++;
    }else{
      break;
    }

  }

  //console.log("avgIt tr"+tr+" trC"+trC+" res"+(tr/trC));
  return tr/trC;

}
