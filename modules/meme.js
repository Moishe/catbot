exports.handle = function(pieces, userStorage, moduleStorage, commonStorage) {
  return {'message': process.env.HEROKU_URL + "images/ace.jpg"};
}