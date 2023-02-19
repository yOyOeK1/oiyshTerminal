
class s_packitsoPage{

  constructor(){

    this.mDoCmd = new mDoCmd();
    this.editWorker = -1;
    this.packsDirs = [];
    this.packs = [];
    this.loadingPacknow  = -1;
    this.app = new mApp();
  }

  get getName(){
    return "pack it so";

  }

  get getDefaultBackgroundColor(){
		return "#cccccc";
	}


  looperIter(){
      console.log("looperIter @ s_packitsoPage ...");


  }



  loadPackitsoList( cbAtEnd ){
    let hDir = this.instanceOf['fDir'];
    cl("loadPackitsoList from home directory ./p-* .... "+hDir);
    let cp = pager.getCurrentPage();

    cl("cp.mDoCmd");
    cl(cp.mDoCmd);
    cp.mDoCmd.otdmArgs(
      { "dfs": hDir.substring(1) },
      (data,r)=>{
        cl("  got data about ./p-* .....")
        cp.packs = [];
        cp.packsDirs = [];
        for(let i=0,ic=data.length;i<ic;i++){
          //cl("pack dir ");
          //cl(data[i]);
          if( data[i].isFile == false && data[i].name.substring(0,2) == "p-" ){
            cp.packsDirs.push( data[i] );
            cp.packs.push(data[i]);
          }
        }
        cl("  updated packsDirs, packs");
        cl("  now callback .....");
        cbAtEnd();
      }
    );

  }




  /*
  appFrame( content, goTo = '', backButton='' ){
    return
    return ( goTo == '' && backButton == false ? "" : `
<div date-role="header" data-position="inline">

  `+(backButton == true ?`
  <button `+
    //`onclick="history.back()" `+
    `onclick="pager.goToByHash('pageByName=pack it so')" `+
    `class="ui-btn-left ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-arrow-l">
    Back to list.</button>
    `:``)+(
      goTo != '' ? `
  <button
    onclick="pager.goToByHash('`+(goTo)+`')"
    class="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-forward">
    Go TO
  </button> `: ''
      )+`
</div>
`)+`

<div role="main" class="ui-content">
<br><br>
  `+content+`
</div>
    `;
  }
  */



  pageMain(){
    return `
    <div id="packitsoPage">
    <h1>Pack it so</h1>

    `+(
      urlArgs['action'] == '' ?
      `<input id="cmd" type="text"
        value="`+( urlArgs['action'] == 'cmd' ? '/usr/bin/pkexec,--disable-internal-agent,whoami': '')+`"
         />
        <div id="spRes"></div>`:''
    )+`
    `+(
      urlArgs['action'] == 'cmd' ?
      `<button class="ui-btn"
        onclick="pager.getCurrentPage().doCmdUpdate()">
        do cmd</button>`: ''
    )+`

    `+(
      urlArgs['action']=='dpkg' ?
      `<button class="ui-btn"
        onclick="pager.getCurrentPage().doAptUpdate()">
        update repository</button>
      <div id="spRes"></div>`:''
    )+`

    <!--
    <button class="ui-btn"
      onclick="sOutSend('yssPage:rebuild')">
      trigger yssPage rebuild</button>

    <button
      onclick="pager.getCurrentPage().doAppDetails('yssPages',0)"
      >cl</button>
    <button
      onclick="pager.setPage(0)"
      >setPage</button>
    -->


    <button class="ui-btn"
      onclick="pager.goToByHash('pageByName=pack it so&action=startNew')">
      pack it so new one</button>


    `+`// for debuging
    <button onclick="pager.goToByHash('pageByName=pack it so&action=startNew`+
      `&pisName=test1&pisDeps=otdm-tool&pisDesc=Description of project from GET at time:`+
      (new Date().getTime())+`&pisVer=0.1.1&pisAuth=B. Ceglik <yoyoek@wp.pl>')"
      >start new with Data....</button>

    </div>
    `;
  }

