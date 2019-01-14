'use strict';

angular.module('CCS-Safety')
  .service('Responseauthinterceptor', ['$rootScope', '$q', '$location', 
  function ($rootScope, $q, $location) {
    function success(response) {
      return response;
    }
    function error(response) {
      var status = response.status;
      if (status == 403) {
        $location.url('/login');
        return;
      }
      // otherwise
      return $q.reject(response);
    }
    return function (promise) {
      return promise.then(success, error);
    }
  }]);
