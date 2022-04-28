
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function mkLightHex( hexIn ){
  console.log("invert["+hexIn+"]");
  if( hexIn.substring(0,4) == "rgb("){
    rgb = hexIn.replace("rgb(","").replace(")",'').split(",");
    tr = "rgb(";
    if( mkShaderType == 'invert' ){
      tr+= 255-parseInt( rgb[0] )+", ";
      tr+= 255-parseInt( rgb[1] )+", ";
      tr+= 255-parseInt( rgb[2] )+" )";
    }else if( mkShaderType == 'blackRed'){
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
    if( mkShaderType == 'invert' ){
      tr+= (255-parseInt( rgba[0] ) )+", ";
      tr+= (255-parseInt( rgba[1] ) )+", ";
      tr+= (255-parseInt( rgba[2] ) )+", "+rgba[3]+")";
    }else if( mkShaderType == 'blackRed'){
      var avg = (parseInt( rgba[0] ) + parseInt( rgba[1] ) + parseInt( rgba[2] ) ) / 3;
      tr+= avg+", 0, 0, "+rgba[3]+" )";
    }

    console.log(" and its: "+tr+" from rgba(....)");
    return tr;

  }else if( hexIn.length == 7 ){
    if( mkShaderType == 'invert' ){
      tr = rgbToHex(
        255-parseInt( hexIn.substring(1,3) , 16),
        255-parseInt( hexIn.substring(3,5), 16),
        255-parseInt( hexIn.substring(5,7), 16)
        );
    }else if( mkShaderType == 'blackRed'){
      var avg = parseInt( hexIn.substring(1,3) , 16);
      avg+= parseInt( hexIn.substring(3,5) , 16);
      avg+= parseInt( hexIn.substring(5,7) , 16);

      tr = rgbToHex( parseInt(avg/3), 0, 0 );
    }


    console.log(" and its: "+tr+" from #......");
    return tr;

  }
  console.log("no action for invert !!!");
  return "";
}

function mkLightOperationFromStyle( obj ){
  //console.log("mkLightOperationFromStyle ");
  var s = obj.attr("style").split(";");
  var sfsOrg = obj.attr("sfsOrg");
  console.log("sfsOrg:"+sfsOrg );
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

var mkShaderType;
function mkShader( shType ){
  mkShaderType = shType;
  console.log("mkLightNight mode..."+mkShaderType);
  var col = $(document.body).css("background-color");
  //console.log("bg:"+col);
  if( mkShaderType == 'normal')
    $(document.body).css("background-color", "#ffffff");
  else{
    $(document.body).css("background-color", mkLightHex( col ) );

  }
  //return 0;
  var s = SVG("#svgDyno");

  s.each(function(){
    //console.log("a");
    //console.log(this);
    if( this['type'] != "mask")
      mkLightRun( this, 0 )

  });

}

function mkLightRun( obj, level ){

  obj.each(function(){
    console.log("a level:"+level+" id=["+this['node']["id"]+"]" );

    try{
      mkLightOperationFromStyle( this );
    }catch(e){
      console.log("style no id=["+this['node']["id"]+"]");
    }
    //console.log(this);
    if( this['type'] != "mask")
      mkLightRun( this, level+1);
  });

  return 0;
}
