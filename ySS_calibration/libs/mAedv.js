class mAedv{

  constructor( name, tableName, promoteColumn, defListSelect = '' ){
    this.name = name;
    this.tableName = tableName;
    this.mdbdf = new mDbdForm(
       name, tableName, promoteColumn, defListSelect
    );

    cl("mAedv["+name+"] init ... for tabe name: "+tableName);

  }

  dbChk( ){
    cl("check If db table ["+this.tableName+"] is ok ....");
    //this.dbQ('select (1) as isNice,now() as tNow;');
    return this.mdbdf.dbChk();
  }

  getAdd(){
    return this.mdbdf.getNewForm();
  }


  getEdit(id){}
  getDelete(id){}
  getView(id){}
  getViewAll( where = '' ){}
  getHTML( where = ''){}


}
