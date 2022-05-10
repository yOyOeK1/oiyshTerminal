


class sPager {
  currentPage = -1;

  constructor(){
    this.currentPage = -1;
    this.pages = new Array();
    cl("sPager constructor done !");
  }

  getCurrentPage(){
    return this.pages[ this.currentPage ];
  }

  wsCallbackExternal( r ){
    cl("wsCallbackExternal got msg");
    cl(r);
    this.wsCallback( r );
  }

  wsCallback( r ){
    if( this.currentPage == -1 )
      cl("pager dumm callback:"+r);
    else
      this.getCurrentPage().onMessageCallBack(r);
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


  setPage( pageNo ){
    this.currentPage = pageNo;

    mkShaderResuming = true;
    mkShader('normal');
    this.setCssForPage();
    mkShaderResuming = false;

    cl("sPager set page to: "+pageNo);

    this.getPage();
    document.cookie="lastPage="+pageNo+";max-age=31536000;";
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

      $("#htmlDyno").html( cp.getHtml );
      try{
        cp.getHtmlAfterLoad();
      }catch(e){
        cl("sPage page "+this.currentPage+" don't have getHtmlAfterLoad() error["+e+"]");
      }
      $("#svgDyno").html( cp.svgDyno );

      cp.svgDynoAfterLoad();
    }

  }

  getMenu(){
    var ta = "";

    for(var i=0;i<this.pages.length;i++){
      ta+= '<input type="button" class="menu-button"';
      ta+= 'value="'+this.pages[i].getName+'" ';
      ta+= 'onclick="pager.setPage('+i+')"/>';
      ta+= '<br>';
    }

    $("#htmlDyno").html( ta );

  }

}
