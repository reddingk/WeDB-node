(function(){
   "use strict";

    angular.module('weSpecial')
    .controller('SpecialController', [ 'movieServices','movieData', function(movieServices, movieData){
      var vm = this;
      vm.title = "special";
      vm.resultsLimit = 10;
      vm.randomid = undefined;

      vm.multiSearch = function(query) {
        if(query != undefined) {
          var cleanString = query;
          cleanString = cleanString.replace("&", "and");

          return movieServices.anyItem(cleanString).then(function (results) {
            var alldata = results.results;
            return (alldata.length > vm.resultsLimit ? alldata.slice(0, vm.resultsLimit) : alldata);  ;
          }, function (error) {
            console.log("ERROR NO RESULTS");
          });
        }
        return;
      }

      // Random Fact Generator

    }]);

})();
