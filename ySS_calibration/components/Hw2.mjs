function mcl( m ) {
	console.log("Hw2 : ",m);
}

mcl("init ...");

import Hw2t from './Hw2_t.mjs'

mcl("template / components ... DONE");

const Hw2_app = Vue.createApp({
	components: {
		Hw2t
	},
	//data(){
	//	return { msg2: 'abc from Hw2.mjs'};
	//},
	created(){
		vM['Hw2_this'] = this;
	},
	setup() {
    const greeting = Vue.ref('Hello from parent')

    return {
      greeting
    }
  }

});

mcl("Hw2_app ... DONE");

export default { Hw2_app }
