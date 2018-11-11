require('./api/data/db.js');
var express =require('express');
var app = express();
var path=require('path');
var routes =require('./api/routes');
var bodyParser = require('body-parser')

app.set('port',3000);

app.use(function(req,res,next){
	console.log(req.method,req.url);
	next();
});

app.use(express.static(path.join(__dirname,'/public')));
app.use('/node_modules',express.static(path.join(__dirname+'/node_modules')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api',routes);
/*app.get('/',function(req,res){
	console.log("Go to homepage");
	res.sendFile(path.join(__dirname,'public','index.html'));
});*/



var server=app.listen(app.get('port'),function(){
	var port  = server.address().port;
	console.log('magic! '+port);
});
console.log('first');
