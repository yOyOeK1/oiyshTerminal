
class s_otdmPage{

  otdmMyList;

  get getName(){
    return "OTDM";
  }

  get getDefaultBackgroundColor(){
		return "#cccccc";
	}


  appDetails( appObj, iNo, itSrc ){
    var aUrl = appObj['external'] == true ? '/yss/external/'+appObj['dir'] : 'sites/'+appObj['dir'];
    var urlToGo = appObj['o'] != undefined ? 'pageByName='+appObj['o'].getName : 'page='+iNo;
    var myRand = parseInt( Math.random()*100000 );
    cl("aUrl");
    cl(aUrl);

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

    if( itSrc == 'yssPages' ){
      det["Status"] = ( appObj['enable'] == true ? 'on' : 'off' );
      det["External"] = (appObj['external'] == true ? 'yes' : 'no' );
      det["Home dir"] = appObj['dir'];
      det["JSSRC files"] = appObj['jssrc'] ? appObj['jssrc'].length : 0;
      det["oName"] = appObj['oName'];
    }
    var urlToGoDisable = appObj['o'] == undefined ? 'disabled="disabled"': '';
    if( appObj['otdm'] )
      det['otdm'] = JSON.stringify( appObj['otdm'] );

    det['Source'] = itSrc;
    det['IndexNo'] = iNo;

//onclick="pager.goToByHash('pageByName=OTDM')"
    var tr = `
<div date-role="header" data-position="inline">
  <button
    onclick="history.back()"
    class="ui-btn-left ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-arrow-l">
    Back to list.</button>




  <button
    `+urlToGoDisable+`
    onclick="pager.goToByHash('`+(urlToGo)+`')"
    class="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-forward">
    Go TO
  </button>

</div>


<div role="main" class="ui-content">
  <br><br>
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

    tr+=`
    </div>
  </div>
</div>

    `;
    return tr;
  }

  doAppDetails( srcApp, appNo){
    if( this.otdmMyList == undefined ){
      // direct request page
      $("#htmlDyno").html( "Loading ...." );
      var res = otdmArgs(
        { "ddpkg": "*" },
        this.otdmCallBackDoAppDetails
      );
      return 0;
    }

    tr = '';
    if( srcApp == 'yssPages' ){
      tr = this.appDetails( yssPages[appNo], appNo, 'yssPages' );

    }else if( srcApp == 'dpkgDetails' ){
      cl("it's a dpkgDetails appp");
      cl("otdmMyList");
      cl(this.otdmMyList);
      tr = this.appDetails( this.otdmMyList[appNo], appNo, 'dpkg' );

    }

    $("#htmlDyno").html( tr ).enhanceWithin();
  }

  otdmCallBackOnlyDataProcess( data, res ){
    if( 0 ){
      cl("otdmCallBack");
      cl("data");
      cl(data);
      cl("res");
      cl(res);
    }

    var ps = [];
    var ks = Object.keys( data );
    for( var k=0,kc=ks.length; k<kc; k++ ){
      ps.push( data[ ks[k] ] );
    }
    //cl("ps now ");
    //cl(ps);

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
        tr+='Loading...';

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

  getPageSwitcher(){
    var tr = `
<form>
  <div clas="ui-field-contain">
    <label for="select-otdmPages">Loking at:</label>
    <select name="select-otdmPages" id="select-otdmPages" data-mini="true">
      <option value="installed" >Installed</option>
      <option value="dpkg" `+(urlArgs['action'] ? 'selected': '')+`>dpkg repository</option>
    </select>
  </div>
</form>
<script>
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
    };

  }
);
</script>
    `;



    return tr;
  }


  pageMain(){
    return `
    <div id="otdmPage">
    <h1>OTDM</h1>

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
  }

  get getHtml(){
    tr = '';

    if( urlArgs['action'] == 'appDetials' ){
      tr = this.doAppDetails(
        urlArgs['src'], urlArgs['i']
      );
    }else{
      tr = this.pageMain();
    }


    return tr;
  }

  getHtmlAfterLoad(){
    cl("after load");
    //$("#otdmPage").enhanceWithin();
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){
  }

  onMessageCallBack( r ){
    console.log("s_otdmPage got msg ");
    if( r.topic == 'e01Mux/adc0' ){
      putText("houBatVol", (""+(r.payload*(0.02771809)) ).substring(0,5) );


    }else if( r.topic == 'thisDevice/bat/perc' ){
      //putText("batPercent", r.payload+"%");
    }
  }

}
