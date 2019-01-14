'use strict';

angular.module('CCS-Safety')
  .controller('UnansweredCtrl', ['$scope', '$location', '$routeParams', 'Api', 'Sharedata',
    function ($scope, $location, $routeParams, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      if(!Sharedata.get('project')) {
        $location.path('/projectMgr');
        return;
      }

      $scope.project = Sharedata.get('project');
      if(window.debug)console.log("================projetc =====================");
      if(window.debug)console.log($scope.project);
      $scope.checklist = Sharedata.get('checklist');
      var q_id  = Sharedata.get('question_id');
      var cat_id = Sharedata.get('cat_id');
      
     
      $scope.isQuestionSelected = true;
      
      // $scope.checklist_id = checklist.key
      var questionId = $routeParams.id;
      var answers = [];
         
         Api.get(settings.url + 'questions/' + q_id + '/get_question.json')
        .then(function (data){
          if (data.error){
            // if(window.debug)console.dir(error);
          } else {
            $scope.question_body = data.body;
          } 
        });      

      Api.get(settings.url + 'questions/' + q_id + '/reports/' + $scope.checklist +'/get_answer.json')
        .then(function (data){
          if (data.error){
            if(window.debug)console.dir(error);
          } else {
            if(window.debug)console.dir(data);
            document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle white_dot");
            document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle white_dot");
            document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle white_dot");
            document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle white_dot");
            if(data[0].status== 1)
            {
              document.getElementsByTagName("i")[3].setAttribute("class", "");
              document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle black_dot");
              document.getElementsByTagName("button")[3].setAttribute("class", "hidden");
              
            }
            else if(data[0].status== 2)
            {
              // document.getElementsByTagName("input")[1].checked = true;
                            document.getElementsByTagName("i")[4].setAttribute("class", "");  
              document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle black_dot");
            }
            else if(data[0].status== 0)
            {
              document.getElementsByTagName("i")[5].setAttribute("class", "");
              document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle black_dot");
              document.getElementsByTagName("button")[3].setAttribute("class", "hidden");

             
              
            }
            else if(data[0].status== 3)
            {
              // document.getElementsByTagName("input")[3].checked = true;
              document.getElementsByTagName("i")[6].setAttribute("class", "");
              document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle black_dot");
              
            }
            $scope.textModel = data[0].notes;
            $scope.question_id = data[0].id;
            $scope.status_of_answer = data[0].status;
            var url = settings.url+data[0].file.url;
            // if(window.debug)console.log();
            if(data[0].file.url != null)
            {
              
              document.getElementById("picupload").setAttribute("class", "");
              $scope.file = url;
            }
             // if(window.debug)console.log(document.getElementById("picurl").value(data[0].notes));
          } 
        });      

      // $scope.updateVar = function(value) {
      //     $scope.myVar = value;
      // }

     

      var newUrl;
      var ans_id;
      $scope.selectAnswer = function(status){
        var answersToUpdate = _.find(answers, function (answ){
          
          return answ.question_id ==questionId;
        });

        if(status == "yes")
        {
          status = 1;
          document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle black_dot");
          document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle white_dot");
        }
        else if(status == "no")
        {
         status = 2;
          document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle black_dot");
          document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle white_dot");
        }
        else if(status == "na")
        {
          status = 0;
          document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle black_dot");
          document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle white_dot");
        }
        else if(status == "re")
        {
          status = 3;
          document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle white_dot");
          document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle black_dot");
        }
        
        //answersToUpdate.status = status;
        $scope.status_of_answer = status;
        if(window.debug)console.log($scope.status_of_answer);
        // $scope.question_id = answersToUpdate.id;
        // if(window.debug)console.log($scope);
        // if(window.debug)console.log($scope.question_id);
        $scope.isQuestionSelected = true;
        return 'btn btn-info btn-block';
        
      };

      $scope.scrollWin = function(){
        if(window.debug)console.log("scrolled ");
        // alert("sdsdsdsdsddsss");
        window.scrollBy(0,150);   
      }


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
          
          
           
          // alert("Image Successfully added");
          
          
        }
        catch(error){
          navigator.notification.alert(error.message, function(){}, " ");
        }
      };
      
      $scope.imagectrl = function(){
        // if(window.debug)console.log("-------------------------------image url-------------------------");

        $scope.path = 'data:image/jpeg;base64,'+ newUrl;
        setTimeout(function(){
            uploadimage(newUrl);
            // alert(fileUrl);
        }, 500);
      }

      $scope.submitanswer = function (){
        // var is_confirmed = confirm("Do you want to submit the answer ?");
        // if(window.debug)console.log($scope);
        // if(is_confirmed)
        // {
          $scope.isQuestionSelected = true;
          Api.patch(settings.url + 'projects/' + $scope.project.key + '/answers/' + $routeParams.id,{status: $scope.status_of_answer })
          .then(function (data){
            if (data.error){
              // if(window.debug)console.dir(error);
            } else {
               // if(window.debug)console.dir(data);
            } 
          }); 

          Api.patch(settings.url + 'projects/' + $scope.project.key + '/answers/' + $routeParams.id + '/update_answer', {answer:{notes: $scope.textModel }})   ////, file: newUrl
          .then(function (data){
            if (data.error){
              // if(window.debug)console.dir(error);
            } 
            else 
            {
              $location.path('/unresolved/'+cat_id);
              Sharedata.set('unresolved_notice', "Answer successfully updated.");
            } 
          });
        // }
      };


      $scope.sendEmail = function(){
        // setTimeout(function(){
            $scope.isQuestionSelected = true;
            document.getElementById("email-button").setAttribute("class", "hidden");
            document.getElementById("disable-button1").setAttribute("class", "");
            document.getElementById("disable-button1").setAttribute("class", "btn btn-primary btn-block pull-left disabled");
            Api.patch(settings.url + 'projects/' + $scope.project.key + '/answers/' + $routeParams.id,{status: $scope.status_of_answer })
            .then(function (data){
              if (data.error){
                // if(window.debug)console.dir(error);
              } else {
                 // if(window.debug)console.dir(data);
              } 
            });
            Api.patch(settings.url + 'projects/' + $scope.project.key + '/answers/' + $routeParams.id + '/update_answer', {answer:{notes: $scope.textModel }})
            .then(function (data){
              if (data.error){
                // if(window.debug)console.dir(error);
              } 
              else 
              {
                // var qid = q_id+1;
                // Sharedata.set("question_id", q_id);
                $location.path('/unansweredemail');

                if(!$scope.$$phase) $scope.$apply();
                
              }    
            });  
        // }, 3000);
        // alert("sexymama");
        
      };

      function uploadimage(url){
        
        document.getElementById("camera-button").setAttribute("class", "hidden");
        document.getElementById("disable-button").setAttribute("class", "");
        document.getElementById("disable-button").setAttribute("class", "btn btn-primary btn-block pull-left disabled");
        Api.patch(settings.url + 'projects/' + $scope.project.key + '/answers/' + $routeParams.id + '/upload_image', {answer:{file:  $scope.imageurl }})
          .then(function (data){
            if (data.error){
              // if(window.debug)console.dir(error);
              document.getElementById("camera-button").setAttribute("class", "btn btn-picture btn-block pull-left");
              document.getElementById("disable-button").setAttribute("class", "hidden");
            } 
            else 
            {
              navigator.notification.alert("Image Successfully Uploaded", function(){}, " ");
              document.getElementById("picupload").setAttribute("class", "");
              document.getElementById("camera-button").setAttribute("class", "btn btn-picture btn-block pull-left");
              document.getElementById("disable-button").setAttribute("class", "hidden");
              $scope.file = settings.url+data.url              
            }    
        });
      }

      function uploadPhoto(fileUrl){
        newUrl = fileUrl;
        $scope.imageurl = fileUrl;
        $scope.imagectrl();
      }

      function resetView() {
        $scope.resolvedStatus = "Unresolved";
      };

      resetView();
  }]);