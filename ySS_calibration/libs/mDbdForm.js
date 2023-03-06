
class mDbdForm{

  constructor( pageName, tableName, promoteColumn, defListSelect = '' ){
    cl("mDbdForm.js init ... page name:"+pageName);
    this.pH = "mDbdF"+this.hexIt(tableName+promoteColumn);
    pager[this.pH] = this;
    this.pageName = pageName;
    this.tableName = tableName;
    this.defListSelect = defListSelect;
    this.promoteColumn = promoteColumn;

    this.urlPrefix = '';

    cl("this.pageName: "+pageName);
    cl("this.tableName: "+tableName);
    cl("this.defListSelect: "+defListSelect);
    cl("this.promoteColumn: "+promoteColumn);
    cl("this.pH: "+this.pH);

    this.nForm = -1;

    this.app = new mApp();
    this.deb = false;
  }


  hexIt( str ){
    let tr = 0;
    for( let c=0,cc=str.length; c<cc; c++ )
      tr+= parseInt(str.charCodeAt(c).toString(2));
    return tr;
  }

  setForm( nForm ){
    this.nForm = nForm;
  }


  getFormDefinition( isEditing, data, btns ){
    if( this.nForm == -1 ){
      return [
          {
              "type" : "h3",
              "html" : isEditing ? "Editing: "+data['name']: "Set some stuff ..."
          },
          {
              "name" : "tStatus",
              "id" : "tStatus",
              "caption" : "status",
              "type" : "checkbox",
              "value" : 1,
              "checked": isEditing && data['status'] == 1 ? true : false
          },
          {
              "name" : "tName",
              "id" : "tName",
              "caption" : "Name / description:",
              "type" : "text",
              "placeholder" : "Task / project ...",
              "value": isEditing ? data['name'] : ''
          },
          {
              "name" : "tDescription",
              "id" : "tDescription",
              "caption" : "Description:",
              "type" : "textarea",
              "placeholder" : "In more details ...",
              "value": isEditing ? data['description'] : ''
          },
          {
            type : "div",
            "data-role" : "controlgroup",
            "data-mini" : "true",
            "data-type" : "horizontal",
            "id" : "dcgftfb"+this.pH,
            html : btns
          }
      ];
    }else{
      return this.nForm( isEditing, data, btns, this.pH );
    }
  }



  getHtmlEdit( urlPrefix, id ){
    return this.app.appFrame({
      "title": "PM: editing .... id:"+id,
      "content": this.getNewForm('asEdit', id),
      "backButton": "pager.goToByHash('"+urlPrefix+"')"
    });
  }

  getHtmlNew( urlPrefix ){
    return this.app.appFrame({
      "title": "PM: new mDbd 123",
      "content": this.getNewForm(),
      "backButton": "pager.goToByHash('"+urlPrefix+"')"
    });
  }

  getHtml( urlPrefix ){
    this.urlPrefix = urlPrefix;
    cl("getHtml .... "+urlPrefix+"  ... pH "+this.pH );
    cl("getHtml urlArgs");
    cl(urlArgs);
    cl("from url is "+urlArgs[this.pH]);

    if( urlArgs[this.pH] == "new" ){
      tr = this.getHtmlNew( urlPrefix );

    }else if( urlArgs[this.pH] == "edit" && urlArgs['id'] != undefined && urlArgs['id'] != '' ){
        tr = this.getHtmlEdit( urlPrefix, urlArgs['id'])

    }else{
      let cont = this.getActionsButtons()+this.loadTaskList(0);

      tr = this.app.appFrame({
        "title": this.promoteColumn,
        "content": cont,
        'backButton': "pager.goToByHash('pageByName="+pager.getCurrentPage().getName+"')"
      });
    }

    return tr;


  }


  dbQ( q, callBack, pH ){
    let url = 'http://192.168.43.220:1880/apidb?sql='+q.split("\n").join(" ");
    $.get( url, function( data, status ){
      if( this.deb ){
        cl("dbQ data");
        cl(data);
        cl("dbQ status");
        cl(status);
        cl("dbQ pH");
        cl(pH)
      }
      callBack( data, status, pH );

    } );
  }

  onDBisTableRes(d,s, pH){
    cl("onDBisTableRes .....");
    if( s == "success" ){
      if( d.length == 0 ){
        cl("No table ["+pager[pH].tableName+"] in db ...");
        $.toast({
            heading: 'Error',
            text: 'Table ['+pager[pH].tableName+'] in db is not there!',
            showHideTransition: 'slide',
            icon: 'error'
        });

      }else{
        cl("Table ["+pager[pH].tableName+"] in db .... OK");
        $.toast({
            heading: 'Info',
            text: 'Table ['+pager[pH].tableName+'] in db is OK!',
            showHideTransition: 'slide',
            icon: 'info'
        });
        pager[pH].loadTaskList(1);
      }
    }
  }

