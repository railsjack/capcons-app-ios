'use strict';

angular.module('CCS-Safety')
  .controller('AnswerCtrl', ['$scope', '$location', '$routeParams', 'Api', 'Sharedata',
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

      Sharedata.set('selected_question', q_id);
      
      $scope.isQuestionSelected = true;
      
      var questionId = $routeParams.id;
      var answers = [];
      $scope.files = [];

         Api.get(settings.url + 'questions/' + q_id + '/get_question.json')
        .then(function (data){
          if (data.error){
            
          } else {
            $scope.question_body = data.body;
          } 
        });      

      Api.get(settings.url + 'questions/' + q_id + '/reports/' + $scope.checklist +'/get_answer.json')
        .then(function (data){
          if (data.error){
            
          } else {
            window.scrollTo(0, 0);
            $('.answer-buttons i').addClass('fa fa-circle white_dot');

            /*document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle white_dot");
            document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle white_dot");
            document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle white_dot");
            document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle white_dot");*/
            if(data[0].status== 1)
            {
              $('.answer-buttons i:eq(0)')
                .removeClass('white_dot')
                .addClass('black_dot');
              
              //document.getElementsByTagName("i")[3].setAttribute("class", "");
              //document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle black_dot");
              //document.getElementsByTagName("button")[3].setAttribute("class", "hidden");
              
            }
            else if(data[0].status== 2)
            {
              $('.answer-buttons i:eq(1)')
                .removeClass('white_dot')
                .addClass('black_dot');
            }
            else if(data[0].status== 0)
            {
              $('.answer-buttons i:eq(2)')
                .removeClass('white_dot')
                .addClass('black_dot');
              //document.getElementsByTagName("i")[5].setAttribute("class", "");
              //document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle black_dot");
              //document.getElementsByTagName("button")[3].setAttribute("class", "hidden");
              
            }
            else if(data[0].status== 3)
            {
              $('.answer-buttons i:eq(3)')
                .removeClass('white_dot')
                .addClass('black_dot');
              
              // document.getElementsByTagName("input")[3].checked = true;
              //document.getElementsByTagName("i")[6].setAttribute("class", "");
              //document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle black_dot");
              
            }
            $scope.textModel = data[0].notes;
            $scope.question_id = data[0].id;
            $scope.status_of_answer = data[0].status;

            //var url = settings.url + data[0].file.url;
            
            var records = _.map(data[0].answers_files, function (answers_file) {
                var url = answers_file.file.url;
                var filename = url.substring(url.lastIndexOf('/') + 1);
                url = url.replace('/' + filename, '/thumb_' + filename);
                return settings.url + url;
            });
            
            if(records.length > 0)
            {
              document.getElementById("picupload").setAttribute("class", "");
              $scope.files = records;
            }
             
          } 
        });      

      var newUrl;
      var ans_id;
      $scope.selectAnswer = function(status){
        var answersToUpdate = _.find(answers, function (answ){
          
          return answ.question_id ==questionId;
        });

        $('.answer-buttons i').removeClass('black_dot').addClass('white_dot');
        if(status == "yes")
        {
          status = 1;
          $('.answer-buttons i:eq(0)').removeClass('white_dot').addClass('black_dot');
          //document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle black_dot");
          //document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle white_dot");
        }
        else if(status == "no")
        {
         status = 2;
          $('.answer-buttons i:eq(1)').removeClass('white_dot').addClass('black_dot');
          //document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle black_dot");
          //document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle white_dot");
        }
        else if(status == "na")
        {
          status = 0;
          $('.answer-buttons i:eq(2)').removeClass('white_dot').addClass('black_dot');
          //document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle black_dot");
          //document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle white_dot");
        }
        else if(status == "re")
        {
          status = 3;
          $('.answer-buttons i:eq(3)').removeClass('white_dot').addClass('black_dot');
          //document.getElementsByTagName("i")[3].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[4].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[5].setAttribute("class", "fa fa-circle white_dot");
          //document.getElementsByTagName("i")[6].setAttribute("class", "fa fa-circle black_dot");
        }
        
        //answersToUpdate.status = status;
        $scope.status_of_answer = status;
        if(window.debug)console.log($scope.status_of_answer);
        $scope.isQuestionSelected = true;
        return 'btn btn-info btn-block';
        
      };

      $scope.scrollWin = function(){
        if(window.debug)console.log("scrolled ");
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

      function uploadPhoto(fileUrl){
        newUrl = fileUrl;

        $scope.imageurl = fileUrl;
        $scope.imagectrl();
      }

      $scope.imagectrl = function(){
        $scope.path = 'data:image/jpeg;base64,'+ newUrl;
        setTimeout(function(){
            uploadimage(newUrl);
        }, 500);
      }

      $scope.submitanswer = function (){
        
        $scope.isQuestionSelected = true;
        Api.patch(settings.url + 'projects/' + $scope.project.key + '/answers/' + $routeParams.id + '/update_answer', {answer:{status: $scope.status_of_answer, notes: $scope.textModel, file: newUrl }})
        .then(function (data){
          if (data.error){
            
          } 
          else 
          {
            var qid = q_id+1;
            Api.get(settings.url + 'questions/' + qid + '/get_question.json')
            .then(function (data){
              if (data.error){
                
              } 
              else 
              {
                Api.get(settings.url +'questions/'+ qid +'/reports/'+$scope.checklist+'/getanswerid.json').
                then(function (data1){
                  if(data1.error){
                    if(window.debug)console.dir(error);
                  }
                  else
                  {
                  	if(data.category_id == cat_id){
	                    Sharedata.set('question_id', qid);
	                    Sharedata.set('notice', "null");
	                    $scope.question_body = data1.body;
	                    $location.path('/answer/'+data1.id).replace();
	                    if(!$scope.$$phase) $scope.$apply();
                  	}else{
	                    $location.path('/categoryList/' + $scope.checklist).replace();
                  	}
                  }
                });
              } 
            });  
          } 
        });
      };


      $scope.sendEmail = function(){
        // setTimeout(function(){
            $scope.isQuestionSelected = true;
            document.getElementById("email-button").setAttribute("class", "hidden");
            document.getElementById("disable-button1").setAttribute("class", "");
            document.getElementById("disable-button1").setAttribute("class", "btn btn-primary btn-block pull-left disabled");
            Api.patch(settings.url + 'projects/' + $scope.project.key + '/answers/' + $routeParams.id + '/update_answer', {answer:{notes: $scope.textModel }})
            .then(function (data){
              if (data.error){
                
              } 
              else 
              {
                // var qid = q_id+1;
                Sharedata.set("question_id", q_id);
                $location.path('/sendemail');
                if(!$scope.$$phase) $scope.$apply();
                
              }    
            });  
        // }, 3000);
        
        
      };

      $scope.goto_questionlist = function(){
        var cat_id = Sharedata.get('cat_id');
        $location.path('/questionList/'+cat_id);
      };

      $scope.files = [];
      function uploadimage(url){
        
        $("#camera-button").addClass("hidden");
        $("#disable-button").removeClass("hidden");
        $("#disable-button").removeClass("hidden");
          //Api.patch(settings.url + 'projects/' + $scope.project.key + '/answers/' + $routeParams.id + '/upload_image', {answer:{file:  $scope.imageurl }})
          Api.patch(settings.url + 'answers_files/' + $routeParams.id + '/upload_image', { file: $scope.imageurl })
          .then(function (data){
            if (data.error){
              
              $("#camera-button").removeClass("hidden");
              $("#disable-button").addClass("hidden");
            } 
            else 
            {
              // /alert("Image Successfully Uploaded");
              
              navigator.notification.alert("Image Successfully Uploaded", function(){}, " ");
              $("#camera-button").removeClass("hidden");
              $("#disable-button").addClass("hidden");
              $("#picupload").removeClass("hidden");
              $("#camera-button").removeClass("hidden");
              $("disable-button").addClass("hidden");
              
                //$scope.file = settings.url + data.url;
              $scope.files.push(settings.url + data.url);
            }    
        });
      }


      function resetView() {
        $scope.resolvedStatus = "Unresolved";
      };

      resetView();
  }]);