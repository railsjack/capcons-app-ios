'use strict';

angular.module('CCS-Safety')
  .controller('IncidentreportCtrl', ['$scope', '$location', '$routeParams', 'Api',
    function ($scope, $location, $routeParams, Api) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

        $scope.report = { project_id: $routeParams["id"] };

        Api.get(settings.url + 'projects/' + $routeParams["id"] + '/incidents/empty_incident.json')
          .then(function (data) {
              if (data.error) {
                  // if(window.debug)console.dir(error);
              } else {
                  $scope.incidentId = data.id;
              }
          });







        $("#reportForm").validate({
            rules: {
                typeTxt: {
                    required: true
                },
                yourNameTxt: {
                    required: true,
                    maxlength: 100
                },
                jobTitleTxt: {
                    required: true
                },
                injuryDateTxt: {
                    required: true,
                    maxlength: 100
                },
                injuryTimeTxt: {
                    required: true,
                    maxlength: 100
                },
                witnessesTxt: {
                    required: true,
                    maxlength: 500
                },
                locationTxt: {
                    required: true,
                    maxlength: 100
                },
                circumstancesTxt: {
                    required: true,
                    maxlength: 1000
                },
                descriptionTxt: {
                    required: true,
                    maxlength: 1000
                },
                injuriesTypeTxt: {
                    required: true,
                    maxlength: 1000
                },
                ppeTxt: {
                    required: true,
                    maxlength: 100
                },
                assistanceProvidedTxt: {
                    required: true,
                    maxlength: 1000
                }
            },
            highlight: validateUtils.highlight,
            unhighlight: validateUtils.unhighlight,
            errorPlacement: validateUtils.errorPlacement,
            submitHandler: function () {
                $("form [type=submit]").button('loading');
                Api.post(settings.url + 'projects/' + $scope.report.project_id + '/incidents.json', { incident: $scope.report, incId: $scope.incidentId })
                .then(function (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        navigator.notification.alert('Saved!', function () { }, " ");
                        $location.path('/showincident/' + data.incident_id).replace();
                    }
                })
                .finally(function () {
                    $("form [type=submit]").button('reset');
                });
            }
        });


        var newUrl;
        $scope.files = [];
        $scope.takePic = function () {
            try {

                var options = {
                    sourceType: 1,
                    quality: 60,
                    destinationType: Camera.DestinationType.DATA_URL
                };
                $scope.newUrl = newUrl;

                navigator.camera.getPicture(uploadPhoto, null, options);


            }
            catch (error) {
                navigator.notification.alert(error.message, function () { }, " ");
            }
        };

        function uploadPhoto(fileUrl) {
            // $scope.report.file = fileUrl;
            newUrl = fileUrl;
            $scope.imageurl = fileUrl;
            $scope.imagectrl();
        }

        $scope.imagectrl = function () {
            $scope.path = 'data:image/jpeg;base64,' + newUrl;
            setTimeout(function () {
                uploadimage(newUrl);
                // alert(fileUrl);
            }, 300);
        }

        function uploadimage(url) {

            $("#camera-button").addClass("hidden");
            $("#disable-button").removeClass("hidden");
            //Api.patch(settings.url + 'projects/' + $routeParams["id"] + '/incidents/' + $scope.incidentId + '/upload_image', {incident:{file:  $scope.imageurl }})
            Api.patch(settings.url + 'incidents_files/' + $scope.incidentId + '/upload_image', { file: $scope.imageurl })
            .then(function (data) {
                if (data.error) {
                    // if(window.debug)console.dir(error);
                    $("#camera-button").removeClass("hidden");
                    $("#disable-button").addClass("hidden");
                }
                else {
                    navigator.notification.alert("Image Successfully Uploaded", function () { }, " ");

                    $("#picupload").removeClass("hidden");
                    $("#camera-button").removeClass("hidden");
                    $("#disable-button").addClass("hidden");
                    //$scope.file = settings.url+data.url;
                    $scope.files.push(settings.url + data.url);
                }
            });
        }






    }]);