  getHtmlListLandingDiv(){
    return `<div id="projLV`+this.pH+`">Projects list is loading ... </div>`;
  }

  loadTaskList( step ){
    pH = this.pH;
    cl("loadTaskList mDbdForm  .... step: "+step+" .. pH "+pH);


    if( step == 0 ){
      cl("check If db table ["+pager[pH].tableName+"] is ok ....");
      //this.dbQ('select (1) as isNice,now() as tNow;');
      this.dbQ(
        `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '`+this.tableName+`';`,
        this.onDBisTableRes,
        this.pH
      );

      return this.getHtmlListLandingDiv();

    }else if( step == 1 ){
      cl("mDbdForm getting list off task in db .... have defListSelect: "+this.defListSelect);
      let sql = this.defListSelect == '' ? `SELECT * FROM `+this.tableName+` order by entryDate desc limit 50;` : this.defListSelect;
      cl("mDbdForm getting list by sql: "+sql);


      this.dbQ(
        sql,
        (d,r, pH)=>{
          if( r == 'success' ){
            cl("mDbdForm make tasks list ..... for table: "+this.tableName);

            let tsks = [];
            for(let i=0,ic=d.length; i<ic; i++ ){
              cl("addind task :"+d[i]['name']); // building element of list oview

              let dToShow = {};
              let keys = Object.keys(d[i]);
              for( let k=0,kc=keys.length; k<kc; k++ ){
                if( keys[ k ] != "id" && keys[ k ] != pager[pH].promoteColumn ){
                  dToShow[ keys[ k ] ] = d[i][ keys[ k ] ];
                }
                if( keys[ k ] == "entryDate" ){
                  dToShow[ keys[ k ] ] = timestampToNiceTime( d[i][ keys[ k ] ] );
                }
              }
              //dToShow = d[i].reduce((acc, obj) => Object.assign(acc, obj), {});


              tsks.push( pager[pH].app.lvElement(
                d[i][pager[pH].promoteColumn],
                {
                  "content": dToShow,
                  "tip": "id: "+d[i]['id']
                },
                "pager.goToByHash('"+pager[pH].urlPrefix+"&"+pH+"=edit&id="+d[i]['id']+"')"
               ) );
            }

            let tr = pager[pH].app.lvBuild({
              "header": "Current "+pager[pH].tableName+" ...",
              "headerTip": d.length,
              "items": tsks.join(' ')
            })


            $('#projLV'+pH).html( tr ).enhanceWithin();



          }

        },
        this.pH
      );

    }


  }



  getTaskFromDB( id, callBack, pH ){
    cl("getTaskFromDBPutToForm ... "+id);
    setTimeout(()=>{
      this.dbQ(
        `SELECT * FROM `+this.tableName+` WHERE id=`+id+`;`,
        (d,r,pH)=>{
          if( r == 'success' && d.length == 1 ){
            cl("Filling up the form .....");
            callBack( d[0], r,pH);
          }
        },
        this.pH
      )}, 200 );
    }

  onTaskFromDBCallBack( d, r, pH ){
    pager[pH].getNewForm( 'asData', d );
  }

  getNewForm( action = 'asNew', id = -1 ){
    let dName = 'dNewF'+this.pH;
    let fName = 'fNew'+this.pH;
    var isEditing = false;

    if( action == 'asEdit' && id != -1 ){
      cl("DO EDIT loading data from db ... ");
      this.getTaskFromDB( id, this.onTaskFromDBCallBack, this.pH );
      return '<div id="'+dName+'"></div>';
    }
    if( action == 'asData' && id != -1 ){
      cl("DO DATA from db to form .... ");
      cl(id);
      //return 'DO DATA';
      isEditing = true;
      var data = id;
    }



    setTimeout(()=>{

      if( $("#"+dName) && $("#"+dName).html() && $("#"+dName).html().length > 1 ){
        cl("It rund is there ....");
        return 0;
      }

      let btnToUse = [];
      if( isEditing == true ){
        btnToUse = [{
            "type" : "a",
            "html" : "Save",
            "href" : "#",
            "class": "ui-btn ui-corner-all",
            "onclick": "pager['"+this.pH+"'].onSaveIt("+data['id']+")"
          },{
            "type" : "a",
            "html" : "Remove",
            "href" : "#",
            "class": "ui-btn ui-corner-all",
            "onclick": "pager['"+this.pH+"'].onRemoveIt("+data['id']+")"
        }];
      }else{
        btnToUse = [{
            "type" : "reset",
            "value" : "Clean"
          },{
            "type" : "a",
            "html" : "Add it",
            "href" : "#",
            "class": "ui-btn ui-corner-all",
            "onclick": "pager['"+this.pH+"'].onAddIt()"
        }];
      }


      //getFormDefinition( isEditing, data, btns )
      let formDef = this.getFormDefinition( isEditing, data, btnToUse );

      $("#"+dName).dform({
        //"action" : "#pageByName="+this.pageName+"&action=add&",
        //"method" : "get",
        "id": fName,
        "html" : formDef
      });

      $("#dcgftfb"+pH).controlgroup();

      $("#"+fName).enhanceWithin();
    },500);


    return `<div id="`+dName+`"></div>`;

  }

