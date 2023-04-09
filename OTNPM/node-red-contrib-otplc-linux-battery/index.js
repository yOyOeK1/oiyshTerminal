
const fs = require("fs");
const path = require("path");
const lb = require("linux-battery")

module.exports = function(RED) {


   console.log("npm - ot - linux-battery .... order battery read ....");
   lb().then( b=>{
     const subflowFile = path.join(__dirname,"subflow.json");
     const subflowContents = fs.readFileSync(subflowFile);
     const subflowJSON = JSON.parse(subflowContents);

     var batNice = '---\n## In system batteries found: '+b.length+"\n"+
      "   *info from "+(new Date())+"*\n";
     for(let bn=0,bnc=b.length; bn<bnc; bn++){
       batNice+= '\n### battery: No('+bn+')\n';

       Object.keys( b[bn] ).find((e,i)=>{
         batNice+= '   - '+e+': '+b[bn][e]+'\n';
       });

     }

     batNice+= "---\norg: "+JSON.stringify( b );


     subflowJSON['info']+= 'So this is a result:\n'+batNice;


     let n = RED.nodes.registerSubflow(subflowJSON);
     console.log("npm - ot - linux-battery ....");
     console.log("n is ...");
     console.log(n);
     console.log(batNice);

   });



}
