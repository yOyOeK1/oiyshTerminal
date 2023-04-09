const linuxBattery = require('linux-battery');
const otplc = require('otplc').otplc;


function cl(m){
  console.log(m);
}


module.exports = function(RED) {


    function OOplcLinuxBattery(config) {
      var myName = 'OOplcLinuxBattery .... ';
      cl( myName+' init ...' );
      RED.nodes.createNode(this,config);
      var node = this;
      var nodeConnfig = config;

      node['batNoSel'] = -1;

      node['batLast'] = {
        'percentage': -1,
        'status': -1
      };


      node['sendMsgUpdate'] = function( bats ){
        if( node['batNoSel'] != -1 && node['batNoSel'] <= bats.length ){
          node.send({
            topic: 'batNo/'+node['batNoSel']+'/update',
            payload: bats[ node['batNoSel'] ]
          })
        }else{
          cl(myName+" update but not set up node :(")
        }
      };


      node['onBatUpdate'] = function( bats ){
        let batHaveCount = bats.length;
        node['batsLast'] = bats;

        cl(myName+"onBatUpdate .... batNoSel:"+node['batNoSel']);
        cl(myName+"so got .... "+batHaveCount);
        cl(myName+"..................NICE!");

        if( node['batNoSel'] == -1 ){
          setStatus( node, "set battery 0..."+(batHaveCount-1) );
        }else{
          setStatus( node, "bats update ! "+(new Date()) );
        }
        node.sendMsgUpdate( bats );

      };

      node['makeUpdateRun'] = function(){
        linuxBattery().then(bats=>{
          node['sendUpdateRun'] = false;
          cl(myName+"got linux battery raport !");
          cl(myName+"can see node?");cl(node);
          cl(myName+"can see node['batLast']?");cl(node['batLast']);
          node.onBatUpdate( bats );
        });
      };


      try{
        let abc = config.location;
      }catch(e){
        cl(myName+"Error no .location setting it up!");
        config['location'] = '';
      }

      let eMsg = '';

      function setStatus( node, m ){
        node.status({text: m});
      }

      if( config.name == "" || config.name == "otplc-linux-battery" ){
        eMsg+=" | name not set";
      }

      if( config.batno == undefined || config.batno == "" ){
        eMsg+=" | battery No is not selected";
      }else{
        try{
          node['batNoSel'] = parseInt(config.batno);
        }catch(e){
          eMsg = " | battery No not integer? ";
          cl(myName+"Error converting battery No to int !");
        }
      }

      setStatus( node, eMsg == "" ? "is ready ... "+node.batLast.percentage : eMsg );

      node.makeUpdateRun();

      if( eMsg == "" ){
        setTimeout(()=>{
          otplc.add( 'linux-battery',
            config.name,
            config.location || "",
            'otplc-linux-battery',
            config.batNo || "",
            node
          );
        },300);
      }


      node.on('input', function(msg) {

        if( node['sendUpdateRun'] == undefined || node['sendUpdateRun'] == false ){
          node['sendUpdateRun'] = true;
          node.makeUpdateRun();
        }else{
          node.status({text: "update run in progress ..."});
        }

        /*
        if( msg.topic == "?" ){
          node.send({
            topit:"help",
            payload: 'TODO'
          });
        }
        */

      });

    }
    RED.nodes.registerType("otplcLinuxBattery", OOplcLinuxBattery);
}
