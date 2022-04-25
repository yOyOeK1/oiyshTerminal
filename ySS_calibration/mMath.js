function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRad (angle) {
  return angle * (Math.PI / 180);
}

function getDist( x1, y1, x2, y2 ){
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt( a*a + b*b );
}
