/*var dbconn = require('../data/dbconnection.js');
var hotelData = require('../data/hotel-data.json')
var ObjectId=require('mongodb').ObjectId;*/
var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery=function(req,res){

	var lng=parseFloat(req.query.lng);
	var lat=parseFloat(req.query.lat);
	//console.log(lng,"+",lat);
	var point = {
		type:"Point",
		coordinates:[lng,lat]
	};

	var geoOptions = {
		spherical:true,
		maxDistance:2000,
		num:5
	};

	Hotel
	.geoNear(point,geoOptions,function(err,results,stats){ 
		if(err){
			console.log("error found",err);
		};
		console.log("Geo results",results);
		console.log("Geo stats",stats);
		res
		.status(200)
		.json(results);
	});
};

module.exports.hotelsGetAll =function(req,res){
	console.log('requested by:'+req.user);
	var offset=0;
	var count = 4;
	var maxCount=10;

	if(req.query&&req.query.lat&&req.query.lng){
		runGeoQuery(req,res);
		return;
	}

	if(req.query&&req.query.offset){
		offset = parseInt(req.query.offset,10);
	}


	if(req.query&&req.query.count){
		count = parseInt(req.query.count,10);
	}
	if(isNaN(offset) || isNaN(count)){
		res.status(400).json({"message":"wrong data types for query"});
		return;
	};
	if(count>maxCount){
		res.status(400).json({
			"message":"count limit exceeded"
		});
		return;
	}
	Hotel
		.find().skip(offset).limit(count)
		.exec(function(err,hotels){
			if(err){
				console.log("error finding hotels");
				res
				.status(500)
				.json(err);
			}
			else{
				console.log("found hotels ",hotels.length);
				res.json(hotels);
			}
			
		}); 

}

module.exports.hotelsGetOne =function(req,res){

	var hotelId= req.params.hotelId;
	console.log("Go to hotel",hotelId);
	Hotel.findById(hotelId).exec(function(err,doc){
		var response={
			status:200,
			message:doc
		};
		if(err){
				console.log("error finding hotel");
				response.status=500;
				response.message=err;
			}
			else if(!doc){
				response.status=404;
				response.message={
					"message":"hotel id not found"
				};
			}
				res.status(response.status).json(response.message);

		
	});
};

var _splitArray = function(input){
	var output;
	if(input && input.length>0){
		output = input.split(";");
	}
	else {
		output=  [];
	}
	return output;
};

module.exports.hotelsAddOne = function(req,res){
	Hotel
	.create({
		name: req.body.name,
		description: req.body.description,
		stars: parseInt(req.body.stars,10),
		services: _splitArray(req.body.services),
		photos: _splitArray(req.body.photos),
		currency: req.body.currency,
		location: {
			address:req.body.address,
			coordinates: [parseFloat(req.body.lng),parseFloat(req.body.lat)]
		}
	},function(err,hotel){
		if(err){
			console.log("error creating hotel");
			res.status(400).json(err);
		}
		else{
			console.log("Hotel created",hotel);
			res.status(201).json(hotel);
		}
	});
	
};

module.exports.hotelsUpdateOne =function(req,res){

	var hotelId= req.params.hotelId;
	console.log("Go to hotel",hotelId);
	Hotel.findById(hotelId).select("-reviews -rooms").exec(function(err,doc){
		var response={
			status:200,
			message:doc
		};
		if(err){
				console.log("error finding hotel");
				response.status=500;
				response.message=err;
			}
			else if(!doc){
				console.log("123");
				response.status=404;
				response.message={
					"message":"hotel id not found"
				};
			}
			if(response.status!=200){
				console.log("error updating ggg");
				res.status(response.status).json(response.message);
				}

			else{
				console.log("456");
				doc.name=req.body.name,
				doc.description= req.body.description,
				doc.stars= parseInt(req.body.stars,10),
				doc.services= _splitArray(req.body.services),
				doc.photos= _splitArray(req.body.photos),
				doc.currency= req.body.currency,
				doc.location= {
					address:req.body.address,
					coordinates: [parseFloat(req.body.lng),parseFloat(req.body.lat)]
					};

					doc.save(function(err,hotelNew){
						if(err){
							res.status(500).json(err);
						}
						else{
							res.status(204).json();
						}
					});

				}
		
	});
};

module.exports.hotelsDeleteOne = function(req,res){
	var hotelId = req.params.hotelId;
	Hotel
	.findByIdAndRemove(hotelId)
	.exec(function(err,hotel){
		if(err){
			console.log("error deleting hotel");
			res.status(400).json(err);
		}
		else{
			console.log("Hotel deleted,id:",hotelId);
			res.status(204).json();
		}
	});
};

