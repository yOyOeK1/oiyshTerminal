

/**
 * mApp is a helper from oiyshTerminal family - Main class
 *
 * This one is helping with holding mobile look of your site. Powerd by jQuery Mobile is nice for fingers gui. Fast Big Buttons is what I need when I'm writing. I don't wast to do back button! This class is doing all for you. In area of simple gui for mobile.
 * **use in**: [yss-otdm](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-yss-otdme), [yss-packitso](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-yss-packitso), [yss-multisvg](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-yss-multisvg)
 *
 * @example
 * First adopter of this class is [yss-packitso](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-yss-packitso) Started as a optimalization concept. On every page it's the same story. You start from zero. Collect thing. This way all is ready. If you have
 * different way or idea. As long is html it's OK with me :)
 */
class mApp{

  constructor(){
    cl("mApp  is in constructor....");
  }

  /**
   * @param {json} args - to set up thinks in frame.
   * @namespace
   * @property {json} args - The default values for frame arguments
   * @property {string} args.goTo - if set then past to `pager.goToByHash(goTo)` to move without reloading
   * @property {string} args.backButton - if set then past to `onclick="backButton"`
   * @property {string} args.title - to put page headet title
   * @property {string} args.content - to put your content in frame
   * @desc function returns Basic Frame of a page. if needed back or goTo button is there to use
   * @returns {string} to put it for example as `$('#htmlDyno').html( returnStr )`;
   * @example
   *  ```javascript
   *  $("#htmlDyno").html( mApp2.appFrame({
   *    "content":"Hello world",
   *    "goTo": "pageByName=test functions"
   *  }) );
   *  ```
   * *will put in htmlDymo div html element App Frame with Hello world in it.
   *  bonus go to button to go to test functions page.*
   *
   * ![](https://github.com/yOyOeK1/oiyshTerminal/raw/main/ySS_calibration/screenShots/ss_mApp_frame.png)
   */
  appFrame( args ){

    let btBack = (args['backButton'] != undefined ?
      `<a `+
        //`onclick="history.back()" `+
        `onclick="`+args['backButton']+`" `+
        `data-rol="back"  `+
        `class="ui-btn-left ui-alt-icon ui-nodisc-icon ui-btn ui-icon-carat-l ui-btn-icon-notext ui-corner-all"  `+
        //`class="ui-btn-left ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-arrow-l"`+
        `>`+
        `Back to list.</a>
        `:``);
    let btGoTo = ( args['goTo'] != undefined ?
      `<a
        onclick="pager.goToByHash('`+args['goTo']+`')"
        class="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-forward">
        Go TO
      </a> `: '' );

    if( args['title'] != undefined && args['title'] != '' ){
      let title = args['title'];
      if ( btBack != '' || btGoTo != '' )
        title = '<h1 data-role="heading" class="ui-title">'+title+'</h1>';
      pager.setHeader( title+btBack+btGoTo );
    }else{
      cl(".appFrame is build without title for header!");
      pager.setHeader( '' );

    }

    return ( (args['title'] != '') || ( args['goTo'] == undefined && args['backButton'] == undefined ) ? "" : `
<div date-role="header" data-position="inline">

  `+btBack+btGoTo+`
</div>
      `)+`

<div class="ui-content">
`+( args['goTo'] == undefined && args['backButton'] == undefined ?
  "" : (args['title'] == '' ? `<br><br>` : '') )+
  args['content']+`
</div>
    `;
  }

  /**
  * @param {dict} data - expect dict of keys: vals
  * @namespace
  * @property {dict} data
  * @property {string} data['key']  - key is a name to use as description of a value
  * @property {string} data.key - value to display strong
  * @returns {string} ready to put in your div or other place
  * @description wraps data with rule `key: <b>val</b></br>` fast !!
  */
  makeNiceList( data ){
    var mnl = [];
    //cl("makeNiceList of element in html -----");
    //cl(data);
    if( data == undefined )
      return '';

    let keys = Object.keys(data);
    for( let i=0,ic=keys.length; i<ic; i++ ){
      mnl.push(
        String( keys[i]+`: <b>`+data[ keys[ i ] ]+`</b>`)
      );
    }
    return mnl.join("<br>");
  }

