(function(){
   "use strict";

   angular.module('services')
    .service('movieServices', ['$http','api', function MovieService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.movie.searchname($str)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getMovieCredits($mid)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        similar: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getSimilarMovies($mid)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        images: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getImages($mid)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        info: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.movie.getMovieInfo($mid)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        now_playing: function($pg,callback) {
          $http({
            method: 'GET',
            url: api.movie.getNowPlaying($pg)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        anyItem: function($str, callback) {
          $http({
            method: 'GET',
            url: api.any.all($str)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        },
        anyItemPage: function($str, $page, callback) {
          $http({
            method: 'GET',
            url: api.any.page($str, $page)
          }).then(function (response) {
            callback(response.data);
          }, function errorCallback(response){
            callback(response);
          });
        }
      }
    }]);

})();
