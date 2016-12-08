exports.handle = function(sender, pieces) {
	return {'message': pieces.join(" ")}; 
}