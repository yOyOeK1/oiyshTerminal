
function mt2(){
    console.log('mt2 request ...');
    return 'test 2';
};

export const abc = 'var abc';

export function mt2export(){
    console.log('mt2export request ...');
    return 'test 2export';
};

var itSelf = self;
var it = this;



export { mt2, it, itSelf };