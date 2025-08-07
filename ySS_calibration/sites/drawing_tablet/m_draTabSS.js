
console.log("m_draTabSS.js included ....");

import { hotHelperServer } from "../../libs/hotHelper.js";


class m_draTabSS extends hotHelperServer{
    constructor( ws ){
        super(ws);
        this.cl("m_draTabSS init ...");
        
        
        this.wsPrefferPrefix = 'xraTab: [';

    }

    cl( str ){
        console.log('m_draTabSS',str);
    }    


    // try to invoce thisone by `sOutSend('xraTab: [aadde');`
    onWsByPrefix=(ws,event,msg)=>{
      
      this.cl(` onWsByPrefix regived in m_draTabSS.js ${msg} `);
      return 1;
    }

    onWsMessageCallBack=(ws, event, msg)=>{
        //this.cl(`got ws message`);
        //this.cl(msg);
          
          let doIt = '';

          if( event == 'on_message' ){
            if( msg.toString().substring(0,15) =='draTab: [move] ' )
              doIt = 'm';
            else if( msg.toString().substring(0,15) =='draTab: [star] ' )
              doIt = 's';
            else if( msg.toString().substring(0,15) =='draTab: [end ] ' )
              doIt = 'e';
            
          }

          if( doIt != '' ){
            //console.log('ok my wscb: draw tablet');
            
            
            let jso = undefined;
            let m = msg.toString().substring(15);
            try{ jso = JSON.parse(m) }catch(e){ console.error("no luck with parsing json ",e);}
            jso['e'] = doIt;
            //console.log(jso);
            this.wss.sendToAll( ws, JSON.stringify(jso) , /*'m_draTabSS'*/);

            return 1;
          
          }
        
        return 0;
    
    }
    
}

export { m_draTabSS }
