exports.options = function() { 
	return {
		'storage': true,
		'privatestore': false,
	} 
}

exports.handle = function(pieces, properties) {
	var user = pieces[0];
	console.log("Giving another plus to " + user);

	var pluses = Number(storage.getItem(user));
	if (!pluses) {
		pluses = 0;
	}

	pluses += 1;

	localStorage.setItem(user, pluses);

	return "One more plus for " + user + "! " + user + " now has " + pluses + " pluses!";
}