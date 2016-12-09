exports.handle = function(sender, pieces, storageFactory, callback, moduleName) {
	callback({'message': 'Hello, <@' + sender + '>!'});
};