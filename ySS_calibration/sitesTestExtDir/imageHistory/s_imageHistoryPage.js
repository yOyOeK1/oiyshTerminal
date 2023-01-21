
class s_imageHistoryPage{

  get getName(){
    return "Image history";
  }

  get getHtml(){
    return `
      <h3>Panama canal weather radar.</h3>
      <iframe
      src="http://192.168.43.1:3000/public/radarPanamaColon/index.html?2198233"
      title="image history"
      style="height:99vh;width:99vw;"
      ></iframe>`;
  }

  getHtmlAfterLoad(){
    console.log("s_blankPage getHtmlAfterLoad()");
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack( r ){
    console.log("s_blankPage got msg ");
  }

}
