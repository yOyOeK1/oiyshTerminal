
class s_otdmPage{

  constructor(){
    this.otdmMyList;

    this.cmdWork;
    this.pH;

    this.resL=0;
    this.resRet = false;
    this.mDoCmd = new mDoCmd();
    this.app = new mApp();
    this.fServiceIt = -1;
    this.fConfig = -1;/*new mDynoForm("config",{
     "otdm": {
      "prefix": "/data/data/com.termux/files/home/.otdm"
     },
     "node-red": {
      "host": "192.168.43.220",
      "port": 1880,
      "apiPath": ""
     },
     "grafana": {
      "host": "192.168.43.1",
      "port": 3000,
      "apiPath": "/api",
      "user": "admin",
      "passwd": "77777"
     },
     "mysql": {
      "host": "192.168.43.64",
      "port": 3306,
      "dbname": "svoiysh",
      "user": "ykpu",
      "passwd": "777777777777"
     },
     "mqtt": {
      "host": "192.168.43.1",
      "port": 10883
     }
   });*/

  }

  get getName(){
    return "OTDM";
  }

  get getDefaultBackgroundColor(){
		return "#cccccc";
	}

  appFrame( content, goTo = '' ){
    return `
<div date-role="header" data-position="inline">

  <button
    onclick="history.back()"
    class="ui-btn-left ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-arrow-l">
    Back to list.</button>
    `+(
      goTo != '' ? `
  <button
    onclick="pager.goToByHash('`+(goTo)+`')"
    class="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-forward">
    Go TO
  </button> `: ''
      )+`
</div>


<div role="main" class="ui-content">
<br><br>
  `+content+`
</div>
    `;
  }


