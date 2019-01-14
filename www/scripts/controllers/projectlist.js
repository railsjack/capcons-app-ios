'use strict';

angular.module('CCS-Safety')
  .controller('ProjectlistCtrl', ['$rootScope', '$scope', '$location', 'Api', 'Sharedata',
    function ($rootScope, $scope, $location, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      Sharedata.clear();
      var projects = [];
      Api.get(settings.url + 'projects.json')
      .then(function(data){
          if(data.error)
          {
            
          }
          else
          {
            projects = data;
            var spinnerData =_.map(data, function(project){
              return {key: project.id, value: project.name};
            });
            
            
            Sharedata.set('projectlist',spinnerData);
            $scope.projectls = Sharedata.get('projectlist',spinnerData);
            
            
          }
        }
      );

      var selectProjectData = function(){
        var selectedData = SpinningWheel.getSelectedValues();
        var projectId = selectedData.keys[0];
        var selectedProject = _.find(projects, function (project){
          return project.id === projectId;
        });
        if(window.debug)console.dir(selectedProject);
        Sharedata.set('project', selectedProject);
        $location.path('/checklist/' + projectId);
        //$scope.$apply();
      };

      $scope.selectproject = function(){
        var projectId = $(this)[0].i.key;

        Sharedata.set('project', $(this)[0].i);
        $location.path('/checklist/' + projectId);
        if(!$scope.$$phase) {
          if(!$scope.$$phase) $scope.$apply();
        }
      }

      $scope.editproject = function()
      {
        // alert($(this)[0].i.key);
        Sharedata.set('Editprojects', $(this)[0].i.key);
        $location.path('/editproject');
      };

      $scope.$on('$destroy', function() {
        //if(window.debug)console.log('SpinningWheel');
        //if(window.debug)console.log(SpinningWheel);
        //window._SpinningWheel = SpinningWheel;
        //SpinningWheel.destroy();
      });
  }]);