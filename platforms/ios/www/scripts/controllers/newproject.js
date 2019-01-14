 'use strict';

angular.module('CCS-Safety')
  .controller('NewprojectCtrl', ['$scope', '$location', 'Api', 'Sharedata', 
    function ($scope, $location, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

      Sharedata.clear();
      $("#projectForm").validate({
        rules: {
          nameTxt: {
            required: true,
            maxlength : 100

          },
          addressTxt: {
            required: true,
            maxlength : 200
          },
          contactTxt: {
            required: true,
            maxlength : 200
          }
        },
        highlight: validateUtils.highlight,
        unhighlight: validateUtils.unhighlight,            
        errorPlacement: validateUtils.errorPlacement,
        submitHandler: function() {
          var promise = Api.post(settings.url + 'projects.json', {project: $scope.project});
          $("form [type=submit]").button('loading');
          promise.then(
            function (data){
              if(data.error)
              {
                $scope.showError = true;

              }else{
                
                $location.path('/projectMgr');
              }
            }
          );
        }
      });
  }]);



 angular.module('CCS-Safety')
  .directive('capitalizeFirst', function($parse) {
    return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if(typeof inputValue=='undefined') return;
           var capitalized = inputValue.charAt(0).toUpperCase() +
                             inputValue.substring(1);
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
     }
    };
  });