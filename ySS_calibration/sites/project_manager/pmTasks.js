

class svgArcHelper{

  point(x, y, r, angel){
    return  [
    (x + Math.sin(angel) * r).toFixed(2),
    (y - Math.cos(angel) * r).toFixed(2),
    ];
  }

  full(x, y, R, r){
    if (r <= 0) {
      return `M ${x - R} ${y} A ${R} ${R} 0 1 1 ${x + R} ${y} A ${R} ${R} 1 1 1 ${x - R} ${y} Z`;
    }
    return `M ${x - R} ${y} A ${R} ${R} 0 1 1 ${x + R} ${y} A ${R} ${R} 1 1 1 ${x - R} ${y} M ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y} A ${r} ${r} 1 1 1 ${x - r} ${y} Z`;
  };

  part(x, y, R, r, start, end){
    const [s, e] = [(start / 360) * 2 * Math.PI, (end / 360) * 2 * Math.PI];
    const P = [
      this.point(x, y, r, s),
      this.point(x, y, R, s),
      this.point(x, y, R, e),
      this.point(x, y, r, e),
    ];
    const flag = e - s > Math.PI ? '1' : '0';
    return `M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} A ${R} ${R} 0 ${flag} 1 ${P[2][0]} ${P[2][1]} L ${P[3][0]} ${P[3][1]} A ${r} ${r}  0 ${flag} 0 ${P[0][0]} ${P[0][1]} Z`;
  };

