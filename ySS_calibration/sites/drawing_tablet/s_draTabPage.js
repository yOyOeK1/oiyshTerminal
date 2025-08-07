
class s_draTabPage{

  constructor(){
    cl(`${this.getName} init ....`);
  }

  get getName(){
    return "Drawing tablet";
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml(){
    return `<div 
      id="myDrawingTabletArea"
      style="
        background-color: white;
        min-height:100vh;
      ">
      </div>`;
      /*<div>Drawing Tablet</div>
      <div id="draTabDeb">draTabDeb ..</div>
      <div id="dtt0" style="background-color:red;width:5px;height:5px"></div>
      */
  }

  dataBuitifier=( data )=>{
    //return JSON.stringify( data );
    
    let tr = data;
    Object.keys(tr).forEach(k => {

      
      let tNo = tr[k];
      
      if( this.viewportsize.x > 360 ){
       
        tNo.x = Math.round( tNo.x*this.sSize.x );
        tNo.y = Math.round( tNo.y*this.sSize.y );
        tNo['ws'] = this.viewportsize;

      }else{
        tNo.x = Math.round( tNo.x );
        tNo.y = Math.round( tNo.y );
        tNo['ws'] = {};
      }
        
      /*
      if( k == '0' ){
        $('#dtt0').css({
          'position':'absolute',
          'left': tNo.x+'px',
          'top': tNo.y+100+'px',
          'width': parseInt(tNo.force*50.0)+'px',
          'height': parseInt(tNo.force*50.0)+'px',
         });

      }
      */
      
    });
    return JSON.stringify( tr );
    
  }

  onWindowResize=(w,h)=>{
    this.viewportsize = {'x':w,'y':h};
    this.sSize = {
      'x': 360.00/w,
      'y': 280.00/h
    };
  }

  getHtmlAfterLoad=()=>{
    this.onWindowResize(window.innerWidth,window.innerHeight);
    
    var touchInf = {};
    document.getElementById('myDrawingTabletArea').addEventListener("touchstart",function(e){
      for(var c = 0; c < e.changedTouches.length; c++){
        touchInf[e.changedTouches[c].identifier] = {"e":"s","x":e.changedTouches[c].clientX,"y":e.changedTouches[c].clientY,"force":e.changedTouches[c].force};
        //document.getElementById("draTabDeb").innerHTML = JSON.stringify(touchInf);
        //sOutSend('draTab: [star] '+siteByKey.s_draTabPage.o.dataBuitifier(touchInf));
        sOutSend(`wsSendToWSID:draPenEmuPyth:${siteByKey.s_draTabPage.o.dataBuitifier(touchInf)}`);
      }
    },false);
    document.getElementById('myDrawingTabletArea').addEventListener("touchend",function(e){
      for(var c = 0; c < e.changedTouches.length; c++){
        //document.getElementById("draTabDeb").innerHTML = JSON.stringify(touchInf);
        touchInf[e.changedTouches[c].identifier]["e"] = "e";
        //sOutSend('draTab: [end ] '+siteByKey.s_draTabPage.o.dataBuitifier(touchInf));
        sOutSend(`wsSendToWSID:draPenEmuPyth:${siteByKey.s_draTabPage.o.dataBuitifier(touchInf)}`);
        delete touchInf[e.changedTouches[c].identifier];
      }
    },false);
    document.getElementById('myDrawingTabletArea').addEventListener("touchmove",function(e){
      for(var c = 0; c < e.changedTouches.length; c++){
        touchInf[e.changedTouches[c].identifier] = {"e":"m","x":e.changedTouches[c].clientX,"y":e.changedTouches[c].clientY,"force":e.changedTouches[c].force};
        //document.getElementById("draTabDeb").innerHTML = JSON.stringify(touchInf);
        //sOutSend('draTab: [move] '+siteByKey.s_draTabPage.o.dataBuitifier(touchInf));
        sOutSend(`wsSendToWSID:draPenEmuPyth:${siteByKey.s_draTabPage.o.dataBuitifier(touchInf)}`);
      }
    },false);
    document.getElementById('myDrawingTabletArea').addEventListener("touchcancel",function(e){
      for(var c = 0; c < e.changedTouches.length; c++){
        delete touchInf[e.changedTouches[c].identifier];
        //document.getElementById("draTabDeb").innerHTML = JSON.stringify(touchInf);
        //sOutSend('draTab: [canc] '+siteByKey.s_draTabPage.o.dataBuitifier(touchInf));
        sOutSend(`wsSendToWSID:draPenEmuPyth:${siteByKey.s_draTabPage.o.dataBuitifier(touchInf)}`);
      }
    },false);
    


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
