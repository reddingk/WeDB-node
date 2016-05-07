(function(){
   "use strict";

    //angular.module('movieCtrl', ['ui.bootstrap'])
    angular.module('weMovies')
    .controller('MovieController', ['movieServices','movieData', '$filter', '$q', function(movieServices, movieData, $filter, $q){
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

      // Select Compare List
      vm.selectedList = undefined;
      vm.comparedVisuals = [];

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
        vm.getCompareCasts().then(function(){
          vm.compareMovieCasts();
          console.log(vm.compared);
          // Get color code for all casts members
          vm.resultsVisuals();
          console.log(vm.comparedVisuals);
        });
      }

      /*Get movie cast for each compared movie*/
      vm.getCompareCasts = function() {
        var promises = [];

        function fullCastInfo(mInfo) {
          var def = $q.defer();
          if(movieData.comparedCasts.length < 1){
            return vm.getMovieCredits(mInfo.id).then(function(data){
              movieData.comparedCasts.push({movieinfo: mInfo, cast: data });
               def.resolve(true);
            });
          }
          return def.promise;
        }

        for(var i =0; i < vm.selectedObjects.length; i++) {
            promises.push(fullCastInfo(vm.selectedObjects[i]));
        }
        return $q.all(promises).then(function(data){
          var def = $q.defer();
          def.resolve(true);
          return def.promise;
        });

      }

      /*Compare casts for each movie and return all cast members that appear in movies together*/
      vm.compareMovieCasts = function() {
        var castList = movieData.comparedCasts;
        var compareResults = [];
        // compare one to one
        if(castList.length > 1){
          for(var i=0; i < castList.length; i++) {
            for(var j=i+1; j < castList.length; j++) {
              movieData.comparedResults.push({movie1: castList[i].movieinfo, movie2:castList[j].movieinfo, matchedCast:vm.compareMovies(castList[i].cast, castList[j].cast, null) });
            }
          }
        }
        // compare all 3 items
        if(castList.length == 3){
          movieData.comparedResults.push({movie1: castList[0].movieinfo, movie2:castList[1].movieinfo, movie3:castList[2].movieinfo, matchedCast:vm.compareMovies(castList[0].cast, castList[1].cast, castList[2].cast) });
        }

        vm.compared = movieData.comparedResults;
        var def = $q.defer();
        def.resolve();
        return def.promise;
      }

      /*Compare movies and return cast in each movie*/
      vm.compareMovies = function(mA, mB, mC) {
        var movieA = (mA == null ? null : mA.cast);
        var movieB = (mB == null ? null : mB.cast);
        var movieC = (mC == null ? null : mC.cast);

        var comparedCasts = [];

        if (movieA == null || movieB == null)
          return;
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
                if((movieA[i].id == movieB[j].id) && (movieB[j].id == movieC[k].id)) {
                  comparedCasts.push(movieA[i]);
                }
              }
            }
          }
        }
        return comparedCasts;
      }

      vm.clearResults = function() {
        movieData.comparedCasts = [];
        movieData.comparedResults = [];
        vm.compared = [];
        vm.selectedObjects = [];
        vm.comparedVisuals = [];
        vm.selectedList = undefined;
      }

      vm.getListClass = function(compare) {
        if(vm.selectedList == compare)
          return "active";
        else
          return "";
      }

      vm.resultsVisuals = function() {
          var idList = [];
          vm.comparedVisuals = [];

          for(var i=0; i < vm.compared.length; i++) {
            for(var j=0; j < vm.compared[i].matchedCast.length; j++) {
              if(idList.indexOf(vm.compared[i].matchedCast[j].id) < 0) {
                idList.push(vm.compared[i].matchedCast[j].id);
              }
            }
          }

          var colorArray = randomColor({ count: idList.length + 1, luminosity: 'bright', format: 'rgb'});
          for(var i=0; i < idList.length; i++) {
            vm.comparedVisuals.push({id: idList[i], color:colorArray[i]});
          }
      }

      vm.getIdColor = function(cid) {
        var color = "rgba(0,0,0,1)";
        var found = $filter('filter')(vm.comparedVisuals, {id: cid});
        if(found != undefined && found.length != 0)
          color = found[0].color;

        return color;
      }

    }]);

})();
