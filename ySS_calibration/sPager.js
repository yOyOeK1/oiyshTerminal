

console.log("sPager.js file");
class sPager {
  currentPage = -1;

  constructor(){
    this.currentPage = -1;
    this.pages = new Array();
    console.log("sPager constructor done !");
  }

  wsCallbackExternal( r ){
    console.log("wsCallbackExternal got msg");
    console.log(r);
    this.wsCallback( r );
  }

  wsCallback( r ){
    if( this.currentPage == -1 )
      console.log("pager dumm callback:"+r);
    else
      this.pages[ this.currentPage ].onMessageCallBack(r);
  }

  addPage( obj ){
    console.log("sPager add page: ["+obj.getName+"] as "+(this.pages.length) );
    this.pages.push( obj );
  }

  makeLooperIter(){
    //console.log("pager looper iter...");
    try{
      this.pages[ this.currentPage ].looperIter();
    }catch( e ){}
  }


  setPage( pageNo ){
    this.currentPage = pageNo;

    mkShaderResuming = true;
    mkShader('normal');
    this.setCssForPage();
    mkShaderResuming = false;

    console.log("sPager set page to: "+pageNo);

    this.getPage();
    document.cookie="lastPage="+pageNo+";expires=; expires=Thu, 18 Dec "+(Date().getFullYear+10)+" 12:00:00 UTC";
    mkShaderStoreResume();

    navBatteryPercent( this );
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

    console.log("default background set: "+bgColor);
  }

  get getPageBGColor(){
    try{
      return this.pages[ this.currentPage ].getDefaultBackgroundColor;
    }catch(e){
      console.log("pageNo: "+this.currentPage+" don't have getDefaultBackgroundColor()");
      return "#ffffff";
    }
  }

  getPage(){
    console.log("getHtml current page: "+this.currentPage);
    lAngels = {};
    movePathStartOffset = {};
    putTextStorage = {};

    if( this.currentPage == -1 ){
      this.getMenu();
      $("#svgDyno").html("");
    }else{
      var cp = this.pages[ this.currentPage ];

      $("#htmlDyno").html( cp.getHtml );
      try{
        cp.getHtmlAfterLoad();
      }catch(e){
        console.log("sPage page "+this.currentPage+" don't have getHtmlAfterLoad()");
      }
      $("#svgDyno").html( cp.svgDyno );

      cp.svgDynoAfterLoad();
    }

  }

  getMenu(){
    var ta = "";

    for(var i=0;i<this.pages.length;i++){
      ta+= '<input type="button" ';
      ta+= 'value="'+this.pages[i].getName+'" ';
      ta+= 'onclick="pager.setPage('+i+')"/>';
      ta+= '<br>';
    }

    $("#htmlDyno").html( "Pages in stack:</br>"+ta );

  }

}
