var searchController = function($rootScope, $scope, $http, $parse) {
    console.log("SearchController Starting Up!");

    $scope.setRecord = function(record){
        $scope.currentRecord = record;//Do more here
    };

    $scope.doSearch = function(){
        console.log("search triggered for: ",$scope.search.Txt);
        if($scope.search.Txt.length < 4){
            return
        }
        var collection = "*"
        switch ($rootScope.app.state)
        {
            case 'pacientes-view' :
                collection = "patients";
                break;
            case 'estudios-view' :
                collection = "studies";
                break;
            case 'reportes-view' :
                collection = "reports";
                break;
            case 'supporte-view' :
                collection = "support";
                break;
            case 'catalogos-view' :
                collection = "catalogs";
                break;
        }
        var url = $rootScope.baseUrl + "/find/"+collection+"/*/"+$scope.search.Txt;
        console.log("querying: ",url);
        $http.get(url)
            .success(function(data){
                console.log("Received ",data);
                var records = {}
                for(var record in data){
                    if(!records[data[record].collection]){
                        records[data[record].collection] = [];
                    }
                    //console.log("Adding: ",data[record]);
                    records[data[record].collection].push(data[record]);
                }
                $rootScope.currentResults = records;
                console.log("records: ",records);
            })
            .error(function(error){
                console.error(error);
            })
    }
};

angular.module('search',[])
    .controller('SearchController', ['$rootScope','$scope', '$http','$parse', searchController])
    .directive('globalSearchWidget',function(){
        console.log("Loading directive global-search-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/global-search-widget.html'
        }
    })
    .directive('searchResultsWidget',function(){
        console.log("Loading directive search-results-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/search-results-widget.html'
        }
    });