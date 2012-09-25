// #!/bin/env node
//  OpenShift sample Node application

var http 	= require("http"),
	url 	= require("url"),
	qs 		= require("querystring"),
	fs      = require('fs'),
	express = require('express'),
	router 	= require("./router"),
	operacionsAritmetiques = require("./operacionsAritmetiques"),
	handle 	= {};

handle["/sumar"] = operacionsAritmetiques.sumar;
handle["/restar"] = operacionsAritmetiques.restar;
handle["/multiplicar"] = operacionsAritmetiques.multiplicar;
handle["/dividir"] = operacionsAritmetiques.dividir;

start(router.route, handle);

//  Local cache for static content [fixed and loaded at startup]
var zcache = { 'index.html': '' };
zcache['index.html'] = fs.readFileSync('./index.html'); //  Cache index.html

// Create "express" server.
//var app  = express.createServer();


/*  =====================================================================  */
/*  Setup route handlers.  */
/*  =====================================================================  */

// Handler for GET /health
/*app.get('/health', function(req, res){
    res.send('1');
});

// Handler for GET /asciimo
app.get('/asciimo', function(req, res){
    var link="https://a248.e.akamai.net/assets.github.com/img/d84f00f173afcf3bc81b4fad855e39838b23d8ff/687474703a2f2f696d6775722e636f6d2f6b6d626a422e706e67";
    res.send("<html><body><img src='" + link + "'></body></html>");
});

// Handler for GET /
app.get('/', function(req, res){
    res.send(zcache['index.html'], {'Content-Type': 'text/html'});
});*/


//  Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP;
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

if (typeof ipaddr === "undefined") {
   console.warn('No OPENSHIFT_INTERNAL_IP environment variable');
}

//  terminator === the termination handler.
function terminator(sig) {
   if (typeof sig === "string") {
      console.log('%s: Received %s - terminating Node server ...',
                  Date(Date.now()), sig);
      process.exit(1);
   }
   console.log('%s: Node server stopped.', Date(Date.now()) );
}

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

	http.createServer(onRequest);
	//console.log("Server has started at: localhost:5858");
}

exports.start = start;

//  Process on exit and signals.
process.on('exit', function() { terminator(); });

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
});

//  And start the app on that interface (and port).
http.listen(port, ipaddr, function() {
   console.log('%s: Node server started on %s:%d ...', Date(Date.now() ),
               ipaddr, port);
});