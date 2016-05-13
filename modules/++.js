exports.needsStorage = function() { return true; }

exports.handle = function(pieces, localStorage) {
	var user = pieces[0];
	console.log("Giving another plus to " + user);

	var pluses = Number(localStorage.getItem(user));
	if (!pluses) {
		pluses = 0;
	}

	pluses += 1;

	localStorage.setItem(user, pluses);

	return "One more plus for " + user + "! " + user + " now has " + pluses + " pluses!";
}