// OpenShift sample Node application
var http 	= require("http"),
	url 	= require("url"),
	qs 		= require("querystring");


var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1",
	port    = process.env.OPENSHIFT_INTERNAL_PORT || "8080";

function start(route, handle) {
	function onRequest(request, response) {
		var data = '',
			pathname = url.parse(request.url).pathname;
		
		if(request.method === 'POST'){
			request.on('data', function(chunk){
				data += chunk;
			});
			
			request.on('end', 
						function(){
							var dataObj = JSON.parse(data);
							
							var op1 = parseInt(dataObj.op1);
							var op2 = parseInt(dataObj.op2);
							//console.log("Request for " + pathname + " received. With operands "+op1+" and "+op2);
							
							route(
						    		handle,
						    		pathname, 
						    		op1,
						    		op2,
						    		function(resultat){
						    			response.writeHead(200, {});
						    			response.write(JSON.stringify(resultat));
					    			    response.end();
						    		},
						    		function(err){
						    			response.writeHead(err.errorCode, err.errorContent);
						    			response.write(JSON.stringify(err.errorDescription));
						    			response.end();
						    		});
						});
			
		} else if(request.method === 'GET'){
			var parsedUrl = url.parse(request.url);
			
			var op1 = parseInt(qs.parse(parsedUrl.query).op1);
			var op2 = parseInt(qs.parse(parsedUrl.query).op2);
			//console.log("Request for " + parsedUrl.pathname + " received.");
			
			route(
		    		handle,
		    		pathname, 
		    		op1,
		    		op2,
		    		function(resultat){
		    			response.writeHead(200, {});
		    			response.write(JSON.stringify(resultat));
	    			    response.end();
		    		},
		    		function(err){
		    			response.writeHead(err.errorCode, err.errorContent);
		    			response.write(JSON.stringify(err.errorDescription));
		    			response.end();
		    		});
		}

		
		/*request.on('error', function(e){
			console.log("Request Caught the error: "+e);
		});
		
		response.on('error', function(e){
			console.log("Response Caught the error: "+e);
		});*/
	}
	
	/*var servidor = */http.createServer(onRequest).listen(port,ipaddr);
	//console.log("server has started at: "+ipaddr+":"+port);
	
	/*servidor.on('error', function(e){
		console.log("Server Caught the error: "+e);
	});*/
}

exports.start = start;