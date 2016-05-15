exports.handle = function(pieces, userStorage, moduleStorage, commonStorage) {
	var user = pieces[0];
	console.log("Giving another plus to " + user);

	var pluses = Number(userStorage.getItem('pluses'));
	if (!pluses) {
		pluses = 0;
	}

	pluses += 1;

	userStorage.setItem('pluses', pluses);

	return {
		'message': "One more plus for " + user + "! " + user + " now has " + pluses + " pluses!"
	}
}