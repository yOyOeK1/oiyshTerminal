
class s_mdf2Page{

  constructor(){
    cl( this.getName+" init .... " );


    /*

    CREATE TABLE `tTestmDF2` (
      `id` int(11) NOT NULL AUTO_INCREMENT,

      `c1Name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `etFormCreate` varchar(255) COLLATE utf8_bin DEFAULT NULL,

      `f0` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f1` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f2` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f3` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f4` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f5` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f6` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f7` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f8` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f9` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f10` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f11` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f12` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f13` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f14` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f15` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f16` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f17` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f18` varchar(255) COLLATE utf8_bin DEFAULT NULL,
      `f19` varchar(255) COLLATE utf8_bin DEFAULT NULL,


      `entryDate` int(11) NOT NULL,
      PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=1;

  */


    let mDef = {
      table: "tTestmDF2",
      aedv:[
        //[new m2View( 'c1Name', "Column 1") ], // no def value, no def preDisplay
        [new m2View( 'etFormCreate', "Form created at", timeStampNow(), timestampToNiceTime ) ],
        [new m2InputText( 'f0', "F0 input text" ) ],
        [new m2TrueFalse( 'f1', "F1 true or false 0 def", [ '1', '0' ], 0) ],
        // need fix of remove [new m2Flipswitch( 'f2', "F2 flipswitch", [ 'yes', 'no' ],1 ) ],
        //[new m2Flipswitch( 'f2', "F2 flipswitch", [ 'yes', 'no' ],1 ) ],
        [new m2Select( 'f3', "Select int",
          [ 'one', 'two', 'three' ],
          1 ) ],
        [new m2Select( 'f4', "Select keys",
          [ {'value':'one','html':'vone'}, {'value':'dbtwo','html':'visiletwo'}, {'value': 'three', 'html':'vthree'} ],
          2 ) ],
        [new m2Hidden( 'f5', 'abc' ) ],
      ]
    };

    this.mdf = new mDF2( mDef );


  }


  get getName(){
    return "test mdf2";
  }

  get getDefaultBackgroundColor(){
    return "#ccc";
  }

  get remEdit(){
    cl("will cliean");
    cl("---- 1");
    cl("---- 2");
    $("#ftEdit select[data-role='flipswitch']").val(0).flipswitch('refresh').flipswitch("destroy");
    //$("#ftEdit input[data-role='flipswitch']").selectmenu( "destroy" );
    cl("---- 3");
    //$("#ftEdit input[data-role='flipswitch']").remove();
    cl("---- 33");
    $("#ftEdit").html('');
    cl("---- 4");
  }

  get getHtml(){

    var mtr = [];
    //[ /*"Add",*/ "Edit", "View", "Delete" ].find((e,i)=>{
    [ "Add", /*"Edit",*/ "View", "Delete" ].find((e,i)=>{
      mtr.push(`
        <a href="#" onclick="$('#ft${e}').show()">${e}</a>
        <script>$('#ft${e}').hide();</script>
        `);
    });



    return mtr.join(" | ")+'<hr><b>'+pager.getCurrentPage().getName+'<b>'+
      `<a href="#" onclick="pager.getCurrentPage().remEdit();">rem edit</a>`+
      `<div id="ftAdd">ftAdd</div>`+

      `<h3>edit form</h3>
      <div id="ftEdit"></div>
      <h4>edit form END</h4>`+

      `<h3>delete form</h3>
      <div id="ftDelete">ftDelete</div>
      <h4>delete form END</h4>`;
  }


  makeAddFormLoop(){
    cl("  makeAddFormLoop ................ ");
    setTimeout( ()=>{
      let cp = pager.getCurrentPage();

      if( 0 ){ // make add
        this.mdf.makeFormAdd( '#ftAdd', (id)=>{
          let cp = pager.getCurrentPage();
          $.toast({
              heading: cp.getName+" Add test",
              text: 'Added id : '+id+' to table ['+cp.mdf.mDef.table+']',
              showHideTransition: 'slide',
              icon: 'success'
          });

          $('#ftAdd').html('<a href="#" onclick="$(\'#f5\').val(2345678)">change f5</a>');
          cp.makeAddFormLoop();

        });

      }

      if( 1 ){ // make edit
        let editId = 8;
        cl(1);
        $('#ftEdit').html('');
        cl(2);
        this.mdf.makeFormEdit( '#ftEdit', editId, (id)=>{
          cl("ok edit done now loop ....");
          let cp2 = pager.getCurrentPage();
          $.toast({
              heading: cp2.getName+" Edit test",
              text: 'saved id : '+editId+' to table ['+cp2.mdf.mDef.table+']',
              showHideTransition: 'slide',
              icon: 'success'
          });

          cp2.makeAddFormLoop();

        });
        cl(3);
      }

    },500);
  }

  getHtmlAfterLoad(){
    let cp = pager.getCurrentPage();
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );

    cp.makeAddFormLoop();

  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){
    cl("automatic test ------------------------");
    //mt1();
    cl("automatic test ------------------------");


  }

  onMessageCallBack( r ){
    cl(
      pager.getCurrentPage().getName+
      " - got msg "
    );
  }

}
