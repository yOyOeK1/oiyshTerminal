
import { mt1 } from "./moduleTest1.js";
class s_modsitPage{

  constructor(){
    cl(`${this.getName} init ....`);
    cl(`${this.getName} using imports from modules ecosystem ....mt1`+mt1);
    this.mt1 = mt1;

  }

  get getName(){
    return `test module site`;
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml = () => {
    return '<b>'+this.getName+'</b>'+
`<pre>
* from module -> mt1: ${JSON.stringify(this.mt1)}
* ...
</pre>`;
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

  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg `);
  }

}

export { s_modsitPage };
