var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';
 
var _connection = null;

var open = function(){
	MongoClient.connect(dburl,function(err,db){
		if(err){
			console.log("connection failed");
			return;
		}
		_connection = db;
		console.log("connection successful to ",_connection) 
	});
};

var get = function(){
	return _connection;
};

module.exports = {
	open:open,
	get:get
};

