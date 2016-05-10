(function(){
   "use strict";

   angular.module('weMovies')
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
        },
        anyItem: function($str) {
          var def = $q.defer();
          $http({
            method: 'GET',
            url: api.any.all($str)
          }).then(function successCallback(response) {
            def.resolve(response.data);
          }, function errorCallback(response) {
            def.reject(response);
          });
          return def.promise;
        }
      }
    }])
   .factory("movieData", ['$q', function($q){
     function movieCompareData() {
       var vm = this;

       vm.selectedMovies = [];
       vm.selectedMoviesInfo = [];
       vm.comparedCasts = [];
       vm.comparedResults = [];

       vm.addCastCompare = function(castObject) {
         console.log("HERE ---");
         console.log(castObject);
         vm.comparedCasts.push(castObject);
       }
       vm.getCastCompare = function() {
         console.log("Return cast compare");
         console.log(vm.comparedCasts);

         return vm.comparedCasts;
       }
     }

     return new movieCompareData();
   }]);


})();
