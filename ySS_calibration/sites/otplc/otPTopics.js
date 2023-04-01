

function otPTopicWS( r ){
  cl("otPTopicWS .... ");
  cl(r);
  //pager['dVtopic'].onWSMsg( r );
}

function otPTopicsHtml(){

  return `

<div style="display:none;">

  <div hh="baseTamplate">
    <h3>{title} - topic in DB</h3>
    <p>{content}</p>
    <button onclick="pager.getCurrentPage().onUpdateTitle()">update title ...</button>
  </div>

  <div hh="lviTamplateBody">
    <div hh="lviTamplate" hhrepthis="" >
      <li><b>{title}</b><br>
      {content}  - lviTamplate</li>
    </div>
  </div>



  <div hh="topicInfoTemplate">
    <b>id: </b>{id} : {topic}<br>
<pre>
recording data
fram: {tStart} to: {tEnd}
count: {iCount}
last: {last}
</pre>
  </div>



</div>

</div data-enhance="false" >




<div id="dLandHeader">

  <form class="topicForm" name="topicForm">
  <ul data-role="listview" data-inset="true" class="ui-body-a">

  <!--
  <li class="ui-field-contain" id="dLandTopicSelect">
  <label for="selTopic">Topic</label>
  <select id="selTopic" name="selTopic"></select>
  </li>
  -->

  <li class="ui-field-contain" >
  <input type="text" id="searchField" placeholder="Select topic from db ...">
  <ul id="suggestions" data-role="listview" data-inset="true"></ul>
  </li>

  </ul>
  </form>

</div>







<div id="dLandMain">main</div>


<!-- end of  data-enhance="false"  -->
</div>
  `;

}


function otPTopicsSelectionDone( topic ){
  cl("otPTopicsSelectionDone ...."+topic);
  // TODO
  let bUrl = 'http://192.168.43.220:1880/apidb/';
  let q = `
    select
    id,
    ('${topic}') as 'topic',
    (select entryDate from ${topic} order by entryDate limit 1) as tStart,
    (select entryDate from ${topic} order by entryDate desc limit 1) as tEnd,
    (select count(id) from ${topic} limit 1) as iCount,
    (select msg from ${topic} order by entryDate desc limit 1) as 'last',
    entryDate
    from ${topic} limit 1;
  `.split("\n").join(' ');

  $('#dLandMain').html( otMHH.injectDataToStr( $('div[hh=topicInfoTemplate]').html(), {
    'id': "- -",
    'topic': 'loading data ....',
    'tStart': "",
    'tEnd': "",
    'iCount': "- -",
    'last':""}
   ) );

  $.get( bUrl+`?sql=`+q, function( data, status ){
      if( status == 'success' && data.length == 1){

        cl(data);

        let dl = $('#dLandMain');
        let th = $('div[hh=topicInfoTemplate]').html();
        let datah = this.datah;
        dl.html( otMHH.injectDataToStr( th, data[0]/*{
          'id': "uu id",
          'topic': topic,
          'tStart': "uu tStart",
          'tEnd': "uu tEnd",
          'iCount': 11,
          'last':"uu last"
        }*/  ) );

    }
  });
}


function otPTopicsRebuildSelector( data ){
  var dataT = [];
  data.topics.find((e,i)=>{
    if( e.topic != "" ){
      dataT.push({value: e.tName ,label: e.topic });
    }
  });
  //https://www.geeksforgeeks.org/how-to-use-a-jquery-mobile-autocomplete-plugin/
  $("#searchField").autocomplete({
      target: $('#suggestions'),
      source: dataT,
      link: '#',
      minLength: 1,
      matchFromStart: false,
      callback: function(e) {
          var $a = $(e.currentTarget);
          cl('select : '+$a.data('autocomplete').value+" || "+$a.data('autocomplete').label);
          $('#searchField').val( $a.data('autocomplete').label );
          $("#searchField").autocomplete('clear');
          otPTopicsSelectionDone( $a.data('autocomplete').value );
      }
  });
  $("#searchField").on({
    mouseenter:()=>{ cl('dooo select all !!'); $('#searchField').select(); }
  });
  $('#searchField').focus();

}

function otPTopicsHtmlAfterLoad(){
  // TODO
  let bUrl = 'http://192.168.43.220:1880/plc';
  $.get( bUrl+`?q=`+encodeURIComponent(JSON.stringify({"lsTopics":"1"})), function( data, status ){
      if( status == 'success' && data.exitCode == 0 ){
        otPTopicsRebuildSelector( data );
      }
  });


}
