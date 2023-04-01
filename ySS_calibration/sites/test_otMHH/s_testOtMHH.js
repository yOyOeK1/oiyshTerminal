
class s_testOtMHH{

  constructor(){
    cl(`${this.getName} init ....`);

    this.app = new mApp();


    this.datah = {
      title: "test 1 of otMHH",
      content: "unteoh usnotuhosnetuh oesnuthoesnut heonsuth oensutho <b>ensuteho</b> sunthu"
    };
    this.datam = {'lviTamplate':[
      { title: 'title 1', content: 'cont 1' },
      { title: 't2', content: 'cont 2' },
      { title: 'title 3', content: 'cont 33' }
    ]};
    this.dataf = [ { id : "v1", name: "value 1" },
    { id : "v2", name: "value 2" } ];

  }

  get getName(){
    return "test otMHH";
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  get getHtml(){
    let cont = `
<div style="display:none;">

  <div hh="baseTamplate">
    <h3>{title} - baseTamplate</h3>
    <p>{content}</p>
    <button onclick="pager.getCurrentPage().onUpdateTitle()">update title ...</button>
  </div>

  <div hh="lviTamplateBody">
    <div hh="lviTamplate" hhrepthis="" >
      <li><b>{title}</b><br>
      {content}  - lviTamplate</li>
    </div>
  </div>



</div>




<div id="dLandHeader">header</div>
<div id="dLandMain">main</div>
<div id="dLandFooter">
  footer: <div hh="lviTamplateFooter">
  <select id="selfooter"></select>
</div>

    `;

    return this.app.appFrame({
      title : pager.getCurrentPage().getName,
      content: cont
    });

  }

  getHtmlAfterLoad(){
    let cp = pager.getCurrentPage();
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );


    let dh = $('#dLandHeader');
    let th = $('div[hh=baseTamplate]').html();
    let datah = this.datah;
    dh.html( otMHH.injectDataToStr( th, datah  ) );
    pager['h'] = datah;


    let dm = $('#dLandMain');
    let tm = $('div[hh=lviTamplateBody]').html();
    let datam = this.datam;
    dm.html( '<b>List of datam:</b><hr>'+ otMHH.injectDataToStr( tm, datam ));


    let df = $('#dLandFooter');
    otMHH.rebuildSelector(
      'select[id=selfooter]',
      this.dataf,
      "v2"
    );
    /* this will not work. template will break select ...
    otMHH.makeAll(
      '#dLandFooter', 'div[hh=lviTamplateFooter]',
      {'oSFt':[
        { value : "v1", html: "value 1" },
        { value : "v2", html: "value 2" }
      ]}
    );
    */

  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}


  onUpdateTitle(){
    this.datah.title = ""+(new Date());
    this.getHtmlAfterLoad();
  }

  onMessageCallBack( r ){
    cl(
      pager.getCurrentPage().getName+
      " - got msg "
    );


  }

}
