function route(handle, operation, a, b, resultat, err) {
	if (typeof handle[operation] === 'function') {
		
		handle[operation](
							a,
							b,
							function(res){
								if(isNaN(res)){
									var error = {
											errorCode: 400,
											errorContent: {
															'Content-Type' : 'text/html'
											},
											errorDescription: '400 Bad Request'
									};
									err(error);
								} else{
									resultat({"resultat" : res});
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
		err(error);
		
	}
}

exports.route = route;