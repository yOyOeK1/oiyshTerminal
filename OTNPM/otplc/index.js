
function cl( m ){
  console.log( m );
}


class OTplc{

  constructor(){
    cl("OTplc init ...");
    this.plcs = [];
    
  }

  isIn( name ){
    return this.plcs.find((e,i)=>{ if(e.name == name) return true; }) ? true : false;
  }

  zeroAll(){
    this.plcs = [];
    return true;
  }


  add(  plcType, name, location='', srcName='', srcD='', extra = -1){
    let suf = '';
    if( this.isIn( name ) == true ){
      for(let s=0,sc=1024; s<sc; s++ ){
        suf = `_${s}`;
        if( this.isIn( name+suf ) == false )
          break;
      }
      cl("will have sufix .... "+name+suf);
    }

    this.plcs.push({
      'plcType': plcType,
      'name': name+suf, 'location': location,
      'srcName': srcName, 'srcD': srcD,
      'extra': extra
    });

    return name+suf;
  }

  getAll(){
    return this.plcs;
  }

  getAllTypes( lType ){
    let trt = {};
    let tr = [];
    for(let p=0; p<this.plcs.length; p++ ){
      cl(`plc NO( ${p} ):`);
      cl(this.plcs[ p ]);
      if( this.plcs[ p ] != undefined && trt[ this.plcs[ p ][ lType ] ] == undefined ){
          trt[ this.plcs[ p ][ lType ] ] = 1;
          tr.push( this.plcs[ p ][ lType ] );
      }
    }
    return tr;
  }

  get( fillterBy = {} ){}

}

class OTplcTest1 {
  constructor() {
    cl('OTplcTest1 .... ');

    cl("go run test 1 ...... "+(new Date()))

    let op = new OTplc();

    op.add('battery', 'dell',             'isDell', 'mqtt', 'devSen/isDell/bat/perc' );
    op.add('led',     'mic',              'Hu'  );
    op.add('battery', 'Home LiPo4',       'oiysh', 'mqtt', 'e01Mux/adc0' );
    op.add('battery', 'Tesla 24 -> 12v',  'oiysh', 'mqtt', 'e01Mux/adc2'  );

    op.add('led',     'mic',              'isDell'  );

    let pAll = op.getAll();
    let pTypes = op.getAllTypes('plcType');

    cl(`Total in: ${pAll.length}
Types: ${pTypes.join(', ')}
---------------------`);
    cl("All typel srcName");
    cl( op.getAllTypes( 'srcName' ) );


    cl("test 1 ........... DONE Exit 0");

    this.op = op;
    cl("in op is the instance to play ...");

  }
}

const otplc = new OTplc();

try{
  module.exports = {
    OTplc,
    OTplcTest1,
    otplc,
  };
}catch(e){
  cl("Is not in module mode ...");
}


var args = {};
process.argv.forEach(function (val, index, array) {
  //console.log(index + ': ' + val);
  if( index >= 2 ){
    let s = val.split('=');
    args[ s[0] ] = s[1] == undefined ? 1 : s[1];
  }
});

if( args != {} ){
  cl("args to parse :");
  cl(args);


  if( args['runTestErr'] == 1 ){
    cl("go Exit with 1")
    process.exit(1);
  } else if( args['runTest1'] == 1 ){
    new OTplcTest1();
  }


}
