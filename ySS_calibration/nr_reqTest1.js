
// test of web page / node red file compatibility

class mutil2{

	pim = 1;

	add(a,b){
		return a+b+11;
	}

	addPim(){
		this.pim++;
	}

	getPim(){
		return this.pim;
	}
}
module.exports = mutil2