  /**
  * @param {string} head - set head of list view item
  * @param {string|json} content - if {string} then put as content of item
  * @namespace
  * @property {object} content - set more custome things like
  * @property {string} content.img - url for image to put on left of item
  * @property {string|dict} content.content - put it as content or if {dict} set do automaticly a list of parameters in item. it will make `key: <strong>value</strong>`
  * @property {string|dict} content.tip - set head  tip cloud in right top corner of item
  * @property {string} content.class - set extra class at `<h2 class="..` try `ui-body-b`

  * @namespace
  * @property {object} content.content - if is dict then do expect that is a {"key":1,"index":23}
  * @property {dict} content.content - if dictionary then use rule `key: <strong>val</strong><br>`
  * @namespace
  * @property {dict} content.tip - if dictionary then use rule `key: <strong>val</strong><br>`
  * @param link {string} [''=DefultValue] - not set link at all or if set put `<a href="#" noclick="link"...` over all item
  * @returns {string} to put it for example as `$('#htmlDyno').html( returnStr )`;
  * @description to make your stuff in lightning speed wrap your data to nice stuff.
  * @example
  *  ```javascript
  *  tr+= this.app.lvBuild({
  *   "header": "files in directory:",
  *   "headerTip": items.length,
  *   "items": items
  *  });
  * ```
  * A fast way to get consistance look
  *
  * ![](https://github.com/yOyOeK1/oiyshTerminal/raw/main/ySS_calibration/screenShots/ss_mAppLvBuilderImages.png)
  *  ![](https://github.com/yOyOeK1/oiyshTerminal/raw/main/ySS_calibration/screenShots/ss_mAppLvBuilderData.png)
  */
  lvElement( head, content, link='' ){
    /*`version: <strong>`+e['packitso']['ver']+`</strong><br>
    works defined: <strong>`+(e['works'].length)+`</strong><br>
    full path: <strong>`+this.packs[w]['fullPath']+`</strong><br>`+*/
    // nO:<strong>`+w+`</strong>
    let lve =`<!-- lvElement start --><li>`;
    if( link != '' ){
      lve+=`<a href="#" onclick="`+link+`">`;
    }
    if( content['img'] != undefined )
      lve+= `<img src="`+content['img']+`">`;
    lve+=`<h2 class="`+( content['class'] != undefined ? content['class'] :'')+`">`+head+`</h2>`;
    lve+= `<p>`;
    if( typeof content == "string" ){
      lve+= content;

    }else{

      if( typeof content['content'] == "string" ){
        lve+= content['content'];

      }else{
        lve+= this.makeNiceList( content['content'] );

        if( content['tip'] != undefined && content['tip'] != '' ){
          lve+= `<p class="ui-li-aside ui-corner-all ui-body-b">`;
          if( typeof content['tip'] == "string" )
            lve+= content['tip'];
          else
            lve+= this.makeNiceList( content['tip'] );
          lve+= `</p>`;
        }

      }

    }
    lve+= `</p>`+
      ( link != '' ? `</a>` : '' )+
      `</li><!-- lvElement end -->`;

    return lve;
  }

  /**
  * @param {string|json} data - if {string} directly element in frame of list view
  * @namespace
  * @property {object} data - if {json} set up thinks in list view to build
  * @property {string} data.header  - sets header of list view
  * @property {string} data.headerTip - sets header tip / noti info
  * @property {string|array|json} data.items  - array of Objects `mApp.lvElement` to list view
  * @property {bool} data.searchOn [true=DefaultValue]
  * @returns {string} to put it for example as `$('#htmlDyno').html( returnStr )`;
  * @description Build in easy way list view customizable and fast touch freandly!
  */
  lvBuild( data ){
    // more easy name to fit
    return this.buildListView( data );
  }
  buildListView( data ){
    //cl("buildListView calld !!!");
    //cl(data);
    let lvtr = `<div class="ui-body ui-corner-all ui-body-a">
    <ul data-role="listview"`+
      ( data['searchOn'] != undefined && data['searchOn'] == false ? "" : `data-filter="true" data-filter-placeholder="Search ..."` )+
      `data-insert="true">
      <li data-role="list-divider">`+
        data['header']+
        `<span class="ui-li-count">`+
          data['headerTip']+
        `</span>
      </li>`;

    cl("lvBuild got items in typeof: ... ["+(typeof data['items'])+"]")
    for(let d=0,dc=data['items'].length;d<dc;d++)
      lvtr+= data['items'][d];

    lvtr+= `</ul></div>`;

    return lvtr;
  }

}
