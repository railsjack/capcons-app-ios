'use strict';

angular.module('CCS-Safety')
    .controller('GMapCtrl', ['$scope', '$location', 'Api', 'Sharedata',
        function ($scope, $location, Api, Sharedata) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    //console.log(position);
                    //loadMap(position.coords.latitude, position.coords.longitude);
                    var sUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + position.coords.latitude + ',' + position.coords.longitude + '&rankby=distance&types=hospital&key=AIzaSyAHJiDpmIM633L75pbtJGUsjjVIi9HamuA';
                    var sDetailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid={0}&key=AIzaSyAHJiDpmIM633L75pbtJGUsjjVIi9HamuA';

                    $scope.hospitals = [];
                    Api.get(sUrl)
                    .then(function (data) {
                        if (data.status == "OK") {
                            var iCnt = 0;
                            for(iCnt = 0; iCnt < data.results.length; iCnt++) {
                                if (iCnt == 5) {
                                    break;
                                }
                                var hospital = data.results[iCnt];
                                var tmpUrl = sDetailsUrl.replace("{0}", hospital.place_id);
                                Api.get(tmpUrl)
                                    .then(function (data) {
                                        if (data.status == "OK") {
                                            var hospDetail = data.result;
                                            var hosp = {
                                                place_id: hospDetail.place_id,
                                                name: hospDetail.name,
                                                lat: hospDetail.geometry.location.lat,
                                                lng: hospDetail.geometry.location.lng,
                                                address: hospDetail.formatted_address
                                            };
                                            $scope.hospitals.push(hosp);
                                        }
                                    });
                            };
                        }
                        else {
                            alert(data.error_message);
                        }
                    });
                });
            } else {
                alert("Geolocation is not supported");
            };
            
            $scope.OpenMap = function(idx) {
                var hp = $scope.hospitals[idx];
                //alert(hName);
                //alert(hAddress);
                var sUrl = "http://maps.google.com/maps?q=" + hp.name + " " + hp.address;
                //alert(sUrl);
                window.open(sUrl, '_system');
            };
        }
    ]);