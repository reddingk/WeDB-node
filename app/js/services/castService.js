(function(){
   "use strict";

   angular.module('services')
    .service('castServices', ['$http','api', function CastService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.cast.searchname($str)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.cast.getCombinedCredits($mid)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        details: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.cast.getCastDetails($mid)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        popular: function($pg, callback) {
          $http({
            method: 'GET',
            url: api.cast.getPopular($pg)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        images: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.cast.getImages($mid)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        taggedImages: function($mid, callback){
          $http({
            method: 'GET',
            url: api.cast.getTaggedImages($mid)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        }
      }
    }]);

})();
