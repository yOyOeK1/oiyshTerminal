/*
For sharing in your local network.


$ curl -X POST http://127.0.0.1:8000/upload -F 'files=@basicauth-example.txt' -u hello:world
# works with
$ pip3 install uploadserver
$ python3 -m uploadserver

*/
class s_shareitso{

  constructor(){
    cl("Shareitso init ...");
    this.app = new mApp();
    this.mDoCmd = new mDoCmd();

    this.hDir = '/data/data/com.termux/files/home/.otdm/yss-shareitso';
    this.prefixSite = 'sites/shareitso/';
    this.hostPortOfFiles = 'http://192.168.43.220:8000';
    this.stack = {"Files":{},"Mesgs":{}};
    this.itemsMain = [];

    this.flagBussy = false;
    this.listFilesBuild = 0;

  }

  get getName(){
    return "shareitso";
  }

  getIconFromPath( path ){
    let sp = path.split(".");
    let l = sp.length-1;
    let ext = sp[l];
    //cl("ext "+ext+" for path:"+path);
    let pref= this.prefixSite;
    if( sp.length == 1 )
      return pref+'icon_folder-svgrepo-com.svg';

    switch( ext.toLowerCase() ){
      case "mp3":
        return pref+"icon_music-svgrepo-com.svg";
        break;
      case "jpeg":
        return path;//pref+"icon_file-jpg-svgrepo-com.svg";
        break;
      case "jpg":
        return path;//pref+"icon_file-jpg-svgrepo-com.svg";
        break;
      case "svg":
        return path;//pref+"icon_file-jpg-svgrepo-com.svg";
        break;
      case "png":
        return path;//pref+"icon_png-file-type-svgrepo-com.svg";
        break;
      case "apk":
        return pref+'icon_android-svgrepo-com.svg';
        break;
      case "pdf":
        return pref+"icon_file-pdf-svgrepo-com.svg";
        break;
      default:
        return pref+"icon_file-o-svgrepo-com.svg";
    }

    return undefined;
  }

  getMimeType(path){
    let sp = path.split(".");
    let l = sp.length-1;
    let ext = sp[l];
    //cl("ext "+ext+" for path:"+path);
    if( sp.length == 1 )
      return 'NaN';

    switch( ext){
      case "mp3":
        return `
          <audio controls>
            <source src="`+path+`" type="audio/mpeg">
          Your browser does not support the audio element.
          </audio>`;
        break;

      /*
      case "png":
        return pref+"icon_png-file-type-svgrepo-com.svg";
        break;
      case "pdf":
        return pref+"icon_file-pdf-svgrepo-com.svg";
        break;
        */
      default:
        return "NaN.ext";
    }

    return undefined;
  }

  getNiceSize(bToNice){
    let tr = '';
    let db = 1;

    if( bToNice > 1024000000){
      tr = ' GB';
      db = 1024000000;
    } else if( bToNice > 1024000){
      tr = ' MB';
      db = 1024000;
    } else if( bToNice > 1024){
      tr = ' KB';
      db = 1024;
    }

    tr = parseInt( (bToNice/(db/10)) )/10+tr;


    return tr;
  }

  lvOfShareitso( fList ){
    var items = JSON.parse( JSON.stringify( fList ) );
    //cl("items------ after req");
    //cl(items);

    let stat = items.length;

    let isHt = [];
    for(let i=0; i<stat; i++ ){
      let item = items[i];
      let pathSplit = item['file'].split('/');
      let fName = pathSplit[ pathSplit.length-1 ];
      let urlToFile = item['file'].split( '/data/data/com.termux/files/home/.otdm/yss-shareitso/').join('sites/shareitso/');
      let items4Conten = {"name": fName };
      item["mime"] = this.getMimeType( urlToFile );
      item["icon"] = this.getIconFromPath(  urlToFile );
      //cl(item);
      item['modTime'] = item['modTime'].substring(0,17);
      item['size'] = this.getNiceSize( item['size'] );
      item['file'] = '<a href="'+urlToFile+'" target="_blank">'+item['file']+'</a>';
      items4Conten = this.app.makeNiceList( item );
      let cont = {
        "content": items4Conten
      };
      if( item['icon'] != undefined ){
        cont['img'] = item['icon'];
        delete item['icon'];
      }

      isHt.push(this.app.lvElement(
        fName,
        cont//,
        //'link__'+this.prefixSite+item['reqPath']
      ));

    }

    let ttr = this.app.lvBuild({
      "header": "Shareitsonize files ...",
      "headerTip": '<span class=\"listCountTotal\">'+stat+'</span>',
      "items": isHt
    });


    if( this.listFilesBuild > 0 ){
      for(let a=0,ac=isHt.length-this.listFilesBuild; a<ac; a++){
        isHt[a] = isHt[a].split('<li>').join('<li class="ui-li-static ui-body-inherit ui-li-has-thumb">');
        $(isHt[a]).insertAfter(
          $('#lvOfShareitso').find('ul').find('li')[0]
        );
      }

      $(".listCountTotal").each( function( i, o){
        $(this).html(""+isHt.length);
      });
    }else{
      $("#lvOfShareitso").html( ttr ).enhanceWithin();
    }
    //$("#lvOfShareitso dataType=['search']").focus();
    this.listFilesBuild = isHt.length;
  }

