


class m2Col{

  constructor( colName, label, val = undefined ){
    cl("m2Col init ... [name, label, val]");
    cl([colName, label, val]);

    this.name = colName;
    this.label = label;
    this.v = val;
  }

  getName(){
    return this.name;
  }
  getLabel(){
    return this.label;
  }
  getVal(){
    return this.v;
  }

  getDBValAdd( fields ){
    return fields;
  }

}

class m2View extends aggregation( m2Col ){

  constructor( colName, label, val = undefined, preDisplay = undefined ){
     super( colName, label, val );
     cl("m2View init .... ");
     this.preDisplay = preDisplay;

  }

  getFormField( v = '' ){
    return`<label for="${this.getName()}" class="ui-dform-label">${this.getLabel()}</label>`+
      (this.preDisplay ? this.preDisplay( this.getVal() ) : this.getVal());
  }

}


class m2InputText extends aggregation( m2Col ){

  constructor( colName, label, val ){
     super( colName, label, val );
     cl("m2VInputText init .... ");

  }

  getFormField( v = '' ){
    return {
        "name" : this.name,
        "id" : this.name,
        "caption" : this.label,
        "type" : "input",
        //"placeholder" : "Task / project ...",
        "value": this.getVal()
    };

  }


  getDBValAdd( fields ){
    let ttr = {};
    ttr[ this.name ] = $('#'+this.name).val()
    fields.push( ttr );
    return fields;
  }

}


class m2Hidden extends aggregation( m2Col ){

  constructor( colName, val ){
     super( colName, '', val );
     cl("m2Hidden init .... ");

  }

  getFormField( v = '' ){
    return {
        "name" : this.name,
        "id" : this.name,
        "caption" : this.label,
        "type" : "text",
        "style": "display:none;",
        //"placeholder" : "Task / project ...",
        "value": this.getVal()
    };

  }


  getDBValAdd( fields ){
    let ttr = {};
    ttr[ this.name ] = $('#'+this.name).val()
    fields.push( ttr );
    return fields;
  }

}




class m2TrueFalse extends aggregation( m2Col ){

  constructor( colName, label, onOffVals=[1,0], val=0 ){
     super( colName, label, val );
     cl("m2TrueFalse init .... ");

     this.vals = onOffVals;

  }

  getFormField( v = '' ){
    let ttr = [
      {
        "type": "label",
        "for": this.name,
        "html": this.label+": "+JSON.stringify(this.vals)
      },{
        "name" : this.name,
        "id" : this.name,
        //"text": "text abc",
        //"caption" : JSON.stringify(this.vals),
        "type" : "checkbox",
        //"placeholder" : "Task / project ...",
        "value": "1"
      }
    ] ;
    //this.getVal()
    if( this.getVal() == 1 )
      ttr[1]['checked']='checked';

    return ttr;
  }


  getDBValAdd( fields ){
    let ttr = {};
    if( $('#'+this.name).attr('checked') ){
      ttr[ this.name ] = this.vals[0];
    }else{
      ttr[ this.name ] = this.vals[1];
    }
    fields.push( ttr );
    return fields;
  }

}


class m2Select extends aggregation( m2Col ){

  constructor( colName, label, options=[], val=0 ){
     super( colName, label, val );
     cl("m2Select init .... ");

     this.options = options;

  }

  getFormField( v = '' ){
    let ttr = {
        "name" : this.name,
        "id" : this.name,
        "caption" : this.label,
        "type" : "select",
        //"placeholder" : "Task / project ...",
        "options": this.options,

    };
    //this.getVal()

    setTimeout(()=>{
      cl("set it ...."+'#'+this.name+' :nth-child('+this.getVal()+')');
      $('#'+this.name+' option').eq(this.getVal()).prop('selected', true);

    },1000);


    return ttr;
  }


  getDBValAdd( fields ){
    let ttr = {};
    ttr[ this.name ] = $('#'+this.name+' option:selected').val();
    fields.push( ttr );
    return fields;
  }

}




class mDF2{

  constructor( mDef ){
    this.deb = true;

    this.mDef = mDef;
    this.obName = mDef['table']+"_"+mDef['aedv'].length+"_"+mDef['aedv'][0].length
    pager[ this.obName ] = this;

    cl(`mDF2 init ... use obName[${this.obName}]`);


  }


  dbQ( q, cbOnDBQDONE = -1 ){
    cl(`dbQ .... debug ${this.deb}`);
    let url = 'http://192.168.43.220:1880/apidb?sql='+q.split("\n").join(" ");
    $.get( url, function( data, status ){
      if( 1 ){
        cl("dbQ data");
        cl(data);
        cl("dbQ status");
        cl(status);
        cl("dbQ call back in .... "+cbOnDBQDONE);

      }
      if( cbOnDBQDONE == -1 ){
        cl("DONE no call back ....");

      }else{
        cbOnDBQDONE( data, status );
      }

    } );

  }