  appDetails( appObj, iNo, itSrc ){
    var aUrl = appObj['external'] == true ? '/yss/external/'+appObj['dir'] : 'sites/'+appObj['dir'];
    var urlToGo = appObj['o'] != undefined ? 'pageByName='+appObj['o'].getName : 'page='+iNo;
    var myRand = parseInt( Math.random()*100000 );
    cl("aUrl");
    cl(aUrl);
    cl('app obj fields');
    cl( Object.keys(appObj) );

    var name = appObj['o'] != undefined ? appObj['o'].getName : appObj['oName'];
    if( name == undefined && appObj['name'] != undefined )
      name = appObj['name'];

    var det = {};
    var author = '';
    if( appObj['author'] )
      author = 'by '+( appObj['author'].indexOf('<') != -1 ? ( '<a href="mailto:'+appObj['author'].split("<")[1].replace('>','')+'?subject=Form yss.">'+appObj['author'].split("<")[0]+'</a>' ) : strToHtmlSafe( appObj['author'] ) );
    var icon = '';
    if( appObj['otdm'] && appObj['otdm']['icon'] != undefined )
      icon = '<li><img class="ui-shadow ui-corner-all" style="background-color:gray; border:1px solid white;width:85%;" src="'+aUrl+'/'+appObj['otdm']['icon']+'" /></li>\n';
    if( appObj['screenShots'] && appObj['screenShots'] != undefined )
      appObj['screenShots'].find( s => {
        icon+= '<li><img class="ui-shadow ui-corner-all" style="background-color:gray; border:1px solid white;width:85%;" src="'+aUrl+'/'+s+'" /><li>\n';
      });
    var versionIs = '';
    if( appObj['ver'] )
      versionIs = 'ver: '+appObj['ver']+' ';

    var homeUrl = '';
    if( appObj['otdm'] && appObj['otdm']['url-home']!=undefined )
      homeUrl = appObj['otdm']['url-home']
    if( det['Home page'] == undefined && appObj['Homepage'] )
      homeUrl = appObj['Homepage'];
    if( homeUrl != '' )
      det['Home page'] = `<a href="`+homeUrl+`">link...</a>`;


    if( appObj['installed'] != undefined )
      det['Installed'] = appObj['installed'];

    if( appObj['debFile'] != undefined )
      det['Filename'] = appObj['debFile'];
    if( appObj['tag'] != undefined )
      det['Tag'] = appObj['tag'];

    if( appObj['Depends'] != undefined && appObj['Depends'] != "" )
      det['Depends'] = otdmMakeLinks( appObj['Depends'] );
    if( appObj['Pre-Depends'] != undefined && appObj['Pre-Depends'] != "" )
      det['Pre-Depends'] = otdmMakeLinks( appObj['Pre-Depends'] );
    if( appObj['Recommends'] != undefined && appObj['Recommends'] != "" )
      det['Recommends'] = otdmMakeLinks( appObj['Recommends'] );
    if( appObj['X-OTDM'] != undefined && appObj['X-OTDM'] != '' ){
      cl("have x-otdm");
      cl(appObj['X-OTDM']);
      det['X-OTDM'] = appObj['X-OTDM'].join(', ');
    }

    if( itSrc == 'yssPages' ){
      det["Status"] = ( appObj['enable'] == true ? 'on' : 'off' );
      det["External"] = (appObj['external'] == true ? 'yes' : 'no' );
      det["Home dir"] = appObj['dir'];
      det["JSSRC files"] = appObj['jssrc'] ? appObj['jssrc'].length : 0;
      det["oName"] = appObj['oName'];
    }
    var urlToGoDisable = appObj['o'] == undefined ? 'disabled="disabled"': '';
    urlToGo = urlToGoDisable != '' ? '' : urlToGo;
    if( appObj['otdm'] )
      det['otdm'] = JSON.stringify( appObj['otdm'] );

    det['Source'] = itSrc;
    det['IndexNo'] = iNo;

//onclick="pager.goToByHash('pageByName=OTDM')"

    var tr = `
  <div data-role="controlgroup" >
    <div class="ui-grid-a">
      <div class="ui-block-a">

        <div class="imgSlider`+myRand+`">
          <ul class="slides">
          `+icon+`
          </ul>
        </div>
<!--
<button
  onclick="mkSlid`+myRand+`()">mk slide</button>
-->
<script>
function mkSlid`+myRand+`(){
  /*$('.imgSlider`+myRand+`').sss({
    slideShow: false
  });*/
  cl("maaaake flex slider")
  $('.imgSlider`+myRand+`').flexslider({
    //animation: "slide"
  });

}
$( document ).ready(function() {
  mkSlid`+myRand+`();
});
</script>

      </div>
      <div class="ui-block-b">
        <h1>`+name+`</h1>
        <small>`+versionIs+author+`</small>
      </div>
    </div>

  </div>

  <div data-role="controlgroup">
    <!--style="background-color:#00cc00;"-->


  <form>
    <input type="checkbox"
      onclick="cl('Do disable/enable of app')"
      name="appEnable" id="appEnable" data-mini="true"
       `+( appObj['enable'] == true ? 'checked': '')+`
       >
    <label for="appEnable">Enable</label>
  </form>


    <hr/>


    `;

    if( appObj['desc'] )
      tr+= appObj['desc']+'<hr/>';

    tr+=`

    <div class="ui-grid-a">
      `;
    var k = Object.keys( det );
    k.find(key => {
      tr+= `<div class="ui-block-a"><b>`+key+`:</b></div>`+
        `<div class="ui-block-b">`+det[key]+`</div>`;
    });


    tr+= urlToGo+ `
    </div>
  </div>`;

    return { "tr": tr, "urlToGo": urlToGo, 'debName':name };
  }

  doAppDetails( srcApp, appNo){
    tr = {'tr':''};
    if( this.otdmMyList == undefined  ){
      // direct request page
      var res = otdmArgs(
        { "ddpkg": "*" },
        this.otdmCallBackDoAppDetails
      );
      tr = {
        "tr": 'Loading ....all dpkg otdm packages'
      };

    }else if( srcApp == 'yssPages' ){
      tr = this.appDetails( yssPages[appNo], appNo, 'yssPages' );

    }else if( srcApp == 'dpkgDetails' ){
      cl("it's a dpkgDetails appp");
      cl("otdmMyList");
      cl(this.otdmMyList);
      tr = this.appDetails( this.otdmMyList[appNo], appNo, 'dpkg' );

    }



    cl("got url To Go");
    cl(tr['urlToGo']);
    $("#htmlDyno").html( this.app.appFrame({
      "title": tr['debName'],
      "content":tr['tr'],
      "goTo": tr['urlToGo'] == '' ? undefined : tr['urlToGo'],
      "backButton": 'history.back()',
    }) ).enhanceWithin();
  }


