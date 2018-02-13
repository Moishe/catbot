function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

exports.handle = function(sender, pieces, db, callback, moduleName) {
  const subject = moduleName;

  db.get(
    "select count(*) as count from learns where learned_to = ?",
    [subject],
    (err, row) => {
      if (row.count == 0) {
        callback({
          message:
            "I don't know what you're talking about. Teach me with ?learn or write a module!"
        });
      } else {
        const offset = getRandomInt(0, row.count);
        db.get(
          "select fact from learns where learned_to = ? limit 1 offset ?",
          [subject, offset],
          (err, row) => {
            callback({ message: row.fact });
          }
        );
      }
    }
  );
};
