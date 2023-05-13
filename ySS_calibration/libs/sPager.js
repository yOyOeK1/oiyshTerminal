

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
    let cc = new otCl(`sPager`);
    this.cl = function(){cc.doClFromArgs( arguments );  };


    this.currentPage = -1;
    this.pages = new Array();
    this.cl("sPager constructor done !");
    this.sm = -1;
    this.pageHistory = [];
  }

  setHeader( title ){
    if( title == '' ){
      $('#pHeader').fadeOut();/*html(
        `<h1 data-role="heading" class="ui-title"
          id="pHeaderStr"
          >not set</h>` );*/
    }else{
      this.cl("setHeader title "+title);
      //this.cl("setHe len:"+title.length);
      //this.cl("setHe sub ["+title.substring(0,1)+"]");
      if( title.substring(0,1) == "<" ){
        this.cl("setHeader detect html as header ..");
        $('#pHeader').html( title );
      }else{
        $('#pHeader').html(
          `<h1 data-role="heading" class="ui-title"
            id="pHeaderStr"
            >`+title+`</h>` );

      }
      $("#pHeader").fadeIn();
      /*
      setTimeout(()=>{
        $('#pHeader').show();
        this.cl("show it !!");
      }, 1200);
      */
    }
  }



  getUA(){
    let device = "Unknown";
    const ua = {
        "Linux": /Linux/i,
        "Android": /Android/i,
        "BlackBerry": /BlackBerry/i,
        "Bluebird": /EF500/i,
        "ChromeOS": /CrOS/i,
        "Datalogic": /DL-AXIS/i,
        "Honeywell": /CT50/i,
        "iPad": /iPad/i,
        "iPhone": /iPhone/i,
        "iPod": /iPod/i,
        "macOS": /Macintosh/i,
        "Windows": /IEMobile|Windows/i,
        "Zebra": /TC70|TC55/i,
    }
    Object.keys(ua).map(v => navigator.userAgent.match(ua[v]) && (device = v));
    return device;
  }

  getDevName(){
    let altName = 'remDev'+parseInt(Math.random()*10000)+this.getUA();
    return getCookie('devName') || altName;
  }

  setDevName( devName ){
    document.cookie = "devName="+devName+";expires=Fri, 31 Dec 9999 23:59:59 GMT;path=http://192.168.43.220:1880/yss/";

  }


  setScreenManager(s){
    this.sm = s;
  }


  getCurrentPage(){
    return this.pages[ this.currentPage ];
  }

  wsCallbackExternal( r ){
    //this.cl("wsCallbackExternal got msg");
    //this.cl(r);
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
          this.cl("got my screen name !"+r.payload);
          this.cl(r.payload);
          this.sm.setMyNo( r.payload );

        }else if(r.topic == "SMidentifyOn"){
          this.cl("got identifyOn cmd !");
          this.sm.identifyYourSelf();

        }else if(r.topic == 'SMCmdTo' && r.No == sm.myNo ){
          this.cl("got cmd to:["+r.payload+']')
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
          this.cl("got cmd to all ! ["+r.payload+"]");
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
      this.cl("pager dumm callback:");
      if(0){
        this.cl("for debug only");
        this.cl(r);
        this.cl("topic:["+r.topic+"]");
        this.cl("payload:["+r.payload+"]");
      }
    }else{
      this.myCallCheet().then(
        pager.getCurrentPage().onMessageCallBack(r)
      );

    }
  }

  addPage( obj ){
    this.cl("add page:",obj.getName," as ", this.pages.length );
    this.pages.push( obj );
  }

  makeLooperIter(){
    //this.cl("pager looper iter...");
    try{
      this.getCurrentPage().looperIter();
    }catch( e ){
      this.cl(`ERROR no make looper iter in page [{e}]`);
    }
  }

  /**
   * @param {integer} pageNo - will sec curent site from `this.pages[pageNo]` to set now
   * @description Methode - **not recomendet** shortest way to set now a different site but not the best. Check `.goToByHash()`
   */
  setPage( pageNo ){
    if( this.currentPage == pageNo  ){
      this.cl("DROPING setPage !!! it's now the same ?");
      //return 0;
    }

    this.cl("setPage"+pageNo);
    this.setHeader('');
    $.mobile.panel();
    this.currentPage = pageNo;
    this.pageHistory.push( pageNo );
    
    this.setMenuSiteSelected();

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
    this.cl("TODO  - page selector !");
    //console.log("pageHistory:");
    //console.log(this.pageHistory)

    mkShaderResuming = true;
    mkShader('normal');
    this.setCssForPage();
    mkShaderResuming = false;

    this.cl("sPager set page to: "+pageNo);

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

    this.cl("scroll to top ...");
    $(document.body).scrollTop( 0 );

    $( "[data-role='header'], [data-role='footer']" ).toolbar({ theme: "b" });


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

    this.cl("default background set: "+bgColor);
  }

  get getPageBGColor(){
    try{
      return this.getCurrentPage().getDefaultBackgroundColor;
    }catch(e){
      this.cl("pageNo: "+this.currentPage+" don't have getDefaultBackgroundColor()");
      return "#ffffff";
    }
  }

  getPage(){
    this.cl("getHtml current page: "+this.currentPage);
    lAngels = {};
    movePathStartOffset = {};
    putTextStorage = {};

    if( this.currentPage == -1 ){
      this.getMenu();
      $("#svgDyno").html("");
    }else{
      var cp = this.getCurrentPage();
      $("#svgDyno").html("");
      //console.log("----------------- mobile get active page ----------------");
      console.log("cl will be call for html", cp);
      $("#htmlDyno").html( cp.getHtml ).enhanceWithin();
      //console.log($(":mobile-pagecontainer").pagecontainer("getActivePage"));
      //$(":mobile-pagecontainer").pagecontainer("getActivePage");
      //$('#htmlDyno').enhanceWithin();
      //$("#htmlDyno").enhanceWithin();
      //console.log("----------------- mobile get active page ---------DONE");
      cp.getHtmlAfterLoad();
      try{
        var abcueoa = 1213;
      }catch(e){
        this.cl("ERROR sPage page "+this.currentPage+" don't have getHtmlAfterLoad() error["+e+"]");
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
    //this.currentPage = -1;
    window.location.hash=url+`&`+(Math.random());
    
  }

	setMenuSiteSelected(){
    this.cl(["men ss:",]);
    this.cl(["men ss:","currentPage",pager.currentPage]);
    this.cl(["men ss:","pages",pager.pages.length]);
    // setting selected site in menu
    let menuObjs = $('.y-menu-item');
    for ( let im=0,imc=pager.pages.length; im<imc; im++ ) {
    	this.cl(["men ss:","run over",im]);
    	let o = $( menuObjs[im] );
    	if( im == pager.currentPage ){
    		o.addClass('ui-btn-b');
    		//o.button({theme: 'a'});
    	}else{
    		o.removeClass('ui-btn-b');    	
    		//o.button({theme: 'b'});
    	}
    }
    
	
	}

  getMenu(){
    var ta = "";
		//cl(["getMenu:", "invoce.."]);

    for(var i=0;i<this.pages.length;i++){
      /*
      ta+= '<input type="button" class="menu-button"';
      ta+= 'value="'+this.pages[i].getName+'" ';
      ta+= 'onclick="pager.setPage('+i+')"/>';
      ta+= '<br>';
      */
      let pName = this.pages[i].getName;
      ta+= `
<li class="pageItemsLi">
  <a href="" data-rel="close" `+
  	`class="y-menu-item" `+
  	`ymenuitemname="`+pName+`" `+
  	`ymiid="`+i+`" `+
    //`onclick="pager.setPage(`+i+`)"`+
    //`onclick="pager.goToByHash('page=`+i+`')"`+
    `onclick="pager.goToByHash('pageByName=`+pName+`')"`+
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
