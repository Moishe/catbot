exports.handle = function(sender, pieces, db, callback, moduleName) {
  const learned_to = pieces[0];
  const fact = pieces.slice(1).join(" ");
  const who_learned = sender.profile.display_name;

  if (!learned_to || !fact || learned_to.length === 0 || fact.length === 0) {
    callback({ message: "Sorry, I can't learn nothing!" });
    return;
  }

  db.run(
    "CREATE TABLE IF NOT EXISTS learns (" +
      "learned_to text NOT NULL," +
      "fact text NOT NULL," +
      "who_learned text NOT NULL," +
      "is_quote integer DEFAULT 0," +
      "create_date datetime DEFAULT current_timestamp" +
      ");"
  );

  const is_quote = fact.indexOf(" ") > 1 ? 1 : 0;

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
