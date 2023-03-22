
class mThisDevice{

  constructor(){
    this.devName = pager.getDevName()

    cl("mThisDevice init ....."+this.devName);




  }


  pushUpdateSens( sens, val ){



    let topic = 'devSen/'+this.devName+'/'+sens;
    let msg = 'toMqttPub:topic='+topic+',payload='+val;
    cl(msg);

    pager.wsCallbackExternal({
      "topic": topic, "payload":val
    });

    sOutSend( msg );
  }



}