  formWorkDelete(){
    cl("delete this.pisNew['edit']"+this.pisNew['edit']+" id:"+this.pisNew['editId']);
    cl("workers now .... "+this.pisNew['works'].length);
    var wfDeletingObj = this.pisNew['works'][ this.pisNew['editId'] ];
    this.pisNew['works'] = this.pisNew['works'].filter(function(item) {
      return item !== wfDeletingObj
    })
    cl("workers after del .... "+this.pisNew['works'].length);
    this.formWorkClear();
    this.workersList();

  }

  formClear(){
    [ "Name", "Deps", "Ver", "Desc", "Auth" ].forEach((item, i) => {
      cl("item:"+item);
      cl("i:"+i)
      $("#pis"+item).val("");
    });
    this.formWorkClear();
    this.pisNew['works'] = [];
    this.workersList();

  }

  // save pisNew to ./packitso/p-name/packitso.json
  formSave(){
    cl("This is the end of form !");
    //this.pisNew['workForm'] = {};
    cl('----------------------------');
    cl(this.pisNew);
    cl('----------------------------');
    let pDir = 'p-'+this.pisNew.packitso.name.split(' ').join('-');
    cl("pDir: ["+pDir+"]");

    cl("checking if free ....")
    this.mDoCmd.otdmArgs(
      { "dfs": pager.getCurrentPage().instanceOf.fDir+'/'+pDir },
      (data,res)=>{
        cl("got pDir test result .....");
        cl(data);
        if( data == 0 ){
          cl("new project save .....");

          cl("  making directory ....")
          this.mDoCmd.otdmArgs({
              "dfs": pager.getCurrentPage().instanceOf.fDir+'/'+pDir,
              "act": "MKDIR"
            },
            (data,res)=>{
              cl("data ->");cl(data);
              cl("  DONE");
              let fName = "./packitso/"+pDir+"/packitso.json";
              cl("  save json to file: "+fName);



              this.mDoCmd.otdmArgs({
                  "dfs": pager.getCurrentPage().instanceOf.fDir+'/'+pDir+'/packitso.json',
                  "act": "POST",
                  "iStr": pager.getCurrentPage().pisNew
                },
                (data,res)=>{
                  cl("data ->");cl(data);
                  cl("  DONE Saved !");
                }
              );


            }
          );

        }else{
          cl("existing project ask if overrite!");
          let text = "There is a file. Overwrite it ?";
          if( confirm(text) == true ){
            cl("ok overwrite it !");

          }else
            cl("do nothing...");
        }

      }
    );


  }


  cbOnCmdLsWorkDONE( data, res ){
    cl(".cbOnCmdLsWorkDONE god ");
    cl("data");
    cl(data);
    cl("res");
    cl(res);

    $("#wfWork").html('<option value="-1" selected>---</option>');
    $("#wfIdent").html('<option value="-1" selected>---</option>');
    data.forEach((item, i) => {
      cl(item);
      $("#wfWork").append(
        `<option
          workSrcName="`+item.name+`"
          value="`+item.keyWord+`">`+
          item.name+'/'+item.keyWord+
          `</option>`
      );
    });

    $("#wfStat").html("DONE").fadeOut();
  }

  cbOnCmdLsAllDONE( data, res ){
    cl(".cbOnCmdLsAllDONE god ");
    cl("data");
    cl(data);
    cl("res");
    cl(res);
    $("#wfIdent").html('<option value="-1" selected>---</option>');
    data.forEach((item, i) => {
      cl(item);
      let uid = -1;
      if( item.uid != undefined )
        uid = "uid:"+item.uid;
      if( uid == -1 && item.id != undefined )
        uid = "id:"+item.id;

      let name = -1;
      if( item.name != undefined )
        name = item.name;
      if( name == -1 && item.label )
        name = item.label;
      if( name == -1 && item.text )
        name = item.text;
      if( name == -1 && item.title )
        name = item.title;


      $("#wfIdent").append(
        `<option value="`+uid+`"
          identName="`+name+`"
          >`+name+` (`+uid+`)</option>`
      );

      if( pager.getCurrentPage().pisNew['edit'] == true ){
        cl("yyyyy select !!!");
        cl("edit worker");
        cl(pager.getCurrentPage().editWorker);
        $("#wfIdent").val( pager.getCurrentPage().editWorker['ident'] );
        $("#wfIdent").selectmenu('refresh');
      }

      $("#wfStat").html("DONE").fadeOut();
    });
  }

