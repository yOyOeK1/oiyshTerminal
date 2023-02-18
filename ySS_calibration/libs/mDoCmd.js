

/**
 * Class mDoCmd is a helper from oiyshTerminal family - Main class
 *
 * @description you can make a instace of it to use it to run cmd communication support.
 *  It can do command, update on stdout/in , callbacks,....
 *  mqtt and otdm-nrf-yss are making a bridge from bash or otdmTool.py to
 *  mqtt. Then using function from this class you can interact with process or
 *  only make some bash work.
 */
class mDoCmd{

  /** @constructor */
  constructor(){
    /** @desc To know if still running. true (running..) */
    this.cmdWork = false;
    /** @desc To identify current command communication topic*/
    this.pH = 0;

    this.updateObj = "";
    cl("mDoCmd  is in constructor.... "+
      " ph: "+this.pH);
  }



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
    tr = {};

    //var fName = "_"+(Math.random()*1000000)+"_"+( new Date().getTime() )+".json";
    //cl("fName: ["+fName+"]");
    var url = "?otdmQ:"+JSON.stringify(args);
    //cl("mDoCmd.otdmArgs -> url: ["+encodeURI(url)+"]---------------------");

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
    return tr;
  }

  /**
   * @param {json} cmd - json structure of arguments pass same way as you use `otdmTools.py` Argument is a key and value is value.
   * @param {string} updateObj - id of html element will update status of app stdout
   * @param {object} callBack - can be not set - then only dump to cl( ... ). Will pass data, result arguments if callBack is set then pass (`data` ,`result`) arguments
   * @description Methode to run command from **bash layer** and get live conection with stdin / stdout. It use `pH` as a key in creating new mqtt topic to establish trafic. Running process. So you can intercact with thread.
   */
  doCmd( cmd, updateObj, cbFunc = -1 ){
    this.updateObj = updateObj;

    if( this.cmdWork == true ){
      cl( 'cmd running can sand some stuff to stdin.' );
      cl(cmd);
      sOutSend('otdmCmd:'+this.pH+':'+cmd );
      return 0;
    }

    cl("do Apt Update :)");
    var pH = "pH"+(Math.round( Math.random()*100000 ) )+"_"+(Math.round( Math.random()*100000 ) );
    this.pH = pH;
    cl("pH: ["+pH+"]");
    $("#"+this.updateObj).html("doing it.....["+cmd+"]<br>");

    //cmd = JSON.stringify(["ls", "/tmp"]),
    this.cmdWork = true;
    this.otdmArgs(
      {
        "webCmdSubProcess": cmd,
        'pH': pH
      },
      cbFunc == -1 ? this.otdmCallBackWebCmdSubProcess : cbFunc
    );
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

  }



  /**
   * Methode to put in your **WebSocket handle** message from it. This will detect end of work for your command. Set up correctly `cmdWork`
   * @param {json} r - incomming msg from websocket server. it will look for owne topic with `pH` as key. if done will come sets end of `cmdWork` to false.
   * @description Methode to update worker live connection is it DONE. Put it in your site **onMassageCallBack** if you want to update status or run next one. If running not starting text.
   */
  onWSMessageCallBackWork_onStatusDONE( r ){
    if( this.cmdWork &&
      r.topic == String("subP/"+this.pH+"/status") ){
        cl("got status update on "+this.pH+" msg:"+r.payload);
        if( r.payload == 'done' ){
          this.cmdWork = false;
          cl("END web sub process work -----");
          $("#"+this.updateObj).append('DONE');
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
  }


}
