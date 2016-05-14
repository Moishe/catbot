exports.handle = function(pieces, userData, commonData) {
  var user = pieces.shift();

  var endorsements = JSON.parse(userData['endorsements'] || '{}');

  var message = '';
  if (Object.keys(endorsements).length) {
    // TODO: add counts
    message = '*' + user + '* has been endorsed for: ' + Object.keys(endorsements).join(', ');
  } else {
    message = '*' + user + '* has no endorsements! You should endorse them for something!';
  }

  return {
    'message': message
  }
}