  cbOnChangeWfWorkSELECTED(){
    let work = $("#wfWork").val();
    cl("cbOnChangeWfWorkSELECTED() ... "+work);

    $("#wfStat").html("loading ... [ * ]").show();
    var cmdBul = {
      "packitso": "ls",
      "work": work,
      "ident": "*"
    };
    if( $("#wfExtArgs").val() != '' ){
      cl("cmdBul");
      cl(cmdBul);
      let a = $("#wfExtArgs").val().split(' ');
      var lastK = "";
      a.forEach((item, i) => {
        if(item.substring(0,1) == "-" ){
          lastK = item.substring(1);
          cmdBul[ lastK ]="";
        }else{
          cmdBul[ lastK ] = item;
        }
      });
      cl("cmdBul -- after adding Extra Arguments");
      cl(cmdBul);

      cl("-----------------------");
    }

    this.mDoCmd.otdmArgs(
      cmdBul,
      this.cbOnCmdLsAllDONE
    );

  }

  formWorkAdd(){
    cl("Add ! - work");
    cl("new is now ");
    cl(this.pisNew);
    if( this.pisNew['works'] == undefined )
      this.pisNew['works'] = [];

    if( this.pisNew['workForm'] == undefined || Object.keys(this.pisNew['workForm']).length < 2 ){
      cl('no action no form edition ...');
      cl('nothing to add.');

    }else{
      let tadd = {
        'entryDate':new Date().getTime()
      };
      let keys = Object.keys( this.pisNew['workForm'] );
      for( let k=0,kc=keys.length;k<kc;k++){
        tadd[keys[k]] = this.pisNew['workForm'][ keys[k] ];
      }
      this.formWorkClear();


      this.pisNew['works'].push( tadd );
      cl("-----------------after adding work");
      cl(this.pisNew);
    }

    this.workersList();
  }


  workEDIT( workId ){
    let we = this.pisNew['works'][ workId ];
    this.editWorker = we;

    this.pisNew['edit'] = true;
    this.pisNew['editId'] = workId;

    //$("#wfBtClear").hide();
    $("#wfBtDelete").show();

    cl("workEDIT: "+workId);
    cl(we);
    $("#wfExtArgs").val(we['extArgs']);
    $("#wfOut").val(we['oFile']);
    $("#wfWork").val(we['keyWord']);
    $("#wfWork").selectmenu('refresh');
    this.cbOnChangeWfWorkSELECTED();
    cl("is async...?");


  }


  formWorkClear(){
    $("#wfExtArgs").val('');
    $("#wfOut").val('');
    $("#wfWork").val('-1');
    $("#wfWork").selectmenu('refresh');
    $("#wfIdent").html('');
    $("#wfIdent").selectmenu('refresh');
    this.pisNew['workForm'] = {};
    this.pisNew['edit'] = false;
    this.pisNew['editId'] = -1;
    $("#wfBtDelete").hide();
  }

