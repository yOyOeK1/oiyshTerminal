
import { mt1 } from "./moduleTest1.js";
class s_testvitePage{

  constructor(){
    cl(`${this.getName} init ....`);
    cl(`${this.getName} using imports from modules ecosystem ....mt1`+mt1);
    this.mt1 = mt1;

  }

  get getName(){
    return `test vite`;
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml = () => {
    return '<b>'+this.getName+'</b>'+
`<pre>
* from module -> mt1: ${JSON.stringify(this.mt1)}
* ...
</pre>
<hr>
<input type="button" name="mkvite" onclick="window.viteMksite();" value="request it" />
<div id="viteapp" ref="myHostStatus" titleit="abc">
?
</div>`;
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

export { s_testvitePage };
