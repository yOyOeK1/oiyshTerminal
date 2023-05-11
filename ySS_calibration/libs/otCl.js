

// --------- ot - Cl console log


/*
	// to init your instance with prefix
	let cc = new otCl("OTCL - vueLoad");
	cl = function(){cc.doClFromArgs( arguments );  };
	cl("hello");
	cl("hello1",1,true);


*/

class otCl{
	constructor( instName = "" ){
		this.instName = "-";
		this.dumpIt = false;

		if ( instName != "" ) {
			this.instName = instName;
		}


		let dumpTopics = {
			'sPager': true,
			'mApp': true,
			'mDoCmd': true,
			'test vue': true,
		};

		let dIt =  dumpTopics[ this.instName ]||false;
		this.dumpIt = dIt;

		this.doCl(` otCl [${this.instName}:]: init ... logger dump to null:`,dIt);
	}



	getCl(){
		return this.doCl;
	}

	doClFromArgs( argsRaw ){
		this.doCl( argsToArr( argsRaw ) );
	}

	doCl(){
		if( this.dumpIt )
			return 0;
		//console.log(arguments);
		//console.log(arguments.length);
		var tr = argsToArr( arguments );
		//console.log(tr);
		//console.log(this);
		if( tr.length == 1 )
			console.log( this.instName+":", tr[0] );
		else
			console.log( this.instName+":",tr );
	}

}

// --------- ot - Cl console log



function argsToArr( argsIn ){
	var tr = [];
	for ( let i=0,ic=argsIn.length; i<ic; i++ ) {
		tr.push(argsIn[i]);
	}
	return tr;
}
