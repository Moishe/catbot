exports.handle = function(sender, pieces, db, callback, moduleName) {
  const learned_to = pieces[0];
  const fact = pieces.slice(1).join(" ");
  const who_learned = sender.profile.display_name;

  if (!learned_to || !fact || learned_to.length === 0 || fact.length === 0) {
    callback({ message: "Sorry, I can't learn nothing!" });
    return;
  }

  db.get(
    "select count(*) as count from learns where learned_to = ? and fact = ?",
    [learned_to, fact],
    (err, row) => {
      if (row.count > 0) {
        callback({ message: ":thumbsup:" });
        return;
      }
      db.run(
        "insert into learns (learned_to, fact, who_learned, is_quote) values (?, ?, ?, ?)",
        [learned_to, fact, who_learned, is_quote],
        err => {
          callback({ message: "Learned " + fact + " to " + learned_to + "." });
        }
      );
    }
  );
};
