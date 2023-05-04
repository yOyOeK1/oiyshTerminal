
class s_otplcPage{

  constructor(){
    cl(`${this.getName} init ....`);

    this.app = new mApp();

    this.pOpts = [
      "topics",
      "ot-plcs"
    ];

    /*this.dVbattery = new otDevView(
      'dVbattery oiysh Battery',
      'and/ext0Out/oiysh/bat/house',
      "devNow",
      (r)=>{ let j = JSON.parse(r.payload); return j['volts'].toFixed(2);  }
    );
    */



  }

  get getName(){
    return "otplc";
  }

  get getDefaultBackgroundColor(){
    return "#ccc";
  }

  getPageSelect(){
    setTimeout(()=>{
      $("#mSelGoTo select").selectmenu({ icon: "bars" });
      $("#mSelGoTo").attr('class', 'ui-btn-right ui-btn-inline ui-mini ui-icon-forward' );

      $("#select-otdmPages").on(
        'change', (e)=>{
          cl('changed!');
          cl(e);
          cl(this);
          cl($("#select-otdmPages option:selected").val() );

          pager.goToByHash(
            `pageByName=${this.getName}&action=`+
            $("#select-otdmPages option:selected").val()
          );

        }
      );


    },100);

    let tr = `<select name="select-otdmPages" id="select-otdmPages" data-mini="true">`+
      `<option value=""`+
        (urlArgs['action']==undefined ? 'selected': '')+
        ` >main</option>`;

    for( let o=0,oc=this.pOpts.length; o<oc; o++ ){
      tr+= `<option value="${this.pOpts[o]}"`+
        (urlArgs['action']==this.pOpts[o] ? 'selected': '')+
        ` >${this.pOpts[o]}</option>`;
    }
    tr+= `</select>`;
    return tr;
  }


  get getHtml(){
    let tr = '';
    let cont = '';
    let goTo = this.getPageSelect();




    if( urlArgs['action'] == "ot-plcs" ){
      cont+= 'ot plcs ';

    }else if( urlArgs['action'] == "topics" ){
      cont+= otPTopicsHtml();

    }else{
      //cont+= this.dVbattery.getDiv()+"<hr>";
      cont+= otPMainHtml();
    }


    tr+= this.app.appFrame({
      title: pager.getCurrentPage().getName,
      content: cont,
      goTo:'raw:<div id="mSelGoTo">'+goTo+'</div>'
    });

    return tr;
  }

  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );

    if( urlArgs['action'] == "ot-plcs" ){

    }else if( urlArgs['action'] == "topics" ){
      otPTopicsHtmlAfterLoad();
    }else{
      cl("otplc.getAll()..................");cl(otplc.getAll());
    }


  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack( r ){
    cl(`got msg at topic ${r.topic} !`);


    //pager.getCurrentPage().dVbattery.onWSMsg( r );


    if( urlArgs['action'] == "ot-plcs" ){

    }else if( urlArgs['action'] == "topics" ){
      otPTopicWS( r );
    }else{
      //otPonWS( r );
    }


  }

}
