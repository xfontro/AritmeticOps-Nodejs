// OpenShift sample Node application
var http 	= require("http"),
	url 	= require("url"),
	qs 		= require("querystring");


var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1",
	port    = process.env.OPENSHIFT_INTERNAL_PORT || "8080";

function start(route, handle) {
	function onRequest(request, response) {
		var data = '';
		
		if(request.method === 'POST'){
			request.on('data', function(chunk){
				data += chunk;
			});
			
			request.on('end', 
						function(){
							var dataObj = JSON.parse(data),
								pathname = url.parse(request.url).pathname;
							console.log("Request for " + pathname + " received.");
						    
							route(
						    		handle,
						    		pathname, 
						    		dataObj.op1,
						    		dataObj.op2,
						    		function(head, resultat){
						    			response.writeHead(head.code, head.content);
						    			response.write(JSON.stringify(resultat));
					    			    response.end();
						    		}); 
						});
		} else if(request.method === 'GET'){
			var parsedUrl = url.parse(request.url);
				op1 = parseInt(qs.parse(parsedUrl.query).op1);
				op2 = parseInt(qs.parse(parsedUrl.query).op2);
			console.log("Request for " + parsedUrl.pathname + " received.");	
			
			route(
					handle,
					parsedUrl.pathname,
					op1,
					op2,
		    		function(head, resultat){
						response.writeHead(head.code, head.content);
		    			response.write(JSON.stringify(resultat));
	    			    response.end();
		    		});
		} 
	}
	http.createServer(onRequest).listen(port,ipaddr);
	console.log("server has started at: "+ipaddr+":"+port);
}

exports.start = start;