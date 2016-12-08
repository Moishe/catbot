exports.handle = function(sender, pieces, storageFactory, callback) {
	if (pieces.length){
		userStorage = storageFactory.getUserStorage(pieces[0]);
		userString = pieces[0];
	}else{
		userStorage = storageFactory.getUserStorage(sender);
		userString = "<@" + sender + ">";
	}

	userStorage.getItem('pluses', function(pluses){
		if (!pluses){
			message = "Alas, " + userString + " has no pluses. You should give them some!";
		}else{
			message = userString + " has " + pluses + " pluses!";
		}

		callback({'message': message});
	});
}