


const fs = require('fs');

function cl( m ){
  console.log( m );
}

class OTplcSysfsClassLeds{


  constructor(){
    this.dLeds = '/sys/class/leds';

    //cl(`OTplcSysfsClassLeds init .... dir [${this.dLeds}]: ${this.dirChk()}`);
  }


  dirChk(){
    return fs.existsSync( this.dLeds );
  }

  dirList(){
    var dltr = [];
    fs.readdirSync( this.dLeds ).map( fn => {
      dltr.push( `${fn}` )
    } );
    return dltr;
  }

  getFileContent( fileP ){
    return fs.readFileSync( fileP ).toString()
      .split("\n").join(' ');
  }

  asNumber( dIn ){
    return parseInt( dIn );
  }

  getFileContentAsNumber( fileP ){
    return this.asNumber( this.getFileContent( fileP ) );
  }

  getTriggers( fileP ){
    let tr = [];
    let trC = -1;
    let tN = this.getFileContent( `${fileP}/trigger` ).split(' ');


    for( let t=0,tc=tN.length; t<tc; t++ ){
      if( tN[ t ] != "" ){
        let v = tN[ t ];
        tr.push( v.replace( '[', '' ).replace( ']', '' ) );

        if ( v.substring(0,1) == "[" && v.substring( v.length-1 ) == "]" ){
          trC = v.substring(1,v.length-1);
        }

      }
    }

    return [tr,trC];
  }

  getStatus( ledName ){
    let bPath = `/sys/class/leds/${ledName}`;
    return this.getFileContentAsNumber( `${bPath}/brightness` );

  }

  getStatusFromSysFs( ledName ){
    let bPath = `/sys/class/leds/${ledName}`;

    let [triggers, trigNow] = this.getTriggers( bPath );

    return {
      'name': ledName,
      'brightness': {
        'now': this.getStatus( ledName ),
        'max': this.getFileContentAsNumber( `${bPath}/max_brightness` ),
        'trigger': trigNow,
        'triggers': triggers
      }
    };
  }

  set( ledName, setItNo ){
    try{
      fs.writeFileSync(
        `/sys/class/leds/${ledName}/brightness`,
        setItNo
      );
      cl("OK");
    }catch(e){
      cl("Error when setting brightness up! EXIT 1");
      process.exit(1);
    }
  }

  setTrigger( ledName, setTrigger ){
    fs.writeFileSync(
      `/sys/class/leds/${ledName}/trigger`,
      setTrigger
    );
    cl("OK");
    try{
    }catch(e){
      cl("Error when setting trigger up! EXIT 1");
      process.exit(1);
    }
  }

  chkperm( ledName ){
    //cl("chk permissions ....");
    let r = false;
    try{
      r = fs.accessSync(
        `/sys/class/leds/${ledName}/brightness`,
        fs.W_OK
        );
        r = true;
    }catch(e){
      //cl(`Error ${e}`);
    }
    return r;
  }

}


var inModMode = false;

try{
  module.exports = OTplcSysfsClassLeds;
  inModMode = true;
}catch(e){
  cl("Is not in module mode ...");
}


if( inModMode == false ){
  var deb = false;

  if( deb ) console.log(`hello in otpl-linux-sys-class-leds .... ver${ver}`);

  var args = {};
  process.argv.forEach(function (val, index, array) {
    //console.log(index + ': ' + val);
    if( index >= 2 ){
      let s = val.split('=');
      args[ s[0] ] = s[1] == undefined ? 1 : s[1];
    }
  });
  if( deb ){
    cl("args to parse :");
    cl(args);
  }



  // as ls
  if( Object.keys( args ).length == 1 &&  args['ls'] == 1  ){
    var otLeds = new OTplcSysfsClassLeds();
    cl(otLeds.dirList());

  }else if( Object.keys( args ).length == 1 &&  args['chkperm'] != ""  ){
    var otLeds = new OTplcSysfsClassLeds();
    cl( otLeds.chkperm( args['chkperm']) );

  // as get='input4somDev'
  } else if( Object.keys( args ).length == 1 && args['get'] != undefined ){
    cl("as get .........");
    var otLeds = new OTplcSysfsClassLeds();
    let led = args['get'];
    cl("get led: "+led);
    cl( otLeds.getStatus( led ) );

  // as set=0 'input4somDev'
  } else if( Object.keys( args ).length == 2 && args['set'] != undefined ){
    cl("as set .........");
    var otLeds = new OTplcSysfsClassLeds();
    otLeds.set( args['name'], args['set'] )

  // as set=0 'input4somDev'
  } else if( Object.keys( args ).length == 2 && args['trigger'] != undefined ){
    cl("as trigger set .........");
    var otLeds = new OTplcSysfsClassLeds();
    otLeds.setTrigger( args['name'], args['trigger'] )


  // as `input4somDev`
  } else if( Object.keys( args ).length == 1  ){
    var otLeds = new OTplcSysfsClassLeds();
    let led = Object.keys(args)[0];
    cl("use led: "+led);
    cl( otLeds.getStatusFromSysFs( led ) );


  } else {
    cl(`No args set so help?

  Use:

  ls - print {array} list all leds in sys/class
  chkperm='inputName' - print {bool} check if have permissions
  inputName - print {json} status of inputName led
  get='inputName' - return  current status in string
  name='inputName' set=1 - will set inputName device to 1
  name='inputName' trigger='trigName' - will set inputName device to triger trigName

  Don't forget to add this script to sudo / visudo so you don't need to write
  password every time you use it ....

  For me it's a line in sudo visudo:

  yoyo ALL=NOPASSWD:/OT/OTNPM/otplc-linux-sys-class-leds/run.sh

      `);




    process.exit(0);

  }


  process.exit(11);
  cl("Exit 11");

  var otLeds = new OTplcSysfsClassLeds();
  let dls = otLeds.dirList();
  cl(`dls: ${dls.length}`);
  cl(dls);
  let i = otLeds.getStatusFromSysFs( 'input4::capslock' );
  cl("current status:")
  cl(i);

  cl("fast status check:")
  cl( otLeds.getStatus( 'input4::capslock' ) );

  cl("set on ....")
  otLeds.set( 'input4::capslock', '1' );
  cl("sleep ....")
  setTimeout(()=>{
    otLeds.set( 'input4::capslock', '0' );
  },1000);

  cl("DONE")
}
