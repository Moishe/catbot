function StorageFactory(connection, module){
	this.connection = connection;
	this.USER_TYPE = 'user_data';
	this.MODULE_TYPE = 'module_data';
	this.GLOBAL_TYPE = 'global_data';

	this.Storage = require("./storage").Storage;
}

StorageFactory.prototype.getUserStorage = function(user){
	return new this.Storage(this.connection, this.USER_TYPE, user);
};

StorageFactory.prototype.getModuleStorage = function(){
	return new this.Storage(this.connection, this.MODULE_TYPE, this.module);
};

StorageFactory.prototype.getGlobalStorage = function(key){
	return new this.Storage(this.connection, this.GLOBL_TYPE, key);
};

exports.StorageFactory = StorageFactory;