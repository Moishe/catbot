exports.handle = function(pieces, userStorage, moduleStorage, commonStorage, callback) {
	var user = pieces[0];
	console.log("Giving another plus to " + user);

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