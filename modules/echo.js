exports.handle = function(pieces) { 
	pieces.shift();
	return pieces.join(" "); 
}