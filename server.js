// Express sample aritmetic application.
var	url 	= require("url"),
	express = require("express");


var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1",
	port    = process.env.OPENSHIFT_INTERNAL_PORT || "8080";

function start(route, handle) {
	var app = express();
	app.use(express.bodyParser());
	app.post('/*', function(request, response, next){
		var pathname = request.path;
		
		route(
	    		handle,
	    		pathname,
	    		request.body.op1,
	    		request.body.op2,
	    		function(error, resultat){
	    			if(error){
	    				response.json(error.errorCode, { error: error.errorDescription });
	    			}else {
	    				response.json(200, {resultat: resultat});
	    			}
    		});
	});
	
	app.get('/*', function(request,response){
		var pathname = request.path;
		
		route(
	    		handle,
	    		pathname, 
	    		parseInt(request.param('op1')),
	    		parseInt(request.param('op2')),
	    		function(error, resultat){
	    			if(error){
	    				response.json(error.errorCode, { error: error.errorDescription });
	    			}else {
	    				response.json(200, {resultat: resultat});
	    			}
    		});
	});
	
	app.listen(port,ipaddr);
	
	console.log("Server has started at: "+ipaddr+":"+port);
	
}

exports.start = start;

