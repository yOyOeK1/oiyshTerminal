console.log("motTools wild");


//const mott = -1;
class motTools{


  constructor(){
    let mott = -1;
    console.log("mott: motTools init .... have target? ", mott);

    this._ip = '192.168.43.220';
    this._port = 1990;
    this.url = this.getUrl();
    this._status = false;
    this._pts = 0;

    setTimeout(()=>{
      this.chkHost();
    },1000);
  }

  getUrl(){
    return 'http://'+this._ip+':'+this._port;
  }

  getStatus(){
    this.chkHost();
    return this._status;
  }

  sapiJ( sapiStr, callBack ){
    this.sapi( sapiStr, (d,s)=>{
      if( s == "success" )
        callBack(JSON.parse(d));
      else
        callBack(-1);
    });
  }

  sapi( sapiStr, callBack ){
    this._pts = new Date().getTime();
    var tws = this._pts;
    $.ajax({
      url:this.url+"/"+ sapiStr,
      type: "GET",
      success: function(d){
        let tn = new Date().getTime();
        cl("mott: got it in ... ("+ (( tn-tws))+" ms.)" );
        //cl("data");cl(d);
        callBack(d,'success');
      },
      error:function(){ cl("mott: Error in 2345678");
        callBack(-1, 'notOk')},

    });
  }

  chkHost(){
    this.sapi( "ping", (d, s ) => {
      cl("mott: got pong?-------------");//cl("mott: status ");cl(s);cl("mott: data ");cl(d);
      if( s == "success" ){
        this._status = true;
        wsToast= $.toast({
    				heading: 'Success',
    				text: 'otdmTools on http is OK!',
    				//showHideTransition: 'slide',
    				hideAfter: 800,
    				icon: 'success'
    		});
      }else{
        this._status = false;
        wsToast= $.toast({
    				heading: 'Error',
    				text: ['otdmTools over http ',"status:",s,"data",d],
    				showHideTransition: 'slide',
    				icon: 'error'
    		});
      }

    });

  }

  test(){
    console.log("mott: test");
  }

}

let m = new motTools();
try{
  mott = m;
  console.log('mott: motTools is in nr-yss');
}catch(e){
  console.log('mott: motTools as module');
}


//console.log("motTools exporting","have mott",mott);
export default { motTools }
export { motTools }
