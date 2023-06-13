
import {createApp, defineComponent } from "/yss/libs/vue.esm-browser.js";

console.log("--",createApp,"...");
import myComp from "/yss/modules/vc-my-component/index.js"

import myclick from "/yss/modules/vc-myclick/index.js"
//import OtcHello from "/yss/sites/test_vue/assets/OtcHello.vue"




oth = {
    'avue1':-1
};
class app01{

    constructor(){
        console.log("avue1 init...");
        //console.log("so we have mtest1 ..."+mtest1());
    
        createApp( myComp ).mount("#forVue1");

        createApp( myclick ).mount("#formyclick");

    }

}

let a = new app01();

export default a