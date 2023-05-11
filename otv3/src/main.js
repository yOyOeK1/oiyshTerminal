import './assets/main.css'


import { createApp } from 'vue'
import App from './App.vue'



function cc(m){
  console.log("CC:main.js:",m)

}


cc("------ import from yss library ");
//import {motTools} from './assets/ySS_calibration/libs/motTools.mjs'
//@yss-libs
import {motTools} from '@yss-libs/motTools.mjs'
cc('so is loaded now it');cl(motTools);
//cc('so is loaded now it 2');cl(motTools.motTools);
//cc("test motTools from yss/libs ....");
//cc(["  current: ", motTools]);
const mott = new motTools();
cc(["  current: ",mott]);
//cc("  new");

//mott.sapiJ( 'ping', (d)=>{cc('got response in main.js from mott ...');cc(d);} )
cc("------ import from yss library END");

// -- import from yss library END

var abcWherYouAre = 'this is in App.vue'

createApp(App).mount('#app')
