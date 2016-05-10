(function(){
   "use strict";

   angular.module('weTv')
    .service('tvServices', ['$q', '$http','api', function TvService($q, $http, api) {
      return {
        names: function($str){
          var def = $q.defer();
          $http({
            method: 'GET',
            url: api.tv.searchname($str)
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
            url: api.tv.getTvCredits($mid)
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
            url: api.tv.getTvInfo($mid)
          }).then(function successCallback(response) {
            def.resolve(response.data);
          }, function errorCallback(response) {
            def.reject(response);
          });
          return def.promise;
        }

      }
    }])
   .factory("tvData", ['$q', function($q){
     function tvCompareData() {
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

     return new tvCompareData();
   }]);


})();
