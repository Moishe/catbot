// Note: NodeJs version needs to be at least 7.6
const { Sonos } = require("sonos");

exports.handle = function(sender, pieces, db, callback) {
  const eng_sonos_ip = "192.168.128.64";
  const device = new Sonos(eng_sonos_ip);
  const better_off_alone = "spotify:track:0pMUR7Uvp6vxlbG0qBFvgM";
  device
    .play(better_off_alone)
    .then(success => {
      console.log("Talk to me");
    })
    .catch(err => {
      console.log("Error occurred %j", err);
    });
  // Useful to find Eng Sonos IP address again if necessary...
  // const search = Sonos.DeviceDiscovery({ timeout: 30000 });
  // search.on("DeviceAvailable", function(device, model) {
  //   console.log("found device at " + device.host);
  //   device.getQueue().then(result => {
  //     console.log(JSON.stringify(result, null, 2));
  //   });
  // });
};
