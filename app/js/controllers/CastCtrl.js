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
      vm.showBio = false;

      // Compare movies
      vm.showCompare = false;
      vm.selectedObjects = [];
      vm.slider = [false, false, false];
      vm.compared = [];

      // Select Compare List
      vm.selectedList = undefined;
      vm.comparedVisuals = [];
      vm.highlight = undefined;

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
      vm.getCastCredits = function(castid) {
        return castServices.credits(castid).then(function (results) {
          return results;
        }, function (error) {
          console.log("ERROR NO MOVIE CREDITS");
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
            vm.showBio = false;
          });
        }
        else {
          vm.showSelected = true;
        }
      }

      vm.viewCastMovies = function(movieid) {
        if(vm.showSelectedMovieList == false){
          if(vm.selectedMovieList == undefined) {
          }
          else {
            vm.showSelectedMovieList = true;
            vm.showBio = false;
            console.log("Already Had Results");
          }
        }
        else {
          vm.showSelectedMovieList = false;
        }
      }

      vm.viewBio = function() {
        vm.showSelectedMovieList = false;
        vm.showBio = !vm.showBio;
      }

      vm.addToCompare = function(movie) {
        if(vm.ableToCompare(movie)){
          vm.selectedObjects.push(movie);
          vm.showSelected = false;
          vm.showSelectedCast = false;
          vm.selectedCast = undefined;
          vm.showBio = false;
          vm.selectedMovieList = undefined;
          vm.selected = undefined;
          vm.showCompare = true;
        }
      }
      vm.removeCompareCast = function(cast) {
        var removeIndex = vm.selectedObjects.indexOf(cast);
        if(removeIndex >= 0)
          vm.selectedObjects.splice(removeIndex, 1);
      }

      vm.ableToCompare = function(cast) {
        if(vm.selectedObjects.length < 3 && cast!= null )
        {
          var found = $filter('filter')(vm.selectedObjects, {id: cast.id});
          if(found == undefined || found.length == 0)
            return true;
        }
        return false;
      }
      vm.getCastIndex = function(cast) {
        var index = vm.selectedObjects.indexOf(cast);
        if(index >= 0)
          return index;
        else
          return 0;
      }
      vm.toggleSlider = function(cast) {
          var castIndex = vm.getCastIndex(cast);
          vm.slider[castIndex] = !vm.slider[castIndex];
      }
      vm.getSliderStatus = function(cast) {
        var castIndex = vm.getCastIndex(cast);
        return vm.slider[castIndex];
      }

      /*Compare Movies*/
      vm.compareSelectedMovies = function() {
        vm.getCompareMovies().then(function(){
          vm.compareCastMovies();
          console.log(vm.compared);
          // Get color code for all casts members
          vm.resultsVisuals();
          console.log(vm.comparedVisuals);
        });
      }

      /*Get movie list for each compared cast*/
      vm.getCompareMovies = function() {
        var promises = [];

        function fullMovieInfo(cInfo) {
          var def = $q.defer();
          if(castData.comparedMovies.length < 1){
            return vm.getCastCredits(cInfo.id).then(function(data){
              castData.comparedMovies.push({castinfo: cInfo, movie: data });
               def.resolve(true);
            });
          }
          return def.promise;
        }

        for(var i =0; i < vm.selectedObjects.length; i++) {
            promises.push(fullMovieInfo(vm.selectedObjects[i]));
        }
        return $q.all(promises).then(function(data){
          var def = $q.defer();
          def.resolve(true);
          return def.promise;
        });
      }

      /*Compare movies for each cast member and return all movies that have both cast members*/
      vm.compareCastMovies = function() {
        var movieList = castData.comparedMovies;
        var compareResults = [];
        // compare one to one
        if(movieList.length > 1){
          for(var i=0; i < movieList.length; i++) {
            for(var j=i+1; j < movieList.length; j++) {
              castData.comparedResults.push({cast1: movieList[i].castinfo, cast2:movieList[j].castinfo, matchedMovies:vm.compareCasts(movieList[i].movie, movieList[j].movie, null) });
            }
          }
        }
        // compare all 3 items
        if(movieList.length == 3){
          castData.comparedResults.push({cast1: movieList[0].castinfo, cast2:movieList[1].castinfo, cast3:movieList[2].castinfo, matchedMovies:vm.compareCasts(movieList[0].movie, movieList[1].movie, movieList[2].movie) });
        }

        vm.compared = castData.comparedResults;
        var def = $q.defer();
        def.resolve();
        return def.promise;
      }

      /*Compare movies and return cast in each movie*/
      vm.compareCasts = function(cA, cB, cC) {
        var castA = (cA == null ? null : cA.cast);
        var castB = (cB == null ? null : cB.cast);
        var castC = (cC == null ? null : cC.cast);

        var comparedMovies = [];

        if (castA == null || castB == null)
          return;
        // Only compare 2
        if(castC == null) {
          for(var i=0; i < castA.length; i++) {
            for(var j=0; j < castB.length; j++) {
              if(castA[i].id == castB[j].id){
                comparedMovies.push(castA[i]);
              }
            }
          }
        }
        else {
          for(var i=0; i < castA.length; i++) {
            for(var j=0; j < castB.length; j++) {
              for(var k=0; k < castC.length; k++) {
                if((castA[i].id == castB[j].id) && (castB[j].id == castC[k].id)) {
                  comparedMovies.push(castA[i]);
                }
              }
            }
          }
        }
        return comparedMovies;
      }

      vm.clearResults = function() {
        castData.comparedMovies = [];
        castData.comparedResults = [];
        vm.compared = [];
        vm.selectedObjects = [];
        vm.comparedVisuals = [];
        vm.selectedList = undefined;
      }

      // Visuals
      vm.getListClass = function(compare) {
        if(vm.selectedList == compare)
          return "active";
        else
          return "";
      }

      vm.resultsVisuals = function() {
          var idList = [];
          vm.comparedVisuals = [];

          function MovieVisuals(movieId) {
              var profile = null;
              var castids = [];
              for(var i=0; i < vm.compared.length; i++) {
                if(vm.compared[i].cast3 == null){
                  var found = $filter('filter')(vm.compared[i].matchedMovies, {id: movieId});
                  if(found != undefined && found.length > 0) {
                    // Profile
                    if(profile == null)
                      profile = found[0].poster_path;
                    // Check Movie 1
                    if(castids.indexOf(vm.compared[i].cast1.id) < 0)
                      castids.push(vm.compared[i].cast1.id);
                    // Check Movie 2
                    if(castids.indexOf(vm.compared[i].cast2.id) < 0)
                      castids.push(vm.compared[i].cast2.id);
                  }
                }
              }
              return {poster_path:profile, movies: castids};
          }

          for(var i=0; i < vm.compared.length; i++) {
            for(var j=0; j < vm.compared[i].matchedMovies.length; j++) {
              if(idList.indexOf(vm.compared[i].matchedMovies[j].id) < 0) {
                idList.push(vm.compared[i].matchedMovies[j].id);
              }
            }
          }

          var colorArray = randomColor({ count: idList.length + 1, luminosity: 'bright', format: 'rgb'});
          for(var i=0; i < idList.length; i++) {
            vm.comparedVisuals.push({id: idList[i], color:colorArray[i], more_info:MovieVisuals(idList[i])});
          }
      }

      vm.getIdColor = function(mid) {
        var color = "rgba(0,0,0,1)";
        var found = $filter('filter')(vm.comparedVisuals, {id: mid});
        if(found != undefined && found.length != 0)
          color = found[0].color;

        return color;
      }
      vm.highlightCast = function(movie) {
        vm.highlight = movie;
      }



    }]);

})();
