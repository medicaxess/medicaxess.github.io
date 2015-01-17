/**
 * Created by dev on 1/16/15.
 */

var navigationController =  function($rootScope, $scope, $http, $timeout) {


    $scope.doUiTease = function(){
        $scope.toggleNav();
        $timeout(function(){
            alert("Welcome to Medicaxess!\nTo show/hide the navigation bar, hover your mouse (or press your finger) to the left of the window, or click on our logo.");
            $scope.toggleNav();
        }, 2100);
    };

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
        $scope.navClass = "oneHundredPxWide";
    };

    $scope.hideNav = function(){
        $rootScope.navShowing = false;
        $scope.navClass = "onePxWide";
    };

    function showMessage(msg){
        console.log("showMessage was called!");
        window.alert(msg);
    }

    $scope.doUiTease();
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
            templateUrl: '/views/partials/navigation-area.html'
        }
    });

