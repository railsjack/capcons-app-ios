'use strict';

angular.module('CCS-Safety')
  .controller('PasswordresetCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Api', 'Sharedata',
    function ($rootScope, $scope, $location, $routeParams, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

    if(window.location.hash != "#/passwordreset ")
    { 
      
      document.getElementById('navbar').setAttribute('class', "hidden");
      document.getElementById('newnavbar').setAttribute('class', "");
      document.getElementById('newnavbar').setAttribute('class', "header navbar-fixed-top");
    } 
    else
    {
      
      document.getElementById('navbar').setAttribute('class', "");
      document.getElementById('newnavbar').setAttribute('class', "header navbar-fixed-top");
      document.getElementById('newnavbar').setAttribute('class', "hidden");
    } 


     $("#resetpwdForm").validate({
      rules: {
        usernameTxt: {
          required: true,
          maxlength : 100
          }
        },
        highlight: validateUtils.highlight,
        unhighlight: validateUtils.unhighlight,            
        errorPlacement: validateUtils.errorPlacement,
        submitHandler: function() {
          var user = {user: $scope.reset};
          var promise = Api.post(settings.url + 'users/password.json', {user:{username : $scope.reset.username}});
          $("form [type=submit]").button('loading');
          promise.then(
            function (data){
              if(data && data.user)
              {
                if(window.debug)console.log("error");
                if(window.debug)console.log(data);
                // $location.path('/projectMgr');
              }
              else
              {
                if(window.debug)console.log("true");
                if(window.debug)console.log(data);
                Sharedata.set('usersignup',
                  $rootScope._T('You will receive an email with instructions on how to reset your password in a few minutes.')
                )
                // $scope.invalidCredentials = true;
                $location.path('/login');
              }
            }
          );

          promise.finally(function (){
            $("form [type=submit]").button('reset');
          });
        }
    });
    
    $scope.go_back = function(){
    	if(lang_code=='en')location.href = 'main_en.html';
    	if(lang_code=='es')location.href = 'main_es.html';
    };


  }]);