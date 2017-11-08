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
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getTvCredits($mid)
          }).then(function successCallback(response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        similar: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getSimilarTv($mid)
          }).then(function successCallback(response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        images: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getImages($mid)
          }).then(function successCallback(response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },        
        info: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.tv.getTvInfo($mid)
          }).then(function successCallback(response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        onAir: function($pg, callback) {
          $http({
            method: 'GET',
            url: api.tv.getOnAir($pg)
          }).then(function successCallback(response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        }
      }
    }]);

})();
