
/**
  *
  *
  */
class mDynoForm{

  constructor( fName, tree ){
    this.fName = fName;
    this.tree = tree;

    this.iKey = "mDyK_"+Math.round(Math.random()+Math.random()+Math.random()+Math.random()*100)+"o";

    cl("mDynoForm ["+this.fName+"] init ... "+this.iKey);
    pager[this.iKey] = this;
  }


  getForm( id, content ){
    return `

    <form name="`+id+`" id="`+id+`">
      <ul data-role="listview" data-inset="true" class="ui-body-a">
        `+content+`
      </ul>
    </form>

    `;
  }

  getHtml(){
    let tr = '';//'<h1>mDyno form ..'+this.fName+'</h1>';

    cl("mDynoForm get html ....");
    cl("tree typeof"+(typeof this.tree));

    if( (typeof this.tree) == "object" ){
      cl("Going as dictionary");
      let keys = Object.keys(this.tree);
      cl("keys have: "+keys.length);
      for(let f=0,fc=keys.length; f<fc; f++ ){
        let key = keys[f];

        let cont = this.doElements( this.tree[key], [key] );

        tr+= this.getForm(
          key,
          `<li class="ui-field-contain">
            <label><b>Section: `+this.doFirstLeterBig( key )+`</b></label>`+
            cont
          );

      }

    }



    return tr;
  }


  doFirstLeterBig( str ){
    return str.substring(0,1).toUpperCase()+
      str.substring(1);
  }


  onFormChange(){
    cl("onFormChange ....");
  }

  doElement( name, val, vPath ){
    //cl("doElement. vPath");
    //cl(vPath);

    var cvP = 'pager[\''+this.iKey+'\'].onFormChange();pager[\''+this.iKey+'\'][\'tree\']';
    vPath.find((e,k)=>{cvP+="['"+e+"']"});

    // set function set()
    var setFA = pager[this.iKey].tree;
    vPath.find((e,k)=>{
      cl("enter "+e+" index: "+vPath.indexOf(e));
      if( vPath.indexOf(e) == vPath.length-1 ){
        cl("  setting "+e+'Set() ... ');
        setFA[e+'Set'] = function ( v ){
          setFA[e] = v;
          $('#'+e).val(v);
        };
      }else{
        setFA = setFA[e];
      }
    });


    if( (typeof val ) == "string" ){
      cvP+=`=$(this).val()`;
      return `
  <li class="ui-field-contain">
    <label for="`+name+`">`+this.doFirstLeterBig(name)+`:</label>
    <input type="text" name="`+name+`" id="`+name+`"
      value="`+val+`"
      onchange="`+cvP+`"
      >
  </li>
    `;

  } else if( (typeof val ) == "number" ){
    cvP+=`=$(this).val()`;
    return `
<li class="ui-field-contain">
  <label for="`+name+`">`+this.doFirstLeterBig(name)+`:</label>
  <input type="number" pattern="[0-9]" name="`+name+`" id="`+name+`"
    value="`+val+`"
    onchange="cl('ok2')"
    >
</li>
  `;

  }else if( (typeof val ) == "object" && Object.keys( val ).length > 0 ){
    cl("Have selector?...");
    cvP+=`=$(this).val()`;
    let keys = Object.keys( val );
    let items = [];
    for(let i=0,ic=val['options'].length; i<ic; i++ ){
      items.push( `<option value="`+i+`">`+val['options'][i]+`</option>` );
    }

    //value="`+val+`"
    //onchange="cl('ok2')"
    //>

    return  `
<li class="ui-field-contain">
  <label for="`+name+`">`+this.doFirstLeterBig(name)+`:</label>
  <select name="`+name+`" id="`+name+`" onchange="`+cvP+`">
    `+items.join(" ")+`
  </select>
</li>
  `;

  }else if( (typeof val ) == "function" ){
    cl("function value skipp...");
  }else{
    cl("NaN element ");
    cl(val);
    return 'NaN element type0: '+(typeof val );
  }

  }

  doElements( eList, vPath ){
    cl('doElements');
    //cl("doElements. vPath");
    //cl(vPath);
    let tr = [];

    if( (typeof eList) == "object" ){
      let keys = Object.keys( eList );
      for(let k=0,kc=keys.length; k<kc; k++ ){
        let e = eList[ keys[k] ];
        var tgvPath = [];
        vPath.find((e,k)=>{cl("e:"+e+" k:"+k); tgvPath.push( e ) });
        tgvPath.push( keys[k] );
        let el = this.doElement( keys[k], e, tgvPath );
        tr.push( el );

      }

    }else{
      tr.push( 'doElements got list: type unknown : '+(typeof eList) );
    }

    return tr.join("\n");



  }

}
