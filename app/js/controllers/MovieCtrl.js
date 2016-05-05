(function(){
   "use strict";

    angular.module('movieCtrl', ['ui.bootstrap']).controller('MovieController', ['movieServices','MovieData', '$filter', '$q', function(movieServices, MovieData, $filter, $q){
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
      vm.slider = [false, false, false];
      vm.compared = [];

      vm.movieSearch = function(query) {
        var cleanString = query;
        cleanString = cleanString.replace("&", "and");

        return movieServices.names(cleanString).then(function (results) {
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
        }
      }
      vm.removeCompareMovie = function(movie) {
        var removeIndex = vm.selectedObjects.indexOf(movie);
        if(removeIndex >= 0)
          vm.selectedObjects.splice(removeIndex, 1);
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

      vm.getMovieIndex = function(movie) {
        var index = vm.selectedObjects.indexOf(movie);
        if(index >= 0)
          return index;
        else
          return 0;
      }
      vm.toggleSlider = function(movie) {
          var movieIndex = vm.getMovieIndex(movie);
          vm.slider[movieIndex] = !vm.slider[movieIndex];
      }
      vm.getSliderStatus = function(movie) {
        var movieIndex = vm.getMovieIndex(movie);
        return vm.slider[movieIndex];
      }

      /*Compare Movies*/
      vm.compareSelectedMovies = function() {
        console.log("-- COMPARE --");
        var deferred = $q.defer();

        vm.getCompareCasts().then(function (data){
          console.log("Cast List: ");
          deferred.resolve(data);
          console.log(deferred.promise);
          vm.compared = vm.compareMovieCasts(deferred.promise);
          console.log("Finished: ");
          console.log(vm.compared);
        });

        //vm.compared = vm.compareMovieCasts(castList);
        //console.log("Finished: ");
        //console.log(vm.compared);

      }

      /*Get movie cast for each compared movie*/
      vm.getCompareCasts = function() {
        var deferred = $q.defer();

        function fullCastInfo(mInfo) {
          var fullCast =[];
          var deferred = $q.defer();
          return vm.getMovieCredits(mInfo.id).then(function(data){
            fullCast.push({movieinfo: mInfo, cast: data });
            deferred.resolve(fullCast);
            return deferred.promise;
          });
        }

        function returnList() {
          var compareCasts = [];

          for(var i =0; i < vm.selectedObjects.length; i++) {
            fullCastInfo(vm.selectedObjects[i]).then(function(data){
              compareCasts.push(data);
              console.log(compareCasts);
            });
          }

          deferred.resolve(compareCasts);
          return deferred.promise;
        }

        return returnList().then(function(data){
          deferred.resolve(data);
          console.log("data: ");
          console.log(deferred.promise);
          return deferred.promise;
        });
      }

      /*Compare casts for each movie and return all cast members that appear in movies together*/
      vm.compareMovieCasts = function(castList) {

        console.log("COMPARE LIST-" + castList.length);
        console.log(castList);

        var compareResults = [];
        // compare one to one
        if(castList.length > 1){
          for(var i=0; i < castList.length; i++) {
            for(var j=i+1; j < castList.length; j++) {
              compareResults.push({movie1: castList[i].movieinfo, movie2:castList[j].movieinfo, matchedCast:vm.compareMovies(castList[i].cast, castList[j].cast, null) });
            }
          }
        }
        // compare all 3 items
        if(castList.length == 3){
          compareResults.push({movie1: castList[0].movieinfo, movie2:castList[1].movieinfo, movie3:castList[2].movieinfo, matchedCast:vm.compareMovies(castList[0], castList[1], castList[2]) });
        }
        console.log("COMPARE RESULTS");
        deferred.resolve(compareResults);
        console.log(deferred.promise);
        return deferred.promise;
      }

      /*Compare movies and return cast in each movie*/
      vm.compareMovies = function(movieA, movieB, movieC) {
        console.log("movieA: " + movieA.length);
        console.log(movieA);
        console.log("movieB: " + movieB.length);
        console.log(movieB);
        console.log("movieC");
        console.log(movieC);

        var comparedCasts = [];
        // Only compare 2
        if(movieC == null) {
          for(var i=0; i < movieA.length; i++) {
            for(var j=0; j < movieB.length; j++) {
              if(movieA[i].id == movieB[j].id){
                comparedCasts.push(movieA[i]);
              }
            }
          }
        }
        else {
          for(var i=0; i < movieA.length; i++) {
            for(var j=0; j < movieB.length; j++) {
              for(var k=0; k < movieC.length; k++) {
                if((movieA[i].id == movieB[j].id) && (movieB[i].id == movieC[k].id)) {
                  comparedCasts.push(movieA[i]);
                }
              }
            }
          }
        }

        return comparedCasts;
      }


    }]);

})();
