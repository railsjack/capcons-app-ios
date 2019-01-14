'use strict';

angular.module('CCS-Safety')
  .controller('QuestionlistCtrl', ['$scope', '$location', '$routeParams', 'Api', 'Sharedata',
    function ($scope, $location, $routeParams, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg1';

      if(!Sharedata.get('project')) {
        $location.path('/projectMgr');
        return;
      }
      
      $scope.project = Sharedata.get('project');
      $scope.checklist = Sharedata.get('checklist');
      $scope.view_mode = 'entire';
      $scope.no_count = 0;

      if(window.localStorage.getItem('questionlist_mode')!==null){
        $scope.view_mode = window.localStorage.getItem('questionlist_mode');
      }


      Api.get(settings.url + 'categories/' + $routeParams.id + '/questions.json', 
        {report_id: $scope.checklist, questionlist_mode: Sharedata.get('questionlist_mode')})
      .then(function (data){
          if(data.error)
          {
            if(window.debug)console.dir(data.error);
          }
          else
          {
            if(window.debug)console.log($routeParams.id);
            var answers = data.answers;
            var answer_statuses = [];
            for(var k in answers){
              answer_statuses["q_"+answers[k].question_id] = answers[k].status;
            }
            var spinnerData =_.map(data.questions, function(question){
              var answer_status = answer_statuses["q_"+question.id]+"";
              if(answer_status==undefined) answer_status = "0";
              var icon="";
              switch(answer_status){
                case "1": icon='yes'; break;
                case "2": icon='no'; $scope.no_count++; break;
                case "0": icon='na'; break;
                case "3": icon='resolved'; break;
              }
              return {key: question.id, value: question.body, icon: icon, answer_status: answer_status };
            });

            
            // SpinningWheel.addSlot(spinnerData, 'left');
            // SpinningWheel.setDoneAction(selectQuestionData);
            // SpinningWheel.open();
            // $('#sw-slots li').addClass("small");
            
            // $('#sw-wrapper').on("click", selectQuestionData);
            // //$('#sw-wrapper').on("scroll", getscroll);

            Sharedata.set('questionls',spinnerData);
            $scope.questionls = Sharedata.get('questionls');
            
          }
        }
      );
       
       
      var questionId;
      var answers = [];
      
      ///////  no need to this function
      var selectQuestionData = function(){
        var selectedData = SpinningWheel.getSelectedValues();

        questionId = selectedData.keys[0];
        $scope.isQuestionSelected = true;
        if(!$scope.$$phase) $scope.$apply();

        // if(window.debug)console.log(questionId);
        // if(window.debug)console.log($scope.checklist_id);
        var answersToUpdate = _.find(answers, function (answ){
          
          return answ.question_id ==questionId;
        });
       // if(window.debug)console.log(answersToUpdate);
        Sharedata.set('question_id', questionId);
        Sharedata.set('cat_id', $routeParams.id);
        $location.path('/answer/'+answersToUpdate.id);
        if(!$scope.$$phase) $scope.$apply();
      };

      // $scope.updateVar = function(value) {
      //     $scope.myVar = value;
      // }

      $scope.selectquesls = function(){
        
        var questionId = $(this)[0].i.key;
        Sharedata.set('question_id', questionId);
        Sharedata.set('cat_id', $routeParams.id);

        Api.get(settings.url +'questions/'+ questionId +'/reports/'+$scope.checklist+'/getanswerid.json').
        then(function (data){
          if(data.error)
            {if(window.debug)console.dir(error);
          }
          else
          {
           if(data.id){
             Sharedata.set("answer_id",data.id);
             $location.path('/answer/'+data.id);
             if(!$scope.$$phase) $scope.$apply();
           }
          }
        });
      };

      $scope.viewEntireList = function(){
        if(window.debug)console.log('viewEntireList');
        window.localStorage.setItem('questionlist_mode','entire');
        $('.frame > div').show();
        
        $('.btn-view-entire').hide();
        $('.btn-view-no').show().css('display','block');
        $('.btn-view-no').removeClass('ng-hide');
      };

      $scope.viewNoList = function(){
        if(window.debug)console.log('viewNoList');
        window.localStorage.setItem('questionlist_mode','no');
        $('.frame > div').hide();
        $('.frame > div[data-answer-status=2]').show();

        $('.btn-view-no').hide();
        $('.btn-view-entire').show().css('display','block');
        $('.btn-view-entire').removeClass('ng-hide');

      };
     
      var getscroll = function(){
        
        $scope.isQuestionSelected = false;
      };

      $scope.$on('$destroy', function() {
        SpinningWheel.destroy();
      });

      var newUrl;
      var ans_id;
      $scope.selectAnswer = function(status){
        var answersToUpdate = _.find(answers, function (answ){
          
          return answ.question_id ==questionId;
        });

        if(status == "yes")
        {
          status = 1;
          document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle");
          document.getElementsByTagName("i")[4].setAttribute("class", "");
          document.getElementsByTagName("i")[5].setAttribute("class", "");
          document.getElementsByTagName("i")[6].setAttribute("class", "");
        }
        else if(status == "no")
        {
         status = 2;
          document.getElementsByTagName("i")[3].setAttribute("class", "");
          document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle");
          document.getElementsByTagName("i")[5].setAttribute("class", "");
          document.getElementsByTagName("i")[6].setAttribute("class", "");
        }
        else if(status == "na")
        {
          status = 0;
          document.getElementsByTagName("i")[3].setAttribute("class", "");
          document.getElementsByTagName("i")[4].setAttribute("class", "");
          document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle");
          document.getElementsByTagName("i")[6].setAttribute("class", "");
        }
        else if(status == "re")
        {
          status = 3;
          document.getElementsByTagName("i")[3].setAttribute("class", "");
          document.getElementsByTagName("i")[4].setAttribute("class", "");
          document.getElementsByTagName("i")[5].setAttribute("class", "");
          document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle");
        }
        
        answersToUpdate.status = status;
        $scope.status_of_answer = status;
        
        $scope.isQuestionSelected = true;
        //answersToUpdate.url = "http://www.johnsoncareers.com/favicon.png";  
        return 'btn btn-info btn-block';
        
      };
      $scope.changeResolve = function (){
        if ($scope.resolvedStatus == 'Resolved'){
          $scope.resolvedStatus = 'Unresolved';
        }
        else
        {
          $scope.resolvedStatus = 'Resolved';
        }
      };

      $scope.getResolveCss = function (){
        return $scope.resolvedStatus == 'Resolved' ? 'btn btn-info btn-block' : 'btn btn-warning btn-block';
      }

      $scope.getResolveIcon = function(){
        return $scope.resolvedStatus == 'Resolved' ? 'fa fa-check' : 'fa fa-ban';
      }

      $scope.takePic = function (){
        try
        {
          // uploadPhoto("iVBORw0KGgoAAAANSUhEUgAAACUAAAAhCAYAAABeD2IVAAAFN0lEQVR4Xt2YaUwUZxjHFSxUCm3SStJIEARW7oBNQKhfyCKFVKUlJQEVaKMNbUqxCSDwgVIi8cIq1sYqsQlWqBy1Sq1cC3Is9yK4Qt3lkcNKI7dWLKd8oP/3LZOgzKzbsm3avskvy8zCzm+eeY53WTE/P/+v4/8hNTc3p5Pe3r4V7e03OFjmYC2wAWtw7u+RwnoBbACOYB14BZgvnH9pQcLFyMhIHhYWFnn06OcpWVlZh5OSkvdCTGZwKazVO3fuCkcUstTqm2dLS8sOHj+e+TFWVHR0dERqamr0sWPHP7t06fL5hoZG1fXrbdTael1Aa21tHQQxY0NL2VRWXst4/HiOxJienuECKlUrp6VFJcCP5XJ5KLsxQ0vZIwInpaRmZx9zqebmliUwsYiIiPcgZWFoKRkicJoJSHHrlkZSKiFhXyzLQYNHqrGx6UtdUvfuDUhKZWRkpLBCWLYU1nNgHdgUHPxWaHd3T74uqZmZWUKCi0plZ587aWJiIl9oEUZ/SQrLzsvLa3tZWfmh+/cfKEUk9I6WkOx1dfWNJ058kWZhYbFFKmo6hRDujyYmJttZAv9JeG41NTUv5gm5a9eqFN7em94WE5MSMraysgqEkFpaQDf4W2praxeEqLZWyaL0hFxVVXWVmZkZi9hKfaRWh4eHh4kI8A9Hl6b6+np6+HBcp9jw8AidPfs1RUZGka+vL6HHLYlafHwCr0h9pFaamprKkUcNLHGfAkINFBISQra2tuTn50d79rxPycnJqK6jdOjQYVwonoKDg8ne3p6cnJwoLi6eampquQyqV4Afp6R8Gg8pS0mphbVqgXX796d/ODU1rWEiYqjVai4SHr6DfHx8yM3NjTw8PCggIIAweujChTwaG7uPRzlBQ0PDNDg49DRdgYGB70DqebBqiRRPJGNjuaen57bFnDmTFf/o0W832AgxNJ2dP+W7urpuc3R05EDhRbFIud++3V3wRySYgOGZnJxC1IZIq+1CTrVwVCoVXbx48RwEnMWkXt648bXtCHkzHhstF0SYP76BgUHCPos6OjpRcVUazE8CQm6xfFNJRkrYCaSlpX2Aktayu5Kip6eX/P39WfXQqVNfUVHRD+zDeRFcufIjlZcr0MGzKTPzBJI5hQ1jQiOmI0eOtLLfWQxm4ifsus+qPhl6SCbESApEgSe1g4MD2dnZ0fr163k12tjYcAoLv4OENzvP35fJZPxVoajQsH4lkJ+fnwMhF31agqm5ufmWvr47peziUhw4cJALOTs7C/A2EBQUxPtYXl4eubi4sHNcKDY2lp9XKpUcPMpWJPh2tmPVd8y8il4TipxQj48/IjHQx1hj5BESorV582YqLi4RIoGfiyGzlxITk9B4mUwdfwU4lxgHIVt9x4wMDXC3paXlG2gJ+x48+JV0UVJSShiyVFBQyPsRtstUXV3DQZ4JEvwYacHJzf2WPTZXvQYylgMSNwFR0N6583MlNv87MBKycUwSLBbkxxqNllWZAGSqOcKxQqEQeWzSHX1NVNS7u3C3naOjYwRY1+3IyclNQ34pR0ZGSR9wM1RRUSkJKrMNebaVtQB9pDxv3uwoWjwSIMjBqmbH+oKtCbu4GFzs/Pmcb1jVAWkpZh0TE7O7v/8Xunu3f7nwPdPVq8Vi8ELA1zNKT09PY/1Jl5QMv3wanZc1xmXT1UW8iaKpisHfw/fDJki9rkvKG1+PqthMMhRoCZhp30ty+XIRYVscADEjKam1mNhvuru7bzUkqLKt6PoSyFiyb3hWoq/6p/nP/Cvod4M+AYycVdHoAAAAAElFTkSuQmCC");          
          
          var options = {
            sourceType: 1,
            quality: 60,
            destinationType: Camera.DestinationType.DATA_URL
          };
          $scope.newUrl = newUrl;
          navigator.camera.getPicture(uploadPhoto,null,options);
        }
        catch(error){
          navigator.notification.alert(error.message, function(){}, " ");
        }
      };
      $scope.imagectrl = function(){
          // if(window.debug)console.log("lalalallallalaallalal");
         // if(window.debug)console.log($scope.newUrl); 

        $scope.path = 'data:image/jpeg;base64,'+ newUrl;
      }

      $scope.submitanswer = function (){
        var is_confirmed = confirm("Do you want to submit the answer ?");
        // if(window.debug)console.log($scope);
        if(is_confirmed)
        {
          $scope.isQuestionSelected = false;
          // if(window.debug)console.log($scope);
          Api.patch(settings.url + 'projects/' + $scope.project.id + '/answers/' + $scope.question_id,
            {status: $scope.status_of_answer })
          .then(function (data){
            if (data.error){
              // if(window.debug)console.dir(error);
            } else {
              // if(window.debug)console.dir(data);
            } 
          });
          // alert(newUrl);
          Api.patch(settings.url + 'projects/' + $scope.project.id + '/answers/' + $scope.question_id + '/update_answer', {answer:{notes: $scope.textModel, file: newUrl }})
          .then(function (data){
            if (data.error){
              // if(window.debug)console.dir(error);
            } else {
              // if(window.debug)console.dir(data);
              // if(window.debug)console.log(data);
            } 
          });
        }
      };

      function uploadPhoto(fileUrl){
        navigator.notification.alert("Image Successfully added", function(){}, " ");
        newUrl = fileUrl;
        $scope.imagectrl();
      }

      function resetView() {
        $scope.resolvedStatus = "Unresolved";
        setTimeout(function(){
          if(typeof Sharedata.get('selected_question')!='undefined'){
            var selected_question = Sharedata.get('selected_question');
            if(typeof $("div[data-question-id='"+selected_question+"']").get(0)!=='undefined'){
              $("div[data-question-id='"+selected_question+"']").get(0).scrollIntoView(0);
              $("div[data-question-id='"+selected_question+"']").addClass('selected-border');
            }
          }
        },1000);
      };

      resetView();


  }]);