  workForm(){


    this.mDoCmd.otdmArgs(
      { "packitso": "lsWork" },
      this.cbOnCmdLsWorkDONE
    );

    return `
<form class="pisForm" name="workForm">

  <label for="wfExtArgs">Extra arguments</label>
  <input type="text" name="wfExtArgs" id="wfExtArgs"
    placeholder="for otdmTools.py"
    class="toSave" pName="extArgs"
    value="`+(urlArgs['wfExtArgs']!=undefined ? urlArgs['wfExtArgs']: '')+`">

  <fieldset data-role="controlgroup" data-type="horizontal"
    data-mini="true">
    <legend>Set up driver  <div style="display:inline;" id="wfStat">lsWork doCmd ... status</div></legend>


    <label for="wfWork">Work in</label>
    <select name="wfWork" id="wfWork"
      onchange="pager.getCurrentPage().cbOnChangeWfWorkSELECTED()"
      class="toSave" pName="keyWord">
      <option value="-1">- - -</option>
    </select>

    <label for="wfIdent">Identification</label>
    <select name="wfIdent" id="wfIdent"
      class="toSave" pName="ident">
      <option value="-1">- - -</option>
    </select>


  </fieldset>
  <label for="wfOut">Output name</label>
  <input type="text"
    name="wfOut" id="wfOut"
    placeholder="file name of out"
    class="toSave" pName="oFile"
    value="">

</form>

<div class="ui-grid-b center">
  <a class="ui-shadow ui-btn ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-inline"
    onclick="pager.getCurrentPage().formWorkAdd()"
    id="wfBtAdd"
    >Add</a>
  <a class="ui-shadow ui-btn ui-corner-all ui-icon-recycle ui-btn-icon-notext ui-btn-inline"
    onclick="pager.getCurrentPage().formWorkClear()"
    id="wfBtClear"
    >Clear</a>
  <a class="ui-shadow ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline"
    onclick="pager.getCurrentPage().formWorkDelete()"
    id="wfBtDelete"
    >Delete</a>


</div>



    `;
  }

  cbOnlsHomeDirDONE( data, res ){
      cl(".cbOnlsHomeDirDONE god ");
      /*
      cl("data");
      cl(data);
      cl("res");
      cl(res);
      */
      pager.getCurrentPage().packs = [];
      pager.getCurrentPage().packsDirs = [];
      for(let i=0,ic=data.length;i<ic;i++){
        //cl("pack dir ");
        //cl(data[i]);
        if( data[i].isFile == false && data[i].name.substring(0,2) == "p-" ){
          pager.getCurrentPage().packsDirs.push( data[i] );
          pager.getCurrentPage().packs.push(data[i]);
        }
      }
      $("#plDiv").html("DONE")
      pager.getCurrentPage().packsListRebuild();

  }


  workEditStart( workNo ){
    cl("work edit start for: "+workNo);
  }


  packsInsertItem( e ){
    //cl("got data --");
    //cl(e);
    if( e == 0  )
      return 0;
    let w = this.loadingPacknow;
    let bUrl = this.packs[w]['fullPath']+`/packitso.json`;
    let urlToPackJ = decodeURI(
      '#pageByName=pack it so&action=editWork&i='+bUrl
    );
    //cl("url to pack: "+urlToPackJ);
    let content = {
      "content" : {
          "version": e['packitso']['ver'],
          "works defined": e['works'].length,
          "full path":  this.packs[w]['fullPath']
      },
      "tip": {"No#":w},
    };
    this.packs[w]['li.tmp'] = this.app.lvElement(
      e['packitso']['name'],
      content,
      `pager.goToByHash('pageByName=pack it so&action=editWork&i=`+w+`')`
    );

    var eles = [];
    for(let pId=0,pc=this.packs.length;pId<pc;pId++){
      if( this.packs[pId]['li.tmp'] != undefined )
        eles.push( this.packs[pId]['li.tmp'] );
    }
    let newList = this.app.buildListView( {
        "header": "Pack it so'us:" +(eles.length == this.packs.length ? "" : " loading ... "),
        "headerTip": eles.length == this.packs.length ? eles.length : eles.length+'/'+this.packs.length,
        'items':eles
      });


    $("#plDiv").html(newList);
    $("#plDiv").enhanceWithin();


    if( this.loadingPacknow!=-1 && this.loadingPacknow < this.packs.length-1 ){
      this.loadingPacknow++;
      this.packLoadDataFormFile(
        this.packs[ this.loadingPacknow ]['fullPath']+'/packitso.json'
      );
    }else{
      this.loadingPacknow = -1;
    }


  }


  packLoadDataFormFile( file ){

    this.mDoCmd.otdmArgs(
      { "dfs": file },
      (data,res)=>{
        let upDatePackId = parseInt(this.loadingPacknow);
        pager.getCurrentPage().packs[upDatePackId]['packitso.json'] = data;
        //callBack();
        pager.getCurrentPage().packsInsertItem( data );
      }
    );
  }