  arc(opts = {}){
    const { x = 0, y = 0 } = opts;
    let {
      R = 0, r = 0, start, end,
    } = opts;

    [R, r] = [Math.max(R, r), Math.min(R, r)];
    if (R <= 0) return '';
    if (start !== +start || end !== +end) return this.full(x, y, R, r);
    if (Math.abs(start - end) < 0.000001) return '';
    if (Math.abs(start - end) % 360 < 0.000001) return this.full(x, y, R, r);

    [start, end] = [start % 360, end % 360];

    if (start > end) end += 360;
    return this.part(x, y, R, r, start, end);
  };

}



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

  lookForDataWithParent( trA, dI, idParent ){
    if( idParent == 0 )
      idParent = null;

    for(let i=0,ic=dI.length; i<ic; i++ ){
      //cl("looking ...."+dI[i]['firstParent']);
      if( dI[i]['firstParent'] == idParent ){
        let d = dI[i];
        d['sub'] = this.lookForDataWithParent( [], dI, dI[i]['id'] );
        trA.push( d );

      }
    }
    return trA;
  }

  rebuildDataForImage( dI ){
    cl("Looking at level ... 0");
    tr = this.lookForDataWithParent( [], dI, 0 );
    cl("in level 0 got ... "+tr.length);

    return tr;

  }



  countSubs( dI ){
    let tr = 2;


    return tr;
  }


  buildBlocksImgGant( objT, dI, wFrom, wTo, level ){
    cl("buildBlocksImgGant ...."+level);
    cl(" wFrom, wTo, level");
    cl([wFrom, wTo, level]);
    let cx=wFrom,cy=70,lh=25,ew=wTo-wFrom;

    if( level == 0 ){
      let tCent = objT.text( ".center" );
      tCent.font({ size:10, fill: "#000000" });
      tCent.move( cx,cy+level*lh );
    }

    let iInLev = dI.length;
    for(let t=0,tc=iInLev; t<tc; t++ ){


      let isFractin = ew/iInLev;
      let rect = objT.rect( isFractin-2, lh-2 ).attr({ stroke: '#000', fill: '#ddd' });
      let x = cx + parseInt( isFractin*t );
      let y = cy + lh*level;
      rect.move( x, y );

      let tCent = objT.text( dI[t]['name'].substring(0,6) );
      tCent.font({ size:10, fill: "#000000" });
      tCent.move( x,y );



      if( dI[t]['sub']!= [] ){
        this.buildBlocksImgGant( objT, dI[t]['sub'], x, x+isFractin, level+1 );
      }


    }


  }



  buildLevelImg( objT, dI, hOff, level ){
    //cl("buildLevelImg ... lever: "+level);

    let x = hOff;
    let trC = 0;
    let trCSub = [];
    for(let t=0,tc=dI.length; t<tc; t++ ){
      let textF = objT.text( dI[t]['name'] );
      textF.font({ size:10, fill: "#000000" });
      textF.move( 20+(level*20), x );
      textF.attr('class','myPMTaskSvg');
      textF.attr("id","listTasksId"+dI[t]['id'] );
      //textF.attr('style','cursor:help;');
      //textF.attr('style.pointer','background-color:#f70;');
      //textF.attr('style:hover','background-color:#f00;');
      textF.on('mouseover',function(){
        cl("over task id: "+dI[t]['id']);
      });
      textF.on('click',function(){
        cl("click on task id: "+dI[t]['id']);
        pager.goToByHash('pageByName=project manager&action=edit&id='+dI[t]['id']);
      });
      x+= 10;
      trC+=1;
      if( dI[t]['sub']!= [] ){
        trCSub = this.buildLevelImg( objT, dI[t]['sub'], x, level+1 );
      }
      if( trCSub >0 ){
        //cl("trCSub got :"+trCSub);
        x+= trCSub*10;
        trC+= trCSub;
      }

    }

    return trC;
  }

  buildCircleImgGant( objT, ccx, ccy, dI, wFrom, wTo, level ){
    //cl("buildCircleImgGant ...."+level);
    //cl(" wFrom, wTo, level");
    //cl([wFrom, wTo, level]);

    let lh=16,cx=wFrom,ew=(wTo-wFrom);

    //cl(" cx, lh, ew ");
    //cl([ cx, lh, ew ]);

    if( level == 0 ){
      let tCent = objT.text( ".cc" );
      tCent.font({ size:10, fill: "#000000" });
      tCent.move( ccx,ccy );
    }


    let iInLev = dI.length;
    var ewAtom = ew/iInLev*0.99;
    var ah = new svgArcHelper();
    let gap = 2;
    for(let t=0,tc=iInLev; t<tc; t++ ){
      var aStart = deg360Pos( cx+(t*ewAtom) );
      let aEnd = deg360Pos( aStart+ewAtom );
      let aW = deg360Pos(aEnd-aStart);
      var r = (level)*lh;
        //cl(" aStart, aEnd, r");
        //cl([ aStart, aEnd, r]);
        let pShadow = objT.path(``);
        let p = objT.path(``);
        //cl("chave path ");
        p.attr("id","cirId"+dI[t]['id'] );
        p.attr("fill","#aaa");
        pShadow.attr("fill","#999");
        p.attr("stroke","#333");

        if( dI[t]['sub'] && dI[t]['sub'] != [] && dI[t]['sub'].length>0 ){
          p.attr('class','myPMCirSvg');
        }else{
          p.attr('class','myPMCirLastSvg');
        }

        // making line on mouseover from circle to list
        p.on('mouseover',function(){
          let mid = this.attr("id");
          let arrowType = 1;
          let tId = mid.substring(5);
          let mx=this.cx(),my=this.cy();
          let lO = SVG("#listTasksId"+tId);
          let lx=lO.x()-gap,ly=lO.y()+5;
          if( pager['PMlineToShow']!= undefined ){
            if( arrowType == 2 ){
              pager['PMlineToShow'].remove();
              pager['PMlineToShow2'].remove();
            }
          }
          if(   pager['PMlineToShowLeLi'] != undefined && arrowType == 1 ){
            pager['PMlineToShowLeLi'].remove();
          }

          if( arrowType == 1 ){
            let l = new LeaderLine(
              document.getElementById( mid ),
              document.getElementById( "listTasksId"+tId ),
              {
                outlineColor: '#353',
                outline: true,
                startSocket: 'top',
                //middleLabel: 'MIDDLE',
                startPlug: 'square',
                startPlugSize: 0.5,
                //animOptions:{ duration: 3000, timing: 'linear'},
                //dropShadow: true,
                color: "#ddd"
              });
            setTimeout(()=>{ try{l.hide();}catch(e){cl("e in line hide: "+e);} },1000);
            pager['PMlineToShowLeLi'] = l;
          }

          if( arrowType == 2 ){
            pager['PMlineToShow'] = objT.line({
              x1:mx, y1: my, x2: lx-50, y2: ly,
              "style": "fill:#fff; stroke:#b86640; stroke-width: 2"
            });
            pager['PMlineToShow2'] = objT.line({
              x1:lx-50, y1: ly, x2: lx, y2: ly,
              "style": "fill:#fff; stroke:#b86640; stroke-width: 2"
            });
          }
          /*
          pager['PMlineToShow'] = SVG(`<g stroke="black" stroke-width="3" fill="black">
            <circle id="pointA" cx="`+mx+`" cy="`+my+`" r="3" />
            <circle id="pointB" cx="`+(lx-40)+`" cy="`+(ly+20)+`" r="3" />
            <circle id="pointC" cx="`+lx+`" cy="`+ly+`" r="3" />
          </g>`);
          */
          $("#pImg").append( pager['PMlineToShow'] );
          $("#pImg").append( pager['PMlineToShow2'] );
          //cl("path is: "+mx+" , "+my+"   to    "+lx+" , "+ly);

        });

        let shadowDist = 2;
        let dShadow = ah.arc({
          x: ccx+shadowDist,
          y: ccy+shadowDist,
          R: r+lh-gap,
          r: r,
          start: aStart,
          end: aEnd,
        });
        pShadow.attr('d', dShadow);
        //pShadow.attr('class','');
        let d = ah.arc({
          x: ccx,
          y: ccy,
          R: r+lh-gap,
          r: r,
          start: aStart,
          end: aEnd,
        });
        p.attr( 'idF', "arcOfId"+dI[t]['id']);
        p.attr('d', d);
        p.attr('fill-rule', 'evenodd');
        //o.move(ccx-r, ccy-r);

          /*parseInt(ccx),
          parseInt(ccy),
          toRad(aStart),
          toRad(ewAtom),
          parseFloat(r), 1 );
          */

      if( dI[t]['sub']!= [] ){
        this.buildCircleImgGant( objT, ccx, ccy, dI[t]['sub'], aStart, aEnd, level+1 );
      }

    }
  }


  buildImage( d ){
  //projSVG
    cl("build Image .....");
    cl("data in ...");
    cl(d);

    let dToI = this.rebuildDataForImage( d );
    cl("img data ");
    cl(dToI);

    let iw=900,ih=300;
    let icx=parseInt(iw/2), icy=parseInt(ih/2);


    let tr = `<svg id="pImg" width="`+iw+`" height="`+ih+`" >
      <text x="10" y="20" style="fill:black;">Project manager view:</text>
      <svg>`;

    $('#projSVG').html(tr);
    var bip = SVG("#pImg");
    let hImg = this.buildLevelImg( bip, dToI, 30, 9 );
    cl("build levels image have elements: "+hImg);
    $("#pImg").attr('height',hImg*10+50);


    //this.buildBlocksImgGant( bip, dToI, 70, 500, 0 );
    this.buildCircleImgGant( bip, 100, 120, dToI, 0, 360, 2 );


    /*
    let lastH = 0;
    for(let t=0,tc=dToI.length; t<tc; t++ ){
      let textF = bip.text( dToI[t]['name'] );
      textF.font({ size:10, fill: "#000000" });
      textF.move( 20, 30+(t+lastH)*10 );
      lastH = this.countSubs( dToI[t] );
    }
    */


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

      return `<div id="projSVG"> </div><div id="projLV">Projects list is loading ... </div>`;

    }else if( step == 1 ){
      cl("getting list off task in db ....");

      this.dbQ(
        `SELECT
        pt.id,
        pt.status as status,
        pt.name as name,
        pt.description as description,
        ( SELECT idTaskParent FROM pm_binds WHERE idTask=pt.id limit 1 ) as firstParent,
        pt.entryDate as entryDate,
        ( SELECT count(idTask) FROM pm_binds WHERE idTaskParent=pt.id ) as childrens
        FROM pm_tasks as pt order by status, childrens, entryDate desc;`,
        (d,r)=>{
          if( r == 'success' ){
            cl("make tasks list .....");


            cp.task.buildImage( d );
            //projSVG

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
