// OpenShift sample Node application
var http 	= require("http"),
	url 	= require("url"),
	qs 		= require("querystring");


var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1",
	port    = process.env.OPENSHIFT_INTERNAL_PORT || "8080";

function start(route, handle) {
	function onRequest(request, response) {
		var data = '',
			op1 = 0,
			op2 = 0,
			pathname = url.parse(request.url).pathname;
		
		if(request.method === 'POST'){
			request.on('data', function(chunk){
				data += chunk;
			});
			
			request.on('end', 
						function(){
							var dataObj = JSON.parse(data);
							
							op1 = parseInt(dataObj.op1);
							op2 = parseInt(dataObj.op2);
							//console.log("Request for " + pathname + " received.");
						});
			
		} else if(request.method === 'GET'){
			var parsedUrl = url.parse(request.url);
			
			op1 = parseInt(qs.parse(parsedUrl.query).op1);
			op2 = parseInt(qs.parse(parsedUrl.query).op2);
			//console.log("Request for " + parsedUrl.pathname + " received.");	
		}
		
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
		
		request.on("error",function(){
			console.log("Unhandled error!");
		});
	}
	http.createServer(onRequest).listen(port,ipaddr);
	console.log("server has started at: "+ipaddr+":"+port);
}

exports.start = start;