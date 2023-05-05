console.log("motTools wild");

class motTools{


  constructor(){
    console.log("motTools init .... have target? ", mott);

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
    $.ajax({
      url:this.url+"/"+ sapiStr,
      type: "GET",
      success: function(d){
        cl("got it in ... "+ (( (new Date().getTime())-this._pts)/1000)+" sec." );
        //cl("data");cl(d);
        callBack(d,'success');
      },
      error:function(){ cl("Error in 2345678");
        callBack(-1, 'notOk')},

    });
  }

  chkHost(){
    this.sapi( "ping", (d, s ) => {
      //cl("got pong?-------------");cl("status ");cl(s);cl("data ");cl(d);
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
    console.log("test");
  }

}

let m = new motTools();
mott = m;

//console.log("motTools exporting","have mott",mott);
export default { motTools };
