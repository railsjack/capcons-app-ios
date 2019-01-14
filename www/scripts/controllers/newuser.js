'use strict';

angular.module('CCS-Safety')
  .controller('NewuserCtrl', ['$scope', '$location', 'Api', function ($scope, $location, Api) {
      var mainScope = angular.element($("#mainBody")).scope();
      mainScope.myBodyClass = 'bodybg';

    $scope.gotoBack = function (){
      $location.path("/login");
    };

    $("#signupForm").validate({
      rules: {
        emailTxt: {
          required: true,
          email:true,
          maxlength : 100
        },
        firstNameTxt: {
          required: true,
          maxlength : 100
        },
        lastNameTxt: {
          required: true,
          maxlength : 100
        },
        passwordTxt: {
          required: true,
          maxlength : 100,
          minlength : 6
        },
        passwordConfirmTxt: {
          required: true,
          equalTo: "#passwordTxt",
          maxlength : 100,
          minlength : 6
        }
      },
      highlight: validateUtils.highlight,
      unhighlight: validateUtils.unhighlight,            
      errorPlacement: validateUtils.errorPlacement,
      submitHandler: function() {
        Api.post(settings.url + 'users.json', $scope.user)
          .then(function (data) {
              if(window.debug)console.dir(data);
            }, 
            function (data, status) {
              if(window.debug)console.dir(data);
          }
        );
      }
      }
    );
  }]);