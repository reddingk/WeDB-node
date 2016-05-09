(function(){
   "use strict";

   angular.module('weCast')
    .service('castServices', ['$q', '$http','api', function CastService($q, $http, api) {
      return {
        names: function($str){
          var def = $q.defer();
          $http({
            method: 'GET',
            url: api.cast.searchname($str)
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
            url: api.cast.getCastCredits($mid)
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
            url: api.cast.getCastInfo($mid)
          }).then(function successCallback(response) {
            def.resolve(response.data);
          }, function errorCallback(response) {
            def.reject(response);
          });
          return def.promise;
        }

      }
    }])
   .factory("castData", ['$q', function($q){
     function castCompareData() {
       var vm = this;

       vm.selectedCast = [];
       vm.selectedCastInfo = [];
       vm.comparedMovies = [];
       vm.comparedResults = [];

       vm.addMovieCompare = function(castObject) {
         console.log("HERE ---");
         console.log(castObject);
         vm.comparedMovies.push(castObject);
       }
       vm.getMovieCompare = function() {
         console.log("Return cast compare");
         console.log(vm.comparedCasts);

         return vm.comparedMovies;
       }
     }

     return new castCompareData();
   }]);


})();
