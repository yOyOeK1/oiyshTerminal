const otplc = require('otplc').otplc;


function cl(m){
  console.log(m);
}


module.exports = function(RED) {



    function OOplcEngine(config) {
      cl( 'OOplcEngine init ...' );
      RED.nodes.createNode(this,config);

      otplc.zeroAll();
      var node = this;
      let eMsg = '';

      this.otPlcSel = config.otPlcSel;
      this.otPlcSelConfig = RED.nodes.getNode( this.otPlcSel );
      cl( "got nodes::otPlcSelConfig");
      cl( this.otPlcSelConfig );

      function setStatus( node, m ){
        node.status({text: m});
      }


      if( config.name == "" || config.name == "ot-plc ..." ){
        eMsg+=" | name not set";
      }

      setStatus( node, eMsg == "" ? "is ready ..." : eMsg );

      if( eMsg == "" ){
        setTimeout(()=>{
          otplc.add( 'ot-plc-Engine',
            config.name,
            config.location
          );
        },300);
      }

      node.on('close', function() {
          node.otPlcSelConfig.removeAllListeners();
          node.status({});
          done();
      });

      node.on('input', function(msg) {

        if( msg.topic == "getAll" ){
          node.send({
            topit:"getAll",
            payload: otplc.getAll()
          });

        } else if( msg.topic == "zeroAll" ){
          node.send({
            topit:"zeroAll",
            payload: otplc.zeroAll()
          });

        } else if( msg.topic == "getAllTypes" ){
          node.send({
            topit:"getAllTypes",
            key: msg.payload,
            payload: otplc.getAllTypes( msg.payload )
          });

        } else if( msg.topic == "add" ){
          let n = otplc.add(
            msg.payload.plcType,
            msg.payload.name,
            msg.payload.location,
            msg.payload.srcName,
            msg.payload.srcD,
            msg.payload.extra
          );
          node.send({
            topit:"add",
            payload: n
          });
        }else{
          node.send({
            topic: "NaN",
            payload: "Unknown topic"
          });
        }


      });
    }
    RED.nodes.registerType("otplcEngine", OOplcEngine);



    function OOplcBundle(n) {
      RED.nodes.createNode(this,n);
      cl( 'OOplcBundle init ...' );
      this.plcType = n.plcType;
      this.name = n.name;
      this.location = n.location;
      this.srcName = n.srcName;
      this.srcD = n.srcD;
      this.extra = n.extra;
      this.setMaxListeners(0);
      var node = this;

      node.on('close', function() {
          node.removeAllListeners();
          node.status({});
          done();
      });

    }
    RED.nodes.registerType("otplcBundle",OOplcBundle);


}
