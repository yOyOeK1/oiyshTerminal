function otcl( m ) {
	console.log("otHS : ",m);
}

otcl("init ...");

otcl("template / components ... DONE");

const OtHostStatus_app = Vue.createApp({
	template: `<p :style="{ color }" >http://{{ host }}:{{ port }}<br>
	 	status( {{ status }} ) / {{ running }} / ({{ iterNo }}) </p>
		<button @click="startIt()" v-if="!running">start</button>
		<button @click="stopIt()"  v-if="running">stop</button>`,
	data(){
		return {
			host: '192.168.43.-',
			port: '1990-',
			status: 'NaN',
			running: false,
			iterNo: 0,
			_intervalsEvery: 1, // sec,
		};
	},
	setup() {
		const toInterval = -1;
		const color = Vue.ref('black')
		return { toInterval, color }
	},
	created(){
		vM['OtHostStatus_this'] = this;
		this.host = mott._ip;
		this.port = mott._port;
	},
	methods:{
		startIt(){
			this.running = true;
			this.toInterval = setInterval(()=>{
				otcl("loop ....");
				this.iterNo++;

				mott.sapiJ('ping/.json',(d)=>{
					//cl("got data !");cl(d);
					if( d.code == 200 ){
						this.status = "ok";
						this.color = 'green';
					}else{
						this.status = "t.o.";
						this.color = 'red';
					}
				});

			}, parseInt(this._intervalsEvery * 1000) );
		},
		stopIt(){
			this.running = false;
			clearInterval( this.toInterval )
		},
		getRunningStatus(){ return this.running; }
	}
});

otcl("OtHostStatus_app ... DONE");

export default { OtHostStatus_app }
