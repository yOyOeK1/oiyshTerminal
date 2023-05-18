<script>
//import {OTGet,OTJ} from '../OTGet.js'


export default{
    props:{
      'titleit': { type: String, required: true},
      'sapi': { type: String, required: true},
      'host': { type: String, required: true },
      'port': { type: String, required: true },
      'useprot': { type: String, required: true }
    },
    data(){ return {
      status: "NaN",
      tSend: 0,
      tDelay: 0,
      lastRes: "",
      lastInfos: [],
      lastResShow: false,
      niceUrl: this.useprot+'://'+this.host+':'+this.port,


    }},
    methods:{
      pingIt(){
        console.log( "pingIt ! - click !",
          this.useprot+'://'+this.host+':'+this.port
        );
        this.status = this.sapi+" ...";
        this.tSend = new Date().getTime();
        console.log("otj ",
          OTJ(this.sapi, this.onPong)
          );

      },
      onPong( d ){
        let tn = new Date().getTime();
        this.tDelay = tn-this.tSend;

        this.status = "got in ("+this.tDelay+" ms.)"
        this.lastInfos = [ new Date(), this.status, "sapi: "+this.sapi ]
        console.log('on'+this.sapi+'....',d,"delay",this.tDelay,"ms.")
        console.log(d)
        if( d != -1 ){
          this.lastRes = d.msg
          this.lastResShow = true;
        }else{
          this.lastRes = d
          this.lastResShow = true;
        }
      }
    }

}

</script>

<template>
  <table>
    <tr>
      <td>
      <button :title="[niceUrl]">[ i ]</button>
      </td>
      <td>
        <h3>{{titleit}}</h3>
      </td>
    </tr>
  </table>

  <p></p>
  <!--<p>sapi: <strong>{{sapi}}</strong></p>-->
  <button @click="pingIt" :title="[niceUrl]">sapi: {{sapi}}</button> status: <b>{{status}}</b>
  <div v-if="lastResShow">
    <div class="otF otSmall">
      <p v-for="lastInfo in lastInfos">{{ lastInfo }}</p>
    </div>
    <pre class="otF otSmall">{{lastRes}}</pre>
    <button @click="lastResShow = false">close log</button>
  </div>

</template>

<style scoped>
.otF{
  border:solid 1px gray;
  background-color: #dfdfdf;
  margin-top: 2px;
  padding:2px;
}
.otSmall{
  font-size:x-small;

}


</style>