  doCmdTest(){

    var res = otdmArgs(
      { "testSubProcAndProm": "abc" },
      this.otdmCallBackDoCmdTest
    );
  }
  otdmCallBackDoCmdTest( data, res ){
    cl("data");
    cl(data)
  }

  doAptUpdate(){
    this.doCmd( "[/usr/bin/pkexec,--disable-internal-agent,apt,update]" );
  }

  doCmdUpdate(){
    var cmd = "["+$("#cmd").val()+"]";
    this.doCmd( cmd );
  }

  doCmd( cmd ){
    //this.mDoCmd.doCmd( cmd, 'spRes' );
    //return 1;
    if( this.cmdWork == true ){
      cl( 'cmd running can sand some stuff to stdin.' );
      cl(cmd);
      sOutSend('otdmCmd:'+this.pH+':'+cmd );
      return 0;
    }

    cl("do Apt Update :)");
    var pH = "pH"+(Math.round( Math.random()*100000 ) )+"_"+(Math.round( Math.random()*100000 ) );
    this.pH = pH;
    cl("pH: ["+pH+"]");
    $("#spRes").html("doing it.....["+cmd+"]<br>");

    //cmd = JSON.stringify(["ls", "/tmp"]),
    this.cmdWork = true;
    otdmArgs(
      {
        "webCmdSubProcess": cmd,
        'pH': pH
      },
      this.otdmCallBackWebCmdSubProcess
    );
  }


  otdmCallBackWebCmdSubProcess_4del( data, res ){
    cl("otdmCallBackWebCmdSubProcess");
    cl("data");
    cl(data);
  }


  otdmCallBackOnlyDataProcess( data, res ){
    var ps = [];
    var ks = Object.keys( data );
    for( var k=0,kc=ks.length; k<kc; k++ ){
      ps.push( data[ ks[k] ] );
    }
    pager.getCurrentPage().otdmMyList = ps;

  }

  otdmCallBackDoAppDetails( data, res ){
    pager.getCurrentPage().otdmCallBackOnlyDataProcess( data, res );
    cl("current i:"+urlArgs['i']);
    pager.getCurrentPage().doAppDetails(
      urlArgs['src'],
      urlArgs['i']
    );

  }

  otdmCallBack( data, res ){
    pager.getCurrentPage().otdmCallBackOnlyDataProcess( data, res );
    $("#otdmLV").html(
      '<div class="ui-controlgroup-controls ">'+
      pager.getCurrentPage().makeLVItems(
        pager.getCurrentPage().otdmMyList,
        'dpkgDetails'
      )+
      "</div>"
    );

  }


  otdmCallBackDoConfig( data, res, formName='config' ){
    data = mDict( data, (k,v)=>{
      return mDict( v, ( kk, vv )=>{
            if( kk == 'passwd' )
              vv = "7".repeat( String(vv).length );
            return vv;
        });
    });

    cl("data for call back form from  ....");cl(data);
    pager.getCurrentPage().fConfig = new mDynoForm(formName,data);
    let app = new mApp();

    let goTo = pager.getCurrentPage().getPageSelect();

    let tr = app.appFrame({
      "title": "otdm", // config
      "content": pager.getCurrentPage().fConfig.getHtml(),
      //'backButton': 'history.back()',
      'goTo':'raw:<div id="mSelGoTo">'+goTo+'</div>'
    });
    $("#htmlDyno").html( tr );


    setTimeout(()=>{

      $("#mSelGoTo select").selectmenu({
        icon: "bars"
        //'ui-btn-right ui-btn ui-btn-b ui-corner-all ui-btn-icon-right ui-icon-forward'
      });
      $("#mSelGoTo").attr('class', 'ui-btn-right ui-btn-inline ui-mini ui-icon-forward' );

      $('#htmlDyno input').textinput({
        disabled: true,
        theme: "b"
      });
      //$('#htmlDyno input').textinput( "refresh" );

      //.attr('class', 'ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-forward');
    },200);

    /*
    $("#htmlDyno").html( pager.getCurrentPage().appFrame(
      '<h1>otdm - config:</h1><hr/>'+
      pager.getCurrentPage().fConfig.getHtml()+
      '<pre>'+JSON.stringify(data, 1, 1 )+'</pre>'
    ));
    */
    $("#htmlDyno").enhanceWithin();
  }

