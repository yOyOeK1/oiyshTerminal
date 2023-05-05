
class s_testVuePage{

  constructor(){
    this.iterCounter = 0;

    this.mCmd = new mDoCmd();



    cl('---------- making vue');
    this.vapp = Vue;

    this.vvaH = null;
    this.vvapp = this.vapp.createApp({
      data(){
        return {
          message: 'abc from vapp - vue!'
        }
      },
      created(){
        pager.getCurrentPage().vvaH = this
      },
      setNewMsg( m ){
        this.message = m;
      },
      methods:{
        onBtUp(){
          this.message = "click : "+(new Date());
        }
      }
    });

    //this.vvAbc = this.vapp.defineAsyncComponent(() =>
    //this.vvAbc = this.vapp.defineComponent(() => {
    //  import('./assets/Abc.vue');
    //  cl("import of .... Abc.vue ....");
    //});

    this.vvPageSelector = this.vapp.createApp({
      data(){
        return {
          pagSel: [
            {name:"One", file: "assets/p1.md"},
            {name:"Two", file: "assets/p0.md"},
          ]
        }
      },
      methods:{
        pageClikAt( page ){
          cl('click at !'); cl(page);
          pager.getCurrentPage().loadAssetPage( page.file );
        }
      },
      created(){
        pager.getCurrentPage().vvPageSelectorObj = this;
      }
    });

    this.vvPageView = this.vapp.createApp({
      data(){
        return {
          pageContent:'loading ...'
        }
      },
      created(){
        cl("vue. vvPageView - on created ....");
        pager.getCurrentPage().vvPageViewObj = this;
      },
    });

  }

  get getName(){
    return "test vue";

  }

  get getDefaultBackgroundColor(){
		return "#fafafa";
	}

  mdToHtml( mdStr ){
    //return marked.parse( mdStr );
    return marked( mdStr );
  }

  loadAssetPage( file ){
    cl('load asset page ... '+file);

    this.mCmd.otdmArgs(
      {'dfs':'/OT/ySS_calibration/sites/test_vue/'+file},
      (d,r)=>{
        //cl("got ls !!!");
        //cl(d);
        pager.getCurrentPage().vvPageViewObj.pageContent = pager.getCurrentPage().mdToHtml( d );
      }
    );

  }


  looperIter(){
      console.log("looperIter @ s_testVuePage ...");
      this.iterCounter++;

  }


  getHtml(){
    return `
Vue - test start <br>
<div id="vue1">
  {{ message }}
  <button @click="onBtUp()">click me!</button>
</div>
Abc import <div id="vvforabc"></div> import done
test END <br>

<hr>
<b>From loader as module</b>
<button onclick="vM.Hw2.Hw2_app.mount('#vhw2')" >mount</button>
<button onclick="vM.Hw2_this.greeting=(new Date())" >change</button>

<div id="vhw2">
  <b>Children</b><br>
  <Hw2t :msg="greeting"></Hw2t><br>
  <b>Rest</b><br>
for vue module ....</div>

<hr>
<div id="vvpagsel">
  <ul>
    <li v-for="page in pagSel">
      <a href="#" @click="pageClikAt(page)">
        {{ page.name }} - {{ page.file }}
      </a>
    </li>
  </ul>
</div>
<div id="vvpageview" >
  <span v-html="pageContent"></span>
</div>
    `;
  }


  getHtmlAfterLoad(){
    cl("is vue test ?");
    cl( $('#vue1').html() );
    this.vvapp.mount("#vue1");
    this.vvPageSelector.mount("#vvpagsel");
    this.vvPageView.mount("#vvpageview");
    this.loadAssetPage( this.vvPageSelectorObj.pagSel[0].file );
    //this.vvAbc.mount("#vvforabc");
    cl('--------------------------------------------');

    $("#divForVM").append('<div id="oths"style="z-index:12;position:absolute;top:20px;left:200px; background-color:#fdddfd; border:1px solid yellow;color:white; font-size:small;"></div>');
    vM.OtHostStatus.OtHostStatus_app.mount("#oths");



  }

  get svgDyno(){
    //return s_testFuncs;
  }




  svgDynoAfterLoad(){

  }



  onMessageCallBack( r ){
    console.log("s_blankPage got msg ");

  }



}
