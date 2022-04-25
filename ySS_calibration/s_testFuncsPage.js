
class s_testFuncsPage{

  get getName(){
    return "test functions";

  }

  getHtml(){
    return `
<div style="display:inline;position:absolute;top:0;width:200;">
  test start: <br>
  <div id="sliTTest" width="200" height="350"></div>
  test end<br>
</div>
    `;
  }

  getHtmlAfterLoad(){
    $( "#sliTTest" ).slider({
  			slide: function( event, ui ) {
  				console.log(ui.value);

          rotateSvg( "objRot", true, ui.value );
          rotateSvg( "objRot2", true, ui.value );

          $("#textDef").text("test"+ui.value);
          $("#textCen").text("test"+ui.value);
          $("#textRig").text("test"+ui.value);



          moveOnPath( "obj2Path", "pathBase", parseFloat(ui.value)/100.0 );
          moveOnPath( "obj2Path2", "pathBase2", parseFloat(ui.value)/100.0 );

          moveOnPath( "cirPathObj", "cirPath", deg360ToNorm(parseFloat(ui.value)) );



          rotateSvg( "guageOne", true, ui.value );
          rotateSvg( "guageTwo", true, -ui.value );



        		},
  				min:-180,
  				max:360,
  				value:10
  			});
  }

  get svgDyno(){
    return s_testFuncs;
  }

  onMessageCallBack( r ){
    console.log("s_blankPage got msg ");
  }



}
