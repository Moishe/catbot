exports.handle = function(sender, pieces, storageFactory, callback) {
  callback({ message: pieces.join(" ") });
};
