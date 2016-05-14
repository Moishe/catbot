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
	this.commonStorage = new this.LocalStorage('./data/' + module);
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

function safeModuleName(module) {
	// TODO: there is probably a better way to guard against this.
	containsSlash = module.indexOf('/') != -1;
	containsDot = module.indexOf('.') != -1;
	return !(containsSlash || containsDot);
}

CatRunner.prototype.loader = function(moduleName) {
	if (!safeModuleName(module)) {
		console.log('unsafe: ' + module);
		return;
	}
	moduleName = './modules/' + module + '.js'
	return require(moduleName);
}

CatRunner.prototype.handleRtmMessage = function(message) {
	if (message.type == 'message' && message.text[0] == '?') {
		try {
			pieces = message.text.substring(1).split(' ');
			module = pieces[0];

			handler = this.loader(module);
			if (!handler) {
				return;
			}

			options = handler.options ? handler.options() : {};
			storage = commonStorage;
			if (options.storage) {
				storage = new LocalStorage('./data/' + module);
			}

			pieces.shift();
			result = handler.handle(pieces, storage);
			if (result) {
				rtm.sendMessage(result, message.channel);
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
