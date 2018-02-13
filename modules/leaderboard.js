exports.handle = function(sender, pieces, db, callback, moduleName) {
  db.all(
    "select recipient, count(recipient) as count from plusses group by recipient order by count desc limit 5",
    (err, rows) => {
      if (rows.length == 0) {
        callback({ message: "No plusses yet!" });
        return;
      }
      let leaders = [];

      rows.forEach(row => {
        leaders.push(
          ("           " + row.count).slice(-8) + " " + row.recipient
        );
      });

      let givers = [];
      db.all(
        "select giver, count(giver) as count from plusses group by giver order by count desc limit 5",
        (err, rows) => {
          rows.forEach(row => {
            givers.push(
              ("           " + row.count).slice(-8) + " " + row.giver
            );
          });
          callback({
            message:
              "*Plus Leaderboard*\n" +
              leaders.join("\n") +
              "\n" +
              "*Given the most ?++s Leaderboard*\n" +
              givers.join("\n")
          });
        }
      );
    }
  );
};
