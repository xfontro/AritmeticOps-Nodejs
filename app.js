// Express sample aritmetic application.
var	url 	= require("url"),
	express = require("express"),
	operacionsAritmetiques = require("./operacionsAritmetiques"),
	args = require("commander"),
	cluster = require("cluster");

var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "192.168.7.163",
		port    = process.env.OPENSHIFT_INTERNAL_PORT ;//|| "8080";

var app = express(),
	handle = {};

args
	.version('0.1')
	//.option('-p, --port [number]', 'client port', 8080)
	.option('-f, --folder [folderpath]', 'root folder path', './' )
	.option('-c, --cluster', 'cluster of processes')
	.parse(process.argv);

/*if(cluster.isMaster) {
	//console.log('Binding to port ', args.port);
	console.log('Folder path: ', args.folder);
	console.log('Processor: ' + require('os').cpus()[0].model);

	if(args.cluster) {
		console.log('Cluster: ' + args.cluster);
		require('os').cpus().forEach(function (item) {
			cluster.fork();
		});
	} else {
		console.log('Cluster: no cluster');
		cluster.fork();
	}
} else {*/
			
	app.configure(function (){
		app.use(express.bodyParser());
	});

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

	app.listen(port,ipaddr);//args.port,ipaddr);
	console.log("Server has started at: "+ipaddr+":"+port);
//}
