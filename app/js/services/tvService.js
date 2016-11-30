(function(){
   "use strict";

   angular.module('services')
    .service('tvServices', ['$http','api', function TvService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.tv.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getTvCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        similar: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getSimilarTv($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        images: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getImages($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        info: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.tv.getTvInfo($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        onAir: function($pg, callback) {
          $http({
            method: 'GET',
            url: api.tv.getOnAir($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();
