
const fs = require("fs");
const path = require("path");

module.exports = function(RED) {
   const subflowFile = path.join(__dirname,"subflowNice.json");
   const subflowContents = fs.readFileSync(subflowFile);
   const subflowJSON = JSON.parse(subflowContents);
   RED.nodes.registerSubflow(subflowJSON);
   console.log("npm - ot - vanilla init ....");
}
