(function(){
   "use strict";

   angular.module('weCast')
   .controller('CastController', ['castServices','castData', '$filter', '$q', function(castServices, castData, $filter, $q){
     var vm = this;
      vm.title = "cast";

      // Select cast member
      vm.resultsLimit = 8;
      vm.selected = undefined;
      vm.selectedCast = undefined;
      vm.showSelected = false;
      vm.selectedMovieList = undefined;
      vm.showSelectedMovieList = false;

      vm.castSearch = function(query) {
        if(query != undefined) {
          var cleanString = query;
          cleanString = cleanString.replace("&", "and");

          return castServices.names(cleanString).then(function (results) {
            var castdata = results.results;
            return (castdata.length > vm.resultsLimit ? castdata.slice(0, vm.resultsLimit) : castdata);  ;
          }, function (error) {
            console.log("ERROR NO RESULTS");
          });
        }
        return;
      }
      vm.getCastInfo = function(castid) {
        return castServices.info(castid).then(function (results) {
          return results;
        }, function (error) {
          console.log("ERROR NO MOVIE INFO");
        });
      }

      vm.viewCastInfo = function(item) {
        vm.showSelected = false;
        var castid = item.id;
        if((vm.selectedCast == undefined) || (castid != vm.selectedCast.id)) {
          vm.showSelectedMovieList = false;
          vm.selectedMovieList = undefined;
          vm.getCastInfo(castid).then(function(retResults) {
            vm.showSelected = true;
            vm.selectedCast = retResults;
            vm.selectedMovieList = item.known_for;
          });
        }
        else {
          vm.showSelected = true;
        }
      }

    }]);

})();
