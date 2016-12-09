exports.handle = function(sender, pieces, storageFactory, callback) {
	var endorsement_to_find = pieces.shift();

	var userStorage = storageFactory.getUserStorage(sender);
	userStorage.getAllItemsByKey('endorsements', function(endorsements){
		if (!endorsements){
			callback({'message': '/shrug Nobody has been endorsed for anything!'});
			return;
		}

		console.log('result stringified: ' + JSON.stringify(endorsements));
		console.log('elements: ' + endorsements.length);

		var endorsees = [];
		for (var i = 0; i < endorsements.length; i++){
			var user = endorsements[i]['id'];
			console.log('user: ' + user);
			console.log('endorsements: ' + JSON.stringify(endorsements[i]));

			var user_endorsements = JSON.parse(endorsements[i]['data_value'] || '{}');

			if (user_endorsements[endorsement_to_find]){
				console.log(endorsement_to_find + '?' + user_endorsements[endorsement_to_find]);
				endorsees.push(user);
			}

		}

		if (endorsees.length > 0){
			callback({
				'message': 'The following people have been endorsed for ' + endorsement_to_find + ': ' + endorsees.join(', ')
			});			
		}else{
			callback({
				'message': 'Nobody has been endorsed for ' + endorsement_to_find + ' :('
			});
		}
	});
};