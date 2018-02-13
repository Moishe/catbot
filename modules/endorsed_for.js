exports.handle = function(sender, pieces, db, callback) {
  const endorsement_to_find = pieces.shift();

  let users = [];
  db.each(
    "select distinct recipient from endorsements where endorsement = ?",
    [endorsement_to_find],
    (err, row) => {
      users.push(row.recipient);
    },
    (err, num_rows) => {
      if (users.length > 0) {
        callback({
          message:
            "The following people have been endorsed for " +
            endorsement_to_find +
            ": " +
            users.join(", ")
        });
      } else {
        callback({
          message: "Nobody has been endorsed for " + endorsement_to_find + " :("
        });
      }
    }
  );
};
