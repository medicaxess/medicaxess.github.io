/**
 * This controller is used to handle interactions within the patient's view of themselves
 * @param $rootScope
 * @param $scope
 * @param $http
 */

var patientDashboardController = function($rootScope, $scope, $http){
    console.log("Loading PatientDashBoardController");
    $scope.currentPatient = {};

    if($rootScope.currentPatient == undefined){
        /*
        $http.get("/api/patient/default")
            .success(function(data){
                $rootScope.currentPatient = data;
                $scope.currentPatient = data;
            });
            */
        $scope.currentPatient =  {
            name: "Victor Vargas",
            gender: "F",
            dob: "19760704",
            photo: "/img/victor_vargas.png",

            rx : [
                {
                    drug :  'Albuterol Inhaler',
                    dose : '10mg',
                    frequency : 'PRN',
                    duration : '3m',
                    refillsallowed : '10',
                    reason : 'Shortness of breath'
                }
            ],
            records:[
                {
                    date: Date.now(),
                    provider: 'Dr Morales',
                    location: 'Consultorio Web',
                    complaints: [
                        "Shortness of breath"
                    ],
                    obs : [
                        { name: 'auscultation',
                            status : 'complete',
                            notes: 'Observed wheezing'
                        }
                    ],
                    studies : [
                        {
                            name: 'chest xray',
                            status: 'ordered',
                            notes: 'Sent to Imaxess for chest x-ray'
                        }

                    ],
                    orders : [
                        {
                            type: 'study',
                            status: 'on-order',
                            studytype: 'xray chest',
                            reason: 'Rule out blockage'
                        }
                    ]
                }
            ]
        }
    }else{
        $scope.currentPatient = $rootScope.currentPatient;
    }

    //Need a list of field names, values and types so we can construct a proper form for it
    /*
    $http.get("/api/patient/fields")
        .success(function(data){
            $scope.fieldData = data;
        });
        */
    $scope.requiredFields = [
        {
          displayName: 'Name',
            name: 'name',
            type: 'text'
        },
        {
            displayName: 'Date of Birth',
            name: 'dob',
            type: 'date'
        },
        {
            displayName: 'Gender',
            name: 'gender',
            type: 'list',
            values: [
                {   name: "Male",
                    value: "M"
                },
                {
                    name: "Female",
                    value: "F"
                },
                {
                    name: "Other / Unspecified",
                    value: "O"
                }
            ]
        },
        {
            displayName: 'Photo',
            name: 'photo',
            type: 'image'
        },
        {
            displayName: 'Favorite Color',
            name: 'favorite-color',
            type: 'color'
        }
    ]
};

angular.module('patientdashboard',[])
    .controller('PatientDashboardController', ['$rootScope','$scope', '$http', patientDashboardController])
    .directive('patientArea',function(){
        console.log("Loading directive patient-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/patient-area.html'
        }
    })
    .directive('patientEditArea',function(){
        console.log("Loading directive patient-edit-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/patient-edit-area.html'
        }
    });