  rebuildListPart(){
    cl("rebuildListPart");
    let e = this.app.lvElement(
      "abc inject",
      "content str"
    );
    $(e).insertAfter(
      $('#lvOfShareitso').find('ul').find('li')[0]
    );

  }

  rebuildListInShareitso(){
    //$("#lvOfShareitso").html("New files are comming ....");
    setTimeout(()=>{
      pager.getCurrentPage().mDoCmd.doShExitCodeChk(
        'jsK="\\n| .+=[{\\"modTime\\":\\"%Ay-%Am-%Ad %AT\\", \\"size\\":\\"%s\\", \\"file\\":\\"%p\\"}]";echo $jsK;a=$(find -L /data/data/com.termux/files/home/.otdm/yss-shareitso -type f -printf "$jsK" | sort -r); echo "[]" | jq ". $a"',
        '',
        ( d, r )=>{
          pager.getCurrentPage().mDoCmd.cmdWork=false;
          cl("GOT OK !");
          //cl(d);

          pager.getCurrentPage().lvOfShareitso(d);

        },
        ( d, r )=>{
          cl("GOT ERROR !");
          pager.getCurrentPage().mDoCmd.cmdWork=false;

        }
      );
    }, 1);
  }

  async getQrCodeFeachAndProcess( msg ){
    $.get( `/qrcode?q=`+msg, function( data, status ){
        $('#dQr').hide();
        $('#dQr').html( data );
        $('#dQr').fadeIn();
    });
  }

  getQr( msg ){
    if( msg.length < 512 ){
        $('#dQr').html("loading ...");
        this.getQrCodeFeachAndProcess(msg);
    }else{
      $('#dQr').html("to long to generate qrCode. "+msg.length);
    }
  }


  getHtml(){
    let cp = pager.getCurrentPage();
    let htmlTr = '<h1>'+cp.getName+'</h1>';


    // upload form
    // Select file to upload:
    // ## TODO -- get ip hos
    // fast sorting list
    // echo $(find -L ./ -type f -printf "\n| . .[]+={\"modTime\":\"%Ay-%Am-%Ad %AT\", \"size\":\"%s\", \"file\":\"%p\"}" | sort -r)
    //a=$(find -L ./ -type f -printf "\n| .+=[{\"modTime\":\"%Ay-%Am-%Ad %AT\", \"size\":\"%s\", \"file\":\"%p\"}]" | sort -r); echo '[]' | jq '. '"$a"
    //a=$(find -L ./ -type f -printf "\n| .+=[{\"modTime\":\"%Ay-%Am-%Ad %AT\", \"size\":\"%s\", \"file\":\"%p\"}]" | sort -r); echo '[]' | jq '. '"$a"
    htmlTr+=`
    <div id="dQr"></div>
    <form
      id="fileForm" name="fileForm"
      action="`+cp.hostPortOfFiles+`/upload"
      method="POST"
      enctype="multipart/form-data" target="upTargetFrame"
      >

      <ul data-role="listview" data-inset="true" class="ui-body-a">

      <!--
      <input name="token" type="text" style="display:none;" />
      -->
      <li class="ui-field-contain">
        <!--<label for="msg">message</label>-->
        <input name="msg" id="msg" type="text"
          placeholder="Past message ..."
          onchange="pager.getCurrentPage().getQr( $(this).val() )"/>
      </li>

      <li class="ui-field-contain">
        <label for="files">or / and file / (s) to ...</label>
        <input type="file" name="files" id="files" multiple
          placeholder="Or past msg to ..."/>
      </li>

      <li data-role="controlgroup" data-type="horizontal" data-mini="true">
        <input type="submit" value="shareitsonize..." name="submit">
        <input type="reset" value="reset" name="reset">
      </li>

      </ul>

    </form>

    <iframe id="upTargetFrame" name="upTargetFrame"
      style="height:10vh;display:none;"
    ></iframe>

    <script>
    document.forms['fileForm'].addEventListener('submit', (event) => {
      $('#upTargetFrame').fadeIn();
      setTimeout(()=>{
        $('#upTargetFrame').fadeOut();

      },2000);
    });
    </script>

    `;
    // upload form


    htmlTr+=`<div id="lvOfShareitso">Loading ... </div>`;


    return cp.app.appFrame({
      "content": htmlTr
    });


  }

  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );

    $("#htmlDyno").enhanceWithin();
    //sisFormSubmitArm( this.hostPortOfFiles );
    setTimeout(()=>{
      pager.getCurrentPage().rebuildListInShareitso();
    },500);



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

    //cl(r);

    if( r.topic == "subP/MyUploadserver/notification" ){
      cl("Got notification from MyUploadserver ... rebuild list of files...");
      pager.getCurrentPage().rebuildListInShareitso();
    }


  }

}
