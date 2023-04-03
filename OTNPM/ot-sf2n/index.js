
const fs = require('fs');
const http = require("http");
const path = require("path");

function cl( m ){
  console.log( m );
}


class OTsf2n{

  constructor(){
    this.pTemplatesPath = path.join(__dirname,"templates");
    cl("OTsf2n init ... with templates: "+this.pTemplatesPath);

    this.getDone = false;
    this.wdI = -1;
    this.intNo = 0;
    this.doIt = {};
  }

  interwal(){
    cl("in "+otsf2node.intNo);
    if( otsf2node.intNo == 0 ){
      cl('== 0 so query api ...');

    }else if ( otsf2node.intNo > 0 ){
      cl(" http done ..."+otsf2node.getDone);


    }


    otsf2node.intNo++;
  }

  startWD( opts ){
    cl("starting ...");
    this.intNo = 0;
    this.doIt = opts;
    this.wdI = setInterval(this.interwal,1000);
  }

  newId( oId ){
    return oId.substring(0,4)+'.'+oId.substring(5);
  }



  getAllSf( callBack = -1 ){
    cl(".getAllSf() ..... callback:"+(callBack!=-1?'set':'def'));

    this.getDone = false;
    http.get(`http://192.168.43.220:1880/flows`, resp => {
        let data = "";
        resp.on("data", chunk => {
          cl("got data")

          data += chunk;
        });

        resp.on("end", () => {
          cl("got end data ....");
          otsf2node.getDone = true;
          let j = JSON.parse(data);
          if( callBack == -1 ){
            otsf2node.onGotAllSf(j);
          }else{
            callBack( j );
          }
        });

      });
  }
  onGotAllSf( data ){
    cl(".onGotAllSf .... "+data.length);
    //cl(data);
    return 0;
  }


  chkDir( tDir ){
    return fs.existsSync( tDir );
  }


  extractSF( opts ){
    cl(".extractSF .... srcId:"+opts.srcId);

    cl("pre check ....");

    cl("target prefix dir ....")
    if( this.chkDir( opts.prefixDir ) == true  ){
      cl("  OK");
    }else{
      cl("Exit no prefix target directory ["+opts.prefixDir+"] EXIT 1")
      process.exit(1);
    }

    return this.getAllSf( ( data )=>{
        var okId = -1;
        var bNode = -1;
        var debugShowProcess = false;

        //cl("data---------");
        //cl(data);

        if( data.length > 1 ){
          cl("data length > 1 OK !!");
        }else{
          cl("Error data");
          cl(data);
          process.exit(1);
        }

        bNode = data.find((n,i)=>{
          //cl("is node "+i);cl(n);
          if( n.id == opts.srcId ){
            return n;
          }
        })||-1;

        var osfId = bNode['type'].substring(8);
        if( debugShowProcess ){
          cl("--------- base node is ");cl(bNode);
          cl("so org subflow id: "+osfId);
        }
        var osfFlow = [];
        var osfNode = -1;
        let oId = osfId;
        let nId = this.newId( oId );
        var idMap = {};
        idMap[ oId ] = nId;

        data.find((n,i)=>{
          //cl("is node "+i);cl(n);
          if( n.id == osfId ){
            osfNode =  n;
          }

          if( n.z != undefined && n.z == osfId ){
            osfFlow.push( n );
            idMap[ n.id ] = this.newId( n.id );
          }


        })||-1;

        if( debugShowProcess ){
          cl("------- base node difinition ");
          cl(osfNode);

          cl("-------   in flow ");
          cl(osfFlow);

          cl("------- id map");
          cl(idMap);
        }

        osfNode['flow'] = osfFlow;
        //osfNode.name = osfNode.meta.module;
        osfNode.color = "#cee768";
        let nType = osfNode.meta.type;
        osfNode.meta.type = nType.substring( 0, nType.length-4 );
        osfNode.category = 'sf2n-deployd';

        var jTrSwap = JSON.stringify( osfNode, null, 4 );
        jTrSwap = jTrSwap.split( oId ).join( nId );

        let keys = Object.keys( idMap );
        for(let k=0,kc=keys.length; k<kc; k++){
            jTrSwap = jTrSwap.split( keys[ k ] ).join( idMap[ keys[ k ] ] );
        };

        if( debugShowProcess )cl('-------\n'+jTrSwap);

        let tDir = osfNode.meta.module;
        let tDirFull = opts.prefixDir+'/'+tDir;
        cl("checking target dir ...."+tDirFull)
        if( this.chkDir( tDirFull ) == true  ){
          cl("  OK");
        }else{
          cl("no target directory ["+tDirFull+"] making it ...");
          fs.mkdirSync( tDirFull );
          //process.exit(1);
        }

        cl("putting package.json ....");
        // building package.json
        let tNodes = {};
        tNodes[ osfNode.meta.module ] = 'index.js';
        let pJ = {
          'name': osfNode.meta.module,
          'version': osfNode.meta.version,
          'description': osfNode.meta.desc,
          'keywords': osfNode.meta.keywords+', ot-sf2n',
          'license': osfNode.meta.license,
          'author': osfNode.meta.author,
          "engines": { "node": ">=10.19.0" },
          "node-red": {
              "version": ">=2.1.4",
              "nodes": tNodes
          }
        };
          // adding ./package_extra.json if have
        if( this.chkDir( `${tDirFull}/package_extra.json` ) == true ){
          cl('is have package_extra.json .... Do it ...');
          let pE = JSON.parse( fs.readFileSync( `${tDirFull}/package_extra.json` ).toString() );

          let ks = Object.keys( pE );
          for( let k=0,kc=ks.length; k<kc; k++ ){
              cl("adding ... "+ks[ k ]);
              pJ[ ks[ k ] ] = pE[ ks[ k ] ];
          }
          cl("pJ now After add---------");cl(pJ)

        }

        fs.writeFileSync( `${tDirFull}/package.json`, JSON.stringify( pJ, null, 4  ) );


        cl("putting sf.json ....");
        fs.writeFileSync( `${tDirFull}/sf.json`, jTrSwap );



        cl("putting README.md ....");
        let sep = "\n\n";
        let rInstall = fs.readFileSync( `${this.pTemplatesPath}/README_install.md` ).toString()
          .split('{npmName}').join(tDir);
        let rFoot = fs.readFileSync( `${this.pTemplatesPath}/README_foot.md` ).toString();
          // adding ./sample
        let rSample = '';
        if( this.chkDir( `${tDirFull}/sample` ) == true ){
          cl("  have own ./sample ....");
          let trSamp = [];


          if( this.chkDir( `${tDirFull}/sample/ss_exampleNodeSet.png` ) == true ){
            cl("  have own ./sample/ss_exampleNodeSet.png");
            trSamp.push( `In Node-RED\n![](https://raw.githubusercontent.com/yOyOeK1/oiyshTerminal/main/OTNPM/ot-sf2n/${tDir}/sample/ss_exampleNodeSet.png)` );
          }

          if( this.chkDir( `${tDirFull}/sample/exampleNodeSet.json` ) == true ){
            cl("  have own ./sample/exampleNodeSet.json");
            let jsonExampleStr = fs.readFileSync( `${tDirFull}/sample/exampleNodeSet.json` ).toString().split("\n").join('');
            trSamp.push(
              `\n*This is a json to import it as a example node set or use [link to ... ./sample/exampleNodeSet.json](https://github.com/yOyOeK1/oiyshTerminal/tree/main/OTNPM/ot-sf2n/${tDir}/sample/exampleNodeSet.json)*\n\n`+
              '```json\n'+jsonExampleStr+'\n```'
              );
          }


          if( trSamp.length > 0 ){
            rSample = '## example flow set'+sep+trSamp.join( sep )+sep;
          }


        }

        fs.writeFileSync( `${tDirFull}/README.md`,
          rInstall+sep+
          osfNode.info+sep+
          rSample+
          rFoot
        );

        cl("putting README4Node.md ....");
        fs.writeFileSync( `${tDirFull}/README4Node.md`,
          osfNode.info
        );


        cl("putting index.js .....");
        fs.writeFileSync( `${tDirFull}/index.js`, `

const fs = require("fs");
const path = require("path");

module.exports = function(RED) {
   const subflowFile = path.join(__dirname,"sf.json");
   const subflowContents = fs.readFileSync(subflowFile);
   const subflowJSON = JSON.parse(subflowContents);
   RED.nodes.registerSubflow(subflowJSON);
   console.log("ot-sf2n [${osfNode.meta.module}] : [${osfNode.name}] - ver ${osfNode.meta.version} init ....");
}

      `);

      cl("DONE");
      return 0;

    });
  }


}

