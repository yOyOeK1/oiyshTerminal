
class windEfford{
  hdm = undefined;
  tableRaw = {};
  tableAvgs = {};
  store = 60*5; // in sec;

  hdmMin = 360;
  hdmMax = 0;
  resolution = 1;


  updateHDM( newHDM ){
    //var reduction = parseInt( newHDM/this.resolution ) * this.resolution;
    //this.hdm = reduction+parseInt( this.resolution / 2 );
    this.hdm = newHDM;
  }

  updateHeel( newHeel ){
    if( this.hdm != undefined ){

      var spred = 3;
      for( var h=this.hdm-spred,hx=this.hdm+spred;h<=hx;h++){
        if( this.tableRaw[ h ] == undefined )
          this.tableRaw[ h ] = [];

        this.tableRaw[ h ].push({
          't': new Date().getTime(),
          'v': newHeel
        });
      }


      this.dropOld();
      this.hdmMax = 0;
      this.hdmMin = 360;
      this.updateAvgs();

      var tr = [];
      var avg = undefined;
      var avgC = 0;
      for(var i=(this.hdmMin); i<(this.hdmMax); i++){
        if( this.tableAvgs[ i ] != undefined){
          var kres = this.tableAvgs[i];
          cl(" hdm "+i+" res:"+kres);


          if( (i-3)>=( this.hdmMin ) && (i+3) <= (this.hdmMax) ){
            tr.push({
                'x':i,
                'y':kres
            });

            avgC++;
            if( avg == undefined )
              avg = kres;
            else{
              avg+= kres;
            }

          }

        }
      }


    }


    return {
      'd': tr,
      'a': avg/avgC
    };

  }


  dropOld(){
    var to = new Date().getTime() - (this.store*1000);

    for( var k in this.tableRaw ){
      for(;this.tableRaw[ k ].length>0;){
        if( this.tableRaw[ k ][0]['t'] < to )
          this.tableRaw[ k ].shift();
        else
          break;
      }
    }

  }

  updateAvgs(){
    //cl("we ----------------------");
    this.tableAvgs = {};
    for( var k in this.tableRaw ){

      if( k > this.hdmMax )
        this.hdmMax = k;
      if( k < this.hdmMin )
        this.hdmMin = k;

      if( this.tableRaw[ k ].length > 0 ){
        this.tableAvgs[ k ] = this.avgThat( this.tableRaw[ k ] );
      }
    }
  }

  avgThat( list ){
    var tr = 0;
    var l = list.length-1;
    for( var i=0; i<l;i++ )
      if( i == 0 )
        tr = list[i]['v'];
      else
        tr+= list[i]['v'];

    return tr/(l+1);
  }




}


class s_windEffordPage{

  we;

  get getName(){
    return "windEfford playground";

  }

  get getDefaultBackgroundColor(){
		return "#ffddcc";
	}



  getHtml(){
    return `
<div style="display:inline;position:absolute;top:0;width:200;">
  <div id="weAvgs">weAvgs</div>
</div>
    `;
  }


  getHtmlAfterLoad(){
     this.we = new windEfford();

  }

  get svgDyno(){
    return s_windEffordDebug;
  }

  wePlot = null;
  weK = null;
  svgDynoAfterLoad(){
    this.wePlot = m_d3PlotInit("recRes",{
      'plotType': 'area',
      'fillColor': '#0f0',
      'fillToPoint': 0

      });
      this.weK = m_d3PlotInit("recKalman",{
        'plotType': 'area',
        'fillColor': '#0f0',
        'fillToPoint': 0

        });
  }



  onMessageCallBack( r ){
    console.log("s_blankPage got msg ");
    if( r.topic == 'e01Mux/adc0' ){
      //putText("houBatVol", (""+(r.payload*(0.02771809)) ).substring(0,5) );

    }else if( r.topic == 'and/mag' ){
      pager.getCurrentPage().we.updateHDM( parseInt(r.payload) );


    }else if( r.topic == 'and/orient/heel' ){
      var dataPlot = pager.getCurrentPage().we.updateHeel( parseFloat(r.payload) );
      if( dataPlot['d'].length>2 ){
         pager.getCurrentPage().wePlot( dataPlot['d'],{
          'fillToPoint': dataPlot['a']
          });



      }

    }else if( r.topic == 'thisDevice/bat/perc' ){
      //putText("batPercent", r.payload+"%");
    }else{
      cl("msg nan");
      cl(r);
    }
  }



}
