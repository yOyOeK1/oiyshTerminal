

/**
 * Class mDoCmd is a helper from oiyshTerminal family - Main class
 *
 * @description you can make a instace of it to use it to run cmd communication support.
 *  It can do command, update on stdout/in , callbacks,....
 *  mqtt and otdm-nrf-yss are making a bridge from bash or otdmTool.py to
 *  mqtt. Then using function from this class you can interact with process or
 *  only make some bash work.
 *
 *  **Check** otdmTool.py site [otdmDriverWebCmdSubProcess - documentation](./xdevdoc-otdmDriverProto-web-cmd-sub-process)
 */
class mDoCmd{

  /** @constructor */
  constructor(){
    /** @desc To know if still running. true (running..) */
    this.cmdWork = false;
    /** @desc To identify current command communication topic*/
    this.pH = this.genNewPh();
    /** @desc To collect data stdout from cmd from shell*/
    this.cmdStdOut = '';

    this.updateObj = "";
    cl("mDoCmd  is in constructor.... "+
      " ph: "+this.pH);
  }

  genNewPh(){
   self.pH = "pH"+(Math.round( Math.random()*100000 ) )+"_"+(Math.round( Math.random()*100000 ) );
   cl(" mDoCmd generating new pH ..... "+this.pH);
   return self.pH;
  };

  /**
   * Methode run to command from **otdmTools** and get result - call back on finish.
   * @example
   *  ```javascript
   *  this.mDoCmd.otdmArgs({
   *   "dfs": "/tmp/abc",
   *   "act": "MKDIR"
   *   },(data,res)=>{cl("ok");});
   *  ```
   *  *will console.log out "ok" on done.*
   *
   * @example
   * ```javascript
   * this.mDoCmd.otdmArgs({
   *   "dfs": "/tmp"
   *   },(data,res)=>{cl(data);});
   * ```
   * *will console.log out list of files and directories*
   *
   * @param {json} args - json structure of arguments pass same way as you use `otdmTools.py` Argument is a key and value is value.
   * @param {object} callBack - can be not set - then only dump to cl( ... ) will pass `data`, `result` as arguments
   */
  otdmArgs( args, callBack=-1 ){
    //cl("mDoCmd.otdmArgs ["+JSON.stringify(args)+"]");
    // url 'http://localhost:1880/yss/?otdmQ:\{"webCmdSubProcess":"\[ls,/tmp\]","pH":"66"\}'

    var url = "?otdmQ:URI:"+encodeURI(JSON.stringify(args));
    cl("mDoCmd.otdmArgs -> url: ["+encodeURI(url)+"]---------------------");

    $.get( url, function( data, status ){
      let daTr = data;
      try{
        daTr = JSON.parse( data );
      }catch(e){
        cl("In mDoCmd.otdmArgs result no json - :/ ");
        cl(e);
      }
        if( callBack == -1 )
          this.otdmCallBackWebCmdSubProcess( daTr , status )
        else
          callBack( daTr , status );
    } );
  }

  /**
   * @param {array} cmd - array example:["ls","/tmp"] structure of arguments pass same way as you use `otdmTools.py` Argument is a key and value is value.
   * @param {string} updateObj - id of html element will update status of app stdout
   * @param {object} callBack - can be not set - then only dump to cl( ... ). Will pass data, result arguments if callBack is set then pass (`data` ,`result`) arguments
   * @description Methode to run command from **bash layer** and get live conection with stdin / stdout. It use `pH` as a key in creating new mqtt topic to establish trafic. Running process. So you can intercact with thread.
   */
  doCmd( cmd, updateObj, cbFunc=-1 ){
    this.updateObj = updateObj;

    if( this.cmdWork == true ){
      cl( 'cmd running can sand some stuff to stdin.' );
      cl(cmd);
      sOutSend('otdmCmd:'+this.pH+':'+cmd );
      return 0;
    }else{
      cl("new command clearing cmdStdOut .... ["+cmd+"]");
      this.cmdStdOut = '';
    }

    cl("pH: ["+this.pH+"]");
    $("#"+this.updateObj).html("doing it.....["+cmd+"]<br>");

    //cmd = JSON.stringify(["ls", "/tmp"]),
    this.cmdWork = true;
    this.otdmArgs(
      {
        "webCmdSubProcess": cmd,
        'pH': this.pH,
        "stdout": "1"
      },
      cbFunc != -1 ?
        cbFunc :
        this.otdmCallBackWebCmdSubProcess
    );
  }


  /**
   * @param {string} cmd - example: "df -h | grep sda"
   * @param {string} updateObj - id of html element will update status of app stdout
   * @param {object} cbFunc - can be not set - then only dump to cl( ... ). Will pass data, result arguments if callBack is set then pass (`data` ,`result`) arguments
   * @description Methode to run command from **bash layer** and get live conection with stdin / stdout. It use `pH` as a key in creating new mqtt topic to establish trafic. Running process. So you can intercact with thread.
   */
  doSh( cmd, updateObj, cbFunc=-1){
    cl("doSh--------");
    cl("cmd");
    cl( typeof cmd );
    cl(cmd);
    this.doCmd(
      String("[sh,-c,"+cmd+'; echo "exitCode:"$?]').toString(),
      updateObj,
      cbFunc
      );
  }

