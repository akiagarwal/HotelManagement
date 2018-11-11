angular.module('meanhotel').controller('RegisterController',RegisterController);

function RegisterController($http){
	var vm=this;

	vm.register=function(){
		var user = {
			username:vm.username,
			password:vm.password
		};
		if(!vm.username||!vm.password){
			vm.error = 'Please enter username and password';
		}else{
			if(vm.password!=vm.passwordRepeat){
				vm.error = 'passwords do not match';
			}else{
				$http.post('/api/users/register',user).then(function(result){
					console.log(result);
					vm.message = 'Successful registration';
					vm.error='';
				}).catch(function(error){
					console.log(error);
				});
			}
		}
	}
};