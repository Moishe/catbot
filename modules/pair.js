const moment = require("moment");

exports.handle = function(sender, pieces, db, callback) {
  db.run(
    "CREATE TABLE IF NOT EXISTS pair_programming_sessions (" +
      "person1 text NOT NULL," +
      "person2 text NOT NULL," +
      "person3 text," +
      "person4 text," +
      "recorded_by text NOT NULL," +
      "create_date datetime DEFAULT current_timestamp" +
      ");"
  );

  // copy variable number of participants over into people array for db insertion
  let people = [null, null, null, null];
  for (let i = 0; i < pieces.length; i++) {
    if (i == people.length) break;
    people[i] = pieces[i];
  }

  db.run(
    "insert into pair_programming_sessions " +
      "(person1, person2, person3, person4, recorded_by) " +
      "values(?, ?, ?, ?, ?)",
    [people[0], people[1], people[2], people[3], sender.profile.display_name]
  );

  const month_start = moment()
    .startOf("month")
    .format();

  db.get(
    "select count(*) as count from pair_programming_sessions " +
      "where create_date > ? ",
    [month_start],
    function(err, row) {
      callback({
        message:
          "There have been " +
          row.count +
          " pair programming sessions this month"
      });
    }
  );
};
