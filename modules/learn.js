exports.handle = function(sender, pieces, storageFactory, callback, moduleName) {
	if (!pieces[0]){
		callback({'message': "Sorry, I can't learn nothing!"});
		return;
	}
	// write the thing to the global table
	storage = storageFactory.getGlobalStorage('learnings');
	item = pieces[0];
	fact = pieces.slice(1).join(' ');

	storage.getItem(item, function(learnings){
	    learnings = JSON.parse(learnings || '{}');

	    console.log("got learnings: " + JSON.stringify(learnings));

	    if (Object.keys(learnings).length == 0){
	        callback({'message': "Cool, that's the first thing I've learned about " + item});
	    }else if (!learnings[fact]) {
	        callback({'message': 'Okay, learned something else about ' + item});
	    }else{
	    	callback({'message': "Hmm, <@" + learnings[fact] + "> already taught me that!"});
	    	return;
	    }

    	learnings[fact] = sender;
	    console.log(learnings);
        storage.setItem(item, JSON.stringify(learnings));		    	
	});
}