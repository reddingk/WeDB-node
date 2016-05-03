(function(){
   "use strict";

    angular.module('specialCtrl', ['ui.bootstrap']).controller('SpecialController', [ 'movieServices','MovieData', function(movieServices, MovieData){
      var vm = this;
      vm.title = "Special";
      vm.resultsLimit = 8;
      vm.selected = undefined;

      vm.movieSearch = function(query) {
        return movieServices.names(query).then(function (results) {
          var moviedata = results.results;
          return (moviedata.length > vm.resultsLimit ? moviedata.slice(0, vm.resultsLimit) : moviedata);  ;
        }, function (error) {
          console.log("ERROR NO RESULTS");
        });
      }

    }]);

})();
