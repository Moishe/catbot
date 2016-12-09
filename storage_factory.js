function StorageFactory(connection, module, sender){
	this.connection = connection;
	this.sender = sender;
	this.module = module;

	this.USER_TYPE = 'user_data';
	this.MODULE_TYPE = 'module_data';
	this.GLOBAL_TYPE = 'global_data';

	this.Storage = require("./storage").Storage;
}

StorageFactory.prototype.getUserStorage = function(user){
	console.log("getting storage for " + user);
	// We want to be kind of nice here, so we strip out the <@...> piece if this is a mention
	m = user.match(/\<@([UW][A-Z0-9]+)/)
	if (m){
		user = m[1];
		console.log('match: ' + user);
	}

	return new this.Storage(this.connection, this.USER_TYPE, user);
};

StorageFactory.prototype.getModuleStorage = function(){
	return new this.Storage(this.connection, this.MODULE_TYPE, this.module);
};

StorageFactory.prototype.getGlobalStorage = function(key){
	return new this.Storage(this.connection, this.GLOBAL_TYPE, key);
};

exports.StorageFactory = StorageFactory;