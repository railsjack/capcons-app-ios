'use strict';
// projectmgrApp
window.debug = false;


var settings = {
    url: 'http://ccsanalytics.com/'
    //url: 'http://122.160.65.44:3000/'
};


angular.module('CCS-Safety', [
  'ngRoute',
  'ngResource'
])
.run(['$rootScope', function ($rootScope) {
    $rootScope._T = function (key) {
        if (lang_code == 'en') return key;
        //return "_"+key || "";
        return lang[key] || "";
    };
}])
.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    // Enable Angular to pull data from 3rd party domain (used for API)
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Include authorization request with every $http
    $httpProvider.interceptors.push('Headersauthinterceptor');
    // WebSettings settings = webview.getSettings();
    // settings.setDomStorageEnabled(true);

    // Check response header if 401 re-direct to login page
    $httpProvider.responseInterceptors.push('Responseauthinterceptor');

    $routeProvider
      .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
      })
      .when('/projectMgr', {
          templateUrl: 'views/projectmgr.html',
          controller: 'ProjectmgrCtrl'
      })
      .when('/categoryList/:id', {
          templateUrl: 'views/categorylist.html',
          controller: 'CategorylistCtrl'
      })
      .when('/questionList/:id', {
          templateUrl: 'views/questionlist.html',
          controller: 'QuestionlistCtrl'
      })
      .when('/incidentReport/:id', {
          templateUrl: 'views/incidentreport.html',
          controller: 'IncidentreportCtrl'
      })
      .when('/jobhazardReport/:id', {
          templateUrl: 'views/jobhazardreport.html',
          controller: 'JobhazardreportCtrl'
      })
      .when('/newUser', {
          templateUrl: 'views/newuser.html',
          controller: 'NewuserCtrl'
      })
      .when('/newProject', {
          templateUrl: 'views/newproject.html',
          controller: 'NewprojectCtrl'
      })
      .when('/checklist/:id', {
          templateUrl: 'views/checklist.html',
          controller: 'ChecklistCtrl'
      })
      .when('/projectlist', {
          templateUrl: 'views/projectlist.html',
          controller: 'ProjectlistCtrl'
      })
      .when('/answer/:id', {
          templateUrl: 'views/answer.html',
          controller: 'AnswerCtrl'
      })
      .when('/user', {
          templateUrl: 'views/user.html',
          controller: 'LoginCtrl'
      })
      .when('/editproject', {
          templateUrl: 'views/editproject.html',
          controller: 'EditProjectCtrl'
      })
      .when('/sendemail', {
          templateUrl: 'views/sendemail.html',
          controller: 'SendemailCtrl'
      })
      .when('/passwordreset', {
          templateUrl: 'views/passwordreset.html',
          controller: 'PasswordresetCtrl'
      })
      .when('/unresolved/:id', {
          templateUrl: 'views/unresolved.html',
          controller: 'UnresolvedCtrl'
      })
      .when('/unanswered/:id', {
          templateUrl: 'views/unanswered.html',
          controller: 'UnansweredCtrl'
      })
      .when('/unansweredemail', {
          templateUrl: 'views/unansweredemail.html',
          controller: 'UnansweredemailCtrl'
      })
      .when('/incident/:id', {
          templateUrl: 'views/incident.html',
          controller: 'IncidentCtrl'
      })
      .when('/showincident/:id', {
          templateUrl: 'views/showincident.html',
          controller: 'ShowincidentCtrl'
      })
      .when('/jobhazard/:id', {
          templateUrl: 'views/jobhazard.html',
          controller: 'JobhazardCtrl'
      })
      .when('/showjobhazard/:id', {
          templateUrl: 'views/showjobhazard.html',
          controller: 'ShowjobhazardCtrl'
      })
      .when('/hospitals', {
          templateUrl: 'views/hospitals.html',
          controller: 'GMapCtrl'
      })
      .otherwise({
          redirectTo: '/login'
      });
}
]);

// I don't want any real form submit, just ajax submits
$.validator.setDefaults({
    debug: true
});

var currentLocation;
var myPhonegapApp = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        myPhonegapApp.receivedEvent();
    },
    // Update DOM on a Received Event
    receivedEvent: function () {
        if (window.debug) console.log('Device ready');
    },
    onSuccess: function(position) {
    	currentLocation = position;
    	//alert(currentLocation);
    },
    onError: function(error) {
    	//alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }
};

myPhonegapApp.initialize();


var validateUtils = {

    highlight: function (element) {
        if ($(element).siblings("i").length === 0) {
            var icon = $("<i>").addClass("fa fa-exclamation-triangle text-danger");
            $(element).after(icon);
        }
    },
    unhighlight: function (element) {
        $(element).siblings("i").remove();
        $(element).qtip('destroy', true);
        $(element).closest(".control-group").removeClass("has-error").addClass("has-success");

    },
    errorPlacement: function (error, element) {
        var qTipSettings = {
            content: {
                text: error.text() // Use the "div" element next to this for the content
            },
            position: {
                my: 'top center',
                at: 'bottom center'
            },
            style: 'qtip qtip-red qtip-rounded qtip-shadow'
        };

        element.closest(".control-group").removeClass("has-success").addClass("has-error");
        element.qtip(qTipSettings);
    }
};


var ccsLocalStorage = {
    set: function (name, data) {
        window.localStorage.setItem(name, JSON.stringify(data));
    },

    get: function (name) {
        if (window.localStorage.getItem(name) === "undefined") return {};
        return JSON.parse(window.localStorage.getItem(name));
    },

    destroy: function (name) {
        return window.localStorage.removeItem(name);
    },

    clear: function () {
        return window.localStorage.clear();
    },

    has: function (name) {
        return name in window.localStorage;
    }
};

function extract_object(obj) {
    var ret = [];
    for (var k in obj) {
        ret.push({ key: k, value: obj[k] });
    }
    return ret;
}

$(function () {
    $('.btn-select-lang').click(function () {
        var lang_id = $(this).attr('data-id');
        $('.language-select-overlay').fadeOut();
        if (lang_id == 'es') {
            lang = lang_es;
            lang_code = 'es';
        }
        if (lang_id == 'en') {
            lang = lang_en;
            lang_code = 'en';
        }
    });
});

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

