var sumar = function (a, b, res){
	var result = a+b;
	checkNumbersAndRespond(result, res);
};

var restar = function (a, b, res) {
	var result = a-b;
	checkNumbersAndRespond(result, res);
};

var multiplicar = function (a, b, res) {
	var result = a*b;
	checkNumbersAndRespond(result, res);
};

var dividir = function (a, b, res){
	var result = a/b;
	checkNumbersAndRespond(result, res);
};

var checkNumbersAndRespond = function (result, res){
	if(isNaN(result)){
		res(new Error("Not a number!"));
	} else{
		res(null, result);
	}
};

exports.sumar = sumar;
exports.restar = restar;
exports.multiplicar = multiplicar;
exports.dividir = dividir;