var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll=function(req,res){
	var hotelId= req.params.hotelId;
	console.log("Go to hotel",hotelId);
	Hotel.findById(hotelId).select('reviews')
	.exec(function(err,doc){
		console.log("return ",doc);
		res.json(doc.reviews);
	});
};
module.exports.reviewsGetOne=function(req,res){
	var hotelId= req.params.hotelId;
	var reviewId= req.params.reviewId;
	console.log("Go to review id ",reviewId,"for hotel id",hotelId);
	Hotel.findById(hotelId).select('reviews')
	.exec(function(err,hotel){
		console.log("return hotel ",hotel);
		var review = hotel.reviews.id(reviewId);
		res.json(review);
	});
};

var _addReview = function(req,res,hotel){

	hotel.reviews = hotel.reviews.concat([{name: req.body.name,
			rating: parseInt(req.body.rating,10),
			review: req.body.review}]);

	hotel.save(function(err,hotelNew){
		if(err){
			console.log("add error",err);
			res.status(500).json(err);
		}
		else {
			res.status(200).json(hotelNew.reviews[hotelNew.reviews.length -1]);
		}
	});
};

module.exports.reviewsAddOne = function(req,res){
	var hotelId= req.params.hotelId;
	console.log("Go to hotel",hotelId);
	Hotel.findById(hotelId).select('reviews')
	.exec(function(err,doc){
		var response = {
			status: 200,
			message : []
		};
		if(err){
			console.log("error finding hotel");
			response.status=500;
			response.message=err;
		}
		else if(!doc){
			console.log("hotel id not found in database");
			response.status =404;
			response.message = {
				"message":"hotel id not found"+ hotelId
			};
		}
		if(doc){
			_addReview(req,res,doc);
		}
		else{
			res.status(response.status).json(response.message);
		}
	});
};

module.exports.reviewsUpdateOne = function(req, res) {
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};

module.exports.reviewsDeleteOne = function(req,res){
	var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        hotel.reviews.id(reviewId).remove();
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};
