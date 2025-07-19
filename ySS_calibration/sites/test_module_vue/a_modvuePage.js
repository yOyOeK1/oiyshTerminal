
import { mt1 } from "./moduleTest1.js";
import { FoodItem } from "./comps/FoodItem.js";
import fi1 from "./comps/FoodItem.vue";
import  HostStatus  from "/yss/components/OtHostStatus.mjs";

import FoodItem3 from "./comps/FoodItem3.vue";

import FoodItem2 from "./comps/FoodItem2.vue";

import * as m2 from './moduleTest2.js';

import FS from './comps/FoodSetup.vue';

class s_modvuePage{

  constructor(){
    cl(`${this.getName} init ....`);
    cl(`${this.getName} using imports from modules ecosystem ....mt1`+mt1);
    this.mt1 = mt1;
    this.vApp = undefined;
    this.templateTest1 = undefined;
    this.cbCount = 0;
    this.m2 = m2;
    this.fs = FS;
    this.HostS = HostStatus;
    
    cl(["*.vue",FoodItem3, FoodItem2]);
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

    //this.fooditem = this.mkVueComponentFromFile('comps/FoodItem2.vue');


    return `
<div style="overflow-y: scroll;">
<b>`+this.getName+'</b>'+
    `<pre>
* from module -> mt1: ${JSON.stringify(this.mt1)}
* ...
</pre>

vue:
<div id="appvue1">
<b>{{ message }}</b>
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

<hr>

<div id="comptest1">
  <b>component test ...{{okStatus}}</b>
  <div id="wrapper">
      <food-item 
        food-name="Loaded FoodItem component" 
        food-desc="Yes ! and proccess"
        />
  </div>
  <div id="wrapper">
       <food-vue 
        food-name="Loaded FoodItem.vue" 
        food-desc="Yes ! and proccess"
        />
  </div>
  <host-status ref="myHostStatus">?host</host-status>
</div>

<hr>
app from *.vue with setup()<br>
<div id="fromsetupvue">?</div>

<hr>
from *.vue<br>
<div id="fromvue">?</div>


</div>
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
    

    /*** to change port in component:
     * pager._page.vAppComTest.$refs.myHostStatus.port = 8080;
     * chk ref in object <div 
     * */
    this.vAppComTest = Vue.createApp({
      data(){
        return {
          okStatus: "running ... getHtmlAfterLoad"
        };
      },
      components:{
        'food-item': FoodItem,
        'food-vue': fi1,
        'host-status': HostStatus
        //httpVueLoader(`./siteNo/${this.instanceOf.siteNo}/${this.instanceOf.dir}/comps/FoodItem.vue`)
      }
    }).mount('#comptest1');
    this.vAppComTest.$refs.myHostStatus.host = 'localhost';
    this.vAppComTest.$refs.myHostStatus.port = 8080;

    this.vAppFromTemplateVue = Vue.createApp( FoodItem2 ).mount('#fromvue');

    this.vAppWithSetup = Vue.createApp( this.fs ).mount('#fromsetupvue');
     // #fromsetupvue
    

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
