function lcl( m ) {
	console.log("loader : ",m);
}

lcl("init ...");


import Hw2 from './Hw2.mjs'

lcl("Hw2 .... DONE");
lcl("Hw2 ....");lcl(Hw2 );
vM[ 'Hw2' ] = Hw2;

import OtHostStatus from './OtHostStatus.mjs'

lcl("OtHostStatus .... DONE");
lcl( OtHostStatus );
vM[ 'OtHostStatus' ] = OtHostStatus;

lcl("OtMy404 ... ");
import  OtMy404 from './My404.mjs'
vM['OtMy404'] = OtMy404;
/* to inject it use
vM.OtMy404.mount('#vDiv');
*/

import OtcVMVectorView from './OtcVMVectorView.mjs'
vM['OtcVMVectorView'] = OtcVMVectorView;

lcl("is end ----------------- so sum is ");
lcl(vM);
if(0){
	lcl("----------------------------------");
	lcl("----------------------------------");
	lcl("----------------------------------");
	lcl("----------------------------------");

	//import { VueLoaderPlugin } from '../libs/node_modules/vue-loader'


	lcl("----------------------------------");
	lcl("----------------------------------");
	lcl("----------------------------------");
	lcl("----------------------------------");
}
