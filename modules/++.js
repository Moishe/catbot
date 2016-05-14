exports.handle = function(pieces, userData, globalData) {
	var user = pieces[0];
	console.log("Giving another plus to " + user);

	var pluses = Number(userData['pluses']);
	if (!pluses) {
		pluses = 0;
	}

	pluses += 1;

	return {
		'message': "One more plus for " + user + "! " + user + " now has " + pluses + " pluses!",
		'userData': userData
	}
}