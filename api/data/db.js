var mongoose =require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';
mongoose.Promise = global.Promise;
mongoose.connect(dburl);

mongoose.connection.on('connected',function(){
	console.log('mongoose connected to '+dburl);
});

mongoose.connection.on('disconnected',function(){
	console.log('mongoose disconnected to ');
});

mongoose.connection.on('error',function(err){
	console.log('mongoose connectection error '+ err);
});

process.on('SIGINT',function(){
	mongoose.connection.close(function(){
		console.log('mongoose disconnected through app ter');
		process.exit(0);
	});
});

process.on('SIGTERM',function(){
	mongoose.connection.close(function(){
		console.log('mongoose disconnected through app ter(SIGTERM)');
		process.exit(0);
	});
});

process.once('SIGUSR2',function(){
	mongoose.connection.close(function(){
		console.log('mongoose disconnected through app ter(SIGUSR2)');
		process.kill(process.pid,'SIGUSR2');
	});
});

require('./hotels.models.js');
require('./users.model.js');