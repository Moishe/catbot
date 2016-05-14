exports.handle = function(pieces, userData, commonData) {
  var user = pieces.shift();
  var endorsement = pieces.join(' ');

  console.log('Endorsing ' + user + ' for ' + endorsement);
  console.log(JSON.stringify(userData));

  endorsements = JSON.parse(userData['endorsements'] || '{}');

  if (endorsements[endorsement]) {
    endorsements[endorsement] += 1;
  } else {
    endorsements[endorsement] = 1;    
  }

  userData['endorsements'] = JSON.stringify(endorsements);

  return {
    'message': user + ' has been endorsed for ' + endorsement,
    'userData': userData
  }
}