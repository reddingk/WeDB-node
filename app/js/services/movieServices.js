(function(){
   "use strict";

   angular.module('services', [])
    .service('movieServices', ['$q', '$http','api', function MovieService($q, $http, api) {
      return {
        names: function($str){
          var def = $q.defer();
          $http({
            method: 'GET',
            url: api.movie.searchname($str)
          }).then(function successCallback(response) {
            def.resolve(response.data);
          }, function errorCallback(response) {
            def.reject(response);
          });
          return def.promise;
        },
        credits: function($mid){
          var def = $q.defer();
          $http({
            method: 'GET',
            url: api.movie.getMovieCredits($mid)
          }).then(function successCallback(response) {
            def.resolve(response.data);
          }, function errorCallback(response) {
            def.reject(response);
          });
          return def.promise;
        },
        info: function($mid) {
          var def = $q.defer();
          $http({
            method: 'GET',
            url: api.movie.getMovieInfo($mid)
          }).then(function successCallback(response) {
            def.resolve(response.data);
          }, function errorCallback(response) {
            def.reject(response);
          });
          return def.promise;
        }

      }
    }])
   .factory("MovieData", ['$q', function($q){
     function movieCompareData() {
       var self = this;

       self.selectedMovies =[];
       self.selectedMoviesInfo = [];
       self.comparedMoviesInfo = [];

       self.addSeleectedMovie = function() {}
       self.compareMoviesList = function () {}
       self.compareTwoMovies = function(movieA, movieB) {}
       self.compareAllMovies = function() {}
     }

     return new movieCompareData();
   }]);


})();
