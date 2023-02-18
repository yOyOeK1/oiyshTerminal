

class SM{

  constructor(){
    cl("SM constructor started!");
    this.screens = [];
    this.myNo = -1;
    /* action
    0 - enterd the page
    1 - reqesting screens to raport them selfs wait 2 sec.
    screens will display ther No's
    2 - screens list

    */
    this.action = 0;
  }


  setMyNo(n){
    if( this.myNo == -1){
      cl("SM setMyNo:"+n);
      this.myNo = n;
      $("#SMNo").text(n);

    }else{
      cl("SM setMyNo is not for me. I have "+this.myNo);
    }
  }

  startIt(){
    cl("SM startIt");
    cl("SM myNo is:"+this.myNo);
    this.action = 0;

    for( var p=0;p<pager.pages.length;p++){
      if(pager.pages[p].getName == this.getName){
        klikPageNo(p);
        $(".bottomPanelContainer").hide();
        break;
      }

    }



  }


  sendToAllCMD(c){
    cl("SM send to all a cmd ["+c+"]");
    sOutSend('SMToAll:'+c);
  }

  sendPageChange( No, pNo){
    this.sendCmd( No, 'setPage:'+pNo );
  }

  sendCmd( No, cmd ){
    cl("SM send cmd No"+No+" cmd"+cmd);
    sOutSend('SMCmdTo,'+No+','+cmd);
  }

  sendIdentOn(){
    cl("SM send IdentOn");
    this.screens = [];
    $("#SMdiv").html('');
    sOutSend('SM:identifyOn');
  }

  identifyYourSelf(){
    $("#SMIdentDiv").text( this.myNo );
    $("#SMIdentDiv").fadeIn();
    setTimeout( sm.identifyYourSelfTO,2000 );
    sOutSend("SMStat:"+this.myNo+","+pager.currentPage);
    //$('#SMIdentPop').popup( 'open' );
    console.log('pop test !');
  }

  identifyYourSelfTO(){
    $("#SMIdentDiv").fadeOut( "slow" );
    //$('#SMIdentPop').popup( 'close' );
  }





  // for pager
  get getName(){
    return 'Screens Manager';
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  get getHtml(){
    var tr = `
<div id="SMdeb"></div>

<div class="ui-field-contain">
  <label for="smSMButtons">Screens Manager</label>
  <fieldset name="smSMButtons" data-role="controlgroup" data-type="horizontal">

`;
    if( pager.pageHistory.length>0 ){
      for(var p=(pager.pageHistory.length-2);p>0;p--){
        if( pager.pageHistory[p] != -1 )
          tr+= '<button '+
            'onclick="pager.setPage('+pager.pageHistory[p]+')" >'+
            '<-- '+pager.pages[ pager.pageHistory[p] ].getName+
            '</button>';
          break;
      }
    }
    tr += `
    <button tittle="Identify screens" onclick="sm.sendIdentOn()" >
      Identify screens
    </button>
  </fieldset>
</div>





<div class="ui-field-contain">
  <label for="smSenToAll">Send to all:</label>
  <fieldset name="smSenToAll" data-role="controlgroup" data-type="horizontal">

  <button title="fullscreen" onclick="sm.sendToAllCMD('mkfullscreen')" >
    <img src="./icons/fullscreen.svg">‎
  </button>
  <button title="invert" onclick="sm.sendToAllCMD('mkShader.invert')" >
    <img src="./icons/arrow-down-up.svg">‎
  </button>
  <button title="black red" onclick="sm.sendToAllCMD('mkShader.blackRed')" >
    <img src="./icons/moon-stars.svg">‎
  </button>
  <button title="normal" onclick="sm.sendToAllCMD('mkShader.normal')" >
    <img src="./icons/journal-check.svg">‎
  </button>
  <button title="rotate" onclick="sm.sendToAllCMD('mkShader.rotate')" >
    <img src="./icons/bootstrap-reboot.svg">‎
  </button>

  <button title="rotate" onclick="sm.sendToAllCMD('reload')" >
    <img src="./icons/arrow-clockwise.svg">‎
  </button>

  </fieldset>
</div>

<div id="SMdiv">---</div>
    `;

    return tr;
  }

  getHtmlAfterLoad(){
    setTimeout(sm.sendIdentOn,200);
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){
  }
  // for pager


  cbOfPages( No, selectedIs ){
    var trr = '<select onchange="sm.sendPageChange('+No+',this.value)" id="select-native-'+No+'">';
    trr += '<option value="-1">menu</option>';
    var p = pager.getPagesList();
    for(var o=0;o<p.length;o++){
      trr += '<option value="'+o+'"';
      if( o == selectedIs )
        trr += ' selected';
      trr += '>'+p[o].getName+'</option>';
    }
    trr+= '</select>';
    return trr;
  }

  shaderBts( No ){
    var tr = '';//`<span> </span>`;
    //tr+= '<input type="button" value="full screen TODO" onclick="sm.sendCmd('+No+',\'mkfullscreen\')" >';
    tr+= '<button title="invert" onclick="sm.sendCmd('+No+',\'mkShader.invert\')" ><img src="./icons/arrow-down-up.svg">‎ </button> ';
    tr+= '<button title="black red" onclick="sm.sendCmd('+No+',\'mkShader.blackRed\')" ><img src="./icons/moon-stars.svg">‎ </button> ';
    tr+= '<button title="normal" onclick="sm.sendCmd('+No+',\'mkShader.normal\')" ><img src="./icons/journal-check.svg">‎ </button> ';
    tr+= '<button title="R" onclick="sm.sendCmd('+No+',\'mkShader.rotate\')" ><img src="./icons/bootstrap-reboot.svg">‎ </button> ';
    tr+= '<button title="reload" onclick="sm.sendCmd('+No+',\'reload\')" ><img src="./icons/arrow-clockwise.svg">‎ </button> ';
    return tr;
  }

  addScreen(s){
    if( s[0] != this.myNo ){
      this.screens.push(s);
      var tr = '';
      //tr+= 'current page: '+s[1]+'<br>';
      //tr+= '<div class="ui-grid-a">';
      //tr+= '<div class="ui-field-contain">';
      tr+= '<label for="screen-controlgroup">Screen No: '+s[0]+'</label>';
      tr+= '<div data-role="controlgroup" data-type="horizontal">';
      tr+= this.cbOfPages( s[0], s[1] );
      //tr+= '</div>';
      //tr+= '</div>';

      //tr+= '<div class="ui-grid-b">';
      //tr+= '<div class="ui-field-contain">';
      //tr+= '<label for="scNoBts'+s[0]+'">Send:</label>';
      //tr+= `<fieldset name="scNo`+s[0]+`Bts" data-role="controlgroup" data-type="horizontal">`;
      tr+= this.shaderBts( s[0] );
      //tr+= `</fieldset>`;
      tr+= `</div>`;
      //tr+= '</div>';

      $("#SMdiv").append(
        '<div id="rsn'+s[0]+'">'+tr+'</div>'
      )//.enhanceWithin();//.enhanceWithin();
      $('#rsn'+s[0]).enhanceWithin();
    }
  }

  onMessageCallBack( r ){
    if(r.topic && r.payload){
        if(r.topic == "SMStat" ){
          cl('SM ['+r.payload+']');
          var s = r.payload.split(',');

          sm.addScreen(s);
        }
    }

  }



}
