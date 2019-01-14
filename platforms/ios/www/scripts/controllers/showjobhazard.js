'use strict';

angular.module('CCS-Safety')
  .controller('ShowjobhazardCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Api', 'Sharedata',
    function ($rootScope, $scope, $location, $routeParams, Api, Sharedata) {
        var mainScope = angular.element($("#mainBody")).scope();
        mainScope.myBodyClass = 'bodybg';

        $scope.report = { project_id: $routeParams["id"] };


        $scope.project = Sharedata.get('project');

        var projectId = $scope.project.key;
        var jobhazardId = $routeParams.id
        // if(window.debug)console.log($scope.project);
        $scope.emails = [];
        $scope.sendemail = '';
        if (window.localStorage.getItem('sendEmails') !== null &&
          window.localStorage.getItem("sendEmails") !== "") {
            $scope.emails = JSON.parse(window.localStorage.getItem('sendEmails'));
        }


        $scope.fileas = [];
        Api.get(settings.url + 'projects/' + projectId + '/jobhazards/' + jobhazardId + '/view_jobhazard.json')
        .then(function (data) {
            if (data.error) {
                // if(window.debug)console.dir(error);
            }
            else {
                $scope.jobhazard = data;
                var records = _.map(data.jobhazards_files, function (jobhazards_file) {
                    var url = jobhazards_file.file.url;
                    var filename = url.substring(url.lastIndexOf('/') + 1);
                    url = url.replace('/' + filename, '/thumb_' + filename);
                    return settings.url + url;
                });
                $scope.fileas = records;
            }
        });

        $scope.selectemail = function () {
            $scope.user1 = { email: $scope.sendemail };
        };


        $("#emailForm").validate({
            rules: {
                emailTxt: {
                    required: true,
                    email: true,
                    minlength: 6,
                    maxlength: 100
                }
            },
            highlight: validateUtils.highlight,
            unhighlight: validateUtils.unhighlight,
            errorPlacement: validateUtils.errorPlacement,
            submitHandler: function () {
                var promise = Api.post(settings.url + 'jobhazards/' + $routeParams.id + '/send_email_by_jobhazard.json', { email: $scope.user1.email });
                $("form [type=submit]").button('loading');
                promise.then(
                  function (data) {
                      if (data) {
                          if (window.debug) console.log('sending email success');
                          var sendEmails = [];
                          if (window.localStorage.getItem("sendEmails") !== null &&
                            window.localStorage.getItem("sendEmails") !== "") {
                              sendEmails = JSON.parse(window.localStorage.getItem("sendEmails"));
                          }
                          if ($scope.user1.email !== '' && sendEmails.indexOf($scope.user1.email) == -1) {
                              sendEmails.push($scope.user1.email);
                              window.localStorage.setItem("sendEmails", JSON.stringify(sendEmails));
                          }

                          window.localStorage.setItem("sendEmail", $scope.user1.email);
                          document.getElementById('mailsent').setAttribute("class", "");
                      }
                      else {
                          if (window.debug) console.log('sending email fail');
                          if (window.debug) console.log(data)
                          // if(window.debug)console.log("-------------------------qq");
                      }
                  }
                );
                promise.finally(function () {
                    jQuery('#mailsent').removeClass("hidden");
                    $("form [type=submit]").button('reset');
                });

            }
        });

    }]);