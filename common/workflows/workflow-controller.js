var workflowController = function($rootScope, $scope, $http) {
    console.log("WorkflowController Starting Up!");
    if(!$rootScope.workflows){
        $rootScope.workflows = {};
    }
    $rootScope.$watch('workflows', function () {
        console.log('changing workflows: ', $rootScope.workflows);
        $scope.workflows = $rootScope.workflows;
    });

    $rootScope.$watch('currentWorkflow', function () {
        console.log('changing currentWorkflow: ',$rootScope.currentWorkflow);
        $scope.currentWorkflow = $rootScope.currentWorkflow;
    });

    $scope.now = function(){
        return new Date().now();
    };

    if(window.location.host != "localhost"){
        $rootScope.baseUrl = "https://api.medicaxess.com";
        //$rootScope.baseUrl = "https://medicaxess-padtronics.rhcloud.com/"
    }else{
        $rootScope.baseUrl = "http://localhost:8080";
    }
    $scope.baseUrl = $rootScope.baseUrl +"/workflows";

    $scope.fetchAllWorkFlows = function(){
        $http.get($scope.baseUrl)
            .success(function(data){
                console.log("workflows: ",data);
                $rootScope.workflows = {};
                data.forEach(function(element, index){
                    console.log("Fetching workflow: ", element._id);
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
    $scope.setWorkflowByName = function(name){
        console.log("Looking for workflow named: ",name);
        for(var id in $scope.workflows){
            console.log("Examining: ",id);
            var workflow = $rootScope.workflows[id];
            if(workflow.displayname == name){
                console.log("Found: ",name);
                $rootScope.currentWorkflow = workflow;
                return;
            }
        }
        console.error("Could not find a workflow named ",name);
    };
    $scope.setCurrentReport = function(ref){
      $rootScope.currentReport = ref;
    };
    $scope.stepForward = function(){
        if(!$scope.currentWorkflow.step){
            $scope.currentWorkflow.step = 0;
        }
        $scope.currentForm = $scope.currentWorkflow.forms[$scope.currentWorkflow.step++];
    };
    $scope.stepBackward = function(){
        if($scope.currentWorkflow.step) {
            $scope.currentForm = $scope.currentWorkflow.forms[$scope.currentWorkflow.step--];
        }
    };

    $scope.createWorkflow = function(){
        console.log("Workflow: ", $scope.newFlow);
        $scope.newFlow.creator = $rootScope.currentUser.displayname;
        $scope.newFlow.kind = "encounter"; //For now all workflows need to be encounters since that is what will show up in the patient encounters screen.
        $http.post($scope.baseUrl,$scope.newFlow)
            .success(function(data){
                $scope.newFlow = data;
                if(!Array.isArray($rootScope.workflows)){
                    $rootScope.workflows = [];
                }
                $rootScope.workflows.push($scope.newFlow);
                $scope.newFlow = {};
                window.alert("You have created a new workflow "+data._id+"\nTo add forms to your workflow, press the Edit button in the table above.")

            })
            .error(function(err){
                console.error(err);
                window.alert("There was an error creating your new workflow.\nThis problem is probably temporary.\nTry again later.");
            })
    };

    $scope.saveWorkflow = function(){
        var id = $scope.currentWorkflow._id;
        $http.put($scope.baseUrl+"/"+id, $scope.currentWorkflow)
            .success(function(data){
                console.log("workflow returned: ",data);
                window.alert("Successfully saved "+$scope.currentWorkflow.displayname);
            })
            .error(function(err){
                console.error(err);
                window.alert("Failed to save "+scope.currentWorkflow.displayname+" please try again later");
            })
    };
    $scope.modifyWorkflow = function(flow){
        $scope.currentWorkflowState = 'edit';
        $scope.currentWorkflow = flow;
    };

    $scope.findForm = function(id){

        for(var i in $rootScope.forms){
            if($rootScope.forms[i]._id == id){
                return $rootScope.forms[i];
            }
        }
        return null;
    };
    $scope.findIndex = function(id){

        console.log("looking for id: ",id);
        for(x in $scope.currentWorkflow.forms){
            console.log("offset: ",x);
            var ref = $scope.currentWorkflow.forms[x];
            console.log("looking at form: ", ref);
            if(ref.id == id){
                console.log("found it at: ",x);
                return x;
            }
        }
        console.log("could not find: ",id);
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
        $scope.currentWorkflow.forms.push({id: form._id, repeating: false});
        window.alert("You have now added "+$scope.currentWorkflow.nextstep + " as a step");
        $scope.currentWorkflow.nextstep = "";
    };

    $scope.removeStep = function(id){
        console.log("Attempting to remove: ",id);
        var idx = $scope.findIndex(id);
        if(idx != null) {
            console.log("idx: ",idx);
            $scope.currentWorkflow.forms.splice(idx, 1);
        }else{
            console.error("form not found: ",id);
        }
    };

    $scope.dumpStep = function(id){
        console.log("id: ", id);
        console.log("form: ",$rootScope.forms[id]);
        console.log("forms: ",$rootScope.forms);
    };

    $scope.dump = function(obj){
        $scope.setWorkflowByName("Nuevo Paciente");
        console.log("dumping: ",obj);
        console.log("scope.currentWorkflow: ",$scope.currentWorkflow);
        console.log("rootScope.currentWorkflow: ",$rootScope.currentWorkflow);
    };

    $scope.setCurrent = function(flow){
        console.log("Setting currentWorkFlow to: ",flow);
        $scope.currentWorkflow = flow;
        $rootScope.currentWorkflow = flow;
        $rootScope.currentForm = flow.forms[0];
    };
    $scope.clearWorkFlow = function(){
        console.log("clearing currentWorkFlow");
        $scope.currentWorkflow = null;
        $rootScope.currentWorkflow = null;
    };

    $scope.workflowComplete = function(){
      $scope.clearWorkFlow();
    };
    $rootScope.clearWorkFlow = $scope.clearWorkFlow;
    $rootScope.fetchAllWorkFlows = $scope.fetchAllWorkFlows;
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
    .directive('workflowInteractionWidget',function(){
        console.log("Loading directive workflow-interaction-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/workflow-interaction-widget.html'
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
