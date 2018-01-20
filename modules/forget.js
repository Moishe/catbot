exports.handle = function(sender, pieces, db, callback, moduleName) {
  const learned_to = pieces[0];
  const fact = pieces.slice(1).join(" ");

  if (!learned_to || !fact || learned_to.length === 0 || fact.length === 0) {
    callback({ message: "Sorry, I can't forget nothing!" });
    return;
  }

  db.run(
    "delete from learns where learned_to = ? and fact = ?",
    [learned_to, fact],
    (err, row) => {
      callback({ message: ":thumbsup:" });
    }
  );
};
