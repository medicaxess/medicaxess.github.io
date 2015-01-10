/**
 * Controller for handling logins
 */

var userController = function($rootScope, $scope, $http) {

    console.log('Loading user controller');
	$scope.init = function(){
		var url = "/user/userdata";
		$http.get(url,null)
		.onSuccess(function(data){
			$scope.user = data;
		})
		.onError(function(error){
			$scope.error = error;
		});
	};
	
    $scope.logoutUser = function(){
        $scope.send("/user/logout","Logging you out...");
    };

    
    $scope.isLoggedIn = function(){
        var islogged  = $rootScope.hasOwnProperty('userData');
        console.log("User Logged in: ", islogged);
        return islogged;
    };
	
	$scope.init();

};

angular.module('user',[])
    .controller('UserController', ['$rootScope','$scope', '$http', userController])
     .directive('userArea',function(){
        console.log("Loading directive login-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'views/partials/user-area.html'
        }
    });

