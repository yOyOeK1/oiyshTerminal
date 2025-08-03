

class hotHelperServer{

    
    constructor( ws ){
        this.ws = ws;
    }


    sendIt( msg ){
        this.cl(`send ${this.wskey} to client ...`);
        this.ws.send({ type: 'custom', event: 'S2C'+this.wskey,
            data: msg
        });
    }


    onMsg( msg ){
        this.cl( " got msg: ");this.cl(msg);
    }

}

class hotHelperClient{
    constructor(){
        this.hotTasks = {};
        this.wsOns = [];
    }


    hotTaskStart( msg, eventKey = undefined ){
        console.log("hotTastStarta:     topic: "+msg.topic);
        let th = Date.now()+Math.random();
        eventKey = (eventKey == undefined ? 'C2S'+this.hotKey : eventKey );
        
        /*
        if( this.wsOns.indexOf( eventKey ) == -1 ){
            console.log('[i] adding new .on: '+eventKey );
            if( window['Hoty'] ){

                window['Hoty'].on( eventKey, (msg)=>{
                    this.hotTasksCallBack(msg);
                });
                this.wsOns.push( eventKey );

            }else{
                console.error('hotTaskStart With new eventKey: '+eventKey+" Error .on no window['Hoty']");
            }
        }
        */
        
        this.hotTasks[th] = {
            'th': th,
            'eventKey': eventKey,
            'msgOrg': msg,
            'topicOrg':msg.topic,
            'tStart': Date.now(),
            'tTotal': 0,
            'state': 0            
        };
        
        let prom = new Promise((resolve,reject)=>{
            msg['th'] = th;
            this.hotTasks[th]['resolve'] = resolve;
            this.hotTasks[th]['reject'] = reject;
            this.hotSend(msg, eventKey );

            this.hotTasks['timeOut'] = setTimeout(()=>{
                //console.log('hotTaskStart time out ....chek topic: '+msg.topic);

                if( this.hotTasks[th] == undefined ){
                    //console.log('hotTaskStart was done');

                } else if( this.hotTasks[th].tTotal == 0 ){
                    let msgErr = 'hotTaskStart task time out .....'; 
                    console.error( msgErr, this.hotTasks[th] );
                    this.hotTasks[th].reject( msgErr );
                    delete this.hotTasks[th];
                
                }
            },5000);            
            
        });        
        
        this.hotTasks['prom'] = prom;

        return prom;
    }
    hotTaskDone( msg ){
        clearTimeout( this.hotTasks[msg.th].timeOut );
        this.hotTasks[msg.th].resolve( msg );
        console.log(`hotTaskFinish ... in `+((Date.now() - this.hotTasks[msg.th].tStart)/1000 )+" sec." );
        delete this.hotTasks[msg.th];
    }

    hotSend( msg, eventKey = undefined ){
        eventKey = (eventKey == undefined ? 'C2S'+this.hotKey : eventKey );
        window.Hot.send( eventKey, msg );
    }

    hotTasksCallBack( msg ){
        if( msg.th != undefined && this.hotTasks[msg.th] != undefined ){
            this.hotTaskDone( msg );
        } else {
            this.onHotMessageCallBack(msg);
        }
        
    }

    hotRegisterOn(){
        if( window['Hoty'] ){
            window['Hoty'].on('S2C'+this.hotKey, (msg)=>{
                this.hotTasksCallBack(msg);
            });
            this.wsOns.push('S2C'+this.hotKey);
        }
    }
}

export { hotHelperServer, hotHelperClient }