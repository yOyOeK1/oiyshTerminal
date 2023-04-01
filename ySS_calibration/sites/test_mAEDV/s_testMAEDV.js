



class s_testMAEDV{


/*

CREATE TABLE test_iTest1 (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `topic` varchar(255) COLLATE utf8_bin NOT NULL,
    `msg` varchar(255) COLLATE utf8_bin NOT NULL,
    `extraVal` varchar(255) COLLATE utf8_bin NOT NULL,
    `entryDate` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=1;

*/


  constructor(){

    this.test = {
      name :"iTest1",
      db : {
        tableName : "test_iTest1",
        promoteColumn : "topic",
        defListSelect : 'topic DESC',
      },

    };

    cl("s_testMAEDV init ...");
    this.app = new mApp();
    this.aedv = new mAedv(
      this.test.name,
      this.test.db.tableName,
      this.test.db.promoteColumn,
      this.test.db.defListSelect
    );
  }

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


  get getName(){
    return "test mAEDV";
  }

  get getDefaultBackgroundColor(){
    return "#ccc";
  }

  get getHtml(){

    let opts = [
      {
        "label" : "check of table in data base",
        "fRes" : this.aedv.dbChk(),
      },
      {
        "label" : "section add",
        "fRes" : this.aedv.getAdd(),
      },{
        "label" : "section edit",
        "fRes" : this.aedv.getEdit(1),
      },{
        "label" : "section delete",
        "fRes" : this.aedv.getDelete(1),
      },{
        "label" : "section view",
        "fRes" : this.aedv.getView(1),
      },{
        "label" : "section all / view",
        "fRes" : this.aedv.getViewAll('*'),
      },{
        "label" : "section all",
        "fRes" : this.aedv.getHTML('*'),
      }
    ];


    let cont = `<b>[${this.test.name}]of mAedv functionality:</b><br>
    db: table[${this.test.db.tableName}] promote[${this.test.db.promoteColumn}] defListing [${this.test.db.defListSelect}] <hr>`;


    opts.forEach((item, i) => {
      cont+= "<b>"+item.label+"</b><br>"+
        "-------------------- start<br>"+
        item.fRes+
        "<br>--------------------- end <br>";
    });



    return this.app.appFrame({
      "title": "mAedv - test1",
      "content":cont
    });

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
