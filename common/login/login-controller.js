/**
 * Controller for handling logins
 */

var loginController = function($rootScope, $scope, $http) {

    console.log('Login controller, starting up!');
    $scope.user = {};
    $scope.app = {};
    $rootScope.onLogin = [];
    if(window.location.host != "localhost"){
        $rootScope.baseUrl = "https://api.medicaxess.com";
        //$rootScope.baseUrl = "https://medicaxess-padtronics.rhcloud.com/"
    }else{
        $rootScope.baseUrl = "http://localhost:8080";
    }

     $scope.logoutUser = function(){
        window.alert("You are now logged out");
        window.location = "index.html";
    };

    $scope.loginUser = function(form){
        console.log("loginUser was called");
        console.log("sending: ",$scope.userData)

        $http.post($rootScope.baseUrl+"/login",$scope.userData)
            .success(function(data, status, headers, config) {
                //$rootScope.fetchForms();
                console.log("Executing onLogin callbacks, there are "+$rootScope.onLogin.length+" of them.")
                while($rootScope.onLogin.length > 0){
                    var cb = $rootScope.onLogin.shift();
                    console.log("Executing login callback: ",cb);
                    cb();
                }
                console.log("Login success: ",data);
                window.alert("Welcome back, "+data.displayname)
                $rootScope.currentUser = data;
                $rootScope.app ={};
                if($rootScope.currentUser.displayname == null){
                    $rootScope.setForm('displayname',"Profile",'currentForm');
                    $rootScope.app.state = 'profileview';

                    window.alert("Your profile is missing important information, please complete it before proceeding.")
                }else{
                    //
                    $rootScope.setForm('displayname',"Profile",'currentForm'); //Just so something is set there because it's alarming to have it blank
                    $rootScope.app.state = 'defaultview';
                    window.document.title = $rootScope.currentUser.displayname + "'s Dashboard";
                }

            })
            .error(function(data, status, headers, config) {
                console.error("Error: ",data);
                console.error("Status: ",status);
                window.alert("Login Failed!\nPlease check your username and password, contact support if the problem persists")
            });

        };

    $scope.registerUser = function(){

        console.log("registerUser was called");

        $http.post($rootScope.baseUrl+"/register",$scope.userData)
            .success(function(data, status, headers, config) {
                console.log("Registration success: ",data);
                //$rootScope.currentUser = $scope.userData;
                //$rootScope.app ={};
                //$rootScope.app.state = 'defaultview';
                //window.document.title = $scope.userData.username + "'s Dashboard";
                window.alert("You have successfully registered.  You may now use the login button to proceed.")
            }).
            error(function(data, status, headers, config) {
                console.error("Error: ",data);
                console.error("Status: ",status);
                window.alert("Registration Failed!\nEither you're missing a field or an account exists with this information already, please contact support if the problem persists")
            });

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

