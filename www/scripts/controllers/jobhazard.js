'use strict';

angular.module('CCS-Safety')
  .controller('JobhazardCtrl', ['$scope', '$location', '$routeParams','Api','Sharedata',
    function ($scope, $location, $routeParams, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      $scope.report = {project_id : $routeParams["id"]};


      $scope.project = Sharedata.get('project');
      var projectId = $scope.project.key;
      // if(window.debug)console.log($scope.project);

      Api.get(settings.url + 'projects/' + projectId + '/jobhazards.json')
        .then(function (data){
          if (data.error){
            // if(window.debug)console.dir(error);
          } 
          else
          {

            //  var records = _.map(data, function (jobhazard) {
            //      var asas = jobhazard.id;
            //      return { key: jobhazard.id, value: jobhazard.sow };
            //});
              $scope.jobhazards = data;
          } 
      });  



      $scope.selectjobhazardreport = function () {
        // Sharedata.set('checklist', $(this)[0].i.key);
       
        $location.path('/showjobhazard/' + $(this)[0].i.id);
      };







      
  }]);