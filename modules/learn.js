exports.handle = function(sender, pieces, storageFactory, callback, moduleName) {
	item = pieces[0];
	fact = pieces.slice(1).join(' ');

	if (!item || !fact || item.length === 0 || fact.length === 0){
		callback({'message': "Sorry, I can't learn nothing!"});
		return;
	}
	// write the thing to the global table
	storage = storageFactory.getGlobalStorage('learnings');

	if (fact[0] == '<' && fact[fact.length - 1] == '>'){
		fact = fact.substr(1, fact.length - 2);
	}

	storage.getItem(item, function(learnings){
	    learnings = JSON.parse(learnings || '{}');

	    if (Object.keys(learnings).length === 0){
	        callback({'message': "Cool, that's the first thing I've learned about " + item});
	    }else if (!learnings[fact]) {
	        callback({'message': 'Okay, learned something else about ' + item});
	    }else{
			callback({'message': "Hmm, <@" + learnings[fact] + "> already taught me that!"});
			return;
	    }

		learnings[fact] = sender;
		storage.setItem(item, JSON.stringify(learnings));
	});
};