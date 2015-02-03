var workflowController = function($rootScope, $scope, $http) {
    console.log("WorkflowController Starting Up!");
    $scope.now = function(){
        return new Date().now();
    };
    if(!$rootScope.workflows){
        $rootScope.workflows = [];
    }
    if (window.location.host != "localhost") {
        $rootScope.baseUrl = "https://api.medicaxess.com";
    } else {
        $rootScope.baseUrl = "http://localhost:8080";
    }
    $scope.baseUrl = $rootScope.baseUrl +"/workflows";

    $scope.fetchAllWorkFlows = function(){
        $http.get($scope.baseUrl)
            .success(function(data){
                console.log("workflows: ",data);
                $rootScope.workflows = {};
                data.forEach(function(element, index){
                    console.log("Fetching workflow: ", element._id)
                    $http.get($scope.baseUrl+"/"+element._id)
                        .success(function(result){
                            console.log("workflow result: ", result);
                            //$rootScope.$apply(function(result){
                                $rootScope.workflows[result[0]._id] = result[0];
                            //})
                            console.log("rootScope.workflows: ",$rootScope.workflows);
                        })
                });
                //$rootScope.workflows = data;
            })
            .error(function(err){
                console.log(err);
                window.alert("There has been a problem contacting the server, please verify that your internet connection is working.")
            })
    };

    $scope.createWorkflow = function(){
        console.log("Workflow: ", $scope.newFlow);
        $scope.newFlow.creator = $rootScope.currentUser.displayname;
        $scope.newFlow.kind = "encounter"; //For now all workflows need to be encounters since that is what will show up in the patient encounters screen.
        $http.post($scope.baseUrl,$scope.newFlow)
            .success(function(data){
                $scope.newFlow = data;
                $rootScope.workflows.push($scope.newFlow);
                $scope.newFlow = {};
                window.alert("You have created a new workflow "+data._id+"\nTo add forms to your workflow, press the Edit button in the table above.")

            })
            .error(function(err){
                console.error(err);
                window.alert("There was an error creating your new workflow.\nThis problem is probably temporary.\nTry again later.");
            })
    };
    $scope.modifyWorkflow = function(flow){
        $scope.currentWorkflowState = 'edit';
        $scope.currentWorkflow = flow;
    };

    $scope.findForm = function(id){
      var len = $rootScope.forms.length;
        for(var i=0; i < len; i++){
            if($rootScope.forms[i]._id == id){
                return $rootScope.forms[i];
            }
        }
        return null;
    };
    $scope.findIndex = function(id){
        var len = $scope.currentWorkflow.forms;
        for(var i=0; i < len; i++){
            if($scope.currentWorkflow.forms[i]._id == id){
                return i;
            }
        }
        return null;
    };
    $scope.setStep = function(){
        var form = $scope.findForm($scope.currentWorkflow.nextstep);
        if(form == null){
            return
        }
        if(!$scope.currentWorkflow.forms){
            $scope.currentWorkflow.forms = [];
        }
        $scope.currentWorkflow.forms.push(form)
        window.alert("You have now added "+$scope.currentWorkflow.nextstep + " as a step");
        $scope.currentWorkflow.nextstep = "";
    };

    $scope.removeStep = function(form){
        var idx = findIndex(form._id);
        if(idx != null) {
            $scope.currentWorkflow.forms.splice(idx, 1);
        }
    };
    $rootScope.onLogin.push($scope.fetchAllWorkFlows);

};

angular.module('workflows',[])
    .controller('WorkflowController', ['$rootScope','$scope', '$http', workflowController])
    .directive('workflowDisplayWidget',function(){
        console.log("Loading directive workflow-display-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/workflow-display-widget.html'
        }
    })
    .directive('workflowModifyWidget',function(){
        console.log("Loading directive workflow-modify-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/workflow-modify-widget.html'
        }
    })
    .directive('createWorkflowArea',function(){
        console.log("Loading directive create-workflow-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/create-workflow-area.html'
        }
    })
;
