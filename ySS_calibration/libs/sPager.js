

/**
 * Class sPager is a helper from oiyshTerminal family - Main class
 * But we should refer to instance `pager` Nice!
 *
 * This one is helping managing sites. Having menu shaders and work with Screens manager. This is only a documentation to help you how to use it to do somethin you want!
 *
 * @example
 *
 * let cp = pager.getCurrentPage();
 *
 * *will give you a curent page object. You on page from elsvare calld*
 *
 * pager.goToByHash('pageByName=pack it so')
 *
 * *returns {string} - can be use in onclick="returndValue" to get proper back and change page*
 *
 */
class sPager {

  constructor(){
    this.currentPage = -1;
    this.pages = new Array();
    cl("sPager constructor done !");
    this.sm = -1;
    this.pageHistory = [];
  }

  setScreenManager(s){
    this.sm = s;
  }


  getCurrentPage(){
    return this.pages[ this.currentPage ];
  }

  wsCallbackExternal( r ){
    //cl("wsCallbackExternal got msg");
    //cl(r);
    this.wsCallback( r );
  }


  subTask( t ){
    pager.myCallCheet().then( t );
  }

  async myCallCheet(){
    return 1;
  }

  wsCallback( r ){

    if(r.topic && r.payload){
        if(r.topic == "SMForYou" ){
          cl("got my screen name !"+r.payload);
          cl(r.payload);
          this.sm.setMyNo( r.payload );

        }else if(r.topic == "SMidentifyOn"){
          cl("got identifyOn cmd !");
          this.sm.identifyYourSelf();

        }else if(r.topic == 'SMCmdTo' && r.No == sm.myNo ){
          cl("got cmd to:["+r.payload+']')
          if( r.payload.substring(0,8) == "setPage:" )
            klikPageNo( r.payload.substring(8) );
          else if( r.payload == "mkShader.invert" )
            mkShader('invert');
          else if( r.payload == "mkShader.blackRed" )
            mkShader('blackRed');
          else if( r.payload == "mkShader.normal" )
            mkShader('normal');
          else if( r.payload == "mkShader.rotate" )
            mkShader('rotate');
          else if( r.payload == "mkfullscreen" ){
            setTimeout(mkfullscreen,100);
          }else if( r.payload == "reload" )
            location.reload();

        }else if(r.topic == "SMToAll"){
          cl("got cmd to all ! ["+r.payload+"]");
          if( r.payload == "mkShader.invert" )
            mkShader('invert');
          else if( r.payload == "mkShader.blackRed" )
            mkShader('blackRed');
          else if( r.payload == "mkShader.normal" )
            mkShader('normal');
          else if( r.payload == "mkShader.rotate" )
            mkShader('rotate');
          else if( r.payload == "mkfullscreen" ){
            setTimeout(mkfullscreen,100);
          }else if( r.payload == "reload" )
            location.reload();

        }

    }

    if( this.currentPage == -1 ){
      cl("pager dumm callback:");
      if(0){
        cl("for debug only");
        cl(r);
        cl("topic:["+r.topic+"]");
        cl("payload:["+r.payload+"]");
      }
    }else{
      this.myCallCheet().then(
        pager.getCurrentPage().onMessageCallBack(r)
      );

    }
  }

  addPage( obj ){
    cl("sPager add page: ["+obj.getName+"] as "+(this.pages.length) );
    this.pages.push( obj );
  }

  makeLooperIter(){
    //cl("pager looper iter...");
    try{
      this.getCurrentPage().looperIter();
    }catch( e ){}
  }

