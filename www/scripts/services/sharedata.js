'use strict';

angular.module('CCS-Safety')
  .service('Sharedata', function Sharedata() {
    var data = {};
    return {
      set : function (key, value){
        data[key] = value;
      },
      get : function (key){
        return data[key];
      },
      clear : function (key){
        data = {};
      }
    }
  });
