angular.module('meanhotel',['ngRoute','angular-jwt'])
.config(config).run(run);

function config($httpProvider,$routeProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
	$routeProvider
	.when('/',{
		templateUrl:'angular-app/main/main.html',
		access :{
			restriced: false
		}
	})
	.when('/hotels',{
		templateUrl:'angular-app/hotel-list/hotels.html',
		controller:HotelsController,
		controllerAs: 'vm',
		access :{
			restriced: false
		}
	}).when('/hotel/:id',{
		templateUrl:'angular-app/hotel-display/hotel.html',
		controller:HotelController,
		controllerAs:'vm',
		access :{
			restriced: false
		}
	})
	.when('/register',{
		templateUrl:'angular-app/register/register.html',
		controller:RegisterController,
		controllerAs:'vm',
		access :{
			restriced: false
		}
	})
	.when('/profile',{
		templateUrl:'angular-app/profile/profile.html',
		controllerAs:'vm',
		access :{
			restriced: true
		}
	})
	.otherwise({
		redirectTo:'/'
	});
}

function run($window,$location,$rootScope,AuthFactory){
	$rootScope.$on('$routeChangeStart',function(event,nextRoute,currentRoute){
		if(nextRoute.access!==undefined && nextRoute.access.restriced && !$window.sessionStorage.token
			&& !AuthFactory.isLoggedIn){
			event.preventDefault();
			$location.path('/');
		}
	})
}
