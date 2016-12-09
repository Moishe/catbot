exports.handle = function(sender, pieces, storageFactory, callback, moduleName) {
	callback({'message': 'https://www.google.com Hello, <@' + sender + '>!'});
};