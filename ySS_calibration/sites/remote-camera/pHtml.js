var yssRemCamHtml = `



<label for="devName">This device name:</label>
<input type="text" id="devName" name="devName" value="">
<button
  onclick="yssRemCamGoToS('main')" targe="_blank"
  >become a camera ...</button>

<div id="dHttpsSevrevStatus"></div>



`;


function yssRemCamGoToS(adr){
  let dName = $('#devName').val();
  if( dName == '' ){
    $('#devName').focus();
    $.toast({
        heading: 'Error',
        text: 'First set device name!',
        showHideTransition: 'slide',
        icon: 'error'
    });
  }else{

    //document.cookie = "devName="+dName+";expires=Fri, 31 Dec 9999 23:59:59 GMT;HttpOnly;SameSite=Lax";
    pager.setDevName( dName );


    cl("Go To https: "+adr+" devName: "+dName);
    //pager.goToByHash('pageByName=remote camera&p='+adr+'&devName='+dName);
    window.open(
      'https://192.168.43.220:4443/?p='+adr+"&devName="+dName,
    );
    //https://192.168.43.220:4443
  }
}

function yssRemCamMakeJs(){


}
