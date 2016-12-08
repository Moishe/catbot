var mkdirp = require('mkdirp');

function Storage(connection, table, id) {
	this.connection = connection;
	this.table = table;
	this.id = id;
}

Storage.prototype.getItem = function(key, callback) {
	var sql = "SELECT data_value FROM " + this.table + " WHERE id=? AND data_key=?";
	this.connection.query(sql, [this.id, key], function(err, results){
		if (results && results.length > 0){
			callback(results[0]['data_value']);
		}else{
			callback(null);
		}
	});
};

Storage.prototype.setItem = function(key, value) {
	var sql = "INSERT INTO " + this.table + "(id,data_key,data_value) VALUES (?,?,?) ON DUPLICATE KEY UPDATE data_value=?";
	this.connection.query(sql, [this.id, key, value, value]);
}

exports.Storage = Storage;