  /**
   * @param {string} cmd - example: "df -h | grep sda"
   * @param {string} updateObj - id of html element will update status of app stdout
   * @param {object} cbFuncOk - calledback on OK `exitCode:0` can be not set - then only dump to cl( ... ). Will pass data, result arguments if callBack is set then pass (`data` ,`result`) arguments
   * @param {object} cbFuncErr - calledback on Error `exitCode:!0` can be not set - then only dump to cl( ... ). Will pass data, result arguments if callBack is set then pass (`data` ,`result`) arguments
   * @param {bool} rAsJson - true:default if true return in json if false as it came
   * @description Methode to run command from **bash layer** and get live conection with stdin / stdout. It use `pH` as a key in creating new mqtt topic to establish trafic. Running process. So you can intercact with thread. Plast it do exitCode check for you.
   */
  doShExitCodeChk( cmd, updateObj, cbFuncOk=-1, cbFuncErr=-1, rAsJson=true ){
    let c = this.doSh( cmd, updateObj, (d,res)=>{

      // IMPORTANT!
      //c.cmdWork = false;

      let dlen = d.length;
      cl("Data processing .... -1");
      if( d[dlen-1] != -1 ){
        cl("no -1 at end");
        return cbFuncErr( d, res );
      }else{
        cl("OK!");
      }

      cl("Data processing .... exitCode:0 ?");

      if( d[dlen-2] != "exitCode:0" ){
        cl("no correct exitCode GOT ["+d[dlen-2]+"]");
        return cbFuncErr( d, d[dlen-2] );
      }else{
        cl("OK!");
      }

      cl("Poping first and two lasts ....")
      if( rAsJson == true ){
        d.pop();
        d.pop();
        //d.shift();
        d.shift();
      }else{
        d.pop();
        d.pop();
      }

      let retStat = 0;

      let j = {};
      if( rAsJson == true ){
        cl("Data array to json ...");
        try{
          j = JSON.parse( d.join("") );
        }catch(e){
            cl("Error in parsing data to json :/ ");
            return cbFuncErr( d, res );
        }
      }


      //cl(j);


      if( cbFuncOk != -1 && rAsJson == true )
        cbFuncOk( j , retStat);
      else if( cbFuncOk != -1 && rAsJson == false )
        cbFuncOk( d , retStat);


      //cbFuncOk


    });

  }


  /**
  * Default callback methode for `.otdmArgs` methode on DONE. Will only spit to console.log the result.
  * @param {json/string} data - json / string tipically if all is ok then get json.
  */
  cbOnCmdGetReturnDONE( data, status ){
    cl("cbOnCmdGetReturnDONE:");
    cl( status );
    cl("data ------------");
    cl(data);

    cl('// need to call can not!! is is a default mDoCmd.cbOnCmdGetReturnDONE ');
    cl('// this.cmdWork = true;');
  }




  CmdStdOut_addToRes( so ){
    //cl("cmd -> stdout more by ..... ");
    cl(""+so);
    this.cmdStdOut+= so+"\n";
  }


  /**
   * Methode to put in your **WebSocket handle** message from it. This will detect end of work for your command. Set up correctly `cmdWork`
   * @param {json} r - incomming msg from websocket server. it will look for owne topic with `pH` as key. if done will come sets end of `cmdWork` to false.
   * @description Methode to update worker live connection is it DONE. Put it in your site **onMassageCallBack** if you want to update status or run next one. If running not starting text.
   */
  onWSMessageCallBackWork_onStatusDONE( r ){
    //cl(r);
    if( this.cmdWork &&
      r.topic == String("subP/"+this.pH+"/status") ){

        cl("got status update on "+this.pH+" msg:"+r.payload);

        if( r.payload == 'done' ){
          this.cmdWork = false;
          cl("END web sub process work -----");
          $("#"+this.updateObj).append('DONE');
        }
    }else if( r.topic.substring(0,5+this.pH.length) == 'subP/'+this.pH){
      //cl("have line !!!!!");

      if( typeof r.payload == 'object' ){
        let tatso = [];
        var d = r.payload['data'];
        for( var b=0,bc=d.length; b<bc; b++ )
          tatso.push( String.fromCharCode( d[b] ) );

        this.CmdStdOut_addToRes( (tatso.join("")) );
      }else{
        this.CmdStdOut_addToRes( r.payload.toString() );
      }
    }
  }

  /**
  * Default callback methode for `.doCmd` methode. Will only spit to console.log the result.
  */
  otdmCallBackWebCmdSubProcess( data, res ){
    cl("otdmCallBackWebCmdSubProcess - from mDoCmd ");
    cl("data - from mDoCmd");
    cl(data);
    //this.cmdWork = false;
    cl("set cmdWork false - DONE")
  }


}
