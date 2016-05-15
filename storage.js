var mkdirp = require('mkdirp');

function Storage(subtype) {
  this.LocalStorage = require('node-localstorage').LocalStorage;
  var self = this;
  var directoryName = './data/' + subtype;

  // TODO: ideally this wouldn't be sync, but I'm too lazy to refactor right now.
  mkdirp.sync(directoryName);
  self.storageImpl = new self.LocalStorage(directoryName);
}

Storage.prototype.getItem = function(item) {
  return this.storageImpl.getItem(item);
};

Storage.prototype.setItem = function(item, value) {
  return this.storageImpl.setItem(item, value);
}

exports.Storage = Storage;