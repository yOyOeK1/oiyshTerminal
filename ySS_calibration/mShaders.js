
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



function mkLightHex( hexIn, operationType ){
  var doShader = ( operationType != undefined ) ?
    operationType : mkShaderType;

  //console.log("invert["+hexIn+"]");
  if( hexIn.substring(0,4) == "rgb("){
    rgb = hexIn.replace("rgb(","").replace(")",'').split(",");
    tr = "rgb(";
    if( doShader == 'invert' ){
      tr+= 255-parseInt( rgb[0] )+", ";
      tr+= 255-parseInt( rgb[1] )+", ";
      tr+= 255-parseInt( rgb[2] )+" )";
    }else if( doShader == 'blackRed'){
      var avg = (parseInt( rgb[0] ) + parseInt( rgb[1] ) + parseInt( rgb[2] ) ) / 3;
      tr+= avg+", 0, 0 )";
    }

    console.log(" and its: "+tr+" from rgb(....)");
    return tr;

  }else if( hexIn.substring(0,5) == "rgba("){
    rgba = hexIn.replace("rgba(","").replace(")", '').replace(' ', '').split(",");
    console.log("from["+hexIn.replace("rgba(","").replace(")")+"]");
    console.log(rgba);
    tr = "rgba(";
    if( doShader == 'invert' ){
      tr+= (255-parseInt( rgba[0] ) )+", ";
      tr+= (255-parseInt( rgba[1] ) )+", ";
      tr+= (255-parseInt( rgba[2] ) )+", "+rgba[3]+")";
    }else if( doShader == 'blackRed'){
      var avg = (parseInt( rgba[0] ) + parseInt( rgba[1] ) + parseInt( rgba[2] ) ) / 3;
      tr+= avg+", 0, 0, "+rgba[3]+" )";
    }

    console.log(" and its: "+tr+" from rgba(....)");
    return tr;

  }else if( hexIn.length == 7 ){
    if( doShader == 'invert' ){
      tr = rgbToHex(
        255-parseInt( hexIn.substring(1,3) , 16),
        255-parseInt( hexIn.substring(3,5), 16),
        255-parseInt( hexIn.substring(5,7), 16)
        );
    }else if( doShader == 'blackRed'){
      var avg = parseInt( hexIn.substring(1,3) , 16);
      avg+= parseInt( hexIn.substring(3,5) , 16);
      avg+= parseInt( hexIn.substring(5,7) , 16);

      tr = rgbToHex( parseInt(avg/3), 0, 0 );
    }
    //console.log(" and its: "+tr+" from ......");
    return tr;

  }else if( hexIn.length == 4 ){
    if( doShader == 'invert' ){
      tr = "#"+
        (""+(16-parseInt( hexIn.substring(1,2) , 16) ) ).toString(16)+
        (""+(16-parseInt( hexIn.substring(2,3), 16) ) ).toString(16)+
        (""+(16-parseInt( hexIn.substring(3,4), 16) ) ).toString(16);
    }else if( doShader == 'blackRed'){
      var avg = parseInt( hexIn.substring(1,2) , 16);
      avg+= parseInt( hexIn.substring(2,3) , 16);
      avg+= parseInt( hexIn.substring(3,4) , 16);

      tr = "#"+(avg/3).toString(16)+"00";
    }
    console.log("hexIn 4 and its: "+tr+" from ......["+hexIn+"]");
    return tr;

  }else{
    console.log("hexIn NaN ["+hexIn+"]");
  }
  console.log("no action for invert !!!");
  return "";
}

function shaderColor( hex ){
  for( var s=0; s<sharedStoreCookie.length; s++ ){
    if( sharedStoreCookie[s].length > 2 ){
      hex = mkLightHex( hex, sharedStoreCookie[s] );
    }
  }
  return hex;
}

