var sumar = function (a, b, res){
	var result = a + b;
	checkNumbersAndRespond(result, res);
};

var restar = function (a, b, res) {
	var result = a - b;
	checkNumbersAndRespond(result, res);
};

var multiplicar = function (a, b, res) {
	var result = a * b;
	checkNumbersAndRespond(result, res);
};

var dividir = function (a, b, res) {
	var result = a / b;
	checkNumbersAndRespond(result, res);
};

var arrel = function (a, b, res) {
	var result = 0;
	for (var i = 0;i < 1000;i++) {
		result += sqrt(a) * sqrt(b); 
	}
};

var checkNumbersAndRespond = function (result, res) {
	if (isNaN(result) || result === undefined) {
		var error = {
				errorCode: 400,
				errorContent: {
								'Content-Type' : 'text/html'
				},
				errorDescription: '400 Bad Request'
		};
		res(error);
	} else {
		res(null, result);
	}
};

exports.sumar = sumar;
exports.restar = restar;
exports.multiplicar = multiplicar;
exports.dividir = dividir;
exports.arrel = arrel;