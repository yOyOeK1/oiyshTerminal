module.exports = function(RED) {
    function yHelloWorld(config) {
    
    	console.log( 'yHelloWorld init ...' );
    
        RED.nodes.createNode(this,config);
        var node = this;
        node.status({text:"is ready ..."+config.name});
        node.on('input', function(msg) {
            node.send([
            	null,
            	{
            		topic: 'org payload',
            		topic: msg.payload
            	},
            	{
            		topic: 'tn',
            		payload: new Date().getTime()
            	}            
            ]);
            
            msg.payload = "yhello, " + msg.payload+ "!";            
            node.send([msg, null,null]);
            node.status({text:"sind"});
            
            setTimeout(()=>{ node.status({text:"is ready ...2"}); },500);
        
        });
    }
    RED.nodes.registerType("yhello", yHelloWorld);
}
