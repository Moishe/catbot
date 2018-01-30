function CatRunner() {
  console.log("constructing.");

  this.RtmClient = undefined;
  this.RTM_EVENTS = undefined;

  this.token = undefined;

  this.rtm = undefined;
  this.web = undefined;

  this.DEFAULT_MODULE_NAME = "default";

  console.log("constructed.");
}

CatRunner.prototype.init = function(slackClient, tok) {
  console.log("initializing.");
  this.RtmClient = slackClient.RtmClient;
  this.RTM_EVENTS = slackClient.RTM_EVENTS;
  this.token = tok;
  this.rtm = new this.RtmClient(this.token, {
    logLevel: "warning",
    dataStore: false
  });
  this.web = new slackClient.WebClient(this.token);
  this.sanitize = require("sanitize-filename");

  var sqlite3 = require("sqlite3").verbose();
  this.db = new sqlite3.Database("db");

  this.channelRe = /#.*/;
  this.userRe = /<@[UW][A-Za-z0-9]+>/;

  console.log("initialized.");
  this.regex = /^\?/;
};

CatRunner.prototype.start = function() {
  console.log("starting");
  this.rtm.start();

  var self = this;
  this.rtm.on(this.RTM_EVENTS.MESSAGE, m => {
    self.handleRtmMessage(m);
  });
  console.log("started");
};

CatRunner.prototype.loader = function(moduleName) {
  // don't throw if moduleName doesn't exist.
  try {
    return require(moduleName);
  } catch (e) {
    console.log(e);
  }
};

CatRunner.prototype.shouldInvokeOn = function(message) {
  return (
    message.type == "message" &&
    message.text &&
    message.text.match &&
    message.text.match(this.regex)
  );
};

CatRunner.prototype.handleRtmMessage = function(message) {
  if (this.shouldInvokeOn(message)) {
    var cleanMessage = message.text.replace(this.regex, "");
    var pieces = cleanMessage.split(" ");
    var bareModule = this.sanitize(pieces[0]);
    var moduleName = "./modules/" + bareModule + ".js";

    console.log("loading " + moduleName);

    var handler = this.loader(moduleName);
    if (!handler) {
      // if we didn't find a handler, try the default handler.
      console.log("loading default handler");
      moduleName = "./modules/" + this.DEFAULT_MODULE_NAME + ".js";
      handler = this.loader(moduleName);
    }

    if (!handler) {
      console.log("no handler");
      return;
    }

    pieces.shift();
    const self = this;
    this.web.users.info(message.user).then(response => {
      const sender = response.user;
      handler.handle(
        sender,
        pieces.slice(0),
        this.db,
        function(result) {
          if (result) {
            if (result.message) {
              self.web.chat.postMessage(message.channel, result.message, {
                as_user: true
              });
            }
          }
        },
        bareModule
      );
    });

    // unload the module so changes will be picked up without restarting the server
    var name = require.resolve(moduleName);
    delete require.cache[name];
  }
};

exports.CatRunner = CatRunner;
