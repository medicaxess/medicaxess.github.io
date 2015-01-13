/**
 * Controller for handling logins
 */

var loginController = function($rootScope, $scope, $http) {

    console.log('Loading login controller');
    $scope.user = {};
    $scope.app = {};

    $scope.demoLogin = function(){

        window.alert("Welcome to MedicAxess, you have successfully logged in as a Provider, you will now be taken to the Provider Dashboard");
        $scope.userData.isLoggedIn = true;
        $scope.app.state='providerview';
        window.document.title = $scope.userData.username + "'s Dashboard";
    };

    $scope.registerUser = function(){
        /*
        if(isValid()){
            console.log("Preparing to register " + $scope.user.username);
            $scope.currentAction ="register";

            $scope.send("/api/user/register","Sending registration request.");
        }*/
        console.log("registerUser was called");
        $scope.demoLogin();
    };

    $scope.logoutUser = function(){
        $http.get("/api/user/logout");
        window.alert("You are now logged out");
        window.location = "index.html";
    };

    $scope.loginUser = function(){
        /*
        if(isValid()) {
            console.log("Preparing to login " + $scope.user.username);
            $scope.currentAction ="login";
            $scope.send("/api/user/login", "Logging you in...");
        }
        */
        console.log("loginUser was called");
        $scope.demoLogin();
    };


    $scope.recoverPassword = function(){
        if($scope.user.username !== undefined) {
            $http.get("/recover?id=" + $scope.user.username)
                .success(function (data) {
                    window.alert("Depending on your notification preferences you may need to check your email or text messages for what to do next.");
                })
                .error(function (error) {
                    window.alert("Apologies but we couldn't find any account matching that identifier.");
                });
        }
    };

    function isValid(){
        if(!$scope.user){
            window.alert("Even if there was data in the form fields, you need to retype it to proceed.");
            return false;
        }
        if(!$scope.user.username){
            window.alert("You must input a valid username!");
            return false;
        }
        if(!$scope.user.password){
            window.alert("You must input a valid password!");
            return false;
        }
        return true;
    }

    $scope.send = function(url,text){

        if(text){
            $scope.loadingText = text;
        }
        $scope.loading = true;
        console.log("Sending: ",$scope.user);
        $http.post(url, $scope.user)
            .success(function (data) {
                console.log("Data: ", data);
                if(!data){
                    window.alert("Invalid username or password.  If you are trying to register, it may mean that the name is already taken.");
                    return;
                }
                if(data.activated == false){
                    $scope.currentAction = "register";
                }

                $scope.userData = data;
                $rootScope.userData = angular.copy(data);
                console.log("userData: ",$scope.userData);
                //window.location ="/dashboard.html";
            })
            .error(function (error) {
                console.error(error);
                window.alert("There was an error and we could not log you in.  Please check your username & password.");
            })
            .finally(function () {
                console.log("Done with login");
                $scope.loading = false;
            });

    };
    
    $scope.isLoggedIn = function(){
        var islogged  = $rootScope.hasOwnProperty('userData');
        //console.log("User Logged in: ", islogged);
        return islogged;
    };

};

angular.module('login',[])
    .controller('LoginController', ['$rootScope','$scope', '$http', loginController])
     .directive('loginArea',function(){
        console.log("Loading directive login-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/login-area.html'
        }
    })
    .directive('signupArea',function(){
        console.log("Loading directive signup-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/signup-area.html'
        }
    })
;

