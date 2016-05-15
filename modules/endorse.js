exports.handle = function(pieces, userStorage, moduleStorage, commonStorage) {
  var user = pieces.shift();

  // skip 'for' if first word of endorsement
  if (pieces[0] == 'for') {
    pieces.shift();
  }

  var endorsement = pieces.join(' ');

  console.log('Endorsing ' + user + ' for ' + endorsement);

  var endorsements = JSON.parse(userStorage.getItem('endorsements') || '{}');

  if (endorsements[endorsement]) {
    endorsements[endorsement] += 1;
  } else {
    endorsements[endorsement] = 1;    
  }

  userStorage.setItem('endorsements', JSON.stringify(endorsements));

  return {
    'message': user + ' has been endorsed for ' + endorsement
  }
}