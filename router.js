function route(handle, operation, a, b, resultat) {
	if (typeof handle[operation] === 'function') {
		handle[operation](
							a,
							b,
							function(error, res){
								if(error){
									resultat(error);
								} else{
									resultat(null, res);
								}
							}
				);
	} else {
		var error = {
					errorCode: 404,
					errorContent: {
									'Content-Type' : 'text/html'
					},
					errorDescription: '404 Not foud'	
		};
		resultat(error);
	}
}

exports.route = route;