var formController = function($rootScope, $scope, $http) {
    console.log("FormController Starting Up!");

    if(window.location.host != "localhost"){
        $rootScope.baseUrl = "https://api.medicaxess.com";
    }else{
        $rootScope.baseUrl = "http://localhost:8080";
    }

    $scope.baseUrl = $rootScope.baseUrl+"/forms";
    $rootScope.currentPatient =  {
        name: "Victor Vargas",
        gender: "Male",
        dob: new Date(1976,6,4),
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
    };

    $scope.newForm = function(){
        $rootScope.currentForm = {
            displayname: "Default Example Form (change me)",
            collection: "user-profiles",
            scope: "all",
            recordtype: "user-forms",
            fields: [
                {
                    displayname: "Name",
                    type: "text",
                    databind: "currentUser.displayname",
                    variable: "user.name",
                    collapsed: true
                },
                {
                    displayname: "Email",
                    databind: "currentUser.email",
                    variable: "user.email",
                    type: "email",
                    collapsed: true
                }
            ]
        };
    };

    $scope.formInf ={
        //Scopes limit edit horizon of a form to within some degree of relationship with the creator
        //Self is creator
        //Subordinate is anyone who works FOR the creator
        //Location is anyone who works WITH the creator
        //Everyone is global
        scopes : [
            {name: "Self", value: "self"},
            {name: "Subordinates", value: "subordinate"},
            {name: "Location", value: "location"},
            {name: "Everyone", value: "all"}

        ],
        //Collections define which database and thereby which API & ruleset apply to the objects created by this form
        //This defines where the object will be stored, current just patient-info, patient-data & users
        //
        collections : [
            {name: "Patient Records", value: "patients"},
            {name: "Employee Records", value: "users"}
        ],
        //recordtype is a custom searching and indexing field for the use of the form creator
        //Below are some examples
        recordtypes : [
            {name: "Patient Forms (General)", value: "patient-forms"},
            {name: "Patient Forms (Vitals)", value: "patient-vitals"},
            {name: "Patient Forms (Appointments)", value: "patient-appointments"}
        ]
    };

    function enumerateFields(){
        var array = [
            {name: "Record - at time of service", value: 'currentRecord'},
            {name: "Patient - at time of service", value: 'currentPatient'},
            {name: "User - Person Inputting Data", value: 'currentUser'},
            {name: "Location of User - at time of service", value: 'currentLocation'},
        ];
        var keys = Object.keys($rootScope.currentPatient);
        keys.forEach(function(key, index,keys){
            if($rootScope.currentPatient.hasOwnProperty(key)) {
                if(!Array.isArray($rootScope.currentPatient[key])) {
                    var obj = {};
                    obj.name = key;
                    obj.value = "currentPatient." + key;
                    array.push(obj);
                }
            }
        });
        /*
        keys = Object.keys($rootScope.currentUser);
        keys.forEach(function(key, index,keys){
            if($rootScope.currentUser.hasOwnProperty(key)) {
                if(!Array.isArray($rootScope.currentPatient[key])) {
                    var obj = {};
                    obj.name = key;
                    obj.value = "currentUser." + key;
                    array.push(obj);
                }
            }
        });
        */

        console.log("Patient array: ", array);
        return array;
    }
    //Allows binding of field defaults to current Objects
    $scope.fieldInf  = {

        bindings : enumerateFields(),

        fieldtypes : [
            {name: "Plain Text - Single Line",              value: "text"},
            {name: "Plain Text - Multi Line",               value: "textarea"},
            {name: "Photograph or Other Image",             value: "photo"},
            {name: "Video (from file, or camera)",          value: "video"},
            {name: "Color",                                 value: "color"},
            {name: "Email",                                 value: "email"},
            {name: "URL",                                   value: "url"},
            {name: "Checkbox",                              value: "checkbox"},
            {name: "Radio Button",                          value: "radio" },
            {name: "List",                                  value: "list"},
            {name: "Telephone Number",                      value: "tel"},
            {name: "Number",                                value: "number"},
            {name: "Range",                                 value: "range"},
            {name: "Month",                                 value: "month"},
            {name: "Week",                                  value: "week"},
            {name: "Time",                                  value: "time"},
            {name: "Date (yyyy/mm/dd)",                     value: "date"},
            {name: "Date & Time (with timezone)",           value: "datetime"},
            {name: "Date & Time (no timezone)",             value: "datetime-local"}
        ]
    };

    $scope.addField = function(field){
        console.log("Adding a field");
        var fields = $rootScope.currentForm.fields;
        var index = fields.indexOf(field);
        console.log("Index: ",index);
        var newField = {
            displayname: "New Field",
            collapsed: true
        };
        if(index == -1){
            fields.push(newField);
        }else {
           fields.splice(index+1, 0, newField);
        }
        console.log("fields: ",fields);
        $rootScope.currentForm.fields = fields;
        return fields;
    };

    $scope.deleteField = function(field){
        console.log("Deleting a field");

        var fields = $rootScope.currentForm.fields;
        fields.splice(fields.indexOf(field), 1);
        $rootScope.currentForm.fields = fields;

        return fields;
    };

    $scope.moveField = function(field, updown){
        console.log("Moving a field: ",field);
        var fields = $rootScope.currentForm.fields;
        var index =  fields.indexOf(field);
        console.log("From: ",index);
        var offset = index;
        if(updown == 'up'){
            if(offset > 0) {
                offset--;
            }else{
                offset = fields.length -1;
            }
        }else{
            if(offset < fields.length -1) {
                offset++;
            }else{
                offset = 0;
            }
        }
        console.log("To: ", offset);
        //fields.move(index,1,offset);
        $scope.deleteField(field);
        fields.splice(offset,0,field);
        $rootScope.currentForm.fields = fields;
    };

    $scope.addListItem = function(field){
        if(field.list == undefined){
            field.list = [];
        }
        field.list.push({});
    };

    $scope.removeListItem = function(field, item){
        var index = field.list.indexOf(item);
        field.list.splice(index,1);
    };

    $scope.toggleCollapse = function(field){
        console.log("Toggling collapse of "+field.displayname);
        field.collapsed = !field.collapsed;
        $("#" + field).collapse('toggle');
    };

    $scope.saveForm = function(){
        if(!$rootScope.currentForm.hasOwnProperty("_id")){

            $rootScope.currentForm.owner_id = $rootScope.currentUser._id;
            $http.post($scope.baseUrl,$rootScope.currentForm)
                .success(function(data){
                    $scope.fetchAllForms();
                    window.alert("Form has been successfully saved, you can now reference by name or by id");
                })
                .error(function(error){
                    console.error(error);
                    window.alert("There has been an error in persisting the form");
                });
        }else{
            var url = $scope.baseUrl+"/"+$rootScope.currentForm._id
            $http.put(url,$rootScope.currentForm)
                .success(function(data){
                    $scope.fetchAllForms();
                    window.alert("Changes to your form have been saved!")
                })
                .error(function(error){
                    console.error(error);
                    window.alert("There has been an error in persisting the form, it appears you were logged out, you will be returned to the login screen now.");
                    //$rootScope.app.state = undefined;
                });
        }


    };

    $scope.cloneForm = function(form){
        var newForm = form;
        delete newForm._id;
        $rootScope.currentForm = newForm;
    };

    $scope.saveFormData = function(form){
        console.log("saving: ",form);
        var loc = $scope.currentForm.collection;
        console.log("saving it to: ",$rootScope.baseUrl+"/"+loc);
        $http.post($rootScope.baseUrl+"/"+loc, form)
            .success(function(data){
                $rootScope[data.scope] = data;
            })
            .error(function(error){
                console.error(error)
            })
    };

    $scope.fetchForm = function(name, id){
        name = encodeURIComponent(name);
      $http.get($scope.baseUrl+"/"+name)
          .success(function(data){
              console.log(data);
              $rootScope[id] = data;
          })
          .error(function(error){
              console.error(error);
              window.alert("There was a problem fetching a required form")
          })
    };

    $scope.fetchAllForms = function(){
        console.log("Fetching all forms from "+$scope.srl);
        $http.get($scope.baseUrl)
            .success(function(data){
                console.log("forms: ",data);
                $rootScope['forms'] = data;

            })
            .error(function(error){
                console.error(error);
                window.alert("There was a problem fetching a required form")
            })
    };

    $scope.deleteForm = function(form){
        var id = form._id
        delete $rootScope.forms[form]
        $http.delete($scope.baseUrl+"/"+id)
            .success(function(data){
                $scope.fetchAllForms();
                window.alert("You have successfully deleted a form")
            })
            .error(function(err){
                console.error(err)
                window.alert("There was a problem deleting that form, possibly it was locked, out of sync or already deleted.  Try again later")
            })
    };
    /**
     * This sets a rootScope object to an arbitrary form
     * e.g. displayname, Profile, currentForm will set $rootScope.currentForm = {displayname: Profile ...}
     * @param haystack (the field to search in rootScope.forms
     * @param needle (the value to search for)
     * @param id (the field off rootScope to set if/when the form is found)
     */
    $scope.setForm = function(haystack,needle,id){

        console.log("Looking for ",needle," in ",haystack," to set ", id);
        console.log("Available Forms: ",$rootScope['forms']);
        var forms = $rootScope['forms'];
        if(Array.isArray(forms)) {
            for (var i = 0; i <= forms.length; i++) {
                console.log("form: ", forms[i]);
                if (forms[i][haystack] == needle) {
                    $rootScope[id] = forms[i];
                    break;
                }
            }
        }else{
            $rootScope[id]= $rootScope[forms]
        }
    };

    $scope.editForm = function(form){
        $rootScope.currentForm = form;
    }
    $rootScope.setForm = $scope.setForm;
    $rootScope.fetchForms = $scope.fetchAllForms;

};