  packsStartLoaingDataForThem(){
    if( this.loadingPacknow == -1 ){
      this.loadingPacknow = 0;
      cl("ok can start loading data for packers....");
      $("#pacListUl").children().each(function(i, obj) {
        if( i > 0 )
          this.parent().remove( this );
      });
      if( this.packs[ 0 ]['fullPath'] != undefined ){
        this.packLoadDataFormFile(
          this.packs[ 0 ]['fullPath']+'/packitso.json'
        );
      }else{
        cl("Oiysh! - there is no packs!")
      }
    }else{
      cl("loading data for packers.... is running");
    }


  }

  packsListRebuild(){
    let wc = this.packsDirs.length;
    let trl = `loading .... `;


    if( this.packs.length > 0 )
      this.packsStartLoaingDataForThem();

    $("#plDiv").html( trl ).show().enhanceWithin();
  }


  packEDIT_4del( packsId ){
    cl("packEdit: "+packsId);

    //pager.goToByHash('pageByName=pack it so&action=editWork&i=');
    let tr = ``;
    let cp = pager.getCurrentPage();
    this.pisNew = cp.packs[packsId]['packitso.json'];
    $("#htmlDyno").html( tr );
    tr = cp.appFrame(
      cp.pageStartNewOrEdit( 'edit', cp.packs[packsId]['packitso.json'] )
    );
    $("#htmlDyno").html( tr ). enhanceWithin();
  }

  packsList(){
    let hDir = this.instanceOf['fDir'];
    this.mDoCmd.otdmArgs(
      { "dfs": hDir.substring(1) },
      this.cbOnlsHomeDirDONE
    );

    let trpl=`<div id="plDiv">loading ... packs list</div>`;
    return trpl;
  }


  workersList(){
    let wc = 0;
    if( this.pisNew == undefined || this.pisNew['works'] == undefined )
      wc=0
    else
      wc = this.pisNew['works'].length;

    if( wc > 0 ){

      let toTr = [];
      for(let w=wc-1; w>-1; w--){
        let e = this.pisNew['works'][w];
        //cl(" - item: "+e['name']);
        toTr.push(
          this.app.lvElement(
            e['srcName']+` / `+e['keyWord']+` / `+e['name'],
            {
              "content": {
                "ident": e['ident'],
                "extra args": e['extArgs'],
                "out put file": e['oFile']
              },
              "tip": { "No#": w }
            },
            `pager.getCurrentPage().workEDIT(`+w+`)`
          )
        );

      }


      var trw = this.app.lvBuild({
          "header": ( new Date() ),
          "headerTip": wc,
          "items": toTr,
          "searchOn": false
      });



    }else{
      var trw = 'No element....';
    }

    $("#wsListDiv").html( trw );
    $("#wsListDiv").parent().enhanceWithin();

    return `<div id="wsListDiv">- - - starting - - - ?</div>`;
  }

  pageStartNewOrEdit( operation='new', editD={} ){

    cl("Packi it so -- "+( operation == 'new' ? 'NEW ONE' : operation )+" editD!!! ------------------");
    cl(editD);
    this.pisNew = {
      'edit': false,
      'editId':-1,
      'works':[],
      'entryDate': new Date().getTime()
    };

    if( operation == 'edit' )
      this.pisNew = editD;

    return `<div class="ui-corner-all ui-body-a">`+
        this.pagePackForm(
          (operation == 'new' ? 'new one' : operation)
        )+
      `</div>`+
      `<div class="ui-body ui-corner-all ui-body-a">`+
        this.workForm()+
      `</div>`+
      //`<hr>`+
        this.workersList()+
      `<div data-role="controlgroup" data-type="horizontal" data-mini="true">
        <button
          class="ui-btn ui-corner-all ui-btn-icon-left ui-icon-delete"
          onclick="pager.getCurrentPage().formClear()"
          >Clear</button>
        <button
          onclick="pager.getCurrentPage().formSave()"
          >Save</button>
      </div>
      <br><br><br>
      `;
  }


