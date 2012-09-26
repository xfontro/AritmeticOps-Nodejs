var sumar = function (a, b, res){
	var result = a+b;
	console.log("Vull sumar "+a+" i "+b+".");
	res(result);
};

var restar = function (a, b, res) {
	var result = a-b;
	res(result);
};

var multiplicar = function (a, b, res) {
	var result = a*b;
	res(result);
};

var dividir = function (a, b, res){
	var result = a/b;
	res(result);
};

exports.sumar = sumar;
exports.restar = restar;
exports.multiplicar = multiplicar;
exports.dividir = dividir;