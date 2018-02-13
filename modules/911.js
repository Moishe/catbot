var opsgenie = require("opsgenie-sdk");

exports.handle = function(sender, pieces, db, callback) {
  const msg = pieces.slice(1).join(" ");

  opsgenie.configure({
    api_key: "efeab72c-f474-47e5-9d57-2f42b2536036" // yeah yeah hardcoded I know
  });

  opsgenie.alertV2.create(
    {
      message: msg,
      user: sender.profile.display_name
    },
    function(error, alert) {
      if (error) {
        console.error(error);
      } else {
        console.log("Create Alert Response: ");
        console.log(alert);
        callback({ message: "OK, engineers have been paged via OpsGenie!" });
      }
    }
  );
};
