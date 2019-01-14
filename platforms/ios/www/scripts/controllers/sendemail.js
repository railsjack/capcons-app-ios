'use strict';

angular.module('CCS-Safety')
  .controller('SendemailCtrl', ['$scope', '$location', '$routeParams', 'Api', 'Sharedata',
    function ($scope, $location, $routeParams, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      if(!Sharedata.get('project')) {
        $location.path('/projectMgr');
        return;
      }

      var emails = [];
      if(window.localStorage.getItem("sendEmails")!==null && 
        window.localStorage.getItem("sendEmails")!==""){
        emails = JSON.parse(window.localStorage.getItem("sendEmails"));
      }
      $scope.emails = emails;
      $scope.user1 = '';

      // var projectId = $routeParams.id;
      $scope.project = Sharedata.get('project');
      // var ans_id = Sharedata.set("answer_id");
      $scope.checklist = Sharedata.get('checklist');
      $scope.q_id  = Sharedata.get('question_id');
      $scope.cat_id = Sharedata.get('cat_id');
      // if(window.debug)console.log($scope.project);

      $scope.user  ={email: window.sessionStorage.user};

      $scope.selectemail = function(){
        $scope.user1 = {email:$scope.sendemail};
      };

      $("#emailForm").validate({
      rules: {
        emailTxt: {
            required: true,
            email: true,
            minlength: 6,
            maxlength : 100
          }
      },
        highlight: validateUtils.highlight,
        unhighlight: validateUtils.unhighlight,            
        errorPlacement: validateUtils.errorPlacement,
        submitHandler: function() {
          var user = {user: $scope.user1};
          document.getElementById('mailsent').setAttribute("class", "hidden");
          var promise = Api.post(settings.url + 'incidents/'+ $scope.checklist +'/send_email.json', {email: $scope.user1.email ,qid: $scope.q_id});
          $("form [type=submit]").button('loading');
          promise.then(
            function (data){
              if(data)
              {
                if(window.debug)console.log('sending email success');
                var sendEmails = [];
                if(window.localStorage.getItem("sendEmails") !== null && 
                  window.localStorage.getItem("sendEmails")!==""){
                  sendEmails = JSON.parse(window.localStorage.getItem("sendEmails"));
                }
                if($scope.user1.email!=='' && sendEmails.indexOf($scope.user1.email)==-1){
                  sendEmails.push($scope.user1.email);
                  window.localStorage.setItem("sendEmails",JSON.stringify(sendEmails));
                }

                window.localStorage.setItem("sendEmail", $scope.user1.email);
                document.getElementById('mailsent').setAttribute("class", "");
              }
              else
              {
                if(window.debug)console.log('sending email fail');
                if(window.debug)console.log(data)
                // if(window.debug)console.log("-------------------------qq");
              }
            }
          );
          promise.finally(function (){
            $("form [type=submit]").button('reset');
          });
          ////////////////////////////////
          var qid = $scope.q_id+1;
          Api.get(settings.url + 'questions/' + qid + '/get_question.json')
            .then(function (data){
              if (data.error){
                // if(window.debug)console.dir(error);
              } 
              else 
              {
                if(data.category_id == $scope.cat_id)
                {
                  Api.get(settings.url +'questions/'+ qid +'/reports/'+$scope.checklist+'/getanswerid.json').
                  then(function (data1){
                    if(data1.error)
                      {if(window.debug)console.dir(error);
                    }
                    else
                    {
                      Sharedata.set('question_id', qid);
                      Sharedata.set('notice', "null");
                      Sharedata.set('q_body', data.body);
                      // $scope.question_body = data.body;
                      $location.path('/answer/'+data1[0].id);
                      if(!$scope.$$phase) $scope.$apply();
                    }
                  });
                }
                else{
                  Sharedata.set('notice', "Please select another category to proceed.");
                  $location.path('/categoryList/' + $scope.checklist);
                  // $location.path('/sendemail');
                  if(!$scope.$$phase) $scope.$apply();
                }
              }
          });
        }
      });
  }]);