  pagePackForm( title ){
    return `<h1>Pack it so - `+title+`</h1>
<form class="pisForm" name="packitso">

  <ul data-role="listview" data-inset="true">

    <li class="ui-field-contain">
      <label for="pisName">Name of pack:</label>
      <input type="text" name="pisName" id="pisName"
        placeholder="project name in dpkg env."
        class="toSave" pName="name"
        value="`+(urlArgs['pisName']!=undefined ? urlArgs['pisName']: '')+`">
    </li>

    <li class="ui-field-contain">
      <label for="pisVer">Version:</label>
      <input type="text" name="pisVer" id="pisVer"
        placeholder="0.0.1"
        class="toSave" pName="ver"
        value="`+(urlArgs['pisVer']!=undefined ? urlArgs['pisVer']: '')+`">
    </li>

    <li class="ui-field-contain">
      <label for="pisDeps">Dependencies:</label>
      <input type="text" name="pisDeps" id="pisDeps"
        placeholder="otdm-tools, ..."
        class="toSave" pName="otdm.deps"
        value="`+(urlArgs['pisDeps']!=undefined ? urlArgs['pisDeps']: '')+`">
    </li>

    <li class="ui-field-contain">
      <label for="pisDesc">Description:</label>
      <textarea name="pisDesc" id="pisDesc"
        placeholder="write so info about your pack..."
        class="toSave" pName="desc"
        value="">`+(urlArgs['pisDesc']!=undefined ? urlArgs['pisDesc']: '')+`</textarea>
    </li>

    <li class="ui-field-contain">
      <label for="pisAuth">Author:</label>
      <input type="text" name="pisAuth" id="pisAuth"
        placeholder="Name LastName <email@adres.com>"
        class="toSave" pName="author"
        value="`+(urlArgs['pisAuth']!=undefined ? urlArgs['pisAuth']: '')+`">
    </li>

  </ul>

</form>`;

  }



  getHtml(){
    var tr = '';
    let cp = pager.getCurrentPage();

    if( urlArgs['action'] == 'startNew' ){
      cl("startNew");
      cl(tr);
      /*
      this.app.appFrame({
        "goTo": goTo == '' ? undefined : goTo,
        "backButton": backButton == '' ? 'pageByName=pack it so' : undefined,
        "content": content
      });*/
      tr = cp.app.appFrame({
        "backButton": "pageByName="+cp.getName,
        "content": cp.pageStartNewOrEdit()
      });

    }else if( urlArgs['action'] == 'editWork' ){
      cl("editWorks");
      cl(tr);
      cl(this);

      if( urlArgs['i'] != undefined && urlArgs['i']!=''){
        cl("ok load some pack it so .json");

        tr = `<br>loading ... pack it so list ...`;
        cp.loadPackitsoList(()=>{
          $("#htmlDyno").append('<br>DONE');

          let packitNameDirectory = cp.packs[ urlArgs['i'] ]['fullPath'].split('/');
          packitNameDirectory = packitNameDirectory[ packitNameDirectory.length-1 ];
          cl("send as get .... "+packitNameDirectory);
          pager.goToByHash(`pageByName=pack it so&action=editWork&n=`+packitNameDirectory);

        });

      }else if( urlArgs['n'] != undefined && urlArgs['n']!=''){
        cl("ok load from pack it so name :) .....");
        let file = cp.instanceOf['fDir']+'/'+urlArgs['n']+'/packitso.json';

        //cp.packEDIT( urlArgs['i'] )

        $("#htmlDyno").append('<br>loading pack it so by id .... <br>'+file+'<br>....');
        cp.mDoCmd.otdmArgs(
          { "dfs": file },
          (data,res)=>{
            $("#htmlDyno").append('<br>DONE');
            cp.pisNew = data;
            let trf = cp.app.appFrame({
              "backButton": "pageByName="+cp.getName,
              "content": cp.pageStartNewOrEdit( 'edit', data )
            });
            $("#htmlDyno").html( trf ). enhanceWithin();

            cl("set data to form fields .....");
            cl(cp.pisNew);
            $("#pisName").val(cp.pisNew.packitso.name);
            $("#pisVer").val(cp.pisNew.packitso.ver);
            $("#pisDeps").val(cp.pisNew.packitso["otdm.deps"]);
            $("#pisDesc").val(cp.pisNew.packitso.desc);
            $("#pisAuth").val(cp.pisNew.packitso.author);

            cl("rebuilding workers list ....");
            cp.workersList();

            cl("making responsive save ....");
            cp.getHtmlAfterLoad();

          });





      }else
        tr = 'need i= or n=';

    }else if( urlArgs['action'] == 'config' ){
      tr = this.app.appFrame({"content": 'Loading .... config'});



    }else{
      cp.loadPackitsoList(()=>{cl("no args pack it so list ... DONE");});

      tr = cp.app.appFrame({
        "content": cp.pageMain()+"<br>"+cp.packsList()
      });
    }


    return tr;
  }

