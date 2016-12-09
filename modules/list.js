exports.handle = function(sender, pieces, storageFactory, callback, moduleName) {
	if (!pieces[0]){
		callback({'message': "Sorry, I don't know anything about nothing!"});
		return;
	}
	// read the thing from the global table
	storage = storageFactory.getGlobalStorage('learnings');
	item = pieces[0];
	fact = pieces.slice(1).join(' ');

	storage.getItem(item, function(learnings){
	    learnings = JSON.parse(learnings || '{}');

		if (!Object.keys(learnings).length){
			callback({'message': "Alas, I know nothing about " + item + ". You should teach me with ?learn"});
		}else{
			// TODO: include teachers in the learnings (the value in the array is the teachers)
			callback({'message': "Here's what I know about " + item + "\n  - " + Object.keys(learnings).join("\n  - ")});
		}
	});
}