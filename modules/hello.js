exports.handle = function(pieces, storageFactory, callback) {
	if (pieces.length){
		callback({'message': 'Hello ' + pieces[0]});
	}else{
		callback({'message': 'Hello world.'});
	}
}