exports.handle = function(pieces, userStorage, moduleStorage, commonStorage) {
  console.log(process.env.HEROKU_URL + "/images/ace.jpg");
  return {'message': process.env.HEROKU_URL + "/images/ace.jpg"};
}