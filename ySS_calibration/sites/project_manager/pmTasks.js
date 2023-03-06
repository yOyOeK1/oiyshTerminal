
class pmTasks{

  constructor( pageName ){
    cl("pmTasks init ... page name:"+pageName);
    this.pageName = pageName;

    this.app = new mApp();
    this.tasksList = [];
    this.deb = false;
  }


  dbQ( q, callBack ){

    let url = 'http://192.168.43.220:1880/apidb?sql='+q.split("\n").join(" ");
    if( this.deb ) cl("task.dbQ: "+url);
    $.get( url, function( data, status ){
      if( this.deb ){
        cl("dbQ data");
        cl(data);
        cl("dbQ status");
        cl(status);
      }
      callBack( data, status );

    } );
  }



  getHtmlFastDependTask( idTaskParent, step = 0 ){
    cl("getHtmlFastDependTask .... idTaskParent: "+idTaskParent+" .... step: "+step);
    let cp = pager.getCurrentPage();
    if( step == 0 ){
      let tr = `<div id="dfdta">Fast dependency task adder ... loading</div>`;
      this['fdt_idTaskParent'] = idTaskParent;

      // getting list of task still left not currently added
      this.dbQ(
        `SELECT
        pt.id,
        pt.status as status,
        pt.name as name,
        pt.description as description,
        pt.entryDate as entryDate
        FROM pm_tasks as pt
        WHERE
          id != `+idTaskParent+` AND
          id not in ( SELECT idTask FROM pm_binds WHERE idTaskParent=`+idTaskParent+` )
        ORDER BY entryDate desc;`,
        (d,r)=>{
          if( r == 'success' ){
            cl("make tasks list posible still to add.....");
            cp.task.tasksListCanAdd = [];
            for(let i=0,ic=d.length; i<ic; i++ ){
              cp.task.tasksListCanAdd.push( { "value":d[i]['id'], "html":d[i]['name']} );
            }

            cp.task.getHtmlFastDependTask( cp.task['fdt_idTaskParent'], 2 );

          }

        }
      );

      return tr;

    } else if( step == 2 ){
      cl("Got to step 2 ! so we have list of task what we can add ... len is: "+cp.task.tasksListCanAdd.length);

      $('#dfdta').html('');
      $('#dfdta').dform({
        "html":[
          {
            "type": "h3",
            "html": "Add dependency if so .."
          },
          {
            "id" : "fFastDepsAdd",
            "name" : "fFastDepsAdd",
            "type" : "div",
            "data-role" : "controlgroup",
            "data-mini" : "true",
            "data-type" : "horizontal",
            "html":[
                {
                  "type": "select",
                  "id": "subTaskSelection",
                  "caption": "Depend on ...",
                  //"options": [{"value":1,"html":"one"},{"value":2,"html":"two"},{"value":3,"html":"three"}]
                  "options": cp.task.tasksListCanAdd
                },
                {
                  "type" : "a",
                  "html" : "Add",
                  "href" : "#",
                  "class": "ui-btn ui-corner-all",
                  "onclick": "pager.getCurrentPage().task.getHtmlFastDependTask(0, 5)"
                },

              ]
          }
        ]
      });

      $('#fFastDepsAdd').controlgroup();

    } else if( step == 5 ){ // from form task selected to be insert do pm_binds
      let idTaskParent = cp.task['fdt_idTaskParent'];
      let idSubTask = $("#subTaskSelection  option:selected").val();
      cl("Got request to add sub task .....");
      cl("Parent id: "+idTaskParent);
      cl("Subtask id: "+idSubTask);

      let ed = parseInt( (new Date().getTime())/1000 );
      let sql = `insert into pm_binds `+
        `(idTaskParent,idTask,entryDate) VALUES `+
        `(`+idTaskParent+`,`+idSubTask+`,`+ed+`);`;
      cl("Inserting to db ....");
      cp.task.dbQ(
        sql,
        (d,r)=>{
          if( r == 'success' )
            pager.getCurrentPage().task.getHtmlFastDependTask( r, 6 );

        }
      );

    } else if( step == 6 ){ // insert to DB done OK !
      $.toast({
          heading: 'Task added',
          text: 'Is subscribe as a first to be done!',
          showHideTransition: 'slide',
          icon: 'info'
      });

    }


  }




