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

CatRunner.prototype.init = function(client, events, tok) {
	console.log("initializing.");
	this.RtmClient = client;
	this.RTM_EVENTS = events;
	this.token = tok;
	this.rtm = new this.RtmClient(this.token, { logLevel: 'warning' });
	this.sanitize = require("sanitize-filename");


	var mysql = require('mysql');
	var dbConfig;

	if (process.env.DATABASE_URL) {
		dbConfig = process.env.DATABASE_URL;

	} else {
		var config = require('config');
		dbConfig = config.get('DB');
	}
	this.connection = mysql.createConnection(dbConfig);

	// Ensure tables exist.
	var sprintf = require('sprintf');
	var create_query = 'CREATE TABLE IF NOT EXISTS %s (id VARCHAR(64) NOT NULL, data_key VARCHAR(64) NOT NULL, data_value VARCHAR(4096) NOT NULL, PRIMARY KEY(id, data_key)) ENGINE=InnoDB;';

	this.connection.query(sprintf(create_query, 'user_data'), function(err, result){
		if (err) {
			console.log("Error on user data query " + err + " result:");
			console.dir(result);
		}
	});

	this.connection.query(sprintf(create_query, 'module_data'), function(err, result){
		if (err) {
			console.log("Error on module data query " + err + " result:");
			console.dir(result);
		}
	});

	this.connection.query(sprintf(create_query, 'global_data'), function(err, result){
		if (err) {
			console.log("Error on module global query " + err + " result:");
			console.dir(result);
		}
	});


	this.storageFactory = require("./storage_factory").StorageFactory;

	this.channelRe = /#.*/;
	this.userRe = /<@[UW][A-Za-z0-9]+>/;

	console.log("initialized.");
	this.regex = /^\?/;
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
	try { return require(moduleName); } catch (e) {console.log(e); };
};

CatRunner.prototype.shouldInvokeOn = function(message) {
	console.log("message received is: ");
	console.dir(message);
	if (message.type == 'message'){
		if (message.message){
			message = message.message;
		}
	}

	if (message.text && message.text.match(this.regex)){
		return message;
	}
};

CatRunner.prototype.handleRtmMessage = function(message) {
	message = this.shouldInvokeOn(message);
	if (message) {
		var cleanMessage = message.text.replace(this.regex, '');
		var pieces = cleanMessage.split(' ');
		var moduleName = './modules/' + this.sanitize(pieces[0]) + '.js';
		console.log("loading " + moduleName);

		var handler = this.loader(moduleName);
		if (!handler) {
			console.log('no handler');
			return;
		}

		pieces.shift();

		if (message.attachments){
			console.log("Attachment is: ");
			console.dir(message.attachments.first);

		}

		// protect ourselves from bad code/bugs in the handlers
		// TODO: maybe only do this if "production" flag is on or something like that.
		try {
			var self = this;
			var moduleStorageFactory = new this.storageFactory(this.connection, this.sanitize(moduleName));
			handler.handle(message.user, pieces.slice(0), moduleStorageFactory,
				function(result){
					if (result) {
						if (result.message) {
							// TODO: allow bots to return attachments; use them here.
							self.rtm.sendMessage(result.message, message.channel);
						}
					}
			});
		} catch (e) {
			console.log("Error in " + moduleName + ": " + e);
		}

		// unload the module so changes will be picked up without restarting the server
		var name = require.resolve(moduleName);
		delete require.cache[name];
	}
};

exports.CatRunner = CatRunner;
