import { Three4Yss } from "./libs/three4yss.js";

class Three4YssModule{
  constructor(){
    this.myt4y;
    //console.log("echo from module !!!!!!!");
    console.log("Constructor Three4Yss loaded... :)");
    if( t4y == 0 ){

      this.myt4y = new Three4Yss();
      t4y = this.myt4y;
    }else
    console.log("reinit Three4Yss ? ...");
  }

}
console.log("Initing Three4YssModule ...");
let modt4y = new Three4YssModule();

export { Three4YssModule };
