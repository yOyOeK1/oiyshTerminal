

const fs = require("fs");
const path = require("path");

module.exports = function(RED) {
   const subflowFile = path.join(__dirname,"sf.json");
   const subflowContents = fs.readFileSync(subflowFile);
   const subflowJSON = JSON.parse(subflowContents);
   RED.nodes.registerSubflow(subflowJSON);
   console.log("ot-sf2n [ot-hz-detector] : [ot-hz-detector] - ver 0.0.9 init ....");
}

      