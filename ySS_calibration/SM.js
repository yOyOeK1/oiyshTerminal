

class SM{

  screens = [];
  myNo = -1;
  /* action
  0 - enterd the page
  1 - reqesting screens to raport them selfs wait 2 sec.
    screens will display ther No's
  2 - screens list

  */
  action = 0;

  constructor(){
    cl("SM constructor started!");
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
  }

  identifyYourSelfTO(){
    $("#SMIdentDiv").fadeOut( "slow" );
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
<h2>Screens Manager</h2>
<div id="SMdeb"></div>
`;
    if( pager.pageHistory.length>0 ){
      for(var p=(pager.pageHistory.length-2);p>=0;p--){
        if( pager.pageHistory[p] != -1 )
          tr+= '<input type="button" value="<- back to: ';
          tr+= pager.pages[ pager.pageHistory[p] ].getName;
          tr+= '" onclick="pager.setPage('+pager.pageHistory[p]+')">';
          break;
      }
    }
    tr += `
<input type="button" value="Identify screens" onclick="sm.sendIdentOn()">
<br>
Send to all screens:
<input type="button" value="full screen TODO" onclick="sm.sendToAllCMD('mkfullscreen')" >
<input type="button" value="invert" onclick="sm.sendToAllCMD('mkShader.invert')" >
<input type="button" value="black red" onclick="sm.sendToAllCMD('mkShader.blackRed')" >
<input type="button" value="normal" onclick="sm.sendToAllCMD('mkShader.normal')" >
<input type="button" value="R" onclick="sm.sendToAllCMD('mkShader.rotate')" >

<input type="button" value="reload" onclick="sm.sendToAllCMD('reload')" >

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
    var tr = '<select onchange="sm.sendPageChange('+No+',this.value)">';
    tr+= '<option value="-1">menu</option>';
    var p = pager.getPagesList();
    for(var o=0;o<p.length;o++){
      tr+= '<option value="'+o+'"';
      if( o == selectedIs )
        tr+= ' selected';
      tr+= '>'+p[o].getName+'</option>';
    }
    tr+= '</select>';
    return tr;
  }

  shaderBts( No ){
    var tr = '';
    //tr+= '<input type="button" value="full screen TODO" onclick="sm.sendCmd('+No+',\'mkfullscreen\')" >';
    tr+= '<input type="button" value="invert" onclick="sm.sendCmd('+No+',\'mkShader.invert\')" > ';
    tr+= '<input type="button" value="black red" onclick="sm.sendCmd('+No+',\'mkShader.blackRed\')" > ';
    tr+= '<input type="button" value="normal" onclick="sm.sendCmd('+No+',\'mkShader.normal\')" > ';
    tr+= '<input type="button" value="R" onclick="sm.sendCmd('+No+',\'mkShader.rotate\')" > ';
    tr+= '<input type="button" value="reload" onclick="sm.sendCmd('+No+',\'reload\')" > ';
    return tr;
  }

  addScreen(s){
    if( s[0] != this.myNo ){
      this.screens.push(s);
      var tr = '<hr>'+'Screen No: '+s[0]+'<br>';
      //tr+= 'current page: '+s[1]+'<br>';
      tr+= this.cbOfPages( s[0], s[1] )+' ';
      tr+= this.shaderBts( s[0] );
      $("#SMdiv").html(
        $("#SMdiv").html() + tr
      );
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
