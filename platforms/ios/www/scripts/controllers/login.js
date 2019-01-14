'use strict';

angular.module('CCS-Safety')
  .controller('LoginCtrl', ['$rootScope','$scope','$location', 'Api','Sharedata', function ($rootScope, $scope, $location, Api,Sharedata) {
     var index ;
     var name;
     var pwd;
     var options = [];

     var mainScope = angular.element($("#mainBody")).scope();
     mainScope.myBodyClass = 'bodybg1';

    if(window.localStorage.getItem("count"))
    {
     index = window.localStorage.getItem("count");
     index++;
    }else{ index = 0;}

    if(Sharedata.get('usersignup')) {
      
      document.getElementById("userin").setAttribute("class", "");
      $scope.usersignup = Sharedata.get('usersignup');
    }

    $scope.credentials = {};
    if(ccsLocalStorage.has('credentials')){
      $scope.credentials = extract_object(ccsLocalStorage.get('credentials'));
    }

    window.scrollTo(0,0);

    $scope.$on('$routeChangeSuccess', function () {
      $('body').show();
    });

    $scope.username_focus = function($event){
      $scope.user.username = '';
      $scope.user.password = '';
      $('.username-list-container').show();
      window.scrollTo(0, 100);
    };

    $scope.gotoNewUser = function (){
      $location.path("/newUser");
    };
    
    $scope.addUser = function (){
      $location.path('/user');
    };

    $scope.select_credential = function(credential){
      $('.username-list-container').hide();
      $scope.user.username = credential.key;
      $scope.user.password = credential.value;
    };
    
    $scope.open_disclaimer_box = function(){
    	$('.disclaimer-box').show();
    };

    $scope.close_disclaimer_box = function(){
    	$('.disclaimer-box').hide();
    };


    $("#loginForm").validate({
      rules: {
        usernameTxt: {
            required: true,
            maxlength : 100
          },
        passwordTxt: {
            required: true,
            maxlength : 100
          }
        },
        highlight: validateUtils.highlight,
        unhighlight: validateUtils.unhighlight,            
        errorPlacement: validateUtils.errorPlacement,
        submitHandler: function() {
          $scope.invalidCredentials = false;
          var user = {user: $scope.user};
          if(!$scope.user.chkDisclaimer){
          	navigator.notification.alert("You must agree to legal disclaimer to proceed",
          	function(){}, " ");
          	return;
          }
          var promise = Api.post(settings.url + 'users/sign_in.json', {data : user});
          $("form [type=submit]").button('loading');
          promise.then(
            function (data){
              if(data && data.user)
              {
                window.sessionStorage.token = data.authenticity_token;
                window.sessionStorage.user = data.user.first_name;
                
                if($scope.user.remember == true)
                {
                  var credentials = {};
                  if(ccsLocalStorage.has('credentials')){
                    credentials = ccsLocalStorage.get('credentials');
                  }
                  credentials[data.user.username] = $scope.user.password;
                  ccsLocalStorage.set('credentials', credentials);
                  $scope.credentials = extract_object(credentials);
                }
                $location.path('/projectMgr');
              }
              else
              {
                $scope.invalidCredentials = true;
              }
            }
          );

          promise.finally(function (){
            $("form [type=submit]").button('reset');
          });
        }
    });

    
    $("#userForm").validate({
      rules: {
        emailTxt: {
            required: true,
            email: true,
            // minlength: 6,
            maxlength : 100
        },
        fnameTxt: {
            required: true,
            maxlength : 100
        },
        usernameTxt: {
            required: true,
            maxlength : 100
        },
        passwordTxt: {
          required: true,
          maxlength : 100
        },
        password_conTxt: {
          required: true,
          maxlength : 100,
          equalTo: "#passwordTxt",
        },
        companyTxt: {
          required: true,
          maxlength : 100
        },
        phoneTxt: {
          required: true,
          maxlength : 100
        }
      },
        highlight: validateUtils.highlight,
        unhighlight: validateUtils.unhighlight,            
        errorPlacement: validateUtils.errorPlacement,
        submitHandler: function() {
          var user = {user: $scope.newuser};
          // if(window.debug)console.log("user");
          // if(window.debug)console.dir(user);
          var promise = Api.get(settings.url + 'users/add_user.json', {user: $scope.newuser });
          // $("form [type=submit]").button('loading');
          promise.then(
            function (data){
              if(data == 'true')
              {
                
                Sharedata.set('usersignup', $rootScope._T("Your account successfully created. Please login to proceed."));
                $location.path('/login');
              }
              else
              {
                jQuery("#error-div").removeClass('hidden');
                var error_message = "";
                for(var k in data){
                  error_message += "\n"+k.toString().capitalize()+" "+data[k].join(" ");
                }
                $scope.error = error_message;
                // alert(data.email[0])
              }
            }
          );

          // promise.finally(function (){
          //   $("form [type=submit]").button('reset');
          // });
        }
    });


    $scope.scrollWin = function(){
      //window.scrollBy(0,100);
    }

    $scope.open_credential_list = function(){
      $('.credential-list-overlay').removeClass('hidden');
    };

    $scope.close_credential_list = function(){
      $('.credential-list-overlay').addClass('hidden');
    };



    $scope.forgotpassword = function(){
      $location.path("/passwordreset");
    };

    // $scope.adduser = function(){
    //   if(window.debug)console.log("ddffdf");
    // };



  }]);