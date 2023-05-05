function lcl( m ) {
	console.log("loader : ",m);
}

lcl("init ...");


import Hw2 from './Hw2.mjs'

lcl("Hw2 .... DONE");
lcl( Hw2 );
vM[ 'Hw2' ] = Hw2;

import OtHostStatus from './OtHostStatus.mjs'

lcl("OtHostStatus .... DONE");
lcl( OtHostStatus );
vM[ 'OtHostStatus' ] = OtHostStatus;
