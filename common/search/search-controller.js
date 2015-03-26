var searchController = function($rootScope, $scope, $http, $parse) {
    console.log("SearchController Starting Up!");

    $scope.setRecord = function(record){
        $scope.currentRecord = record;//Do more here
    };

    $scope.newRecord = function(){
        var collection = "";
        switch ($rootScope.app.state)
        {
            case 'supporte-view' :
                collection = "support";
                break;
            case 'catalogos-view' :
                collection = "catalogs";
                break;
        }
        if(collection !="") {
            var record = {};
            record.collection = collection;
            record.createdby = $rootScope.currentUser.displayname;
            record.createdby_id = $rootScope.currentUser.displayname;
            record.links = [];
            $rootScope.currentRecord = record;
            $rootScope.app.prev = $rootScope.app.state;
            $rootScope.app.state = "edit-" + collection + "-view";
            window.alert("You are creating a new entry in " + collection + "\nPlease hit the 'save' button when done, to persist it to the database.");
        }else{
            window.alert("Records of this type cannot be created from this screen.\nIf you see this error, you should notify support.");
        }
    };

    $scope.doSearch = function(src){
        console.log("search triggered for: ",$scope.search.Txt);
        if(src == 'btn'){
            window.alert("Results are displayed below");
        }
        if($scope.search.Txt.length < 3){
            return
        }

        var collection = "*";
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
    };

    $scope.viewRecord = function(record){
        console.log("setting view state for: ",record.collection);
        switch(record.collection){
            case  'support' :
                $rootScope.currentRecord = record;
                $rootScope.app.state = 'supporte-view';
            break;
            case  'catalogs' :
                $rootScope.currentRecord = record;
                $rootScope.app.state = 'supporte-view';
            break;
        }
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