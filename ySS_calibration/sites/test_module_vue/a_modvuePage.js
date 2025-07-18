
import { mt1 } from "./moduleTest1.js";

class s_modvuePage{

  constructor(){
    cl(`${this.getName} init ....`);
    cl(`${this.getName} using imports from modules ecosystem ....mt1`+mt1);
    this.mt1 = mt1;
    this.vApp = undefined;
    this.templateTest1 = undefined;
    this.cbCount = 0;
    
  }
  
  get getName(){
    return `test module vue`;
  }
  
  get getDefaultBackgroundColor(){
    return "#ffffff";
  }
  
  /***
   * 
   * 
<hr>

`+this.vueTempToDiv( (o)=>{this.templateTest1 = o;}, "template01.html", "tempOne", {
  data() {
    return {
      msg: 'Template loaded!',
      tLoad: Date.now()
      };
    }
})+`
`
   * 
   */
  vueTempToDiv( vueObj, templateFile, objTarget, vueArgs ){
    let na = "t"+objTarget;
    //var vueObjn = vueObj;

    $.get(
      `siteNo/${this.instanceOf.siteNo}/${this.instanceOf.dir}/${templateFile}`,
      null, ( data, status) => {
        if( status == 'success' ){
          console.log("vueTempToDiv have data",data);
          $('#'+objTarget).html( data );
          vueObj(
            Vue.createApp( vueArgs ).mount( '#'+objTarget )
          );

        }else
        console.error(`vueTempToDiv Can\'t load ${file} :(`);
        
      }
    );
    
    return `<div id="${objTarget}">[${objTarget}] loading ...</div>`;
  }
  
  injectHtmlTo( file, objName ){
    $.get(
      `siteNo/${this.instanceOf.siteNo}/${this.instanceOf.dir}/${file}`,
      null, ( data, status) => {
        if( status == 'success' ){
          console.log("have data",data);
          $(objName).html( data );
        }else
        console.error('Can\'t load template01.html :(');
      }
    );
  }
  
  getHtml = () => {
    let mres = ``;
    
    //this.injectHtmlTo('template01.html', '#tmp01' );
    
    return '<b>'+this.getName+'</b>'+
    `<pre>
* from module -> mt1: ${JSON.stringify(this.mt1)}
* ...
</pre>

vue:
<div id="appvue1">
<h1>{{ message }}</h1>
<small>callback counter: {{cbCount}}</small>
<button @click="changeMessage">Change Message</button>
</div>

<hr>

`+this.vueTempToDiv( (o)=>{this.templateTest1 = o;}, "template01.html", "tempOne", {
  data() {
    return {
      msg: 'Template loaded!',
      tLoad: Date.now()
      };
    }
})+`
`;

}

getHtmlAfterLoad = () => {
    cl(
      this.getName+
      " - getHtmlAfterLoad()"
    );
    
    this.vApp = Vue.createApp({
      data() {
        return {
          message: 'Hello Vue!',
                cbCount: 0
            };
        },
        methods: {
            changeMessage() {
                this.message = 'Message Changed!';
            }
        }
    }).mount('#appvue1');


  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg `);
  
    this.cbCount++;
    this.vApp.cbCount++;
    //this.vApp.message = `[cb] message no: ${this.cbCount}`;
  
  }

}

export { s_modvuePage };
