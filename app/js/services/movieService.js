(function(){
   "use strict";

   angular.module('services')
    .service('movieServices', ['$http','api', function MovieService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.movie.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getMovieCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        similar: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getSimilarMovies($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        images: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getImages($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        info: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.movie.getMovieInfo($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        now_playing: function($pg,callback) {
          $http({
            method: 'GET',
            url: api.movie.getNowPlaying($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        anyItem: function($str, callback) {
          $http({
            method: 'GET',
            url: api.any.all($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        anyItemPage: function($str, $page, callback) {
          $http({
            method: 'GET',
            url: api.any.page($str, $page)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();