  onDBisTableRes(d,s){
    cl("onDBisTableRes .....");
    if( s == "success" ){
      if( d.length == 0 ){
        cl("No table in db ...");

        $.toast({
            heading: 'Error',
            text: 'Table in db is not there!',
            showHideTransition: 'slide',
            icon: 'error'
        });

      }else{
        cl("Table in db .... OK");
        $.toast({
            heading: 'Info',
            text: 'Table in db is OK!',
            showHideTransition: 'slide',
            icon: 'info'
        });
        pager.getCurrentPage().task.loadTaskList(1);
      }
    }
  }

  loadTaskList( step ){
    cl("loadTaskList .... step: "+step);
    let cp = pager.getCurrentPage();

    if( step == 0 ){
      cl("check If db table is ok ....");
      //this.dbQ('select (1) as isNice,now() as tNow;');
      this.dbQ(
        `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'pm_tasks';`,
        this.onDBisTableRes
      );

      return `<div id="projLV">Projects list is loading ... </div>`;

    }else if( step == 1 ){
      cl("getting list off task in db ....");

      this.dbQ(
        `SELECT
        pt.id,
        pt.status as status,
        pt.name as name,
        pt.description as description,
        pt.entryDate as entryDate,
        ( SELECT count(idTask) FROM pm_binds WHERE idTaskParent=pt.id ) as childrens
        FROM pm_tasks as pt order by status, childrens, entryDate desc;`,
        (d,r)=>{
          if( r == 'success' ){
            cl("make tasks list .....");

            let tsks = [];
            cp.task.tasksList = [];
            for(let i=0,ic=d.length; i<ic; i++ ){
              cp.task.tasksList.push( {"id":d[i]['id'], "name":d[i]['name']} );
              tsks.push( cp.task.app.lvElement(
                d[i]['name'],
                {
                  "content":{
                    "desc": d[i]['description'],
                    "status": d[i]['status'],
                    "childrens" : d[i]['childrens'],
                    "id" : +d[i]['id']
                  },
                  "tip": "s: "+d[i]['status']?'TODO':'DONE'
                },
                "pager.goToByHash('pageByName=project manager&action=edit&id="+d[i]['id']+"')"
               ) );
            }

            let tr = cp.task.app.lvBuild({
              "header": "Current tasts ...",
              "headerTip": d.length,
              "items": tsks.join(' ')
            })


            $('#projLV').html( tr ).enhanceWithin();



          }

        }
      );

    }


  }



  getTaskFromDB( id, callBack ){
    cl("getTaskFromDBPutToForm ... "+id);
    setTimeout(()=>{
      this.dbQ(
        `SELECT * FROM pm_tasks WHERE id=`+id+`;`,
        (d,r)=>{
          if( r == 'success' && d.length == 1 ){
            cl("Filling up the form .....");
            callBack( d[0], r);
          }
        }
      )}, 200 );
    }

  onTaskFromDBCallBack( d, r ){
    pager.getCurrentPage().task.getNewForm( 'asData', d );
  }

  getNewForm( action = 'asNew', id = -1 ){
    let dName = 'dNewF';
    let fName = 'fNew';
    var isEditing = false;

    if( action == 'asEdit' && id != -1 ){
      cl("DO EDIT loading data from db ... ");
      this.getTaskFromDB( id, this.onTaskFromDBCallBack );
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

      if( $("#"+dName).html().length > 1 ){
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
            "onclick": "pager.getCurrentPage().task.onSaveIt("+data['id']+")"
          },{
            "type" : "a",
            "html" : "Remove",
            "href" : "#",
            "class": "ui-btn ui-corner-all",
            "onclick": "pager.getCurrentPage().task.onRemoveIt("+data['id']+")"
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
            "onclick": "pager.getCurrentPage().task.onAddIt()"
        }];
      }



      let formDef = [
          {
              "type" : "h3",
              "html" : isEditing ? "Editing: "+data['name']: "Set some stuff ..."
          },
          {
              "type" : "div",
              "id": "dExtrInfo"
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
            "id" : "dcgftfb",
            html : btnToUse
          }
      ];



