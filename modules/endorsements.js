exports.handle = function(sender, pieces, db, callback) {
  var user = pieces.shift();
  var m = user.match(/<@([UW][A-Z0-9]+)/);
  if (m) {
    user = m[1];
  }

  let endorsements = [];
  db.each(
    "select endorsement, count(endorsement) as count from endorsements where recipient = ? " +
      "group by endorsement",
    [user],
    (err, row) => {
      if (row.count == 1) {
        endorsements.push(row.endorsement);
      } else {
        endorsements.push(row.endorsement + " (x" + row.count + ")");
      }
    },
    (err, num_rows) => {
      let message = "";
      if (endorsements.length > 0) {
        message = user + " has been endorsed for " + endorsements.join(", ");
      } else {
        message =
          user + " has no endorsements! You should endorse them for something!";
      }

      callback({ message: message });
    }
  );
};
