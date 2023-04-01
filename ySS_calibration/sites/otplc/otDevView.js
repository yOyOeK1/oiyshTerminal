class otDevView{

  constructor( dName, topic, divIdTarget, getDataF ){
    cl(`otDevView init ... ${dName}`);
    this.dName = dName;
    this.topic = topic;
    this.divId = divIdTarget;
    this.getDataF = getDataF;


  }

  getDiv(){
    return `<div id="${this.divId}">Data view (${this.dName})<br>
      at ${this.topic} - no data ...</div>`;
  }

  onWSMsg( r ){
    if( r.topic == this.topic ){
      cl(`Ok have my device (${this.dName}) at ${this.topic} !`);
      //cl(r);
      cl("var:"+this.getDataF(r) );

      $( `#${this.divId}` ).html(
        `Data view (${this.dName})<br>
        at ${this.topic} : `+
        this.getDataF(r)
      );

    }
  }

}
