
class s_otdmPage{

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
    var det = {};
    var author = '';
    if( appObj['author'] )
      author = 'by '+( appObj['author'].indexOf('<') != -1 ? ( '<a href="mailto:'+appObj['author'].split("<")[1].replace('>','')+'?subject=Form yss.">'+appObj['author'].split("<")[0]+'</a>' ) : strToHtmlSafe( appObj['author'] ) );
    var icon = '';
    if( appObj['otdm']['icon']!=undefined )
      icon = '<li><img class="ui-shadow ui-corner-all" style="background-color:gray; border:1px solid white;width:85%;" src="'+aUrl+'/'+appObj['otdm']['icon']+'" /></li>\n';
    if( appObj['screenShots'] != undefined )
      appObj['screenShots'].find( s => {
        icon+= '<li><img class="ui-shadow ui-corner-all" style="background-color:gray; border:1px solid white;width:85%;" src="'+aUrl+'/'+s+'" /><li>\n';
      });
    var versionIs = '';
    if( appObj['ver'] )
      versionIs = 'ver: '+appObj['ver']+' ';
    if( appObj['otdm']['url-home']!=undefined )
      det['Home page']= `<a href="`+appObj['otdm']['url-home']+`">link...</a>`;
    det["Status"] = ( appObj['enable'] == true ? 'on' : 'off' );
    det["External"] = (appObj['external'] == true ? 'yes' : 'no' );
    det["Home dir"] = appObj['dir'];
    det["JSSRC files"] = appObj['jssrc'].length;
    det["oName"] = appObj['oName'];
    var urlToGoDisable = appObj['o'] == undefined ? 'disabled="disabled"': '';
    if( appObj['otdm'] )
      det['otdm'] = JSON.stringify( appObj['otdm'] );

    det['Source'] = itSrc;
    det['IndexNo'] = iNo;

    var tr = `
<div date-role="header" data-position="inline">
  <button
    onclick="pager.goToByHash('pageByName=OTDM')"
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
    tr = '';
    if( srcApp == 'yssPages' ){
      tr = this.appDetails( yssPages[appNo], appNo, 'yssPages' );
    }

    $("#htmlDyno").html( tr ).enhanceWithin();
  }

  getYssPages(){
    var tr= `
<div id="yssPagesNow">
  <form class="ui-filterable">
    <input id="filterBasic-input" data-type="search" />
  </form>
  <div data-role="controlgroup" data-filter="true" data-input="#filterBasic-input">
      `;
    for(var p=0,pc=yssPages.length; p<pc; p++ ){
      //cl("yssPages["+p+"]");
      //cl(yssPages[p]);

      tr+= '<a href="#" '+
        //'onclick="pager.getCurrentPage().doAppDetails(\'yssPages\','+p+')" '+
        `onclick="pager.goToByHash('pageByName=OTDM&action=appDetials&src=yssPages&i=`+p+`')" `+
        'class="ui-btn '+
          ( yssPages[p]['enable'] == true ? 'ui-btn-a' : 'ui-btn-b' )+
          ( yssPages[p]['external'] == true ? 'ui-btn-c' : '' )+
          ' ui-btn-icon-right ui-icon-carat-r">'+
        '['+( yssPages[p]['enable'] == true ? 'on' : 'off' )+'] '+
        ( yssPages[p]['o'] != null ? yssPages[p]['o'].getName : yssPages[p]['oName'] )+
        '</a>';

    }
    tr+= `
  </div>
</div>`;

    cl("list view build.");
    return tr;
  }

  getPageSwitcher(){
    var tr = `
<form>
  <div clas="ui-field-contain">
    <label for="select-otdmPages">Loking at:</label>
    <select name="select-otdmPages" id="select-otdmPages" data-mini="true">
      <option value="1" >Installed</option>
      <option value="2" >TODO - on Repo</option>
    </select>
  </div>
</form>
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
    trigger yssPage rebuild
    </button>

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
