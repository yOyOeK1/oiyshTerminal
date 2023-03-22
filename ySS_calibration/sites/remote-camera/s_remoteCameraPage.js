
// chrome://flags/#unsafely-treat-insecure-origin-as-secure

class s_remoteCameraPage{


  constructor(){
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
    let cp = pager.getCurrentPage();

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

      //setTimeout(()=>{
      //  $("#dForCam").html(yssRemCamHtml);
      //},300);


      let cont = '<div id="dForCam"></div>'+
        `<div id="dRemCamImgs">`+yssRemCamHtml+`</div>
          <br>
        <div id="dRemCamImgs2"></div>`+
        '<div id="RCList">'+
          this.app.buildListView( {
            "header": "Remotes ...",
            "headerTip": 0,
            "items":[this.app.lvElement('remotes..',{})]
          })+
        "</div>";


      return this.app.appFrame({
        'title':  cp.getName,
        'content': cont
        });
    }
  }





  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );
    setTimeout( ()=>{
      yssRemCamMakeJs();

      $('#devName').val( pager.getDevName() );

      $("#dHttpsSevrevStatus").html("TODO check server https status ....");
    }, 1000 );
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}


  buildDivForRC( name ){
    if( pager.getCurrentPage()['divDone'+name] == undefined ){
      cl('not pressend adding ....');
      let itemCont = `
      <div id="drc_`+name+`">
        Sensors:<div id="drcStatus_`+name+`">`;

      for(let s=0,sc=navApiList.length; s<sc; s++ ){
        itemCont+=`<img style="width:24px;height:24px;display:none;"
          src="sites/remote-camera/localHttps/icon_`+
          navApiList[s]+
          `.svg" id="dSen_`+navApiList[s]+`">`+
          `<div id="dSenVals_`+navApiList[s]+`"></div>`;




      }

      itemCont+=`<div>
        <div id="drcImg_`+name+`"></div>
      </div>`;

      let item = this.app.lvElement(
        name,
        {
          'content': itemCont
        }
      );

      $("#RCList ul>li:eq(1)").append( item );

      pager.getCurrentPage()['divDone'+name] = true;
    }else{
      cl('is!');
    }
  }

  onMessageCallBack( r ){
    cl(
      pager.getCurrentPage().getName+
      " - got msg "
    );


    let tSplit = r.topic.split('/');

    if( tSplit.length == 3 && tSplit[0] == 'remcam' ){
      let dn = tSplit[1];
      let navApi = tSplit[2];
      pager.getCurrentPage().buildDivForRC( dn );
      cl("show...");
      cl(r );
      cl("#drcStatus_"+dn+" #dSenVals_"+navApi);
      $("#drcStatus_"+dn+" #dSenVals_"+navApi).html( '<pre>'+JSON.stringify(r.payload )+'</pre>' );




    }else if( r.topic == "remcam/statusUpdate" ){
      let dn = r.devName;
      pager.getCurrentPage().buildDivForRC( dn );
      if( r.testResult == "1" )
        $("#drcStatus_"+dn+" #dSen_"+r.navApi).show();
      cl("#drcStatus_"+dn+" #dSen_"+r.navApi);
      cl("show...");



    }else if( r.topic == 'remcam' ){
      let dn = r.devName;
      pager.getCurrentPage().buildDivForRC( dn );


      $("#drcImg_"+dn).html(
        `<img src="sites/remote-camera/localHttps/`+r.payload+`" alt="ok or no">`
      );
    }


  }

}
