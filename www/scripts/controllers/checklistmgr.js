'use strict';

angular.module('CCS-Safety')
  .controller('ChecklistmgrCtrl', ['$scope', '$location',
    function ($scope, $location) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      $scope.gotoNewCheckList = function() {
        $location.path('/newchecklist');
      };

      $scope.gotoCheckListList = function(){
        $location.path('/checklist');
      };
  }]);