function mkLightOperationFromStyle( obj ){
  //console.log("mkLightOperationFromStyle ");
  var style = obj.attr("style");

  //cl("style: "+style);
  //cl("fill:"+obj.attr("fill") );
  //cl("stroke:"+obj.attr("stroke"));
  if( style == undefined  ){
    var tFill = obj.attr("fill");
    var tStroke = obj.attr("stroke");

    if( tFill == undefined && tStroke == undefined )
      return 0;
    else{
      var nStyle = new Array();
      if( tFill != undefined ){
        nStyle.push("fill:"+tFill);
        obj.attr("fill",null);
      }
      if( tStroke != undefined ){
        nStyle.push("stroke:"+tStroke);
        obj.attr("stroke",null);
      }
      style = nStyle.join(";");
    }


  }

  var s = style.split(";");
  var sfsOrg = obj.attr("sfsOrg");
  var fill = "";
  var stroke = "";
  var orgFill,orgStroke;
  if( mkShaderType == 'normal' && sfsOrg != undefined ){
    var sfsOrgSplit = sfsOrg.split(",");
    orgFill = sfsOrgSplit[0];
    orgStroke = sfsOrgSplit[1];
  }

  for(var i=0;i<s.length; i++){
    if( s[i].indexOf("fill:#") == 0 ){
      if( mkShaderType == 'normal' && sfsOrg != undefined )
        s[i] = "fill:"+orgFill;
      else{
        fill = s[i].substring(5);
        s[i] = "fill:"+mkLightHex( fill );
      }
    }
    if( s[i].indexOf("stroke:#") == 0 ){
      if( mkShaderType == 'normal' && sfsOrg != undefined )
        s[i] = "stroke:"+orgStroke;
      else{
        stroke = s[i].substring(7);
        s[i] = "stroke:"+mkLightHex( stroke );
      }
    }

  }

  if( sfsOrg == undefined )
    obj.attr("sfsOrg", fill+","+stroke );

  obj.attr("style", s.join(";"))

}

function mkShaderStoreResume(){
  mkShaderResuming = true;

  var shaderStore = getCookie('shaderStore');
  console.log("mk shared store settings resume: ["+shaderStore+"]");
  var seq = shaderStore.split(",");
  for( var s=0; s<seq.length; s++ ){
    if( seq[s].length > 2 )
      mkShader( seq[s] );
  }

  mkShaderResuming = false;
  sharedStoreCookie = seq;
}

var sharedStoreCookie = [];
var mkShaderResuming = false;
function mkShaderStoreSettings(){
  var shaderStore = getCookie('shaderStore');
  console.log("mk shared store settings: ["+shaderStore+"]");
  var seq = shaderStore.split(",");
  seq.push(mkShaderType);

  if( mkShaderType == 'normal' )
    seq = new Array();

  document.cookie="shaderStore="+seq.join(",")+";max-age=31536000;";
  sharedStoreCookie = seq;

}

var mkShaderType;
function mkShader( shType ){
  mkShaderType = shType;
  //console.log("mkLightNight mode..."+mkShaderType);
  var bgColor = $(document.body).css("background-color");
  var bodyColor = $(document.body).css("color");
  var inputBgColor = $(document.input).css("background-color");
  var inputColor = $(document.input).css("color");
  //console.log("bg:"+col);
  if( mkShaderType == 'normal'){
    $(document.body).css("background-color", "#ffffff");
    $(".bottomPanelContainer").css("background-color", "#ffffff");
    $(document.body).css("color", "#000000");
  }else{
    $(document.body).css("background-color", mkLightHex( bgColor ) );
    $(document.body).css("color", mkLightHex(bodyColor) );
    $(".bottomPanelContainer").css("background-color", mkLightHex(bgColor) );

    /* TODO inputs to shader
    cl('shader for input'+inputBgColor);
    cl('shader for input'+inputColor);

    $(document.input).css('background-color', mkLightHex(inputBgColor) );
    $(document.input).css('color', mkLightHex(inputColor) );
    */
  }
  //return 0;
  var s = SVG("#svgDyno");

  s.each(function(){
    //console.log("a");
    //console.log(this);
    if( this['type'] != "mask")
      mkLightRun( this, 0 );

  });

  // TODO fix menu
  /*
  cl("bottom menu ------- START ");
  var sm = SVG("#bottomPanelMenuImg");
  sm.each(function(){
    console.log("a");
    console.log(this);
    if( this['type'] != "mask")
      mkLightRun( this, 0 );

  });
  cl("bottom menu ------- END ");
  */

  if( !mkShaderResuming )
    mkShaderStoreSettings();

}

function mkLightRun( obj, level ){

  obj.each(function(){
    cl("a level:"+level+" id=["+this['node']["id"]+"]" );

    try{
      mkLightOperationFromStyle( this );
    }catch(e){
      cl("style no id=["+this['node']["id"]+"] error: "+e);

    }
    //console.log(this);
    if( this['type'] != "mask")
      mkLightRun( this, level+1);
  });

  return 0;
}
