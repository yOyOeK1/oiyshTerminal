
function otdmChk(){
  cl('otdm Chk!!');
}

function otdmArgs( args, callBack=otdmGotRes ){
  cl("otdmArgs ["+JSON.stringify(args)+"]");
  tr = {};

  //var fName = "_"+(Math.random()*1000000)+"_"+( new Date().getTime() )+".json";
  //cl("fName: ["+fName+"]");
  var url = "?otdmQ:"+JSON.stringify(args);
  cl("otdmArgs -> url: ["+encodeURI(url)+"]---------------------");

  $.get( url, function( data, status ){
      callBack( JSON.parse( data ) , status );
  } );
  return tr;
}

function otdmGotRes( data, status ){
  cl(".get got :)\n status:");
  cl( status );
  cl("data ------------");
  cl(data);

}


// replace all names in string to links to details in otdm
function otdmMakeLinks( strs ){
  //cl("otdm finder ..."+strs);
  var ps = pager.getCurrentPage().otdmMyList;

  for(var p=0,pc=ps.length; p<pc; p++ ){
    strs = strs.replace(
      ps[p]['name'],
      '<a href="#" '+
        `onclick="pager.goToByHash('pageByName=OTDM&action=appDetials&src=dpkgDetails&i=`+p+`')" >`+ps[p]['name']+`</a>`
    );
  }

  return strs;
}