  makeLVItems( doPages, src='yssPages' ){
    var tr = '';
    for(var p=0,pc=doPages.length; p<pc; p++ ){
      //cl("doPages["+p+"]");
      //cl(doPages[p]);
      var name = ( doPages[p]['o'] != null ? doPages[p]['o'].getName : doPages[p]['oName'] );
      if( name == undefined && doPages[p]['name'] != undefined )
        name = doPages[p]['name'];

      tr+= '<a href="#" '+
        //'onclick="pager.getCurrentPage().doAppDetails(\'yssPages\','+p+')" '+
        `onclick="pager.goToByHash('pageByName=OTDM&action=appDetials&src=`+src+`&i=`+p+`')" `+
        'class="ui-btn '+
          ( doPages[p]['enable'] == true ? 'ui-btn-a' : 'ui-btn-b' )+
          ( doPages[p]['external'] == true ? 'ui-btn-c' : '' )+
          ' ui-btn-icon-right ui-icon-carat-r">'+
        '['+( (doPages[p]['enable'] == true || doPages[p]['installed'] == true) ? 'on' : 'off' )+'] '+
        name+
        '</a>';
    }
    return tr;
  }

  getYssPages(){
    var tr= `
<div id="yssPagesNow">
  <form class="ui-filterable">
    <input id="filterBasic-input" data-type="search" />
  </form>
  <div id="otdmLV" data-role="controlgroup" data-filter="true" data-input="#filterBasic-input">
      `;


    if( urlArgs['action'] && urlArgs['action'] == 'dpkg' ){
      otdmChk();
      cl("now is otdmMyList");
      cl(this.otdmMyList);

      if( this.otdmMyList != undefined ){
        cl("no need to query there is a list ....");
        tr+= pager.getCurrentPage().makeLVItems(
            this.otdmMyList,'dpkgDetails'
          );

      }else{

        var res = otdmArgs(
          { "ddpkg": "*" },
          this.otdmCallBack
        );
        cl("res from otdmArgs---------");
        cl( res );
        tr+='Loading... dpkg data';

      }

    } else {
      var doPages = yssPages;
      tr+= this.makeLVItems( doPages );

    } // end main yssPages
    tr+= `
  </div>
</div>
<script>
setTimeout(()=>{
  cl("focus on filter field....");
  $("#filterBasic-input").focus();
},200);
</script>
`;

    cl("list view build.");
    return tr;
  }


  getPageSelect(){
    return `
    <select name="select-otdmPages" id="select-otdmPages" data-mini="true">
      <option value="installed" >Installed</option>
      <option value="dpkg" `+(urlArgs['action']=='dpkg' ? 'selected': '')+`>dpkg repository</option>
      <option value="cmd" `+(urlArgs['action']=='cmd' ? 'selected': '')+`>cmd</option>
      <option value="config" `+(urlArgs['action']=='config' ? 'selected': '')+`>config</option>
      <option value="versions" `+(urlArgs['action']=='versions' ? 'selected': '')+`>versions</option>

    </select>

    `;
  }

  pageSelectActivate(){
    $("#select-otdmPages").on(
      'change', (e)=>{
        cl('changed!');
        cl(e);
        cl(this);
        cl($("#select-otdmPages option:selected").val() );

        switch( $("#select-otdmPages option:selected").val() ){
          case "installed":
            pager.goToByHash('pageByName=OTDM');
            break;
          case "dpkg":
            pager.goToByHash('pageByName=OTDM&action=dpkg');
            break;
          case "config":
            pager.goToByHash('pageByName=OTDM&action=config');
            break;
          case "versions":
            pager.goToByHash('pageByName=OTDM&action=versions');
            break;
          case "cmd":
            pager.goToByHash('pageByName=OTDM&action=cmd');
            break;
        };

      }
    );
  }


