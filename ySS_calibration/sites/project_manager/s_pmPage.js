
class s_pmPage{

  constructor(){
    cl("Project Manager init ....");
    this.app = new mApp();
    this.task = new pmTasks( this.getName );

    this.mfBinds = new mDbdForm( this.getName, 'pm_binds','entryDate');
    this.mfBinds.setForm(this.setFormForBinds);

    this.mfRes = new mDbdForm( this.getName, 'resources','resource');
    this.mfRes.setForm(this.setFormForResources);

    this.mfTasks = new mDbdForm( this.getName, 'pm_tasks','entryDate');
    this.mfTasksL = new mDbdForm( this.getName, 'pm_tasks','name');





    this.tasksNames = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];


  }

  //this.nForm( isEditing, data, btns, this.pH );
  setFormForResources( isEditing, data, btns, pH ){
    return [
        {
            "type" : "h3",
            "html" : isEditing ? "Editing: "+data['resource']: "Set some stuff ..."
        },
        {
          "type": "div",
          "id": "dExtrInfo"
        },
        {
            "name" : "tResource",
            "id" : "tResource",
            "caption" : "Resource name",
            "type" : "input",
            "value": isEditing ? data['resource'] : ""
        },{
            "name" : "tUnit",
            "id" : "tUnit",
            "caption" : "Unit use",
            "type" : "input",
            "value": isEditing ? data['unit'] : ""
        },
        {
          type : "div",
          "data-role" : "controlgroup",
          "data-mini" : "true",
          "data-type" : "horizontal",
          "id" : "dcgfrl"+pH,
          html : btns
        }
    ];
  }


  //this.nForm( isEditing, data, btns, this.pH );
  setFormForBinds( isEditing, data, btns, pH ){
    return [
        {
            "type" : "h3",
            "html" : isEditing ? "Editing: "+data['name']: "Set some stuff ..."
        },
        {
            "name" : "tIdTaskParent",
            "id" : "tIdTaskParent",
            "caption" : "Parent task",
            "type" : "select",
            "options" : { 0: "- - -"}
        },{
            "name" : "tIdTask",
            "id" : "tIdTask",
            "caption" : "Childe task",
            "type" : "select",
            "options" : { 0: "- - -"}

        },
        {
          type : "div",
          "data-role" : "controlgroup",
          "data-mini" : "true",
          "data-type" : "horizontal",
          "id" : "dcgftfb"+pH,
          html : btns
        }
    ];
  }

  get getName(){
    return "project manager";
  }

  get getDefaultBackgroundColor(){
    return "#cccccc";
  }



  // id parent 8 iths 10
  getHtml(){
    let cp = pager.getCurrentPage();
    let tr = '';

    if( urlArgs['action'] == "binds" ){
      tr = cp.mfBinds.getHtml( "pageByName="+cp.getName+"&action=binds" );



    }else if( urlArgs['action'] == "resources" ){
      cp.mfRes.defListSelect = `SELECT * FROM resources ORDER BY resource;`;
      tr = cp.mfRes.getHtml( "pageByName="+cp.getName+"&action=resources" );


      if( urlArgs[ cp.mfRes.pH ] == "edit" && urlArgs['id'] != ''  ){
        cl("Resource in edit so get some extra data about it ....");
        setTimeout(()=>{

          cl("Quering for statistinc of this resource ....");
          cp.task.dbQ(
            `select
            ( select count(id) from resourceRec where idResource=`+urlArgs['id']+` ) as "Entrens count with it",
            ( select sum(quantity) from resourceRec where idResource=`+urlArgs['id']+` ) as "Current status",
            ( select sum(quantity) as isIn from resourceRec where idResource=`+urlArgs['id']+` and quantity>0 limit 1 ) as "Input",
            ( select sum(quantity) as isOut from resourceRec where idResource=`+urlArgs['id']+` and quantity<0 limit 1 ) as "Output"
            ;`,
            (d,r)=>{
              if( r == 'success'  ){
                let result = d.reduce((acc, obj) => Object.assign(acc, obj), {});

                cl("Got statistics on this task ...");
                $('#dExtrInfo').html( cp.app.makeNiceList( result ) );
                //$("#dExtrInfo").
              }
          });
          cl("Quering for statistinc of this resource ....SEND");

        },800);

      }



    }else if( urlArgs['action'] == 'new' ){
      tr = cp.app.appFrame({
        "title": "PM: new",
        "content": cp.task.getNewForm(),
        "backButton": "pager.goToByHash('pageByName="+cp.getName+"')"
      });


    }else if( urlArgs['action'] == 'edit' && urlArgs['id'] != undefined && urlArgs['id'] != '' ){

      tr = cp.app.appFrame({
        "title": "PM: editing .... id:"+urlArgs['id'],
        "content":
          cp.task.getNewForm('asEdit', urlArgs['id'])+
          cp.task.getHtmlFastDependTask( urlArgs['id'] )+
          `<div id="tChildrens"></div>`
          ,
        "backButton": "pager.goToByHash('pageByName="+cp.getName+"')"
      });

      //tr+=;

      setTimeout(()=>{
        cp.mfTasks['urlPrefix'] = "pageByName="+cp.getName+'&action=new&idTaskParent='+urlArgs['id'];
        let actButs = cp.mfTasks.getActionsButtons();

        cp.mfTasksL.defListSelect = `SELECT * FROM pm_tasks where id in (
          SELECT idTask FROM pm_binds WHERE idTaskParent=`+urlArgs['id']+`
        );`;

        cp.mfTasksL['urlPrefix'] = "pageByName="+cp.getName+'&action=edit';

        $('#tChildrens').html(
          `<h3>Children of this task:</h3>`+
          actButs+cp.mfTasksL.loadTaskList(1)+cp.mfTasksL.getHtmlListLandingDiv()
        );
      },400);
      //pager.getCurrentPage().task.getTaskFromDBPutToForm( urlArgs['id'] );


      setTimeout(()=>{


        cl("Quering for statistinc of this task ....");
        cp.task.dbQ(
          `select
          ( SELECT count(id) FROM pm_binds WHERE idTaskParent=`+urlArgs['id']+` limit 1 ) as "Depend on",
          ( SELECT name FROM pm_tasks WHERE id IN (  SELECT idTaskParent FROM pm_binds WHERE idTask=`+urlArgs['id']+` ) limit 1 ) as "Part of",
          ( SELECT count(idTaskParent) FROM pm_binds WHERE idTask=`+urlArgs['id']+` limit 1 ) as "Part of in total",
          ( SELECT count(idTaskParent) FROM pm_binds WHERE idTask=`+urlArgs['id']+` group by idTaskParent limit 1 ) as " Unique"
          ;`,
          (d,r)=>{
            if( r == 'success'  ){
              let result = d.reduce((acc, obj) => Object.assign(acc, obj), {});

              cl("Got statistics on this task ...");
              $('#dExtrInfo').html( cp.app.makeNiceList( result ) );
              //$("#dExtrInfo").
            }
        });




      },800);




    }else{
      cl("Trace why it's starting .....");
      cl("urlArgs");
      cl(urlArgs);

      let cont = cp.task.getActionsButtons()+cp.task.loadTaskList(0);





      tr = cp.app.appFrame({
        "title": cp.getName,
        "content": cont
      });
    }

    return tr;
  }

  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack( r ){
    cl(
      pager.getCurrentPage().getName+
      " - got msg "
    );
  }

}
