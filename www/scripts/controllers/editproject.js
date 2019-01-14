'use strict';

angular.module('CCS-Safety')
  .controller('EditProjectCtrl', ['$scope','$location', 'Api','Sharedata',
   function ($scope, $location, Api, Sharedata) {
       var mainScope = angular.element($("#mainBody")).scope();
       mainScope.myBodyClass = 'bodybg';

    // alert("sdsdhsgjhgd");
    var projId = Sharedata.get('Editprojects');

    Api.get(settings.url + 'projects/'+projId+'/edit.json')
      .then(function(data){
        if(data.error)
        {
          // if(window.debug)console.log("Errorrrrrrrrrrrrrrrrrrrrrrrrrr");
          // if(window.debug)console.dir(data.error);
        }
        else
        {
         
          $scope.project = {name: data.name, address: data.address, contact_info: data.contact_info, data: ''};
          
        }
      }
    );

    $("#editprojectForm").validate({
      rules: {
        nameTxt: {
            required: true,
            // minlength: 6,
            maxlength : 100
          },
        addressTxt: {
            required: true,
            maxlength : 100
        },
        contactTxt: {
          required: true,
          maxlength : 100
        }
        },
        highlight: validateUtils.highlight,
        unhighlight: validateUtils.unhighlight,            
        errorPlacement: validateUtils.errorPlacement,
        submitHandler: function() {
          var user = {user: $scope};
        
          if(window.debug)console.log($scope.project);
          var promise = Api.patch(settings.url + 'projects/'+projId+'.json', {project: $scope.project });
          promise.then(
            function (data){
              if(window.debug)console.log(data);
              if(data)
              {
                // if(window.debug)console.log("00000000000000000000000000000000");
                $location.path('/projectlist');
              }
              else{
              // {if(window.debug)console.log("99999999999999999999999999999999999");
              }
            }
          );
        }
    });

    $scope.scrollWin = function(){
      if(window.debug)console.log("scrolled ");
      window.scrollBy(0,200);   
    }
}]);