  getPageSwitcher(){
    var tr = `
<form>
  <div clas="ui-field-contain">
    <label for="select-otdmPages">Loking at:</label>
    `+this.getPageSelect()+`
  </div>
</form>
    `;

    return tr;
  }


  pageMain(){
    /*
    return `
    <div id="otdmPage">
    <h1>OTDM</h1>

    `+(
      urlArgs['action'] == 'cmd' ?
      `<input id="cmd" type="text"
        value="`+( urlArgs['action'] == 'cmd' ? '/usr/bin/pkexec,--disable-internal-agent,whoami': '')+`"
         />
        <div id="spRes"></div>`:''
    )+`
    `+(
      urlArgs['action'] == 'cmd' ?
      `<button class="ui-btn"
        onclick="pager.getCurrentPage().doCmdUpdate()">
        do cmd</button>`: ''
    )+`

    `+(
      urlArgs['action']=='dpkg' ?
      `<button class="ui-btn"
        onclick="pager.getCurrentPage().doAptUpdate()">
        update repository</button>
      <div id="spRes"></div>`:''
    )+`

    <!--
    <button class="ui-btn"
      onclick="sOutSend('yssPage:rebuild')">
      trigger yssPage rebuild</button>

    <button
      onclick="pager.getCurrentPage().doAppDetails('yssPages',0)"
      >cl</button>
    <button
      onclick="pager.setPage(0)"
      >setPage</button>
    -->


    `+this.getPageSwitcher()+`
    `+this.getYssPages()+`

    </div>
    `;

    */
    let cont = '';
    if( urlArgs['action'] == 'cmd' ){
      cont+= `<input id="cmd" type="text"
        value="`+( urlArgs['action'] == 'cmd' ? '/usr/bin/pkexec,--disable-internal-agent,whoami': '')+`"
         />
        <div id="spRes"></div>`;
    }
    if( urlArgs['action'] == 'cmd' ){
      cont+= `<button class="ui-btn"
        onclick="pager.getCurrentPage().doCmdUpdate()">
        do cmd</button>`;
    }
    if( urlArgs['action'] == 'dpkg' ){
      cont+= `<button class="ui-btn"
        onclick="pager.getCurrentPage().doAptUpdate()">
        update repository</button>
      <div id="spRes"></div>`;
    }

    //cont+= this.getPageSwitcher();
    cont+= this.getYssPages();

    let app = new mApp();
    let goTo = pager.getCurrentPage().getPageSelect();
    let tr = app.appFrame({
      "title": "otdm", // config
      "content": cont,
      //'backButton': 'history.back()',
      'goTo':'raw:<div id="mSelGoTo">'+goTo+'</div>'
    });
    $("#htmlDyno").html( tr );


    setTimeout(()=>{

      $("#mSelGoTo select").selectmenu({
        icon: "bars"
        //'ui-btn-right ui-btn ui-btn-b ui-corner-all ui-btn-icon-right ui-icon-forward'
      });
      $("#mSelGoTo").attr('class', 'ui-btn-right ui-btn-inline ui-mini ui-icon-forward' );
    },100);

  }