      $("#"+dName).dform({
        //"action" : "#pageByName="+this.pageName+"&action=add&",
        //"method" : "get",
        "id": fName,
        "html" : formDef
      });

      $("#dcgftfb").controlgroup();

      $("#"+fName).enhanceWithin();
    },500);


    return `<div id="`+dName+`"></div>`;

  }

  onDBInsertTask( d, r ){
    cl("onDBInsertTask .....");

    if( urlArgs['idTaskParent'] != undefined && urlArgs['idTaskParent'] != '' ){
      cl("Have id task parent need one more insert ....");
      // workon

      var pageToGoAfter = 'pageByName='+pager.getCurrentPage().getName+'&action=edit&id='+urlArgs['idTaskParent'];
      pager.getCurrentPage().task.dbQ(
        `insert into pm_binds
        ( idTask, idTaskParent, entryDate)
        values
        (
          (select id from pm_tasks order by id desc limit 1) ,
          `+urlArgs['idTaskParent']+` ,
          `+parseInt((new Date().getTime())/1000 )+`
        );`,
        (d,r)=>{
          if( r == 'success'  ){
            cl("Insert binds done ...");
            pager.getCurrentPage().task.onDBInsertTask( '', 'success' );
            pager.goToByHash(pageToGoAfter);
            urlArgs['idTaskParent'] = '';
          }
      });
      return 0;
    }


    if( r == 'success' ){
      $.toast({
          heading: 'Added',
          text: 'Is save fore later in db',
          showHideTransition: 'slide',
          icon: 'success'
      });
      pager.goToByHash('pageByName=project manager&action=edit&id='+d['insertId']);
    }
  }

  onDBUpdateTask( d, r ){
    cl("onDBUpdateTask .....");
    $.toast({
        heading: 'Success',
        text: "Save. <a href=\"#\" onclick=\"pager.goToByHash('pageByName=project manager')\">Go to list ...</a>",
        showHideTransition: 'slide',
        icon: 'success'
    });

  }

  onRemoveIt( id ){
    cl("onRemoveIt ... "+id);
    this.dbQ(
      'DELETE FROM pm_tasks WHERE id=:vid;&vid='+id,
      (d,r)=>{
        if( r == "success" ){
          $.toast({
              heading: 'Success',
              text: 'Deleted.',
              showHideTransition: 'slide',
              icon: 'success'
          });
          pager.goToByHash('pageByName=project manager');
        }
      }
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
      sql = `insert into pm_tasks `+
      `(status,name,description,entryDate) VALUES `+
      `(:vstatus,:vname,:vdescription,:ventryDate);`;
    }else if( action == "ReadyUpdate" ){
      cl("ReadyUpdate sql");
      sql = `UPDATE pm_tasks SET `+
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
        this.onDBInsertTask
      );

    }else if( action == "ReadyUpdate" ){
      this.dbQ(
        q,
        this.onDBUpdateTask
      );
    }
  }


  getActionsButtons(){

    setTimeout(()=>{

      if( $("#dActBut").html().length > 1 ){
        cl("It rund is there ....");
        return 0;
      }

      $("#dActBut").dform({
        //"action" : "#",
        //"method" : "get",
        "id": "fActBut",
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
              "id" : "dcghab",
              html : [
                      {
                        "type" : "a",
                        "html" : "New",
                        "href" : "#",
                        "class": "ui-btn ui-corner-all ui-icon-delete ui-bt-icon-left",
                        "onclick": "pager.goToByHash('pageByName="+this.pageName+"&action=new')"
                      },
                      {
                        "type" : "a",
                        "html" : "Binds",
                        "href" : "#",
                        "class": "ui-btn ui-corner-all ui-icon-delete ui-bt-icon-left",
                        "onclick": "pager.goToByHash('pageByName="+this.pageName+"&action=binds')"
                      },
                      {
                        "type" : "a",
                        "html" : "Resources",
                        "href" : "#",
                        "class": "ui-btn ui-corner-all ui-icon-delete ui-bt-icon-left",
                        "onclick": "pager.goToByHash('pageByName="+this.pageName+"&action=resources')"
                      }
              ]
            }
        ]
      });

      $("#dcghab").controlgroup();

    },500);


    return `<div id="dActBut"></div>`;

  }

}