angular.module('customforms',[])
    .controller('FormController', ['$rootScope','$scope', '$http', formController])
    .directive('formWidget',function(){
        console.log("Loading directive form-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/form-widget.html'
        }
    })
    .directive('formListWidget',function(){
        console.log("Loading directive form-list-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/form-list-widget.html'
        }
    })
    .directive('formEditWidget',function(){
        console.log("Loading directive form-edit-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/form-edit-widget.html'
        }
    })
    .directive('fieldAdjustWidget',function(){
        console.log("Loading directive field-adjust-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/field-adjust-widget.html'
        }
    })
    .directive('fieldEditWidget',function(){
        console.log("Loading directive field-edit-widget");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/widgets/field-edit-widget.html'
        }
    })
    .directive('customFormsArea',function(){
        console.log("Loading directive custom-forms-area");
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/views/partials/custom-forms-area.html'
        }
    })
    .directive('dynamicModel', ['$compile', function ($compile) {
        return {
            'link': function(scope, element, attrs) {
                scope.$watch(attrs.dynamicModel, function(dynamicModel) {
                    if (attrs.ngModel == dynamicModel || !dynamicModel) return;

                    element.attr('ng-model', dynamicModel);
                    if (dynamicModel == '') {
                        element.removeAttr('ng-model');
                    }

                    // Unbind all previous event handlers, this is
                    // necessary to remove previously linked models.
                    element.unbind();
                    $compile(element)(scope);
                });
            }
        };
    }])
;