  /**
   * @param {integer} pageNo - will sec curent site from `this.pages[pageNo]` to set now
   * @description Methode - **not recomendet** shortest way to set now a different site but not the best. Check `.goToByHash()`
   */
  setPage( pageNo ){
    cl("setPage"+pageNo);
    $.mobile.panel();
    this.currentPage = pageNo;
    this.pageHistory.push( pageNo );

    /*
    $('.pageItemsLi').each(function(i){
      if( i == pager.currentPage ){
        $(this).attr({
          'class':"pageItemsLi ui-bar ui-bar-b"
        });
      }else{
        $(this).attr({
          'class':"pageItemsLi ui-bar ui-bar-a"
        });
      }
    });
    */
    cl("TODO  - page selector !");
    //console.log("pageHistory:");
    //console.log(this.pageHistory)

    mkShaderResuming = true;
    mkShader('normal');
    this.setCssForPage();
    mkShaderResuming = false;

    cl("sPager set page to: "+pageNo);

    this.getPage();
    document.cookie="lastPage="+pageNo+";max-age=31536000;";
    mkShaderStoreResume();

    navBatteryPercent( this );
    $('#panelMenu').panel('close');


    setSvgFit();


    console.log("---- ts5 --- disable text-shadows");
    $("tspan").each(function( i ){
      //console.log("ts5 "+i+": "+$(this).html()+" -- >" );
      //console.log( $(this) );
      $(this).css('text-shadow','0 0 0 #0000');//'10px 15px 5px #f3f3f366');
    });

    cl("scroll to top ...");
    $(document.body).scrollTop( 0 );
  }

  setCssForPage(){
    var bgColor = this.getPageBGColor;
    $(document.body).css(
      "background-color", bgColor
      );
      $(document.body).css(
        "color", mkLightHex(bgColor,'invert')
        );

    $(".defBg").css(
	    "background-color", bgColor
    );

    cl("default background set: "+bgColor);
  }

  get getPageBGColor(){
    try{
      return this.getCurrentPage().getDefaultBackgroundColor;
    }catch(e){
      cl("pageNo: "+this.currentPage+" don't have getDefaultBackgroundColor()");
      return "#ffffff";
    }
  }

  getPage(){
    cl("getHtml current page: "+this.currentPage);
    lAngels = {};
    movePathStartOffset = {};
    putTextStorage = {};

    if( this.currentPage == -1 ){
      this.getMenu();
      $("#svgDyno").html("");
    }else{
      var cp = this.getCurrentPage();
      $("#svgDyno").html("");
      console.log("----------------- mobile get active page ----------------");
      $("#htmlDyno").html( cp.getHtml ).enhanceWithin();
      //console.log($(":mobile-pagecontainer").pagecontainer("getActivePage"));
      //$(":mobile-pagecontainer").pagecontainer("getActivePage");
      //$('#htmlDyno').enhanceWithin();
      //$("#htmlDyno").enhanceWithin();
      console.log("----------------- mobile get active page ---------DONE");
      cp.getHtmlAfterLoad();
      try{
        var abcueoa = 1213;
      }catch(e){
        cl("sPage page "+this.currentPage+" don't have getHtmlAfterLoad() error["+e+"]");
      }
      $("#svgDyno").html( cp.svgDyno );

      cp.svgDynoAfterLoad();
    }

  }


  getPagesList(){
    return this.pages;
  }

  /**
   * @param {string} url - in zone of yss
   * @returns {string} correct string to use in `onclick="returnValue"` to sustain back in browser. Passing arguments and not reload ish
   *
   * @example
   * ```javascript
   * // clean way to change a page and ads timestamp
   * // at end as updater to reduce chaching
   * pager.goToByHash('pageByName=pack it so');
   * ```
   */
  goToByHash( url ){
    window.location.hash=url+`&`+(Math.random());
  }

  getMenu(){
    var ta = "";

    for(var i=0;i<this.pages.length;i++){
      /*
      ta+= '<input type="button" class="menu-button"';
      ta+= 'value="'+this.pages[i].getName+'" ';
      ta+= 'onclick="pager.setPage('+i+')"/>';
      ta+= '<br>';
      */
      ta+= `
<li class="pageItemsLi">
  <a href="" data-rel="close"`+
    //`onclick="pager.setPage(`+i+`)"`+
    `onclick="pager.goToByHash('page=`+i+`')"`+
    `>`+this.pages[i].getName+`</a>
</li>`;
    }

    //$("#htmlDyno").html( ta ).enhanceWithin();

    $( ta ).insertBefore( ".innerMenuList" );
    $("#menuListView").listview('refresh');
    //console.log("------ menuListView content ----------");
    //console.log($("#menuListView").html());

    //$("#menuListView").html().enhanceWithin();

  }

}
