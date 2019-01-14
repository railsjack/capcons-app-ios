'use strict';

angular.module('CCS-Safety')
  .service('Headersauthinterceptor', ['$location', '$rootScope', '$q', '$window',
  function ($location, $rootScope, $q, $window) {
    return {
      request: function (config) {
        // TODO: if get request set params for post set data
        var data;
        switch(config.method){
          case "GET":
          case "DELETE":
            data = config.params = config.params || {};
          break;
          default:
            data = config.data = config.data || {};
          break;
        }
        
        if ($window.sessionStorage.token) {
          data.authenticity_token = $window.sessionStorage.token;
        }
        return config;
      }
    };
  }]);
