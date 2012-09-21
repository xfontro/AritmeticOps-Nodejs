function route(handle, operation, a, b, responseGetter) {
	if (typeof handle[operation] === 'function') {
		var resultat = 0; 
		handle[operation](
							a,
							b,
							function(res){
								resultat = res;
							}
				);
		var head = {
					code: 200,
					content: {}
		};
		
		responseGetter(head,{"resultat": resultat});
	    
		/*response.write(
	    	JSON.stringify({ 
					"resultat": resultat 
				}));
	    response.end();*/
	    
	} else {
		console.log('No request handler found for ' + operation);
		var head = {
					code: 404,
					content: {
									'Content-Type' : 'text/html'
					}
		};
		responseGetter(head,'404 Not found');
		
		/*response.writeHead(404, {'Content-Type': 'text/html'});
		response.write('404 Not found');
		response.end();*/
	}
}

exports.route = route;