  onDBInsertTask( d, r, pH ){
    cl("onDBInsertTask .....");
    if( r == 'success' ){
      $.toast({
          heading: 'Added',
          text: 'Is save fore later in db',
          showHideTransition: 'slide',
          icon: 'success'
      });
      pager.goToByHash(pager[pH].urlPrefix);
    }
  }

  onDBUpdateTask( d, r, pH ){
    cl("onDBUpdateTask .....");
    $.toast({
        heading: 'Success',
        text: 'Save.',
        showHideTransition: 'slide',
        icon: 'success'
    });

  }

  onRemoveIt( id ){
    cl("onRemoveIt ... "+id+" .. ");
    this.dbQ(
      'DELETE FROM '+this.tableName+' WHERE id=:vid;&vid='+id,
      (d,r)=>{
        if( r == "success" ){
          $.toast({
              heading: 'Success',
              text: 'Deleted.',
              showHideTransition: 'slide',
              icon: 'success'
          });
          pager.goToByHash(this.urlPrefix);
        }
      },
      this.pH
    );
  }

  onSaveIt( id ){
    this.onAddIt( 'ReadyUpdate', id );
  }

  onAddIt( action = 'Add', id = -1 ){
    cl("onAddIt "+action);
    let fData = $('#fNew').serializeArray();
    cl("Have data in serialize array ....");
    cl(fData);
    let sql = '';
    if( action == "Add" ){
      cl("ADD sql");
      sql = `insert into `+this.tableName+` `+
      `(status,name,description,entryDate) VALUES `+
      `(:vstatus,:vname,:vdescription,:ventryDate);`;
    }else if( action == "ReadyUpdate" ){
      cl("ReadyUpdate sql");
      sql = `UPDATE `+this.tableName+` SET `+
      `status=:vstatus, name=:vname, description=:vdescription, entryDate=:ventryDate WHERE `+
      `id=:vid;`;
    }
    let q = sql;

    let d = {
        "entryDate" : parseInt(new Date().getTime()/1000)
    };
    if( action == "ReadyUpdate" )
      d['id'] = id;

    for( let i=0,ic=fData.length; i<ic; i++ ){
      let vName = fData[ i ]['name'].substring(1).toLowerCase();
      d[ vName ] = fData[ i ]['value'];
    }
    if( d['status'] == undefined ){
      d['status'] = '0';
    }

    cl("sql is now ");
    cl(sql);
    cl("data to it ");
    cl(d);


    let ks = Object.keys( d );
    for(let i=0,ic=ks.length; i<ic; i++ ){
      //q+= "&v"+ks[i]+"="+encodeURI(d[ ks[i] ]);
      q+= "&v"+ks[i]+"="+d[ ks[i] ];
    }


    cl("so q will be ");
    cl(q);


    if( action == "Add" ){
      this.dbQ(
        q,
        this.onDBInsertTask,
        this.pH
      );

    }else if( action == "ReadyUpdate" ){
      this.dbQ(
        q,
        this.onDBUpdateTask,
        this.pH
      );
    }
  }


  getActionsButtons(){

    setTimeout(()=>{

      if( $("#dActBut"+this.pH).html().length > 1 ){
        cl("It rund is there ....");
        return 0;
      }

      cl("------------------------------");
      $("#dActBut"+this.pH).dform({
        //"action" : "#",
        //"method" : "get",
        "id": "fActBut"+this.pH,
        "html" :
        [
            {
                "type" : "label",
                "html" : "Action button for you:"
            },
            {
              type : "div",
              "data-role" : "controlgroup",
              "data-mini" : "true",
              "data-type" : "horizontal",
              "id" : "dcghab"+this.pH,
              html : [
                      {
                        "type" : "a",
                        "html" : "New",
                        "href" : "#",
                        "class": "ui-btn ui-corner-all ui-icon-delete ui-bt-icon-left",
                        "onclick": "pager.goToByHash('"+this.urlPrefix+"&"+this.pH+"=new')"
                      }
              ]
            }
        ]
      });

      $("#dcghab"+this.pH).controlgroup();

    },500);


    return `<div id="dActBut`+this.pH+`"></div>`;

  }

}
