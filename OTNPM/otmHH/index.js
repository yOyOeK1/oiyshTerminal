

function cl( m ){
  console.log( m );
}


class OTMHH{
  constructor(){
    cl("OTMHH init ....");

  }


  injectionOfData( htmlAsStr, data ){
    let tr = '';
    for(let v=0;v<data.length; v++ ){
      let dkeys = Object.getOwnPropertyNames( data[v] );
      let h = htmlAsStr;
      //cl("h is type:"+typeof(h));
      //cl("h: "+h);
      for(let k2=0;k2<dkeys.length;k2++){
        h = h.replaceAll( "{"+dkeys[k2]+"}",  data[v][ dkeys[k2] ] );
      }
      //cl("hnew: "+h);
      tr+= h;
    }
    return tr;
  }


  injectDataToStr( htmlAsStr, data ){
    let mTemp = $('<div>');
    mTemp.html(htmlAsStr);
    let keys = Object.getOwnPropertyNames( data );
    for(let k=0;k<keys.length; k++){
      let key = keys[k];

      if( typeof(data[ key ]) == 'string' || typeof(data[ key ]) == 'number' ){
        let mTempOrg = mTemp.html();
        let mTempNoHtml = mTemp
        mTemp.html(
          mTempOrg.replaceAll( '{'+key+'}', data[ key ] )
          );
        data[ key+'_set'] = function( v ){
          cl('set .... v ?TODO '+v);
        };

      }else{
        //cl("finding target element by key ... [hh="+key+"]");
        let ele = mTemp.find("[hh="+key+"]");

        if( ele.is('[hhrepcont]') ){
          let temp = ele.html();
          ele.html( hhMakeInjectionOfData( temp, data[key] ) );

        }else if( ele.is('[hhrepthis]') ){
          let temp = ele.prop('outerHTML');
          //ele.css('display','none');
          ele.innerHTML = '';
          //cl("outer ["+temp+"]")
          ele.html( this.injectionOfData( temp, data[key] ) );


        }

      }

      //cl("after iter mTemp is ");
      //cl(mTemp.html());

    }

    return mTemp.html();
  }


  makeAll( qObjTarget, qObjTemplate, data ){
    let dm = $(qObjTarget);
    let tm = $(qObjTemplate).html();
    dm.html( this.injectDataToStr( tm, data ));

  }

  rebuildSelector( qObjTarget, data, selId=-1 ){
    let tm = $( qObjTarget );
    let tr = '';
    for( let o=0; o<data.length; o++){
      tr+= '<option value="'+data[o]['id']+'" ';
      if( data[o]['id'] == selId )
        tr+= 'selected ';
      tr+= '>'+data[o]['name']+'</option>';
    }

    tm.html(tr);

    cl("//tm.selectmenu().selectmenu('refresh');");
    tm.selectmenu('refresh');

  }


}

const otMHH = new OTMHH();

try{
  module.exports = otMHH;

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
      cl("run test 1 ------------------------------");

    }


  }

}catch(e){
  cl("Is not in module mode ...");
}
