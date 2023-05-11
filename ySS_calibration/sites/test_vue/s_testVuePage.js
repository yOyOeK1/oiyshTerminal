
let cc = new otCl("OTCL - vueLoad");
cl = function(){cc.doClFromArgs( arguments );  };
cl("hello");
cl("hello1",1,true);
cc.doCl("hello");
cc.doCl("hello1",1,true);

var vComs = {};

class vueOT{

	constructor(){
		let cc = new otCl("vueOT");
		this.cl = function(){cc.doClFromArgs( arguments );  };
		this.callBack = -1;
	}

	load( fPath, callBackOnDone ){

		this.cl("load",fPath);
		this.callBack = callBackOnDone;
		let mC = new mDoCmd();

		let nTmp = fPath.split("/");
		let loadName= nTmp[ nTmp.length-1 ].split(".")[0];
		this.cl("extract ","loadName",loadName);

		mC.otdmArgs(
	    {'dfs':`/home/yoyo/Apps/oiyshTerminal/ySS_calibration/sites/test_vue/${fPath}`},
	    (d,r)=>{
	      //this.cl("got ls !!!");
	      //this.cl(d);
	      this.cl(`dfs`, "DONE","path", fPath);
	      let otO = this.vueSplit(loadName, d);
	      //cp.vvPageViewObj.pageContent = cp.mdToHtml( d );
	    }
	  )
	}

	vueSplit( name, vueRaw ){
		let tr = {
			'name': name,
			'o': -1,
			'script': '',
			'template': '',
			'style': ''
		};


		this.cl("looking for template ...");
		let tTmp = vueRaw.split("<template>");
		tTmp = tTmp[1].split("</template>");
		if( tTmp.length == 2 ){
			this.cl("have IT!", tTmp[0]);
			tr['template'] = tTmp[0];
		}else{
			this.cl("don't have IT");
		}





	  this.cl("looking for style ...");
	  let cTmp = vueRaw.split("<style scoped>");
		if( cTmp.length == 1 ){
				this.cl('no style at all!')
		}else{
		  cTmp = cTmp[1].split("</style>");
		  if( cTmp.length == 2 ){
		    this.cl("have IT!", cTmp[0]);
				tr['style'] = cTmp[0];
		  }else{
		  	this.cl("don't have IT");
		  }
		}


		this.cl("looking for script ...");
		let sTmp = vueRaw.split("<script setup>");
		if( sTmp.length == 1 ){
			sTmp = vueRaw.split("<script>");
		}
		if( sTmp.length == 1 ){

			this.cl("Error have no <script> in file ....");
			let caStr = JSON.stringify({
				'template': tr['template']
			});


			let eInit = `function ${name}(){ Vue.createApp(${caStr});}`;
			sTmp = [
				eInit,
				sTmp[0]
			];

			this.cl("so new fake data is ....",sTmp);

			//return 0;
		}else{
			sTmp = sTmp[1].split("</script>");
		}
		if( sTmp.length > 1){
			this.cl('have IT!', sTmp[0]);
			let te = sTmp[0]+";\n";
			var o = -1;
			te+= `o = ${name};`;
			this.cl("so eval ...",te);
			eval(te);
			this.cl("o ...vue ?",o);

			tr['o'] = o;
			tr['script'] = sTmp[0];

		}else{
			this.cl("don't have IT");
		}



		this.cl("returning","---------------------",tr,"-----------------------------");
		//this.callBack( tr );

		this.cl("vComs","set","name",name)
		vComs[ name ] = tr;
		this.cl("cunnert","vComs","is",vComs);

		let vohw = tr['o']();
		setTimeout(()=>{
			$("#vDiv").html(`<div id="${name}">${tr['template']}</div>`);

			vohw.mount(`#${name}`);

		},1000);

	}

}






class s_testVuePage{

