
// chrome://flags/#unsafely-treat-insecure-origin-as-secure

class s_remoteCameraPage{


  construcetor(){
    cl("s_remoteCameraPage init ....");
    this.app = new mApp();
  }

  get getName(){
    return "remote camera";
  }

  get getDefaultBackgroundColor(){
    return "#ccc";
  }

  get getHtml(){
    //#pageByName=remote%20camera&p=main&devName=isDell&0.2781911874561849

    // main page of remote device
    if( urlArgs['p'] == "main" && urlArgs['devName'] != '' ){
      return 'ok remote device ... '+urlArgs['devName']+'<hr>'+
        `
        <iframe src="https://192.168.43.220:4443/?p=`+urlArgs['p']+`&dName=`+urlArgs['devName']+`"
        style="height:50vh;width:50vw;"
        frameborder="0"></iframe>

        `;


    // main landing page
    }else{

      setTimeout(()=>{
        $("#dForCam").html(yssRemCamHtml);
      },300);
      return '<b>'+pager.getCurrentPage().getName+'<b><div id="dForCam"></div>'+
      `<div id="dRemCamImgs"></div>
      <br>
      <div id="dRemCamImgs2"></div>`;
    }
  }

  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );
    setTimeout( ()=>{
      yssRemCamMakeJs();

      $('#devName').val( getCookie('devName') );

      $("#dHttpsSevrevStatus").html("TODO check server https status ....");
    }, 1000 );
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack( r ){
    cl(
      pager.getCurrentPage().getName+
      " - got msg "
    );

    if( r.topic == 'remcam' ){
      $("#dRemCamImgs2").html(
        `<img src="sites/remote-camera/localHttps/`+r.payload+`" onload="$('#dRemCamImgs').attr('src', $('#dRemCamImgs2').attr('src') );" alt="ok or no">`
      );
    }


  }

}
