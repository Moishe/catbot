exports.handle = function(sender, pieces, db, callback) {
  db.run(
    "CREATE TABLE IF NOT EXISTS plusses (" +
      "recipient text NOT NULL," +
      "giver text NOT NULL," +
      "create_date datetime DEFAULT current_timestamp" +
      ");"
  );

  var user = pieces[0];
  console.log("Giving another plus to " + user);

  var m = user.match(/<@([UW][A-Z0-9]+)/);
  if (m) {
    user = m[1];
  }

  if (user == sender.profile.display_name) {
    callback({ message: "Hey now, you can't plus yourself!" });
    return;
  }

  db.run("insert into plusses (recipient, giver) values (?, ?)", [
    user,
    sender.id
  ]);
  db.get(
    "select count(*) as count from plusses where recipient = ?",
    user,
    function(err, row) {
      if (err) {
        console.log("error" + err);
      }
      callback({
        message:
          "One more plus for " +
          user +
          "! " +
          user +
          " now has " +
          row.count +
          " plusses!"
      });
    }
  );
};
