const otplcLLeds = require('otplc-linux-sys-class-leds');

const otplc = require('otplc').otplc;


function cl(m){
  console.log(m);
}


module.exports = function(RED) {
    function OOplcLinuxSysClassLeds(config) {
      console.log( 'OOplcLinuxSysClassLeds init ...' );
      RED.nodes.createNode(this,config);
      var node = this;



      let eMsg = '';
      var mot = new otplcLLeds();
      node['mot'] = mot;
      //var dirList = mot.dirList();
      //dirList.find((e,i)=>{ dirList[ i ] = { value: e, label: e }; });
      //console.log( '- so dirList is ...');
      //console.log(dirList);
      //config.optsLeds = JSON.stringify(dirList);
      //var otplcLeds = dirList;
      let lName = this.name;
      let tPerms = mot.chkperm(lName);




      //cl("config is ...");
      //cl(config);


      //config.ledsel.options = ['1','3'];


      function setStatus( node, m ){
        node.status({text: m});
      }


      if( config.name == "" || config.name == "linux: /sys/class/leds" ){
        eMsg+=" | name not set";
      }

      if( config.led == undefined || config.led == "" ){
        eMsg+=" | led is not selected: "+JSON.stringify(mot.dirList());
      }

      if( mot.chkperm( config.led ) == false ){
        eMsg+=` | no permissions to write /sys/class/leds/${config.led}/brightness`;
      }

      setStatus( node, eMsg == "" ? "is ready ...["+mot.getStatus( config.led )+"] ["+mot.getStatusFromSysFs( config.led ).brightness.trigger+"]" : eMsg );

      /*
      if( eMsg == "" ){
        setTimeout(()=>{
          otplc.add( 'sysClassLed',
            lName,
            config.location
          );
        },300);
      }
      */

      node.on('input', function(msg) {

        if( msg.topic == "dirList" ){
          node.send({
            topit:"dirList",
            payload: this.mot.dirList()
          });


        }else if( msg.topic == "getStatus" ){
          node.send({
            topit:"getStatus",
            payload: this.mot.getStatus( config.led )
          });

        }else if( msg.topic == "getStatusLong" ){
          node.send({
            topit:"getStatusLong",
            payload: this.mot.getStatusFromSysFs( config.led )
          });

        }else if( msg.topic == "set" ){
          this.mot.set( config.led, msg.payload );
          setStatus( node, `[${msg.payload}]` );

        }else if( msg.topic == "trigger" ){
          this.mot.setTrigger( config.led, msg.payload );
          //setStatus( node, `[${msg.payload}]` );
        }


      });
    }
    RED.nodes.registerType("otplcLinuxSysClassLeds", OOplcLinuxSysClassLeds);
}
