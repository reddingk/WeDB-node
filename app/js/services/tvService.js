(function(){
   "use strict";

   angular.module('services')
    .service('tvServices', ['$http','api', function TvService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.tv.searchname($str)
          }).then(function successCallback(response) {
            callback(response);
          }, function errorCallback(response) {
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getTvCredits($mid)
          }).then(function successCallback(response) {
            callback(response);
          }, function errorCallback(response) {
            callback(response);
          });
        },
        info: function($mid) {
          $http({
            method: 'GET',
            url: api.tv.getTvInfo($mid)
          }).then(function successCallback(response) {
            callback(response);
          }, function errorCallback(response) {
            callback(response);
          });
        }
      }
    }]);

})();
