





function otPTopicSelectorView( options ){

  setTimeout(()=>{

    var topicsLiAs=[];
    options.find((e,i)=>{
      topicsLiAs.push({
        'type': 'li',
        'html':{
          'type': 'a',
          'href': '#',
          'onclick': 'otPTopicViewSelected($(this).text())',
          //'style': 'display:none;',
          'html': e
        }
      });
    });


    $( '#dtsv' ).html('');
    $( '#dtsv' ).dform({
      'type': 'div',
      'id': 'shViewTopic',
      'html': [
        {
          'type': 'h4',
          'html': "Set topic to view ...",
        },{
          'type': 'p',
          'html': {
            'type': 'ul',
            'id': 'sTopicSelecToView',
            'html':topicsLiAs
          }
        }]
    });

    //'class': 'ui-dform-li ui-field-contain ui-li-static',
      /*'html':[
        {
          "type": "label",
          "for": "sTopicSelecToView",
          "html": "View topic"
        },{
          'id': 'sTopicSelecToView',
          'name': 'sTopicSelecToView',
          'type': 'select',
          'data-mini': true,
          'data-inline': true,
          'options': options,
          'onchange': 'otPTopicViewSelected($(this).find(\'option:selected\').text())'
        }
      ]*/

    //$('#sTopicSelecToView').selectmenu();
    //$('#sTopicSelecToView').listview();
    $('#sTopicSelecToView').listview({
      filter: true,
      filterReveal: true,
      filterPlaceholder: "Search for topic ...",
      inset: true
    }).listview('refresh');

    $('#shViewTopic').collapsible();


  },400);

  return '<div id="dtsv">dtsv - to select topic to view </div>';
}


function otPTopicViewSelected( topic ){
  cl(`otPTopicViewSelected with topic .... ${topic}`);

  //$('#devNow1').html('waiting for data ...');
  /*
  pager['dVtopic'] = new otDevView(
    `${topic}`,
    topic,
    "devNow1_"+timeStampNow(),
    (r)=>{ return r.payload; }
  );
  */

}

function otPonWS( r ){
  //pager['dVtopic'].onWSMsg( r );
}

function otPMainHtml(){
  //pager['dVtopic'] = -1;

  let tr = '';
  // TODO
  let bUrl = 'http://192.168.43.220:1880/plc'


  /*
  pager['dVtopic'] = new otDevView(
    'dVtopic and mag ',
    'and/mag',
    "devNow1",
    (r)=>{ return r.payload; }
  );
  tr+= pager['dVtopic'].getDiv();
  */
  tr+= `
    <div class="toHorisontalControlGroup">
      <div><img src="./sites/${pager.getCurrentPage().getName}/ico_sensors_32_32.png" ></div>
      <div id="stcd">Topics registerd count in system ....</div>
    </div>`;


  $.get( bUrl+`?q=`+encodeURIComponent(JSON.stringify({"lsTopics":"1"})), function( data, status ){
      if( status == 'success' && data.exitCode == 0 ){

        cl(data);
        var topicsOpts = [];
        data.topics.find((e,i)=>{
          topicsOpts.push( e.topic );
        });


        $('#stcd').html(
          '- topics registered in system: '+data.topics.length+'<br>'/*+
          otPTopicSelectorView( topicsOpts )*/
        );
      }else{
        cl('Error on getting lsTopics ! 979');
      }
  } );



  tr+= `
    <div class="toHorisontalControlGroup">
      <div><img src="./sites/${pager.getCurrentPage().getName}/ico_v_tree_32_32.png" ></div>
      <div id="splcscd">ot-plcs registerd count in system ....</div>
    </div>
    `;


  $.get( bUrl+`?q=`+encodeURIComponent(JSON.stringify({"lsPlcs":"1"})), function( data, status ){
    cl(status);
    cl(data);
      if( status == 'success' && data.exitCode == 0 ){
        var sums = {};
        var sTr = '';
        data.otPlcs.find((e,i)=>{
          if( sums[ e.plcType ] == undefined ) sums[ e.plcType ] = 0;
          sums[ e.plcType ]++;
        });
        cl('Sums:');
        cl(sums);
        sTr+=
          JSON.stringify( sums ).split(',').join('</li><li>')
            .split('{').join('<li>')
            .split('}').join('</li>')
            .split('"').join('')
            .split(':').join(': ')
            ;


        $('#splcscd').html('- ot-plc registered in system: '+data.otPlcs.length+'<br>'+sTr);
      }else{
        cl('Error on getting lsPlcs ! 4329');
      }
  } );




  return `<h1>
      <img src="./sites/${pager.getCurrentPage().getName}/ico_graph_32_32.png" >
      ot-plc : stats
    </h1>`+tr;
}