  getHtmlAfterLoad(){
    cl("Pack it so - After load HTML");
    $(".pisForm").each(function(i, obj) {
      //test
      cl(i+": - Form in - Pack it so now on page. name:["+obj["name"]+"] children:"+obj.children.length);
      $(obj).change(function(){
        let pisNew = pager.getCurrentPage().pisNew;
        cl("so now pack it so - new is ----------");
        cl( pisNew );

        cl("form change ! ["+this.name+"]....");
        var changeInFormName = this.name;
        $(obj).find(".toSave").each(function(){
          let pName = $(this).attr('pName');
          cl("obj .toSave ... id: "+this.id+" pName: "+pName);
          if( pisNew[changeInFormName] == undefined )
            pisNew[changeInFormName] = {};
          if( pisNew[changeInFormName][pName] == undefined )
            pisNew[changeInFormName][pName] = "";
          pisNew[changeInFormName][pName] = $(this).val();
          if( pisNew['edit'] == true ){
            pisNew['works'][ pisNew['editId'] ][pName] = $(this).val();

          }

          if( pName == "ident" ){
            cl("html of all ---------------------");

            //cl("workSrcName");
            //cl("gedding .attr('workSrcName') from selected works wfWork")

            //cl( $(this).html() );
            let cs = $(this).children();
            let selNow = $(this).val();
            for(let c=0,cc=cs.length;c<cc;c++ ){
              if( $(cs[c]).attr('value') == $(this).val() ){
                let identSplit = $(this).val().split(':');
                pisNew[changeInFormName]['srcName'] = $('#wfWork').find(":selected").attr('workSrcName');
                pisNew[changeInFormName]['identKey'] = identSplit[0];
                pisNew[changeInFormName]['identUid'] = identSplit[1];
                pisNew[changeInFormName]['name'] = $(cs[c]).attr('identname');

                if( pisNew['edit'] == true ){
                  //pisNew['works'][ pisNew['editId'] ]
                  pisNew['works'][ pisNew['editId'] ]['srcName'] = $('#wfWork').find(":selected").attr('workSrcName');
                  pisNew['works'][ pisNew['editId'] ]['identKey'] = identSplit[0];
                  pisNew['works'][ pisNew['editId'] ]['identUid'] = identSplit[1];
                  pisNew['works'][ pisNew['editId'] ]['name'] = $(cs[c]).attr('identname');

                }

                break;
              }
            }
          }

        });


        cl("so now pack it so - new is ----------");
        cl( pisNew );
        pager.getCurrentPage().workersList();

      });
    });

    setTimeout(()=>{
      this.workersList();
      $("#wfBtDelete").hide();
    },200);
  }

  get svgDyno(){
    //return s_testFuncs;
  }




  svgDynoAfterLoad(){

  }



  onMessageCallBack( r ){
    console.log("s_packitsoPage got msg ");
    cl(r);
    if( r.topic == 'e01Mux/adc0' ){
      //putText("houBatVol", (""+(r.payload*(0.02771809)) ).substring(0,5) );


    }else if( r.topic == 'thisDevice/bat/perc' ){
      //putText("batPercent", r.payload+"%");
    }
  }


}
