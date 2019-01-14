'use strict';

angular.module('CCS-Safety')
    .controller('MainCtrl', ['$scope', function ($scope) {
        $scope.myBodyClass = 'bodybg';
    }]);

angular.module('CCS-Safety')
  .controller('HeaderCtrl', ['$scope', '$location', 'Sharedata', 'Api',
    function ($scope, $location, Sharedata,Api) {
      var isBackAllowed = true;
      var isHomeAllowed = true;
      
      $scope.isBackAllowed = function (){
        return isBackAllowed;
      };

      $scope.isHomeAllowed = function (){
        return isHomeAllowed;
      };

      $scope.gotoHome = function (){
        $location.path('/projectMgr');
        Sharedata.clear();
      }
      
      $scope.gotoHospital = function (){
        $location.path('/hospitals');
        Sharedata.clear();
      }

      $scope.gotoBack = function (){
        window.history.back();
      };

      $scope.gotoLogin = function(){
        $location.path('/login');
        Sharedata.clear();
      };

      $scope.logout = function(){
        if(window.debug)console.log(window.sessionStorage.token);
        if(window.debug)console.log(window.sessionStorage.user)
        
        Api.del(settings.url + 'users/sign_out.json',{method: "delete"})
        .then(function (data){
          if(window.debug)console.log('Sign Out');
          if(window.debug)console.log(JSON.stringify(data));
          if (data.error){
            // if(window.debug)console.dir(error);
          } else {
            $location.path('/login');
          } 
        });  

      };

      var updateHeaderStatus = function () {
        var location = ($location.path().match(/\/\w+/)|| [])[0];
        $scope.project = Sharedata.get('project');

        switch (location) {
          case '/':
          case '/passwordreset':
            isBackAllowed = false;
            isHomeAllowed = false;
            break;
          case '/login':
            isBackAllowed = false;
            isHomeAllowed = false;
            break;
          default:
            isBackAllowed = true;
            isHomeAllowed = true;
            break;
        }
      };
        

      $scope.$on('$locationChangeSuccess', updateHeaderStatus);

  }]);