


class m2Col{

  constructor( colName, label, val = undefined ){
    cl("m2Col init ... [name, label, val]");
    cl([colName, label, val]);

    this.name = colName;
    this.label = label;
    this.v = val;

  }

  setMDFParent( mdfParent ){
    cl(`setMDFParent for ${this.name} : ${this.label}`)
    this.mdf = mdfParent;
  }

  setAEDV( act, resForIdName ){
    this.aedv = act;
    this.formId = resForIdName;
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

  getDBValAddEdit( actAEDV, fields ){
    return fields;
  }

  setVal( v ){
    this.v = v;
    cl(".setVal v = v ....");
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


  getDBValAddEdit( actAEDV, fields ){
    let ttr = {};
    ttr[ this.name ] = $('#'+this.formId+' #'+this.name).val()
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


  getDBValAddEdit( actAEDV, fields ){
    let ttr = {};
    ttr[ this.name ] = $('#'+this.formId+' #'+this.name).val()
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


  getDBValAddEdit( actAEDV, fields ){
    let ttr = {};
    if( $('#'+this.formId+' #'+this.name).attr('checked') ){
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

      cl('select val is :'+this.getVal() );
      cl("options ");
      cl( this.options );
      $( "#"+this.formId+' #'+this.name ).selectmenu()
      $( "#"+this.formId+' #'+this.name ).val( this.getVal() );
      $( "#"+this.formId+' #'+this.name ).selectmenu('refresh');
      //$( e0Sel ).select('refresh');

    },500);


    return ttr;
  }



  /*

  setVal( v ){
    cl(" .setVal for m2TrueFalse .... "+v);
    this.v = v;

    setTimeout(()=>{
      $('#this.name option:eq("'+v+'")').prop('selected', true);
    },800);

  }

  */



  getDBValAddEdit( actAEDV, fields ){
    let ttr = {};
    ttr[ this.name ] = $('#'+this.formId+' #'+this.name+' option:selected').val();
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
    cl(this.mDef);

    // pass this to all mDefs
    cl("have aedvs in arra .... "+this.mDef['aedv'].length);
    for(let f=0,fc=this.mDef['aedv'].length; f<fc; f++ ){
      cl("set mdf parent ...."+f);
      //this.mDef.aedv[f].setMDFParent( this );
    }
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

  getFormName( actName){
    return `mdfForm${actName}`+this.obName;
  }

  actEdit(){
    cl("actEdit ....");
    this.actAddEdit('e');
  }

  actAdd(){
    this.actAddEdit('a');
  }

  actAddEdit(actAEDV){
    let actName = 'Add';
    let editingId = '';

    if( actAEDV == 'e' ){
      actName = 'Edit';
      editingId = $( '#'+this.getFormName( actName ) ).attr('editID');
    }

    cl(`act${actName} .... `);

    let tav = [
      {'entryDate':timeStampNow()}
    ];

    let cDef = this.mDef.aedv;
    for(let c=0,cc=cDef.length; c<cc; c++ ){
      let colDef = cDef[c];
      tav = colDef[0].getDBValAddEdit( actAEDV , tav );

    }

    cl("so add db q is ....");
    cl( tav );

    let qVN = [];
    let qVNS = [];
    let qV = '';
    let qins = '';
    for( let c=0,cc=tav.length; c<cc; c++ ){
      let key = Object.keys( tav[c] )[0];
      let v = tav[c][ key ];
      qVN.push( key );
      qVNS.push( ':'+key );
      qV+= '&'+key+'='+encodeURIComponent(v);

    }

    if( actAEDV == 'a' ){
      qins = `insert into `+this.mDef.table+` `+
        `( `+qVN.join(",")+` ) VALUES
        ( `+qVNS.join(",")+` );`;
    } else if ( actAEDV == 'e' ){
      qins = `update ${this.mDef.table} set `;
      let setL = []
      for(let s=0,sc=qVNS.length; s<sc; s++ ){
        setL.push( `${qVN[s]}=${qVNS[s]}` );
      }
      qins+= setL.join(',')+
        ` where id=:id;`;
      qV+=`&id=${editingId}`;
    }


    let sq = qins+qV;
    cl("so org q is :")
    cl(sq);


    if( actAEDV == 'a' ){
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
    }else if( actAEDV == 'e' ){
      cl("doooo DB!!!");
      this.dbQ(
        sq,
        (d,r)=>{
          if( r == "success" && d.warningStatus == 0 ){
            cl("Saved !");
            pager[ this.obName ].cbOnAddDone(0);
          }else{
            cl("Error when Editing ");
          }
          /*
          if( r == "success" && d.insertId != undefined ){
            pager[this.obName]['lastAddRes'] = d;
            cl("Saved !");
            pager[ this.obName ].cbOnAddDone( d.insertId );
          }else{
            cl("Error when Adding");
          }
          */
        }
      );
    }


  }

  makeFormAdd( htmlObjTargetId, cbAfterAdd ){
    this.makeFormAddEdit('a', htmlObjTargetId, cbAfterAdd );
  }

  makeFormAddEdit( actAEDV, htmlObjTargetId, cbAfterAdd, data ){
    let actName = 'Add';
    let btLabelAddSave = 'Add it';
    let editingId = ``;

    if( actAEDV == 'e' ){
      actName = 'Edit';
      btLabelAddSave = 'Save';
      editingId = data['id'];
    }

    let resForIdName = this.getFormName( actName );

    cl(`makeFormAddEdit AEDV_${actName} .... `);
    let fa = `make Form ${actName} ...`;
    this.cbOnAddDone = cbAfterAdd;

    let ht = [
      {
        "type": "h3",
        "html": `${actName} form from - mDF2.js`
      }
    ];

    let cDef = this.mDef.aedv;
    let fields = [];
    for(let c=0,cc=cDef.length; c<cc; c++ ){
      let colDef0 = cDef[c][0];
      cl(`doing column ${c} - is as ${typeof colDef0}`);

      colDef0.setAEDV( actAEDV, resForIdName );
      if( actAEDV == 'a' ){

      } else if( actAEDV == 'e' ){
        colDef0.setVal( data[ colDef0.name ] );

      }

      let ff = colDef0.getFormField();

      // adding fields / rows of form from mDef ...
      cl("trace type ");
      cl(colDef0.constructor.name);
      if(
        (ff != "" && ff != undefined ) ||
        ( 1 )
      ){
        fields.push({
              'type': 'li',
              'class': 'ui-field-contain ui-li-static ui-body-inherit ui-first-child',
              'html': ff
        });

        if( colDef0.constructor.name == 'm2Hidden' ){
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
            "html" : `${btLabelAddSave}`,
            "href" : "#",
            "class": "ui-btn ui-corner-all",
            "onclick": `pager['${this.obName}'].act${actName}()`
        }]
    });

    cl('final ht');
    cl(ht);

    let dformDef = {
      'id': resForIdName,
      'editId': editingId,
      'html': ht
    };
    
    $( htmlObjTargetId ).dform( dformDef );

    $( `#${resForIdName} [id="lvStart"]` ).listview();
    $( `#${resForIdName}` ).enhanceWithin();
    cl("dform executed ....");

  }


  makeFormEdit( htmlObjTargetId, editID, cbAfterAdd ){
    cl(`makeFormEdit ... editID:${editID}`)
    var editK = 'edit_'+editID;
    if( this[ editK ] == undefined ){
      this[ editK ] = 0;
      cl(`step ... 0 - get data from db .....`);
      $( htmlObjTargetId ).html('loading data ....');
      this.dbQ(
        `select * from ${this.mDef.table} where id=${editID};`,
        (d,r)=>{
          cl("d.length ... " +d.length);
          cl("d[0] keys .... "+Object.keys(d[0]).length);

          if( r == "success" && d.length == 1 && Object.keys(d[0]).length > 2 ){
            this[ editK ] = d[0];
            this.makeFormEdit( htmlObjTargetId, editID, cbAfterAdd );
          }else{
            cl("Error on getting data from db :( 34567");
          }
        }
      );


    }else if ( Object.keys( this[ editK ] ).length > 2 ){
      cl('makeFormEdit ... Have data make form ....');
      this.makeFormAddEdit('e', htmlObjTargetId, cbAfterAdd, this[ editK ] );

    }else{
      cl('makeFormEdit ... NaN state !');
    }



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
