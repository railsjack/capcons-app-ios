'use strict';

angular.module('CCS-Safety')
  .controller('ProjectmgrCtrl', ['$scope', '$location', 'Api','Sharedata',
    function ($scope, $location, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg1';

      Sharedata.clear();
      
      window.scrollTo(0, 0);
      Api.get(settings.url + 'projects.json')
      .then(function(data){
          if(data.error)
          {
            // if(window.debug)console.log("Errorrrrrrrrrrrrrrrrrrrrrrrrrr");
            if(window.debug)console.log(data);
            // if(window.debug)console.log("hhhhhhhhh");

          }
          else
          {if(window.debug)console.log(data);
            if(data.length > 0 && data.length < 500)
            {
              document.getElementById("viewproj").setAttribute("class", "");
            }
          }
        }
      );



      $scope.gotoNewProject = function (){
        $location.path('/newProject');
      };
      $scope.gotoProjectList = function (){
        $location.path('/projectlist');
      };

      
  }]);