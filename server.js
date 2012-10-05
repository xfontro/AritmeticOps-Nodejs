// Express sample aritmetic application.
var	url 	= require("url"),
	express = require("express"),
	operacionsAritmetiques = require("./operacionsAritmetiques");

var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1",
	port    = process.env.OPENSHIFT_INTERNAL_PORT || "8080";

var app = express(),
	handle = {};

handle["sumar"] = operacionsAritmetiques.sumar;
handle["restar"] = operacionsAritmetiques.restar;
handle["multiplicar"] = operacionsAritmetiques.multiplicar;
handle["dividir"] = operacionsAritmetiques.dividir;
handle["expensive"] = operacionsAritmetiques.arrel;

app.configure(function (){
	app.use(express.bodyParser());
});

app.post("/:operation", function(request, response, next){
	var op = handle[request.params.operation];

	if(typeof op === 'function'){
		op(	request.body.op1, 
			request.body.op2, 
			function(error, resultat){
	    			if(error){
	    				response.json(error.errorCode, { error: error.errorDescription });
	    			}else {
	    				response.json(200, {resultat: resultat});
	    			}
    		});
	}else{
		next();
	}
});

app.get("/:operation", function (request, response, next){
	var op = handle[request.params.operation];
	
	if(typeof op === 'function'){
		op( parseInt(request.param('op1')),
			parseInt(request.param('op2')),
			function(error, resultat){
				if(error){
					response.json(error.errorCode, { error: error.errorDescription });
				}else {
					response.json(200, {resultat: resultat});
				}
		});
	}else {
		next();
	}
});

app.all("/*", function (request, response){
	response.json(404, {error:'404 Not Found'});
});

app.listen(port,ipaddr);
console.log("Server has started at: "+ipaddr+":"+port);

