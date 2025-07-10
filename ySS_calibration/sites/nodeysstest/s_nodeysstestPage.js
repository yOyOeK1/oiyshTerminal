
class s_nodeyssTest{

  constructor(){
    cl(`${this.getName} init ....`);
  }

  get getName(){
    return "node yss tests";
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  ajaxIt(action){
    cl(`ajax it ${action}`);
    
    let mUrl = '';
    if( action == 'zeroSites') mUrl = '/zeroSites';
    else if( action == 'stopServer' ) mUrl = '/stopServer';
    
    if( mUrl != '' ){
        cl(`ajax doing url [${mUrl}]`);
        $.ajax({
            url: mUrl,
            method: "GET",
            success: function(res){ cl(`ajax success: ${res}`);}          
        }).done( function( data ){
            cl("ajax done with: "+data);
        });
    }
  }

  getHtml(){
    return '<b>'+pager.getCurrentPage().getName+'</b>'+
        `<input type="button" value="zeroSites" onclick="pager.getCurrentPage().ajaxIt('zeroSites')">`+
        `<input type="button" value="stop server" onclick="pager.getCurrentPage().ajaxIt('stopServer')">`;
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
