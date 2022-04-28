

console.log("sPager.js file");
class sPager {


  constructor(){
    this.currentPage = -1;
    this.pages = new Array();
    console.log("sPager constructor done !");
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

  setPage( pageNo ){
    console.log("sPager set page to: "+pageNo);
    this.currentPage = pageNo;
    this.getPage();

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
