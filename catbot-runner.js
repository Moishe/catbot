function CatRunner() {
	console.log("constructing.");

	this.RtmClient = undefined;
	this.RTM_EVENTS = undefined;

	this.token = undefined;

	this.rtm = undefined;

	this.commonStorage = undefined;
	this.userStorage = undefined;
	this.moduleStorage = undefined;

	console.log("constructed.");
};

CatRunner.prototype.init = function(client, events, tok, rtm, store, cstore) {
	console.log("initializing.");
	this.RtmClient = client || require('@slack/client').RtmClient;
	this.RTM_EVENTS = events || require('@slack/client').RTM_EVENTS;

	this.token = tok || (process.env.SLACK_API_TOKEN || '');
	this.rtm = new this.RtmClient(this.token, { logLevel: 'warning' });

	var config	   = require('config');
	var mysql      = require('mysql');

	dbConfig = config.get('DB');
	this.connection = mysql.createConnection(config.get('DB'));
	this.connection.connect();

	this.sanitize = require("sanitize-filename");

	this.Storage = require("./storage").Storage;
	console.log("initialized.");
};

CatRunner.prototype.start = function() {
	console.log("starting");
	this.rtm.start();

	var self = this;
	this.rtm.on(this.RTM_EVENTS.MESSAGE, function(m) { 
		self.handleRtmMessage(m); 
	});
	this.rtm.on(this.RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
	  // TODO
	});

	this.rtm.on(this.RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
	  // TODO
	});
	console.log("started");
};

CatRunner.prototype.loader = function(moduleName) {
	// don't throw if moduleName doesn't exist.
	try { return require(moduleName); } catch (e) { console.log(e); };
}

CatRunner.prototype.handleRtmMessage = function(message) {
	if (message.type == 'message' && message.text[0] == '?') {
		pieces = message.text.substring(1).split(' ');
		moduleName = './modules/' + this.sanitize(pieces[0]) + '.js'
		console.log("loading " + moduleName);

		handler = this.loader(moduleName);
		if (!handler) {
			console.log('no handler');
			return;
		}

		pieces.shift();
		var user;
		if (pieces.length >= 1) {
			user = pieces[0];
		} else {
			user = '';
		}

		var userStorage = new this.Storage(this.connection, 'user_data', this.sanitize(user));
		var moduleStorage = new this.Storage(this.connection, 'module_data', this.sanitize(moduleName));

		var clonedPieces = pieces.slice(0);

		// protect ourselves from bad code/bugs in the handlers
		// TODO: maybe only do this if "production" flag is on or something like that.
		try {
			self = this;
			result = handler.handle(clonedPieces, userStorage, moduleStorage, this.commonStorage, function(result){
				if (result) {
					if (result.message) {
						// TODO: allow bots to return attachments; use them here.
						self.rtm.sendMessage(result.message, message.channel);
					}
				}
			});
		} catch (e) {
			console.log("Error in " + moduleName + ": " + e);
			result = '';
		}

		// unload the module so changes will be picked up without restarting the server
		name = require.resolve(moduleName);
		delete require.cache[name];
	}
};

exports.CatRunner = CatRunner;