  cbOnDBQDONEPreWrap( data, status, cb ){

    cl(`cbOnDBQDONEPreWrap ... ${this.obName} -> status[${status}] data:`);
    cl(data);
  }

  checkTable(){
    cl("checkTable ....");
    this.dbQ(
      `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '`+this.mDef.table+`';`,
      (d,r)=>{ if( r == "success" && d.length > 0 ){ cl("table is OK!"); }else{
          cl("table is Not THERE!");
          $.toast({
              heading: 'mDF2: Error',
              text: 'Table ['+this.mDef.table+'] in db is not there!',
              showHideTransition: 'slide',
              icon: 'error'
          });
        } }
    );
    return `checking if table is ok ...`;
  }


  actAdd(){
    cl("actAdd .... ");

    let tav = [
      {'entryDate':timeStampNow()}
    ];

    let cDef = this.mDef.aedv;
    for(let c=0,cc=cDef.length; c<cc; c++ ){
      let colDef = cDef[c];
      tav = colDef[0].getDBValAdd( tav );

    }

    cl("so add db q is ....");
    cl( tav );

    let qVN = [];
    let qVNS = [];
    let qV = '';
    for( let c=0,cc=tav.length; c<cc; c++ ){
      let key = Object.keys( tav[c] )[0];
      let v = tav[c][ key ];
      qVN.push( key );
      qVNS.push( ':'+key );
      qV+= '&'+key+'='+encodeURIComponent(v);
    }
    let qins = `insert into `+this.mDef.table+` `+
      `( `+qVN.join(",")+` ) VALUES
       ( `+qVNS.join(",")+` );`;

    let sq = qins+qV;
    cl("so org q is :")
    cl(sq);

    this.dbQ(
      sq,
      (d,r)=>{
        if( r == "success" && d.insertId != undefined ){
          pager[this.obName]['lastAddRes'] = d;
          cl("Added !");
          pager[ this.obName ].cbOnAddDone( d.insertId );
        }else{
          cl("Error when Adding");
        }
      }
    );


  }


  makeFormAdd( htmlObjTargetId, cbAfterAdd ){
    cl(`makeFormAdd .... `);
    let fa = "make Form Add ...";
    this.cbOnAddDone = cbAfterAdd;

    let ht = [
      {
        "type": "h3",
        "html": "Add form from - mDF2.js"
      }
    ];

    let cDef = this.mDef.aedv;
    let fields = [];
    for(let c=0,cc=cDef.length; c<cc; c++ ){
      let colDef = cDef[c];
      cl(`doing column ${c} - is as ${typeof colDef[0]}`);
      let ff = colDef[0].getFormField();

      // adding fields / rows of form from mDef ...
      cl("trace type ");
      cl(colDef[0].constructor.name);
      if(
        (ff != "" && ff != undefined ) ||
        ( 1 )
      ){
        fields.push({
              'type': 'li',
              'class': 'ui-field-contain ui-li-static ui-body-inherit ui-first-child',
              'html': ff
        });

        if( colDef[0].constructor.name == 'm2Hidden' ){
          fields[ fields.length-1 ]['style']='display:none;';
        }

      }

    }

    ht.push({
          'type': 'ul',
          'html': fields,
          'id': 'lvStart',
          'data-role': 'listview',
          'data-inset': 'true'
    });


    ht.push({
        type : "div",
        "data-role" : "controlgroup",
        "data-mini" : "true",
        "data-type" : "horizontal",
        html : [{
            "type" : "reset",
            "value" : "Clean"
          },{
            "type" : "a",
            "html" : "Add it",
            "href" : "#",
            "class": "ui-btn ui-corner-all",
            "onclick": "pager['"+this.obName+"'].actAdd()"
        }]
    });

    cl('final ht');
    cl(ht);


    $( htmlObjTargetId ).dform({
      'id': "mdfFormAdd"+this.obName,
      'html': ht
    });

    $( "#mdfFormAdd"+this.obName+' #lvStart' ).listview();
    $( "#mdfFormAdd"+this.obName ).enhanceWithin();
    cl("dform executed ....");

  }





}





function mt1(){
  cl("mt1 ------------------ START");




  mDef = {
    table: "tTestmDF2",
    aedv:[
      ['view', 'c1Name', "Column 1", , ], // no def value, no def preDisplay
      ['view', 'etFormCreate', "Form created at", parseInt(new Date().getTime()/1000), timestampToNiceTime ]
    ]
  };

  let m = new mDF2( mDef );
  cl("test table no monit...");
  m.checkTable();





  cl("mt1 ------------------ END");
}
