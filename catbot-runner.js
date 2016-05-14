function CatRunner() {
	this.RtmClient = undefined;
	this.RTM_EVENTS = undefined;

	this.token = undefined;

	this.rtm = undefined;

	this.LocalStorage = undefined;
	this.commonStorage = undefined;
};

CatRunner.prototype.init = function(client, events, tok, rtm, store, cstore) {
	this.RtmClient = client || require('@slack/client').RtmClient;
	this.RTM_EVENTS = events || require('@slack/client').RTM_EVENTS;

	this.token = tok || (process.env.SLACK_API_TOKEN || '');
	this.rtm = new this.RtmClient(this.token, { logLevel: 'warning' });

	this.LocalStorage = require('node-localstorage').LocalStorage;
	this.userStorage = new this.LocalStorage('./data/users');
	this.globalStorage = new this.LocalStorage('./data/common');

	this.sanitize = require("sanitize-filename");
};

CatRunner.prototype.start = function() {
	this.rtm.start();

	var self = this;
	this.rtm.on(this.RTM_EVENTS.MESSAGE, function(m) { self.handleRtmMessage(m); });
	this.rtm.on(this.RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
	  // TODO
	});

	this.rtm.on(this.RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
	  // TODO
	});
};

CatRunner.prototype.loader = function(moduleName) {
	moduleName = './modules/' + moduleName + '.js'
	return require(moduleName);
}

CatRunner.prototype.handleRtmMessage = function(message) {
	if (message.type == 'message' && message.text[0] == '?') {
		try {
			pieces = message.text.substring(1).split(' ');
			module = this.sanitize(pieces[0]);

			handler = this.loader(module);
			if (!handler) {
				return;
			}

			pieces.shift();
			userData = userStorage.getItem(pieces[0]);
			globalData = globalStorage.getItem(module);

			result = handler.handle(pieces, userData, globalData);

			if (result.message) {
				rtm.sendMessage(result.message, message.channel);
			}

			if (result.userData) {
				userStorage.setItem(pieces[0], result.userData);
			}

			if (result.globalData) {
				globalStorage.setItem(module, result.globalData);
			}

			// unload the module so changes will be picked up without restarting the server
			name = require.resolve(moduleName);
			delete require.cache[name];
		} catch (e) {
			console.log('nope: ' + e);
			console.log(e.stack);
		}
	}
};

exports.CatRunner = CatRunner;
