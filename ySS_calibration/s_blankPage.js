
class s_blankPage{

  get getName(){
    return "blank page";
  }

  getHtml(){
    return 'blank page';
  }

  getHtmlAfterLoad(){
    console.log("s_blankPage getHtmlAfterLoad()");
  }

  get svgDyno(){
    return s_fitscreen;
  }

  svgDynoAfterLoad(){}

  onMessageCallBack( r ){
    console.log("s_blankPage got msg ");
  }

}
