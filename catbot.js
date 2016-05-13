/**
 * Example for creating and working with the Slack RTM API.
 */

/* eslint no-console:0 */

var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var token = process.env.SLACK_API_TOKEN || '';

var rtm = new RtmClient(token, { logLevel: 'warning' });
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
	if (message.type == 'message' && message.text[0] == '?') {
		try {
			var pieces = message.text.substring(1).split(' ');
			var module = pieces[0];
			var moduleName = './modules/' + module + '.js'
			var handler = require(moduleName);

			var LocalStorage;
			var localStorage;
			if (handler.needsStorage && handler.needsStorage()) {
				LocalStorage = require('node-localstorage').LocalStorage;
				localStorage = new LocalStorage('./data/' + module);
			}

			pieces.shift();
			var result = handler.handle(pieces, localStorage);
			if (result) {
				rtm.sendMessage(result, message.channel);
			}

			// unload the module so changes will be picked up without restarting the server
			var name = require.resolve(moduleName);
			delete require.cache[name];
		} catch (e) {
			console.log('nope: ' + e);
			console.log(e.stack);
		}
	}
});

rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
  // TODO
});

rtm.on(RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
  // TODO
});
