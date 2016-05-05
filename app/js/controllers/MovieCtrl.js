(function(){
   "use strict";

    angular.module('movieCtrl', ['ui.bootstrap']).controller('MovieController', ['movieServices','MovieData', '$filter', function(movieServices, MovieData, $filter){
      var vm = this;
      vm.title = "Movie";

      // Select movie
      vm.resultsLimit = 8;
      vm.selected = undefined;
      vm.selectedMovie = undefined;
      vm.showSelected = false;
      vm.selectedCredit = undefined;
      vm.showSelectedCredit = false;

      // Compare movies
      vm.showCompare = false;
      vm.selectedObjects = [];

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
      vm.addMovieToCompare = function(movie) {
        if(vm.ableToCompare(movie)){
          vm.selectedObjects.push(movie);
          vm.showSelected = false;
          vm.showSelectedCredit = false;
          vm.selectedMovie = undefined;
          vm.selectedCredit = undefined;
          vm.selected = undefined;
          vm.showCompare = true;
          console.log("added: " + vm.selectedObjects.length );
        }
        console.log("after add");
      }

      vm.ableToCompare = function(movie) {
        if(vm.selectedObjects.length < 3 && movie!= null )
        {
          var found = $filter('filter')(vm.selectedObjects, {id: movie.id});
          if(found == undefined || found.length == 0)
            return true;
        }
        return false;
      }

    }]);

})();
