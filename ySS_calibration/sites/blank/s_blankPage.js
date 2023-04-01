
class s_blankPage{

  constructor(){
    cl(`${this.getName} init ....`);
  }

  get getName(){
    return "blank";
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml(){
    return '<b>'+pager.getCurrentPage().getName+'</b>';
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
