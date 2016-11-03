(function(){
   "use strict";

   angular.module('services')
    .service('castServices', ['$http','api', function CastService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.cast.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.cast.getCombinedCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        details: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.cast.getCastDetails($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        popular: function($pg, callback) {
          $http({
            method: 'GET',
            url: api.cast.getPopular($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();
