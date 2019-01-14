'use strict';

angular.module('CCS-Safety')
  .controller('ChecklistCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Api', 'Sharedata',
    function ($rootScope, $scope, $location, $routeParams, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg1';

      if(!Sharedata.get('project')) {
        $location.path('/projectMgr');
        return;
      }

      var projectId = $routeParams.id;
      $scope.project = Sharedata.get('project');
      var checklistList = [];
      var goodReports = [];
      Api.get(settings.url + 'projects/'+ projectId +'/reports.json')
      .then(function (data){
        if(data.error)
        {
          if(window.debug)console.dir(data.error);
        }
        else
        {
          checklistList = data.reports;
          goodReports = data.goodreports;
          
          var checklistMap = _.map(checklistList, function (checklist){
           var arr = checklist.name.split(" ");
            var asas=  checklist.user_id;
            var _issues = $rootScope._T('issues');
            return {key : checklist.id, value : arr[arr.length - 1] , issues : checklist.user_id +' '+ _issues, catname: checklist.catname};
          });


          if(goodReports.length > 0){

            $('#goodchkls').addClass('layout');
            var goodchecklistMap = _.map(goodReports, function (goodchecklist){
             var arr1 = goodchecklist.name.split(" ");
              return {key : goodchecklist.id, value : arr1[arr1.length - 1] };
            });

            Sharedata.set('goodcheckls',goodchecklistMap);
            $scope.goodcheckls = Sharedata.get('goodcheckls');

          }

           Sharedata.set('checkls',checklistMap);
            $scope.checkls = Sharedata.get('checkls');        

        }
      });

      $scope.addchecklist = function(){

        // var is_confirmed = confirm("Press 'OK' if you want to create a new checklist.");
        // if(is_confirmed)
        // {
        // if(window.debug)console.log(is_confirmed);
          $("#add_checklist").addClass("hidden");
          $("#add_checklist_disabled").removeClass("hidden");
          
         Api.get(settings.url +'projects/'+ projectId +'/submit_report.json')
          
        .then(function (data){
          if(data.error)
            {if(window.debug)console.dir(error);
          }
          else
          {
           
           Sharedata.set('checklist', data.id);
           Sharedata.set('hide_notice_div', 1);
           $scope.checklistid = data.id;
           $location.path('/categoryList/' + data.id);
           if(!$scope.$$phase) $scope.$apply();
          }
        });
        // }  
      }


      $scope.view_incident = function(){
        $location.path('/incident/' + projectId);
      };

      $scope.create_incident = function(){
        // if(window.debug)console.log();
        $location.path('/incidentReport/'+projectId);
      };
      
      $scope.view_jobhazard = function(){
        $location.path('/jobhazard/' + projectId);
      };
      
      $scope.create_jobhazard = function(){
        // if(window.debug)console.log();
        $location.path('/jobhazardReport/'+projectId);
      };

      $scope.selectcheckls = function(){
        Sharedata.set('checklist', $(this)[0].i.key);
        Sharedata.set('notice', "null");
        Sharedata.set('questionlist_mode', "existing");
        $scope.checklistid = $(this)[0].i.key;
        //$location.path('/categoryList/' + $(this)[0].i.key);
        $location.path('/questionList/' + $(this)[0].i.key);
        if(!$scope.$$phase) $scope.$apply();
      }

      $scope.$on('$destroy', function() {
        //SpinningWheel.destroy();
      });
  }]);