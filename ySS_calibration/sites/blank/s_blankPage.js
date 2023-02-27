
class s_blankPage{

  get getName(){
    return "blank";
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml(){
    return '<b>'+pager.getCurrentPage().getName+'<b>';
  }

  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack( r ){
    cl(
      pager.getCurrentPage().getName+
      " - got msg "
    );
  }

}
