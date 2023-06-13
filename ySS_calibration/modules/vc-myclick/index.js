import {defineComponent } from "/yss/libs/vue.esm-browser.js";

//import { OtcHello } from "/yss/modules/vuescorrect/OtcHello.js";

export default {
    //components:{ OtcFastDo },
    data() {
        return { count: 0 }
    },
    methods:{
        add(){
            this.count++;
        }
    },
    template: `<div>count is {{ count }}</div>
    <button @click="add" >add</button>
    `
}