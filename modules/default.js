function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

exports.handle = function(sender, pieces, storageFactory, callback, moduleName) {

	// Read from the global table.

	var storage = storageFactory.getGlobalStorage('learnings');
	var item = pieces[0];
	var fact = pieces.slice(1).join(' ');

	storage.getItem(moduleName, function(learnings){
	    learnings = JSON.parse(learnings || '{}');

		if (Object.keys(learnings).length === 0) {
			callback({'message': "I don't know what you're talking about. Teach me with ?learn or write a module!"});
		}else{
			var things = Object.keys(learnings);
			var idx = getRandomInt(0, things.length - 1);

			callback({'message': things[idx]});
		}
	});
};