  get getHtml(){
    var tr = '';

    if( urlArgs['action'] == 'appDetials' ){
      tr = this.doAppDetails(
        urlArgs['src'], urlArgs['i']
      );
      cl("app details");
      cl(tr);

    }else if( urlArgs['action'] == 'cmd' ){
      var trB = (
        urlArgs['action'] == 'cmd' || urlArgs['action'] == 'dpkg' ?
        `<input id="cmd" type="text"
          value="`+( urlArgs['action'] == 'cmd' ?
            //'./otdmTools.py,-testDialog,yes': ''
            //'mplayer,/home/yoyo/Music/AWS/3sirCWDglG4ZY.128.mp3': ''
            `sh,-c,seq 1 1 10 | while read -r line; do echo '--'$line;done`: ''
            )+`"
           />
          <div id="spRes">res..</div>`:''
        )+`
        `+(
        urlArgs['action'] == 'cmd' ?
        `<button class="ui-btn"
          onclick="pager.getCurrentPage().doCmdUpdate()">
          do cmd</button>`: ''
        );
      let app = new mApp();
      let goTo = pager.getCurrentPage().getPageSelect();
      tr = app.appFrame({
         "title": "otdm", // cmd
         "content": trB,
         //"backButton":"pager.goToByHash('pageByName=OTDM')",
         'goTo':'raw:<div id="mSelGoTo">'+goTo+'</div>'
      });

      // to correct go option
      setTimeout(()=>{
        $("#mSelGoTo select").selectmenu({
          icon: "bars"
          //'ui-btn-right ui-btn ui-btn-b ui-corner-all ui-btn-icon-right ui-icon-forward'
        });
        $("#mSelGoTo").attr('class', 'ui-btn-right ui-btn-inline ui-mini ui-icon-forward' );
      },100);


    }else if( urlArgs['action'] == 'config' ){
      tr = this.appFrame( 'Loading .... config' );

      otdmArgs(
        { "dfs": "/data/data/com.termux/files/home/.otdm/config.json" },
        this.otdmCallBackDoConfig
      );

    }else if( urlArgs['action'] == 'versions' ){
      tr = this.appFrame( 'Loading .... versions' );
      mott.sapiJ("ver/.json",(d)=>{
        if( d == -1 )
          cl("Error 2314");

        var td = { otdmTools: {"ver.":d.msg.otdmTools},
          serviceIt: {} };
        d.msg.serviceIt.find((e,i)=>{
          td.serviceIt[ e.name +" ver." ] = e.ver;
        });

        this.otdmCallBackDoConfig( td, 'success', 'versions' );

      });

    }else{
      tr = this.pageMain();
    }

    setTimeout(()=>{
      cl("Activate header menu ...");
      pager.getCurrentPage().pageSelectActivate();
    },200);

    return tr;
  }

  getHtmlAfterLoad(){
    cl("after load");
    //$("#otdmPage").enhanceWithin();
    setTimeout(()=>{
      cl("Activate2 header menu ...");
      pager.getCurrentPage().pageSelectActivate();
    },500);
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){
  }

  onMessageCallBack( r ){
    //console.log("s_otdmPage got msg ");
    //cl(r);
    if( r.topic == 'e01Mux/adc0' ){
      //putText("houBatVol", (""+(r.payload*(0.02771809)) ).substring(0,5) );

    }else if( r.topic == 'thisDevice/bat/perc' ){
      //putText("batPercent", r.payload+"%");

    }else if( pager.getCurrentPage().cmdWork &&
      r.topic == String("subP/"+pager.getCurrentPage().pH+"/status") ){
        cl("got status update on "+pager.getCurrentPage().pH+" msg:"+r.payload);
        if( r.payload == 'done' ){
          pager.getCurrentPage().cmdWork = false;
          cl("END web sub process work -----");
          $("#spRes").append('DONE');
        }


    }else if( r.topic.substring(0,5) == 'subP/'){

      var workS = pager.getCurrentPage().cmdWork;
      //cl("payload data");
      //cl(r.payload);

      if( typeof r.payload == 'object' ){
        var tr = [];
        var d = r.payload['data'];
        for( var b=0,bc=d.length; b<bc; b++ )
          tr.push( String.fromCharCode( d[b] ) );

        pager.getCurrentPage().addToRes( (tr.join("")) );
      }else
        pager.getCurrentPage().addToRes( r.payload.toString() );



    }
  }
  addToRes( msg ){
    $("#spRes").append(
      `<div id="resL`+this.resL+`">`+
      msg+
      `</div>`
    );

    //cl("got["+( msg.charCodeAt( msg.length-1 ).toString(16) )+"]");


    if( msg.charCodeAt( msg.length-1 ).toString(16) == 'd' ){
      //cl("back to same line");
      $("#resL"+(this.resL-1)).hide();
      this.resRet = true;
    }else{
      //cl("back ok");
      this.resRet = false
    }

    //$("#resL"+this.resL).slideDown();

    this.resL++;
    //cl("resLine:"+this.resL);
    var max = 10;
    if( this.resL > max )
      $("#resL"+(this.resL-max-1)).hide();
  }

}
