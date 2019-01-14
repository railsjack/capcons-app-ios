'use strict';

angular.module('CCS-Safety')
  .controller('UnresolvedCtrl', ['$scope', '$location', '$routeParams', 'Api', 'Sharedata',
    function ($scope, $location, $routeParams, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      if(!Sharedata.get('project')) {
        $location.path('/projectMgr');
        return;
      }

      $scope.project = Sharedata.get('project');
      $scope.checklist = Sharedata.get('checklist');
      var q_id  = Sharedata.get('question_id');
      var cat_id = Sharedata.get('cat_id');
      

      if(Sharedata.get("unresolved_notice") != null)
      {
        $scope.unres_notice = Sharedata.get("unresolved_notice");
        document.getElementById("unresolvednotice").setAttribute("class", "");  
      }
     
      $scope.isQuestionSelected = true;
      
      // $scope.checklist_id = checklist.key
      var questionId = $routeParams.id;
      var answers = [];
         
      Api.get(settings.url + 'categories/' + $routeParams.id + '/no_questions.json',{report: $scope.checklist})
      .then(function (data){
          if(data.error)
          {
            if(window.debug)console.dir(data.error);
          }
          else
          {
            if(window.debug)console.log($routeParams.id);
            var spinnerData =_.map(data, function(question){
              return {key: question.id, value: question.body};
            });

            // Sharedata.set('questionls',spinnerData);
            // $scope.questionls = Sharedata.get('questionls');
            $scope.questionls = spinnerData

          }
        }
      );  



      $scope.selectquesls = function(){
        
        var questionId = $(this)[0].i.key;
        Sharedata.set('question_id', questionId);
        Sharedata.set('cat_id', $routeParams.id);
        Sharedata.set("unresolved_notice", null);
        Api.get(settings.url +'questions/'+ questionId +'/reports/'+$scope.checklist+'/getanswerid.json').
          
        then(function (data){
          if(data.error)
            {if(window.debug)console.dir(error);
          }
          else
          {
           Sharedata.set("answer_id",data[0].id);
           $location.path('/unanswered/'+data[0].id);
           if(!$scope.$$phase) $scope.$apply();
          }
        });
      };
  
    

      function resetView() {
        $scope.resolvedStatus = "Unresolved";
      };

      resetView();
  }]);