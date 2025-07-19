
import { mt1 } from "./moduleTest1.js";

import App1 from './res/app.vue';
import router from './router.js';


class s_mvueroutPage{

  constructor(){
    cl(`${this.getName} init ....`);
    cl(`${this.getName} using imports from modules ecosystem ....mt1`+mt1);
    this.mt1 = mt1;

  }

  get getName(){
    return `test m vue router`;
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml = () => {
    return '<b>'+this.getName+'</b>'+
`<div id="routtest1">?</div>`;
  }

  getHtmlAfterLoad = () => {
    cl(
      this.getName+
      " - getHtmlAfterLoad()"
    );

    this.vapp = Vue.createApp( App1 )
      .use( router )
      .mount( '#routtest1' );

  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){
    
  }


  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg `);
  }

}

export { s_mvueroutPage };
