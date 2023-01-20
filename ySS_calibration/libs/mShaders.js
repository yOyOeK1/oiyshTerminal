
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
      tr+= parseInt(avg)+", 0, 0 )";
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
      tr+= parseInt(avg)+", 0, 0, "+rgba[3]+" )";
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
  //cl("obj");
  //obj = $(obj);
  //cl(obj.attr("id"));
  // setting up org for return option to orginal
  if( mkShaderType == 'normal' ){
      // first run no mkShOrg set up. setting it up
      if( obj !=undefined && obj.attr("mkShOrg") == undefined ){
        var org = {
          'style': obj.attr("style"),
          'class': obj.attr("class")
        };
        if(0){
          cl("----------- shader analisys-------------");
          cl("html of obj:");
          cl(obj);
          cl("syle");
          cl(obj.attr("style"));
          cl("class");
          cl(obj.attr("class"));
          cl("css");
          cl(obj.css());
        }
        obj.attr("mkShOrg", JSON.stringify(org) );
      }

      var mkShOrg = JSON.parse( obj.attr("mkShOrg") );
      obj.attr( "style",
        mkShaderOnStr( mkShOrg['style'], mkShaderStack )
      );
      obj.attr( "css",
        mkShaderOnStr( mkShOrg['css'], mkShaderStack )
      );
    //}
    }else if( mkShaderType == 'invert' || mkShaderType == 'blackRed' ){
      //cl("mk shader action "+JSON.stringify(mkShaderType)+"-----------");
      var mkShOrg = JSON.parse( obj.attr("mkShOrg") );
      obj.attr( "style",
        mkShaderOnStr( mkShOrg['style'], mkShaderStack )
      );
      obj.attr( "css",
        mkShaderOnStr( mkShOrg['css'], mkShaderStack )
      );
    }
  }

  function mkShaderOnStr( str, shader ){
    if( str == undefined )
      return "";
    //cl("mkShaderOnObject do "+JSON.stringify(shader));
    //cl("")

    var tr = "";

    // hex
    //cl("str to work["+str+"]");
    var h = str.split('#');
    if( h.length >1 ){
      //cl("hex colors in string "+h.length);
      tr+= h[0];
      for( var i=1,ic=h.length; i<ic ; i++){
        if( h[i].substring(6,7) == ';' ){
          var curC = '#'+h[i].substring(0,6);
          var nc = curC;
          //cl("Current collor: "+curC);

          if( shader['invert'] == true ){
            //cl("  - invert ");
            nc = mkLightHex( nc, 'invert' );
          }
          if( shader['red'] == true ){
            //cl("  - red ");
            nc = mkLightHex( nc, 'blackRed' );
          }

          //cl("new ["+nc+"]");
          tr+= nc+h[i].substring(6);

        }else{
          tr+= '#'+h[i];
        }
      }
    }else
      tr = str;

    if( String(str ).length != String( tr ).length ){
      cl(" in out diff length !!!-------------------------");
      cl("in");
      cl(str);
      cl("out");
      cl(tr);
    }
    //cl(" end string ["+tr+"]");
    return tr;
  }

  function mkLightOperationFromStyle_4Del( obj ){
    //console.log("mkLightOperationFromStyle ");
    /*
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
    */

  /*
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
  */

}

