exports.handle = function(sender, pieces, db, callback, moduleName) {
  if (!pieces[0]) {
    callback({ message: "Sorry, I don't know anything about nothing!" });
    return;
  }

  // read the thing from the global table
  const item = pieces[0];
  const fact = pieces.slice(1).join(" ");

  let learns = [];
  db.each(
    "select fact, who_learned from learns where learned_to = ?",
    [item],
    (err, row) => {
      learns.push(row.fact + " (" + row.who_learned + ")");
    },
    err => {
      if (learns.length == 0) {
        callback({
          message:
            "Alas, I know nothing about " +
            item +
            ". You should teach me with ?learn"
        });
      } else {
        const message = " • " + learns.join("\n • ");
        callback({ message: message });
      }
    }
  );
};