  constructor(){
    this.iterCounter = 0;

		let cc = new otCl(`${this.getName}`);
		this.cl = function(){cc.doClFromArgs( arguments );  };

    this.mCmd = new mDoCmd();


		let ccv = new otCl(`VUE`);
		let cv = function(){ccv.doClFromArgs( arguments );  };

		cv("make new uveOT() ...");
		let vueL = new vueOT();
		cv("starting load ...");
		let vRaw = vueL.load(`assets/OtcHello.vue`);
		//let vRaw = vueL.load(`assets/HelloWorld.vue`);
		//let vRaw = vueL.load(`assets/OtvNotFound.vue`);

		cv("load DONE","res:", vRaw);


    //cl(" load OtcFastDo -----------------------");
    //let vRaw2 = vueLoad(`assets/OtcFastDo.vue`, vueSplit);
    //cl(" load OtcFastDo ----------------------- DONE");


    this.cl('---------- making vue');
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
		this.cl("log for","VUE","vvapp","mountable",this.vvapp);

		this.vvaHello_obj = null;
		this.vvaHello = this.vapp.createApp({
			data(){
    		let cc = new otCl('vvaHello');
				const cl = function(){cc.doClFromArgs( arguments );  };
        return {
          'cl' : cl
        }
			},
			'template': `<div>He<b>ll</b>o vvaHello</div>`,
			created(){
				this.cl("created","VUE");
				pager.getCurrentPage().vvaHello_obj = this;
			}
		});

    //this.vvAbc = this.vapp.defineAsyncComponent(() =>
    //this.vvAbc = this.vapp.defineComponent(() => {
    //  import('./assets/Abc.vue');
    //  cl("import of .... Abc.vue ....");
    //});

    this.vvPageSelector = this.vapp.createApp({
    	data(){
    		let cc = new otCl('vvPageSelector');
				const cl = function(){cc.doClFromArgs( arguments );  };


        return {
          pagSel: [
            {name:"One", file: "assets/p1.md"},
            {name:"Two", file: "assets/p0.md"},
            {name:"About otplc", file: "../otplc/README.md"},
            {name:"About otv3", file: "../../../otv3/README.md"},
          ],
          'cl' : cl
        }
      },
      methods:{
        pageClikAt( page ){
          this.cl('click at !'); cl(page);
          let cp = pager.getCurrentPage();
          //pager.getCurrentPage().loadAssetPage( page.file );
          let mC = new mDoCmd();
          mC.otdmArgs(
            {'dfs':`/OT/ySS_calibration/sites/test_vue/${page.file}`},
            (d,r)=>{
              //this.cl("got ls !!!");
              //this.cl(d);
              cp.vvPageViewObj.pageContent = cp.mdToHtml( d );
            }
          );
        }
      },
      created(){
        pager.getCurrentPage().vvPageSelectorObj = this;
      }
    });

    this.vvPageView = this.vapp.createApp({
      data(){
      	let cc = new otCl('vvPageView');
				const cl = function(){cc.doClFromArgs( arguments );  };

        return {
          pageContent:'loading ...',
          'cl':cl
        }
      },
      created(){
        this.cl("vue. vvPageView - on created ....");
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

	// load .md al html asset :)
  loadAssetPage( file ){
    this.cl('load asset page ... '+file);

    this.mCmd.otdmArgs(
      {'dfs':'/OT/ySS_calibration/sites/test_vue/'+file},
      (d,r)=>{
        //this.cl("got ls !!!");
        //this.cl(d);
        pager.getCurrentPage().vvPageViewObj.pageContent = pager.getCurrentPage().mdToHtml( d );
      }
    );

  }


  looperIter(){
      //console.log(`looperIter @ ${this.getName} ...`);
      this.iterCounter++;

  }


  getHtml(){
    return `
<h2>vue injection area start </h2>
vHello:
<div id="vHello"></div>
OtcHello.vue:
<div id="otchello"></div>
vDiv:
<div id="vDiv"></div>
<h2>vue injection area end </h2>
<hr>

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
    this.cl("is vue test ?");
    this.cl( $('#vue1').html() );
    this.vvapp.mount("#vue1");
    this.vvPageSelector.mount("#vvpagsel");
    this.vvPageView.mount("#vvpageview");
    this.loadAssetPage( this.vvPageSelectorObj.pagSel[0].file );
    //this.vvAbc.mount("#vvforabc");
    this.cl('--------------------------------------------');

    $("#divForVM").append('<div id="oths"style="z-index:12;position:absolute;top:20px;left:200px; background-color:#fdddfd; border:1px solid yellow;color:white; font-size:small;"></div>');
    vM.OtHostStatus.OtHostStatus_app.mount("#oths");

		this.vvaHello.mount("#vHello");



  }

  get svgDyno(){
    //return s_testFuncs;
  }




  svgDynoAfterLoad(){

  }



  onMessageCallBack( r ){
    //console.log(`${this.getName} got msg `);

  }z



}