function mkShaderStoreResume(){
  mkShaderResuming = true;

  var shaderStore = getCookie('shaderStore');
  console.log("mk shared store settings resume: ["+shaderStore+"]");
  var seq = shaderStore.split(",");
  sharedStoreCookie = seq;
  for( var s=0; s<seq.length; s++ ){
    if( seq[s].length > 2 )
      mkShader( seq[s] );
  }

  mkShaderResuming = false;

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

var mkRotationAngCurrent = 0;
function mkRotation( rotateStat ){
  mkRotationAngCurrent = rotateStat;
  $('#svgDyno').css('-webkit-transform', 'rotate('+rotateStat+'deg)');
  $('#svgDyno').css('-moz-transform', 'rotate('+rotateStat+'deg)');
  $('#svgDyno').css('-o-transform', 'rotate('+rotateStat+'deg)');
  $('#svgDyno').css('-ms-transform', 'rotate('+rotateStat+'deg)');
  $('#svgDyno').css('transform', 'rotate('+rotateStat+'deg)');

  if( 0 ){
    $('#otThreeLogo').css('-webkit-transform', 'rotate('+rotateStat+'deg)');
    $('#otThreeLogo').css('-moz-transform', 'rotate('+rotateStat+'deg)');
    $('#otThreeLogo').css('-o-transform', 'rotate('+rotateStat+'deg)');
    $('#otThreeLogo').css('-ms-transform', 'rotate('+rotateStat+'deg)');
    $('#otThreeLogo').css('transform', 'rotate('+rotateStat+'deg)');
  }

  setSvgFit();
  console.log("call fit svg")
}

var mkShaderType;
var mkShaderStack={
  'invert': false,
  'red': false,
  'rot':0
};
function mkShader( shType ){

  // new shader stack manager....
  cl(this.mkShaderStack);

  switch( shType ){
    case "normal":
      this.mkShaderStack['invert'] = false;
      this.mkShaderStack['red'] = false;
      this.mkShaderStack['rot'] = 0;
      break;
    case "invert":
      this.mkShaderStack['invert'] = !this.mkShaderStack['invert'];
      break;
    case "blackRed":
      this.mkShaderStack['red'] = !this.mkShaderStack['red'];
      break;
    case "rotate":
      this.mkShaderStack['rot'] = (this.mkShaderStack['rot']+90)%360;
      break;
    default:
      cl("mkShader got empty...");
      cl(shType);
      //this.mkShaderExecutor( shType );
      break;
  }

  //cl("class");

  cl("mkShader stack now...mkShaderResuming["+mkShaderResuming+"]");
  cl(this.mkShaderStack);

  var old_mkShaderResuming = mkShaderResuming;
  if( mkShaderResuming == false )
    mkShaderResuming = false;
  this.mkShaderExecutor("normal");
  //mkShaderResuming = ;

  var btI = $("#mBtShaInv").attr('class');
  $("#mBtShaInv").attr('class', this.mkShaderStack['invert']? btI+" ui-btn-b ": replaceAll(btI, "ui-btn-b", "" ) );
  if( this.mkShaderStack['invert'] ){
    this.mkShaderExecutor("invert");
  }

  var btR = $("#mBtShaBlaRed").attr('class');
  $("#mBtShaBlaRed").attr('class', this.mkShaderStack['red']? btR+" ui-btn-b ": replaceAll(btR, "ui-btn-b", "" ) );
  if( this.mkShaderStack['red'] )
    this.mkShaderExecutor("blackRed");


  mkShaderResuming = old_mkShaderResuming;
  for(var r=0;
    r<this.mkShaderStack['rot'];
    r+=90 ){
    cl("mkShader make rotation");
    this.mkShaderExecutor('rotate');
  }
  mkRotation( this.mkShaderStack['rot']);
  //mkShaderResuming = old_mkShaderResuming;
}
function replaceAll( string, find, replace ) {

	return string.split( find ).join( replace );

}

function mkShaderExecutor( shType ){
  mkShaderType = shType;
  console.log("mkShader mode..."+mkShaderType);
  var bgColor = $(document.body).css("background-color");
  var bodyColor = $(document.body).css("color");
  var inputBgColor = $(document.input).css("background-color");
  var inputColor = $(document.input).css("color");
  //console.log("bg:"+col);
  if( t4y ){
    t4y.shaderAction( mkShaderType );
  }
  if( mkShaderType == 'normal'){
    var bgColor = pager.getPageBGColor;
    $('.ui-page').css( 'background', bgColor );
    $('.ui-page').css( 'background-color', bgColor );
    $(document.body).css("background-color",
      bgColor
      //"#ffffff"
      );
    $(".bottomPanelContainer").css("background-color",
      //"#ffffff"
      bgColor
      );
    $(document.body).css("color",
      //"#000000"
      mkLightHex(bgColor,'invert')
      );
    //document.cookie="rotateStat=0;max-age=31536000;";
    mkRotation( 0 );


  }else if( mkShaderType == "rotate" ){

    //var rotateStat = getCookie('rotateStat');
    console.log(" ooo rotate ! resuming["+mkShaderResuming+"]");
    console.log(" ooo rotate ["+sharedStoreCookie.join(',')+"]");
    var rotateStat = 0;
    if( !mkShaderResuming )
      rotateStat+= 90;
    for( var si=0,sli=sharedStoreCookie.length; si<sli; si++){
      console.log(" ooo rotate ["+si+"] in stack ["+sharedStoreCookie[si]+"]");
      if( sharedStoreCookie[si] == "rotate" ){
        rotateStat = (rotateStat+90)%360;
      }
    }

    console.log(" ooo rotate to def["+rotateStat+"]");
    /*
    if( !mkShaderResuming ){
      rotateStat = (rotateStat+90)%360;
      document.cookie="rotateStat="+rotateStat+";max-age=31536000;";
    }
    */
    mkRotation( rotateStat );
    /*
    if( !mkShaderResuming )
      mkShaderStoreSettings();

    return 0;
    */
  }else{
    $(document.body).css("background-color", mkLightHex( bgColor ) );
    $('.ui-page').css( 'background', mkLightHex(bgColor) );
    $('.ui-page').css( 'background-color', mkLightHex(bgColor) );
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

  if( mkShaderType != "rotate" ){
    s.each(function(){
      //console.log("a");
      //console.log(this);
      if( this['type'] != "mask")
        mkLightRun( this, 0 );

    });
  }

  cl("doing shader over menu.--------");
  /*
  // do menu
  $("#panelMenu").each(function(o, e){
    console.log("a");
    console.log(this);
    console.log(typeof this );
    console.log( $( this ).attr("id") );
    console.log("o");
    console.log(o);
    console.log("e");
    console.log(e);
    //mkLightRun( $( this )), 0 );
    mkShaderMenu( $(this) , 0);
    $("#panelMenu").enhanceWithin();

  });
  */
  cl("doing shader over menu.--------END");
  // TODO fix menu
  /*  cl("bottom menu ------- START ");
  var sm = SVG("#bottomPanelMenuImg");
  sm.each(function(){
    console.log("a");
    console.log(this);
    if( this['type'] != "mask")
      mkLightRun( this, 0 );
  });
  cl("bottom menu ------- END ");  */
  if( !mkShaderResuming )
    mkShaderStoreSettings();
}

function mkShaderMenu(obj, l){
  $(obj).children().each( function( a, o ){

    cl("obj");
    cl(o);
    cl("class");
    var s = $(o).attr('class');
    cl(s);
    //if( o.attr() )
    var sOrg;
    if( $(o).attr("mkShOrg") == undefined ){
      $(o).attr("mkShOrg", s );
      sOrg = s;
    }else
      sOrg = $(o).attr("mkShOrg");

    if( mkShaderStack['red'] == false && mkShaderStack['invert'] == false  ){
      $(o).attr('class', sOrg );
    }

    if( mkShaderStack['invert'] ){
      mkShaderForMonuItem( $(o), sOrg, 'invert' );
      ///$("#panelMenu").attr("class",sOrg);
    }


    mkShaderMenu( $(o), l+1 );
  });
}
function mkShaderForMonuItem( obj, org, what ){
  if( org == undefined )
    return 0;


  cl("obj to work with ");
  cl( obj );
  var btnB = org.indexOf("ui-btn-b");
  var btn = org.indexOf("ui-btn");
  cl("btn B:"+btnB+" b:"+btn);

  var barA = org.indexOf("ui-bar-a");
  var barB = org.indexOf("ui-bar-b");
  var bar = org.indexOf("ui-bar");
  cl("bar A:"+barA+" B:"+barB+" b:"+bar);

  var bodyA = org.indexOf("ui-body-a");
  var bodyB = org.indexOf("ui-body-b");
  var body = org.indexOf("ui-body");
  cl("body A:"+bodyA+" B:"+bodyB+" b:"+body);

  var tr = org;

  switch( what ){
    case 'invert':
      if( btnB == -1 && btn != -1 ){
        tr+= ' ui-btn-b';
      }else if( btnB != -1 && btn != -1 ){
        tr = org.split("ui-btn-b").join("ui-btn-a");
      }else if( bodyA == -1 && bodyB != -1 && body != -1 ){
        tr = org.split("ui-body-b").join("ui-body-a");
      }else if( bodyA != -1 && bodyB == -1 && body != -1 ){
        tr = org.split("ui-body-a").join("ui-body-b");
      }else if( barA == -1 && barB != -1 && bar != -1 ){
        tr = org.split("ui-bar-b").join("ui-bar-a");
      }else if( barA != -1 && barB == -1 && bar != -1 ){
        tr = org.split("ui-bar-a").join("ui-bar-b");
      }
      break;
  };

  cl("org is ");
  cl(org);
  cl("new tr ");
  cl(tr);
  obj.attr('class',String(tr));



}

function mkLightRun( obj, level ){

  obj.each(function(){
    //cl("a level:"+level+" id=["+this['node']["id"]+"]" );

    //try{
      mkLightOperationFromStyle( this );
    //}catch(e){
      //cl("style no id=["+this['node']["id"]+"] error: "+e);

    //}
    //console.log(this);
    if( this['type'] != "mask")
      mkLightRun( this, level+1);
  });




  return 0;
}
