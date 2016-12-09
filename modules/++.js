exports.handle = function(sender, pieces, storageFactory, callback) {
	var user = pieces[0];
	console.log("Giving another plus to " + user);

	var m = user.match(/<@([UW][A-Z0-9]+)/)
	if (m){
		user = m[1];
	}

	if (user == sender){
		callback({'message': "Hey now, you can't plus yourself!"});
		return;
	}

	var userStorage = storageFactory.getUserStorage(user);
	userStorage.getItem('pluses', function(pluses){
		if (!pluses) {
			pluses = 0;
		}

		pluses = parseInt(pluses);

		pluses += 1;

		userStorage.setItem('pluses', pluses);

		callback({
			'message': "One more plus for " + user + "! " + user + " now has " + pluses + " pluses!"
		});
	});
}