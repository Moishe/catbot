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

	this.Storage = require('./storage').Storage;

	this.commonStorage = new this.Storage('common');

	this.sanitize = require("sanitize-filename");
	console.log("initialized.");
};

CatRunner.prototype.start = function() {
	console.log("starting");
	this.rtm.start();

	var self = this;
	this.rtm.on(this.RTM_EVENTS.MESSAGE, function(m) { self.handleRtmMessage(m); });
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
	try { return require(moduleName); } catch (e) {};
}

CatRunner.prototype.handleRtmMessage = function(message) {
	if (message.type == 'message' && message.text[0] == '?') {
		pieces = message.text.substring(1).split(' ');
		moduleName = './modules/' + this.sanitize(pieces[0]) + '.js'

		handler = this.loader(moduleName);
		if (!handler) {
			console.log('no handler');
			return;
		}

		pieces.shift();
		var user = pieces[0];

		var userStorage = new this.Storage('users/' + this.sanitize(user));
		var moduleStorage = new this.Storage('modules/' + moduleName);

		var clonedPieces = pieces.slice(0);

		// protect ourselves from bad code/bugs in the handlers
		// TODO: maybe only do this if "production" flag is on or something like that.
		try {
			result = handler.handle(clonedPieces, userStorage, moduleStorage, this.commonStorage);
		} catch (e) {
			console.log("Error in " + moduleName + ": " + e);
		}

		if (result) {
			console.log(result);
			if (result.message) {
				this.rtm.sendMessage(result.message, message.channel);
			}
		}

		// unload the module so changes will be picked up without restarting the server
		name = require.resolve(moduleName);
		delete require.cache[name];
	}
};

exports.CatRunner = CatRunner;
