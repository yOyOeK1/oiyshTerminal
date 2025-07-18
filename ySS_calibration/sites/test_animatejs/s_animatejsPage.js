
class s_animatejsPage{

  constructor(){
    cl(`${this.getName} init ....`);
  }

  get getName(){
    return "test animatejs";
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml(){
  
    setTimeout(()=>{
        
        pager['my1'] = {
            number: 1
        };
        
        ajs( [pager['my1'], "#anijsDiv2"], {
            frameRate: 10,
            duration: 1000,
            number: 50,
            x:50,
            ease: aajs.createSpring({ stiffness: 90 }),
            modifier: aujs.round(1),
            onRender: function(){
                //console.log("gooo");
                $("#anijsDiv").html( String(pager['my1'].number) );
                
            }
        });
        
    },100);
  
    return '<b>'+pager.getCurrentPage().getName+'</b>'+`
    <div id="anijsDiv">abc</div>
    <div id="anijsDiv2" style="position:absolute;">abc</div>
    `;
  }

  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      ` - getHtmlAfterLoad()`
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
