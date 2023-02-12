

console.log("m.js is running ....");

function cl(str){
  console.log(str);
}



function mkParse(j){
  cl("do we have a json ? items in:"+j.length);
  if( j.length == 0 || j.length == undefined ){
    cl("error no items in json. abord.");
    process.exit();
  }

  var jt = {};
  var jtId = "";
  var jtC = 0;
  var jn = [];
  if( j != {} ){
    cl("so if we have json check if it's ok....");
    for(var n=0,nc=j.length; n<nc; n++ ){
      var t = j[n].type;
      var id = j[n].id;
      cl(" - node nr:"+n+" type:"+t+" id:"+id);
      if( t == "tab" ){
        jtC++;
        jtId = id;
        jt = j[n];
      }else{
        jn.push(j[n]);
      }

    }

    cl(" - so after check we have.");
    cl(" - tab count:"+jtC+" nodes count:"+jn.length);
    if( jtC==1 ){
      cl("we have tab so building injection json....");
      var tr=jt;
      tr['nodes']=jn;
      cl("done");

      return tr;


    }else{
      cl("error more then one tab !");
      process.exit();
    }


  }

  return {};
}





cl("got args:");
cl( process.argv );

if( process.argv.length == 3 ){
  var fn = process.argv[2];
  cl("got arg3 ["+fn+"]");

  cl("try to read it....");

  const fs = require('fs');
  fs.readFile( fn, (err, data) => {
    if (err) throw err;
    var jj = JSON.parse(data);
    var tr = mkParse(jj);
    if( tr != {} ){
      var nfn = fn.replace('.json','')+'_nrfi.json';
      cl('saving it with the name ['+nfn+'] for file:'+fn);
      let jStr = JSON.stringify(tr);
      const fsW = require('fs');
      fsW.writeFile(nfn, jStr, 'utf8', (err) => {if(err!=null)cl("error writing file :("+err);});
      cl('DONE');

    }else{
      cl("error something went wrong :(");
    }
  });
}
