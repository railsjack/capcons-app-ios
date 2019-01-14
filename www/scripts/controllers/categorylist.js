'use strict';

angular.module('CCS-Safety')
  .controller('CategorylistCtrl', ['$scope', '$location', 'Api', 'Sharedata',
    function ($scope, $location, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      if(!Sharedata.get('project')) {
        $location.path('/projectMgr');
        return;
      }

      $scope.project = Sharedata.get('project');
      $scope.notice = Sharedata.get('notice');
      $scope.checklist = Sharedata.get('checklist');
      var spinnerData;
      if($scope.notice != "null" && $scope.notice!=undefined)
      {
        $("#notice").removeClass('hidden');  
      }
      else if(Sharedata.set('hide_notice_div')){
        $("#notice").addClass('hidden');  
      }
     
      Api.get(settings.url + 'categories.json',{report: $scope.checklist})
      .then(function(data){
        
          if(data.error)
          {
            if(window.debug)console.dir(data.error);
          }
          // if (data.obj.category.length ).obj.category
          else  if (data.length > 1) 
          {
            spinnerData =_.map(data, function(category){
              return {key: category.id, value: category.name};
            });
            
          }
          else if (data.length == 1) 
          {
            spinnerData =_.map(data, function(category){
              return {key: category.id, value: category.name};
            });
            $scope.userCatId = spinnerData[0].key;
            $location.path('/questionList/' + $scope.userCatId).replace();
          }

          Sharedata.set('catls',spinnerData);
          $scope.catls = Sharedata.get('catls');
        }
      );

      var selectCategoryData = function(){
        var selectedData = SpinningWheel.getSelectedValues();
        var categoryId = selectedData.keys[0];
        $location.path('/questionList/' + categoryId);
        if(!$scope.$$phase) $scope.$apply();
      };

      $scope.selectcatls = function(){
        Sharedata.set('catls', $(this)[0].i);
        Sharedata.set('questionlist_mode', "nonexisting");
        var categoryId = $(this)[0].i.key;
        $location.path('/questionList/' + categoryId).replace();
        if(!$scope.$$phase) $scope.$apply();
        return;
        Sharedata.set('cat_id', categoryId);
        Api.get(settings.url + 'categories/' + categoryId + '/questions.json', {category_id: categoryId})
        .then(function (data){
          if(window.debug)console.log(data);
        });
      };

      $scope.selectcatls1 = function(){
        Sharedata.set('catls', $(this)[0].i);
        var categoryId = $(this)[0].i.key;
        Sharedata.set('cat_id', categoryId);
        Api.get(settings.url + 'categories/' + categoryId + '/question.json',{report: $scope.checklist})
        .then(function (data){
            if(window.debug)console.log("================================");
            if(window.debug)console.log(data.status)
            if(data.error)
            {
              if(window.debug)console.dir(data.error);
            }
            else if(data.noanswer == true)                                     /// when we need question list page
            {
              // Sharedata.set('catls', $(this)[0].i);
              // var categoryId = $(this)[0].i.key;
              // alert(categoryId);
              $location.path('/unresolved/'+categoryId);
              if(!$scope.$$phase) $scope.$apply();
            }
            else                                      /////if(data.status == false)
            {
              var questionId = data.id;
              var answerId = data.answer_id;
              Sharedata.set('question_id', questionId);
              $location.path('/answer/'+answerId);
              if(!$scope.$$phase) $scope.$apply();
            }
            // else
            // {
            //   $location.path('/questionList/' + categoryId);
            //   if(!$scope.$$phase) $scope.$apply();
            // }
          }
        );
        // alert(categoryId);
        // $location.path('/questionList/' + categoryId);
        // if(!$scope.$$phase) $scope.$apply();
      };


      $scope.unresolved = function(){
        
        var categoryId = $scope.userCatId;
        Sharedata.set('cat_id', $scope.userCatId);
        Api.get(settings.url + 'categories/' + categoryId + '/noquestions.json',{report: $scope.checklist})
        .then(function (data){
            if(data.error)
            {
              if(window.debug)console.dir(data.error);
            }
            else                                      ///// if(data.status == false)
            {
              var questionId = data.question_id;
              var answerId = data.id;
              Sharedata.set('question_id', questionId);
              $location.path('/resolved/'+answerId);
              if(!$scope.$$phase) $scope.$apply();
            }
          }
        );
      };
      
      $scope.$on('$destroy', function() {
        SpinningWheel.destroy();
      });
  }]);