
export default Vue.createApp({
  template: `<h3>vM current: {{msg}}</h3>
    <div v-for="vMi in vMvector">
      - {{vMi}}
    </div>`,

  data(){
    let vM;
    return {
      vMvector:vM,
      msg:"hello from data"
    }
  },
  created(){
		vM['OtcVMVectorView_this'] = this;
	},
  methods:{
    setVector(nV){
      this.vMvector = nV;
      console.log("got new vector")
    }
  }
});
