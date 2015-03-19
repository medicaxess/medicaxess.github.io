/**
 * Created by dev on 1/16/15.
 */

var navigationController =  function($rootScope, $scope, $http, $timeout) {

    $scope.toggleNav = function(){
        //console.log("toggleNav was called!");
        if(!$rootScope.navShowing){
            $scope.showNav();
        }else{
            $scope.hideNav();
        }

    };

    $scope.showNav = function(){
        $rootScope.navShowing = true;
        $scope.navClass = "oneHundredPxHigh";
    };

    $scope.hideNav = function(){
        $rootScope.navShowing = false;
        $scope.navClass = "onePxHigh";
    };

    $scope.setState = function(state){
        if(!$rootScope.app){
            $rootScope.app ={};
        }
        $rootScope.app.state = state;
       console.log("Showing "+$rootScope.app.state);
    };

};

angular.module('navigation',[])
    .controller('NavigationController', ['$rootScope','$scope', '$http','$timeout', navigationController])
    .directive('headerArea',function(){
        console.log("Loading directive header-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/header-area.html'
        }
    })
    .directive('navigationArea',function(){
        console.log("Loading directive navigation-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/navigation-area-new.html'
        }
    });

