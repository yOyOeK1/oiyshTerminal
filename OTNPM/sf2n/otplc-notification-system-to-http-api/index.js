

const fs = require("fs");
const path = require("path");

module.exports = function(RED) {
   const subflowFile = path.join(__dirname,"sf.json");
   const subflowContents = fs.readFileSync(subflowFile);
   const subflowJSON = JSON.parse(subflowContents);
   RED.nodes.registerSubflow(subflowJSON);
   console.log("ot-sf2n [otplc-notification-system-to-http-api] : [otplc-notification-system-to-http-api] - ver 0.0.4 init ....");
}

      