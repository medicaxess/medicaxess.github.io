/**
 * The dashboard is a collection of views and views are collections of widgets
 * @param $rootScope
 * @param $scope
 * @param $http
 */

var dashboardController = function($rootScope
                                   ,$scope
                                   ,$http
                                   ,$compile
                                   //,uiCalendarConfig
){
    Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        return this;
    };

    console.log("Loading dashboard controller");
    $scope.setState = function(state){
        if(!$rootScope.app){
            $rootScope.app ={};
        }
        $rootScope.app.state = state;
        console.log("Showing "+$rootScope.app.state);
    };
    $scope.eventSource = {
        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
        className: 'gcal-event'           // an option!
    };

    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        /*
        element.attr({'tooltip': event.title,
            'tooltip-append-to-body': true});
        */
        element.attr({'onclick': $scope.onCalendarClick})

        $compile(element)($scope);
    };
    $scope.onCalendarClick = function(evt, jsEvent, view){
        console.log("evt: ",evt);
        console.log("event: ",jsEvent);
        console.log("view: ",view);
        if(evt == 0){
            return;
        }
        $scope.currentEvent = evt;

        var now = evt.start;
        //var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var dateOfMonth = now.getDate();
        console.log("now: ",now);
        console.log("year: ",year);
        console.log("month: ",month);
        console.log("dateOfMonth: ",dateOfMonth);
        $scope.gotoDate('bigCalendar', year, month, dateOfMonth);
        $scope.changeView('agendaDay','bigCalendar');
    };

    $scope.gotoDate = function(calendar,year, month, dateOfMonth){
        uiCalendarConfig.calendars[calendar].fullCalendar('gotoDate',year,month,dateOfMonth);
    };
    /* config object */
    $scope.uiConfig = {
        calendar:{

            editable: true,
            header: {
                left: 'title',
                center: 'today prev,next',
                right: ''
            },
            defaultView: 'agendaWeek',
            eventClick: $scope.onCalendarClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender
        }
    };
    //console.log("uiCalendarConfig: ",uiCalendarConfig);
    $scope.currentTime = function(){
        return new Date();
    };
    var now = $scope.currentTime();

    $scope.isDate = function(val) {
        var d = new Date(val);
        return !isNaN(d.valueOf());
    };

    $scope.events = {
        color: 'yellow',
        textColor: 'black',
        events: [
            {type:'availability',title: 'Available',start: now, end: $scope.currentTime().addHours(2), allDay: false}
        ]
    };

    /* Change View */
    $scope.changeView = function(view,calendar) {
        //$scope.saveEvent();
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    $scope.renderCalendar = function(calendar) {
        if(uiCalendarConfig.calendars[calendar]){
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    $scope.newEvent = function(){
        var now = $scope.currentTime();
        now.setMinutes(0);
        $scope.currentEvent = {
            title : 'New Appointment',
            start : now,
            end : now.addHours(1),
            new : true
        };
    };
    $scope.saveEvent = function(){
        if(!$scope.currentEvent){
            return;
        }
        if($scope.currentEvent.new){
            delete $scope.currentEvent.new;
            $scope.events.events.push($scope.currentEvent);
        }
        delete $scope.currentEvent;
        //$scope.renderCalendar('bigCalendar');
        $scope.changeView('month','bigCalendar')
    };
    if (typeof String.prototype.contains === 'undefined') { String.prototype.contains = function(it) { return this.indexOf(it) != -1; }; }
    $scope.patient = {};

    $scope.fetchAllPatients = function(){
      $http.get($rootScope.baseUrl+"/find/patients/*/*")
          .success(function(data){
              console.log("patients: ",data);
              var patients = {};
              for(var patient in data){
                  patients[data[patient]._id] = data[patient];
              }
              $rootScope.patients = patients;
              $rootScope.matches = patients;
          })
    };

    $scope.searchPatients = function() {

        $rootScope.matches = {};
        if ($rootScope.patients) {

            console.log("rootScope.patients: ", $rootScope.patients);
            for(var person in $rootScope.patients ){
                person = $rootScope.patients[person];
                console.log("patient: ",person);
                var matched = 0;
                for(var field in $scope.patient){
                    if(!$scope.patient.hasOwnProperty(field) || !person.hasOwnProperty(field)){
                        continue;
                    }
                    console.log("comparing field: ",field);
                    var data = $scope.patient[field];
                    if($scope.isDate(data) && $scope.isDate(person[field])){
                        var searchDate = new Date(data);
                        var recordDate = new Date(person[field]);

                        if(searchDate.getUTCFullYear() == recordDate.getUTCFullYear()){
                            matched++;
                        }else{
                            matched--;
                        }
                        if(searchDate.getUTCMonth() == recordDate.getUTCMonth()){
                            matched++;
                        }else{
                            matched--;
                        }
                        continue;
                    }

                    if(person[field].toLowerCase().contains(data)){
                        matched++;
                    }else{
                        matched--;
                    }
                }
                if(matched > 0){
                    $rootScope.matches[person._id] = person;
                }
            }
        }else{
            $scope.fetchAllPatients();
        }
    };



    $scope.setCurrentPatient = function(id){

        $scope.currentPatient = $rootScope.patients[id];
        $rootScope.currentPatient = $scope.currentPatient;
        //drawChart();
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
        //drawChart();
    };

    $scope.hidePatient = function(){
        delete $scope.currentPatient;
        delete $rootScope.currentPatient;

    };
    $scope.newPatient = function(){
        if($scope.patient.displayname){
            console.log("creating: ",$scope.patient);
            $scope.patient.createdby = $rootScope.currentUser.displayname;
            $scope.patient.createdby_id = $rootScope.currentUser._id;
            $scope.patient.collection = "patients";

            delete($scope.patient._id);
            $http.post($rootScope.baseUrl+"/patients",$scope.patient)
                .success(function(data){
                    console.log("new patient: ",data);
                    $scope.currentPatient = data;
                    $scope.fetchAllPatients();
                    window.alert("Successfully created new patient "+data.displayname);
                })
                .error(function(err){
                    console.error(err);
                    window.alert("There was a problem creating this patient, please try again in a few minutes.");
                })
        }else{
            window.alert("You need to at least input a patient name to continue");
        }
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
    };

    $scope.startVideo = function(){
        initVideo();
        $scope.chatstate = "started";
    };

    $scope.viewStudy = function(patient){
        var url = "http://pacs.medicaxess.com:8080/plugin-dwv/explorer.html#patient?name="+escape(patient.name);
        window.open(url);
    };
    $scope.setDefaultCalendar = function(){
        $scope.changeView('agendaDay', 'bigCalendar');
        $scope.changeView('month', 'littleCalendar');
        $http.get($rootScope.baseUrl+"/events")
            .success(function(data){
                $scope.events.push(data[0]);
            })
            .error(function(err){
                console.error(err);
            });
    };

    $scope.eventSources = [$scope.events,$rootScope.events];

    if(!$rootScope.onLogin){
        $rootScope.onLogin = [];
    }

    $rootScope.onLogin.push($scope.fetchAllPatients);
    $rootScope.onLogin.push($scope.setDefaultCalendar);

};

angular.module('dashboard',[])
    .controller('DashboardController', [
        '$rootScope'
        ,'$scope'
        ,'$http'
        ,'$compile'
        //,'uiCalendarConfig'
        , dashboardController
    ])
    .directive('dashboardArea',function(){
        console.log("Loading directive dashboard-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/dashboard-area.html'
        }
    })
    .directive('agendaArea',function(){
        console.log("Loading directive agenda-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/agenda-area.html'
        }
    })
    .directive('buscarArea',function(){
        console.log("Loading directive buscar-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/buscar-area.html'
        }
    })
    .directive('estudiosArea',function(){
        console.log("Loading directive estudios-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/estudios-area.html'
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
    .directive('searchArea',function(){
        console.log("Loading directive search-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/search-area.html'
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
    .directive('patientSearchWidget',function(){
        console.log("Loading directive patient-search-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/patient-search-widget.html'
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

