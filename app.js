// Express sample aritmetic application.
var	express = require("express"),
	operacionsAritmetiques = require("./operacionsAritmetiques");

var port = process.env.OPENSHIFT_INTERNAL_PORT || process.env.VMC_APP_PORT || "8080",
	app = express(),
	handle = {};

app.configure(function (){
	app.use(express.bodyParser());
});

// Handlers for POST.
app.post("/sumar", function(request, response){operacionsAritmetiques.sumar(request.body.op1, request.body.op2, function(error, resultat){
					if(error){
						response.json(error.errorCode, { error: error.errorDescription });
					}else {
						response.json(200, {resultat: resultat});
					}
});});

app.post("/restar", function(request, response){operacionsAritmetiques.restar(request.body.op1, request.body.op2, function(error, resultat){
					if(error){
						response.json(error.errorCode, { error: error.errorDescription });
					}else {
						response.json(200, {resultat: resultat});
					}
});});

app.post("/multiplicar", function(request, response){operacionsAritmetiques.multiplicar(request.body.op1, request.body.op2, function(error, resultat){
					if(error){
						response.json(error.errorCode, { error: error.errorDescription });
					}else {
						response.json(200, {resultat: resultat});
					}
});});

app.post("/dividir", function(request, response){operacionsAritmetiques.dividir(request.body.op1, request.body.op2, function(error, resultat){
					if(error){
						response.json(error.errorCode, { error: error.errorDescription });
					}else {
						response.json(200, {resultat: resultat});
					}
});});

// Handlers for GET
app.get("/:operation", function (request, response, next){
	var op;
	
	if(request.params.operation == "sumar"){
		op = operacionsAritmetiques.sumar;
	}else if(request.params.operation == "restar"){
		op = operacionsAritmetiques.restar;
	}else if(request.params.operation == "multiplicar"){
		op = operacionsAritmetiques.multiplicar;
	}else if(request.params.operation == "dividir"){
		op = operacionsAritmetiques.dividir;
	}else{
		op = undefined;
	}
	
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

// Default handler
app.all("/*", function (request, response){
	response.json(404, {error:'404 Not Found'});
});

app.listen(port);
console.log("Server has started at port: "+port);