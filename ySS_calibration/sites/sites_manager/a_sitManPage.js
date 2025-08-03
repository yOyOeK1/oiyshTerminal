import * as sitCom from './sitesCompositor.js'

class s_sitManPage{

  constructor(){
    cl(`${this.getName} init ....`);
    cl(`${this.getName} using imports from modules ecosystem ....mt1`+mt1);
    this.SiC = sitCom;

    this.msc = new this.SiC.sitesCompositor(
      pager.pages,
      new this.SiC.compositorInLine()
    );

  }

  get getName(){
    return `Sites manager`;
  }

  get getDefaultBackgroundColor(){
    return "#ccc";
  }

  get getCss(){
    return `
      #SiCRoot{
        border:solid 1px red;
        min-height:90vh;
        background-color: gray;
      }

    #SiCMenu{
      z-index:21;
      min-height:30px;
    }

    `;
  }

  goHome = () => {
    console.log('click');
    this.msc.compositor.tailClick(-1);
  }

  getHtml = () => {
    return `<style>${this.getCss}</style>
      <div id="SiCRoot">/root</div>
      <div id="SiCMenu" class="bottomPanel" 
        style="
          left:-100px;
        "
        onclick="siteByKey.s_sitManPage.o.goHome();">menu</div>`;
  }

  getHtmlAfterLoad(){
    
    this.msc.mount('#SiCRoot');
    $('#bottomPanelHandle').click(()=>{
      cl('menu button click');
    });

  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onKeypress( event ){

  }

  onWindowResize = ( w, h ) => {
    //cl(`new window size :) ${w} x ${h}`);
    this.msc.compositor.onWindowResize( w, h );
  }

  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg `);
  }

}

export { s_sitManPage };
