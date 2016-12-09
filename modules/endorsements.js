exports.handle = function(sender, pieces, storageFactory, callback) {
  var user = pieces.shift();

  var userStorage = storageFactory.getUserStorage(user);
  userStorage.getItem('endorsements', function(endorsements){
    endorsements = JSON.parse(endorsements || '{}'); 
    var annotatedEndorsements = [];

    for (var endorsement in endorsements) {
      if (endorsements[endorsement] == 1) {
        annotatedEndorsements.push(endorsement);
      } else {
        annotatedEndorsements.push(endorsement + " (" + endorsements[endorsement] + ")");
      }
    }

    var message = '';
    if (Object.keys(endorsements).length) {
      message = '*' + user + '* has been endorsed for: ' + annotatedEndorsements.join(', ');
    } else {
      message = '*' + user + '* has no endorsements! You should endorse them for something!';
    }

    callback({
      'message': message
    });    
  });
}