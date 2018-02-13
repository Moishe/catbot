exports.handle = function(sender, pieces, db, callback) {
  db.run(
    "CREATE TABLE IF NOT EXISTS endorsements (" +
      "recipient text NOT NULL," +
      "endorsement text NOT NULL," +
      "giver text NOT NULL," +
      "create_date datetime DEFAULT current_timestamp" +
      ");"
  );

  var user = pieces.shift();

  // skip 'for' if first word of endorsement
  if (pieces[0] == "for") {
    pieces.shift();
  }

  var endorsement = pieces.join(" ");

  console.log("Endorsing " + user + " for " + endorsement);

  db.run(
    "insert into endorsements (recipient, endorsement, giver) values (?, ?, ?)",
    [user, endorsement, sender.profile.display_name]
  );

  db.get(
    "select count(*) as count from endorsements where recipient = ? AND endorsement = ?",
    [user, endorsement],
    function(err, row) {
      callback({
        message:
          user +
          " has now been endorsed for " +
          endorsement +
          " " +
          row.count +
          " times!"
      });
    }
  );
};
