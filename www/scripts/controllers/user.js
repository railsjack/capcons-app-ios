 'use strict';

angular.module('CCS-Safety')
  .controller('UserCtrl', ['$scope', '$location', 'Api', 'Sharedata', 
    function ($scope, $location, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      Sharedata.clear();
      
		$scope.go_home = function(){
			if(lang_code=='en')location.href = 'main_en.html';
			if(lang_code=='es')location.href = 'main_es.html';
		};
     
  }]);