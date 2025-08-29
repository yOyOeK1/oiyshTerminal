class ottTasker{
  constructor(){
    this.tList = {};

  }
  getId(){
    return Math.round(Math.random()*10000);
  }

  /**
   * example of use
   * execute on host command `uptime` getting results
   * ```js
   * ottO.newSh("uptime").then((r)=>{ console.log("sukcesssssss",r); })
   * ```
   */
  newSh( shCmd ){
    //.newTask().then((r)=>{console.log(r);});
    let bCmd = btoa(shCmd);
    //console.log(bCmd);
    let task = this.newTask({
      "q":`exeIt/{"webCmdSubProcess":"b64[${bCmd}]","mqtt":0, "pH":2 }` 
    } );

    return task.then((r)=>{
      console.log('ok so have it as ',r);
      let j = JSON.parse(r);
     
      return new Promise((res,rej)=>{
        setTimeout(()=>{res(j);},10);
      });
    });

  }

  newTask( qj ){
    //console.log('ottTasker new Task',qj);
    let id = this.getId();
    qj["id"] = id;
    let task = {
      "id":id,
      "qj": qj,
      "tStart": Date.now(),
      "timeOut": setTimeout(()=>{
          let err ='Time out otj: '+JSON.stringify(this.tList[id].qj); 
          console.log(`ottTasker task time out `+err);
          this.tList[id].rej( err ); 
          delete this.tList[id];
          },5000
        ),
      };
    task['p'] = new Promise((res,rej)=>{
        task['res'] = res;
        task['rej'] = rej;
        let jts = JSON.stringify(qj);
        //console.log('so ott new task jts: '+jts);
        sOutSend(`otj:${jts}`);
      });
    
    this.tList[id] = task;    
    return task.p;
  }

  onWsMsg(msg){
    //console.log('ottTasker got msg',msg);

    if( msg.otj && msg.id == undefined && this.tList[msg.otj] )
      msg['id'] = msg.otj;

    if( this.tList[msg.id] ){
      let t = this.tList[msg.id];
      if( t['timeOut'] != undefined )
        clearTimeout( t['timeOut'] );
      msg['tTotalms'] = (Date.now()-t.tStart)/1000.00;
      console.log(`ottTasker finish in ${msg['tTotalms']} sec.`);
      t.res(msg.res);
      delete this.tList[msg.id];

    }
  }

}

export { ottTasker }