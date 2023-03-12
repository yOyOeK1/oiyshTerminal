
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
    setTimeout(()=>{
      $("#dForCam").html(yssRemCamHtml);
    },300);
    return '<b>'+pager.getCurrentPage().getName+'<b><div id="dForCam"></div>'+
    `<div id="dRemCamImgs"></div>
    <div id="dRemCamImgs2"></div>`;
  }

  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );
    setTimeout( yssRemCamMakeJs, 1000 );
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
      $("#dRemCamImgs").html(
        `<img src="sites/remote-camera/localHttps/`+r.payload+`" alt="ok or no">`
      );
    }


  }

}
