exports.handle = function(sender, pieces, db, callback, moduleName) {
  console.log(sender.profile.display_name);
  callback({ message: "Hello, " + sender.profile.display_name + "!" });
};
