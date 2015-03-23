var recordController = function($rootScope, $scope, $http, $parse, $sce) {
    console.log("RecordController Starting Up!");

    $scope.updateMap = function(){
      $scope.currentRecord.mapURL = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBs1YEWx0p86qifx8aaOtwZselyH8K4sRU&q="+escape($scope.currentRecord.address);
    };

    $scope.getMapURL = function(){

        return  $sce.trustAsResourceUrl($scope.currentRecord.mapURL);
    };
    $scope.saveRecord = function(){
        var record = $rootScope.currentRecord;
        var url = $rootScope.baseUrl+"/"+record.collection;
        if(!record._id){
            $http.post(url,record)
                .success(function(data){
                    console.log("data: ",data);
                    $rootScope.currentRecord = data[0];
                    $rootScope.app.state = $rootScope.app.prev;
                })
                .error(function(err){
                   console.error(err);
                    window.alert("There was an error saving this record, please try again later!");
                });
        }else{
            url +="/"+record._id;
            $http.put(url,record)
                .success(function(data){
                    console.log("data: ",data);
                    $rootScope.currentRecord = data[0];
                    $rootScope.app.state = $rootScope.app.prev;
                })
                .error(function(err){
                    console.error(err);
                    window.alert("There was an error saving this record, please try again later!");
                });
        }
    }
};

angular.module('records',[])
    .controller('RecordController', ['$rootScope','$scope', '$http','$parse', '$sce',recordController])
    .directive('editSupportArea',function(){
        console.log("Loading directive edit-support-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/edit-support-area.html'
        }
    })
    .directive('supportArea',function(){
        console.log("Loading directive support-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/support-area.html'
        }
    })
;