/**
 * The dashboard is a collection of views and views are collections of widgets
 * @param $rootScope
 * @param $scope
 * @param $http
 */

var dashboardController = function($rootScope, $scope, $http){
    console.log("Loading dashboard controller");

    $scope.patients = [
         {
            displayname: "Victor Vargas",
            gender: "M",
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
        },
        {
            displayname: "Faye King",
            gender: "F",
            dob: "19870630",
            records:[
                {
                    date: Date.now(),
                    provider: 'Dr Morales',
                    location: 'Consultorio Web',
                    complaints: [
                        "Unconciousness Following Automobile Accident"
                    ],
                    obs : [
                        { name: 'Visual Inspection',
                            status : 'complete',
                            notes: 'Observed bruising / swelling around left orbital'
                        }
                    ],
                    studies : [
                        {
                            name: 'MRI Skull',
                            status: 'ordered',
                            notes: 'Sent to Imaxess for MRI'
                        }

                    ],
                    orders : [
                        {
                            type: 'study',
                            status: 'on-order',
                            studytype: 'MRI Skull',
                            reason: 'Homeostasis check, rule out concussion'
                        }
                    ]
                }
            ]
        },
        {
            displayname: "Antonia Malsalud",
            gender: "F",
            dob: "19691215",
            complaint: "Annual Checkup",
            records:[
                {
                    date: Date.now(),
                    provider: 'Dr Morales',
                    location: 'Consultorio Web',
                    complaints: [
                        "None"
                    ],
                    obs : [
                        { name: 'Visual Inspection',
                            status : 'complete',
                            notes: 'normal'
                        },
                        {
                            name: 'BP',
                            stat: 'complete',
                            notes: '120/98'
                        }
                    ],
                    studies : [
                        {
                            name: 'CBC',
                            status: 'ordered',
                            notes: 'Sent to Imaxess for CBC'
                        },
                        {
                            name: 'HbA1C',
                            status: 'ordered',
                            notes: 'Sent to Imaxess for HbA1C'
                        },
                        {
                            name: 'MAMMO',
                            status: 'ordered',
                            notes: 'Sent to Imaxess for Mammogram'
                        }

                    ],
                    orders : [
                        {
                            type: 'study',
                            status: 'on-order',
                            studytype: 'CBC',
                            reason: 'Annual Exam, Complete blood count'
                        },
                        {
                            type: 'study',
                            status: 'on-order',
                            studytype: 'HbA1C',
                            reason: 'Annual Exam, HbA1C'
                        },
                        {
                            type: 'study',
                            status: 'on-order',
                            studytype: 'MAMMO',
                            reason: 'Annual Exam, Mammogram'
                        }
                    ]
                }
            ]
        }
        ];


    $scope.searchPatients = function(fieldname){

      $scope.matches = [];
       $scope.patients.forEach(function(patient){
           //console.log("Looking at: ",patient);
           if(patient[fieldname].toLowerCase().contains($scope.search[fieldname].toLowerCase())){
               $scope.matches.push(patient);
           }
       });
    };

    $scope.setCurrentPatient = function(patient){
        $scope.app.state = 'providerview-patient';
        $scope.currentPatient = patient;
        drawChart();
    };
    $scope.addInfo = function(patient){
        if(patient.extraInfo == undefined){
            patient.extraInfo = {};
        }
        patient.extraInfo[$scope.fieldName] = $scope.fieldValue;

    };
    $scope.appendRecord = function(patient){
        var record =  {
          date: 'today',
          provider: $scope.userData.fullname,
          location: $scope.userData.location,
          complaints: [],
          obs : [],
          studies : [],
          orders : [],
          rx : []
        };
        patient.records.push(record);
        $scope.currentRecord = record;
    };

    $scope.startEncounter = function(patient){
        $rootScope.clearWorkFlow();
        $rootScope.fetchAllWorkFlows();
        $rootScope.currentPatient = patient;
        $scope.newEncounter = true;
        console.log("There are " + $rootScope.workflows.length + " workflows");

    };

    $scope.showPatient = function(id){
        $scope.app.state = 'providerview-patient';
        $scope.currentPatient = $scope.patients[id];
        drawChart();
    };

    $scope.showRecordDetail = function(record){
        console.log("Selected record: ",record);
        $scope.currentRecord = record;
    };

    $scope.appendComplaint = function(record){
        console.log("newComplaint is ",$scope.newComplaint);
        for(var x=0; x< record.complaints.length; x++){
            if(record.complaints[x] === $scope.newComplaint){
                return;
            }
        }
        record.complaints.push($scope.newComplaint);
        $scope.newComplaint={};
    };

    $scope.appendObservation = function(record){
        var observation = {};
        observation.name = $scope.newOb.name;
        observation.status = $scope.newOb.status;
        observation.notes = $scope.newOb.notes;
        record.obs.push(observation);
        $scope.newOb = {};
    };

    $scope.appendStudy = function(record){
        var study = {};
        study.name = $scope.newStudy.name;
        study.status = $scope.newStudy.status;
        study.notes = $scope.newStudy.notes;
        record.studies.push(study);
        $scope.newStudy = {}
    }

    $scope.startVideo = function(){
        initVideo();
        $scope.chatstate = "started";
    }

    $scope.viewStudy = function(patient){
        var url = "http://pacs.medicaxess.com:8080/plugin-dwv/explorer.html#patient?name="+escape(patient.name);
        window.open(url);
    }
};

angular.module('dashboard',[])
    .controller('DashboardController', ['$rootScope','$scope', '$http', dashboardController])
    .directive('dashboardArea',function(){
        console.log("Loading directive dashboard-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/dashboard-area.html'
        }
    })
    .directive('profileArea',function(){
        console.log("Loading directive profile-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/profile-area.html'
        }
    })
    .directive('patientArea',function(){
        console.log("Loading directive patient-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/patient-area.html'
        }
    })
    .directive('chartsArea',function(){
        console.log("Loading directive charts-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/charts-area.html'
        }
    })
    .directive('conferenceArea',function(){
        console.log("Loading directive conference-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/conference-area.html'
        }
    })
    .directive('patientInfoWidget',function(){
        console.log("Loading directive patient-info-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/patient-info-widget.html'
        }
    })
    .directive('patientVitalsWidget',function(){
        console.log("Loading directive patient-vitals-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/patient-vitals-widget.html'
        }
    })
    .directive('patientCustomFieldEditorWidget',function(){
        console.log("Loading directive patient-custom-field-editor-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/patient-custom-field-editor-widget.html'
        }
    })
    .directive('patientEncountersWidget',function(){
        console.log("Loading directive patient-records-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/patient-encounters-widget.html'
        }
    })
    .directive('patientRecordDetailWidget',function(){
        console.log("Loading directive patient-record-detail-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/patient-record-detail-widget.html'
        }
    })
    .directive('videoConferenceWidget',function(){
        console.log("Loading directive video-conference-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/video-conference-widget.html'
        }
    })
    .directive('complaintsWidget',function(){
        console.log("Loading directive complaints-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/complaints-widget.html'
        }
    })
    .directive('observationsWidget',function(){
        console.log("Loading directive observations-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/observations-widget.html'
        }
    })
    .directive('ordersWidget',function(){
        console.log("Loading directive orders-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/orders-widget.html'
        }
    })
    .directive('studiesWidget',function(){
        console.log("Loading directive studies-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/studies-widget.html'
        }
    })
    .directive('prescriptionWidget',function(){
        console.log("Loading directive prescription-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/prescription-widget.html'
        }
    });

