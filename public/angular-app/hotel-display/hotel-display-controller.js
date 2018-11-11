angular.module('meanhotel').controller('HotelController',HotelController);

function HotelController($window,$route,hotelDataFactory,$routeParams,AuthFactory,jwtHelper){
	var vm=this;
	var id = $routeParams.id;
	vm.isSubmitted=false;
	hotelDataFactory.hotelDisplay(id).then(function(response){
		//console.log(response);
		vm.hotel = response;
		vm.stars= _getStarRating(response.stars);
	});

	function _getStarRating(stars){
		return new Array(stars);
	}

	vm.isLoggedIn = function(){
		if(AuthFactory.isLoggedIn){
			return true;
		}else{
			return false;
		}
	};

	vm.addReview=function(){
		var token =jwtHelper.decodeToken($window.sessionStorage.token);
		var username = token.username;
		var postData={
			name: username,
			rating:vm.rating,
			review:vm.review
		};
		if(vm.reviewForm.$valid){
			hotelDataFactory.postReview(id,postData).then(function(response){
				console.log(response.statusText);
				if(response.status===200){
					$route.reload();
				}
			}).catch(function(error){
				console.log(error);
			});
		}
		else{
			vm.isSubmitted=true;
		}
	};
}