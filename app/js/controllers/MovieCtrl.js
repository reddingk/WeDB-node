(function(){
   "use strict";

    angular.module('movieCtrl', ['ui.bootstrap']).controller('MovieController', ['movieServices','MovieData', function(movieServices, MovieData){
      var vm = this;
      vm.title = "Movie";

      vm.resultsLimit = 8;
      vm.selected = undefined;
      vm.selectedMovie = undefined;
      vm.showSelected = false;
      vm.selectedCredit = undefined;
      vm.showSelectedCredit = false;


      vm.movieSearch = function(query) {
        return movieServices.names(query).then(function (results) {
          var moviedata = results.results;
          return (moviedata.length > vm.resultsLimit ? moviedata.slice(0, vm.resultsLimit) : moviedata);  ;
        }, function (error) {
          console.log("ERROR NO RESULTS");
        });
      }

      vm.getMovieInfo = function(movieid) {
        return movieServices.info(movieid).then(function (results) {
          return results;
        }, function (error) {
          console.log("ERROR NO MOVIE INFO");
        });
      }

      vm.getMovieCredits = function(movieid) {
        return movieServices.credits(movieid).then(function (results) {
          return results;
        }, function (error) {
          console.log("ERROR NO MOVIE CREDITS");
        });
      }

      vm.viewMovieInfo = function(item) {
        vm.showSelected = false;
        var movieid = item.id;
        if((vm.selectedMovie == undefined) || (movieid != vm.selectedMovie.id)) {
          vm.showSelectedCredit = false;
          vm.selectedCredit = undefined;
          vm.getMovieInfo(movieid).then(function(retResults) {
            vm.showSelected = true;
            vm.selectedMovie = retResults;
          });
        }
        else {
          vm.showSelected = true;
        }
      }

      vm.viewMovieCredits = function(movieid) {
        if(vm.showSelectedCredit == false){
          if(vm.selectedCredit == undefined) {
            vm.getMovieCredits(movieid).then(function(retResults) {
              vm.selectedCredit = retResults.cast;
              vm.showSelectedCredit = true;
              console.log("Got Results");
            });
          }
          else {
            vm.showSelectedCredit = true;
            console.log("Already Had Results");
          }
        }
        else {
          vm.showSelectedCredit = false;
        }

      }

    }]);

})();
