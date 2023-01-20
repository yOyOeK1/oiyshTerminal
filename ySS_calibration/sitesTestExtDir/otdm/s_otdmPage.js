
class s_otdmPage{

  get getName(){
    return "OTDM";
  }

  get getDefaultBackgroundColor(){
		return "#cccccc";
	}


  appDetails( appObj ){
    var aUrl = appObj['external'] == true ? '' : 'sites/'+appObj['dir'];
    var name = appObj['o'] != undefined ? appObj['o'].getName : appObj['oName'];
    var det = {};
    if( appObj['desc'] )
      det['Desctription'] = appObj['desc'];
    if( appObj['author'] )
      det['Author'] = encodeURI( appObj['author'] );
    if( appObj['ver'] )
      det['Version site'] = appObj['ver'];
    det["Status"] = ( appObj['enable'] == true ? 'on' : 'off' );
    det["External"] = (appObj['external'] == true ? 'yes' : 'no' );
    det["Home dir"] = appObj['dir'];
    det["JSSRC files"] = appObj['jssrc'].length;
    det["oName"] = appObj['oName'];


    if( appObj['otdm'] )
      det['otdm'] = JSON.stringify( appObj['otdm'] );

    var tr = `
<div date-role="header">
  <button
    onclick="window.location.hash='pageByName=OTDM&`+(Math.random())+`'"
    class="ui-btn-left ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-arrow-l">
    Back to list.</button>

  <button
    onclick="window.location.hash='pageByName=`+(appObj['o'].getName)+`'"
    class="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-forward">
    Go TO
  </button>

</div>


<div role="main" class="ui-content" >
  <div data-role="controlgroup"
    >
    <!--style="background-image: url('`+aUrl+'/'+`screen01.png');"-->
    <h1>`+name+`</h1>
    `+( appObj['otdm']['icon']!=undefined ?
      '<img height="25%" src="'+aUrl+'/'+appObj['otdm']['icon']+'">' :
      '' )+`
    <hr/>
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




    <div class="ui-grid-a">
      `;
      var k = Object.keys( det );
      k.find(key => {
        tr+= `<div class="ui-block-a"><b>`+key+`:</b></div>`+
          `<div class="ui-block-b">`+det[key]+`</div>`;
      });

      tr+=`
    </div>
    `+( appObj['otdm']['url-home']!=undefined ? 'Home page: <a href="'+appObj['otdm']['url-home']+'">link...</a>' : '')+`


  </div>
</div>

    `;
    return tr;
  }

  doAppDetails( srcApp, appNo){
    tr = '';
    if( srcApp == 'yssPages' ){
      tr = pager.getCurrentPage().appDetails( yssPages[appNo] );
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
        'onclick="pager.getCurrentPage().doAppDetails(\'yssPages\','+p+')" '+
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


    `+pager.getCurrentPage().getPageSwitcher()+`
    `+pager.getCurrentPage().getYssPages()+`

    </div>
    `;
  }

  getHtml(){
    tr = '';

    if( urlArgs['action'] == 'appDetials' ){
      tr = pager.getCurrentPage().doAppDetails(
        urlArgs['src'],urlArgs['i']
      );
    }else{
      tr = pager.getCurrentPage().pageMain();
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
