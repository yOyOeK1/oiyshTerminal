const otplc = require('otplc').otplc;


function cl(m){
  console.log(m);
}


module.exports = function(RED) {



    function OOplcEngine(config) {
      RED.nodes.createNode(this,config);
      let niceName = config.name == "" ? 'ot-plc ... ': config.name+":location:"+config.location;
      cl( 'OOplcEngine init ...['+niceName+']' );
      try{
        let abc = config.location;
      }catch(e){
        cl("Error no .location setting it up!");
        config['location'] = '';
      }

      otplc.zeroAll();
      var node = this;
      let eMsg = '';

      this.otPlcSel = config.otPlcSel;
      this.otPlcSelConfig = RED.nodes.getNode( this.otPlcSel );
      //cl( "got nodes::otPlcSelConfig ... count: "+this.otPlcSelConfig.length );
      //cl( this.otPlcSelConfig );

      //let con = new Date();
      //cl( "set context: "+con);
      //this.context().set('testContext1', con);

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
          cl("get all types .... ");
          //cl("  and otplc is ..");cl(otplc);
          node.send({
            topit:"getAllTypes",
            key: msg.payload,
            payload: otplc.getAllTypes( String(msg.payload) )
          });

        } else if( msg.topic == "add" ){
          let m = msg.payload;

          cl("OOplcEngine add ....")
          let n = otplc.add(
            m.plcType,
            m.name, m.location,
            m.srcName, m.srcD,
            m.extra
          );
          //cl("- to otplc .... DONE name: "+n);
          //cl( this.otPlcSelConfig );
          //RED.nodes.eachConfig((e)=>{ console.log(e);});


          //cl(" so create it ....");

          /*
          RED.nodes.add('otplcBundle',{
            plcType: m.plcType,
            name: n,
            location: m.location,
            srcName: m.srcName,
            srcD: m.srcD,
            extra: m.extra
          });
          */
          //cl("- to otplcBundle .... DONE")

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
      //cl(" soooo n is .....");
      //cl(n);
      RED.nodes.createNode(this,n);
      cl( `OOplcBundle init ... [plcType:${n.plcType} name:${n.name} location:${n.location}]` );
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