class OTsf2nTest1 {
  constructor() {
    cl('OTsf2Test1 .... ');
    let o = new OTsf2n();
    cl( o );

    o.getAllSf();
    o.extractSF({
      'srcId': '287824b207e90fa3', // as a id of instance of subflow to export
      'prefixDir': "/tmp/b"
    } );

  }

}
class OTsf2nDoIt {
  constructor(opts) {
    cl('OTsf2DoIt init .... ');
    cl("  opts:");cl(opts);
    let o = new OTsf2n();
    o.extractSF(opts);
  }

}

const otsf2node = new OTsf2n();

try{
  module.exports = {
    OTsf2n,
    OTsf2nTest1,
    otsf2node
  };
}catch(e){
  cl("Is not in module mode ...");
}

//cl("cli?");

var args = {};
process.argv.forEach(function (val, index, array) {
  //console.log(index + ': ' + val);
  if( index >= 2 ){
    let s = val.split('=');
    args[ s[0] ] = s[1] == undefined ? 1 : s[1];
  }
});

function pHelp(){
  let subflowFile = path.join(__dirname,"README.md");
  cl("Help from "+subflowFile);
  cl(fs.readFileSync(subflowFile, 'utf-8'));
}

if( args != {} ){
  cl("args to parse :");cl(args);

  if( args['doId'] != undefined && args['pDir'] != undefined  ){
    cl(`go doId ............`);
    var d = new OTsf2nDoIt({
      'srcId': args['doId'], // as a id of instance of subflow to export
      'prefixDir': args['pDir']
    });

    //cl("DONE");
    //process.exit(0);

  } else if( args['runTestErr'] == 1 ){
    cl("go Exit with 1")
    process.exit(1);
  } else if( args['runTest1'] == 1 ){
    new OTsf2nTest1();

  }else if( args['-h'] != undefined || args['--help'] != undefined ){
    pHelp();
  } else {
    //cl("No arg help?");
    //pHelp();
  }


}
