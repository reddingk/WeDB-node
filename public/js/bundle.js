(function () {
	"use strict";
		angular.module('weMovies', ['ui.bootstrap']);
		angular.module('weSpecial', ['ui.bootstrap']);
		angular.module('weCast', ['ui.bootstrap']);
		angular.module('weTv', ['ui.bootstrap']);
		angular.module('directives', []);
		angular.module('services', []);

    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'directives', 'config', 'homeCtrl', 'weSpecial', 'weCast','weTv', 'weMovies'])
		.run(function($rootScope){
	    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
	        //change body background
	        //document.body.style.background = 'red';
	    });
	    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
	        //reset body background
					if (angular.isDefined(toState.data.bodyClass)) {
						document.body.style.backgroundPosition = "center bottom";
						document.body.style.backgroundRepeat = "no-repeat";
						document.body.style.backgroundSize = "100%";

						switch(toState.data.bodyClass) {
							case "movieBody":
								document.body.style.backgroundImage = "url('img/movie_back.png')";
								break;
							case "specialBody":
								document.body.style.backgroundImage = "url('img/special_back.png')";
								break;
							case "tvBody":
								document.body.style.backgroundImage = "url('img/tv_back.png')";
								break;
							case "castBody":
								document.body.style.backgroundImage = "url('img/cast_back.png')";
								break;
							default:
								document.body.style.background = 'white';
						}
					}
					else {
						document.body.style.background = 'white';
					}

	    });
		});

})();

(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('config', [ 'ngMaterial' ]);


})();

(function(){

  angular
    .module('config')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider
      .state('home', {
        url: "/",
        templateUrl: 'views/home.html',
        controller: 'SpecialController as sc',
        data: {
           bodyClass: 'specialBody'
        }
      })
      .state('movies', {
        url: "/movies",
        templateUrl: 'views/movies.html',
        controller: 'MovieController as mc',
        data: {
           bodyClass: 'movieBody'
        }
      })
      .state('tv', {
        url: "/tv-shows",
        templateUrl: 'views/tv.html',
        controller: 'TvController as tc',
        data: {
           bodyClass: 'tvBody'
        }
      })
      .state('cast', {
        url: "/cast",
        templateUrl: 'views/cast.html',
        controller: 'CastController as cc',
        data: {
           bodyClass: 'castBody'
        }
      });

      $urlRouterProvider.otherwise('/');
    }]);


})();

(function(){
  'use strict';

  angular
    .module('config')
    .factory('api', function(){
      var baseurl = "https://api.themoviedb.org/3/";
      var apikey = "8af02f398b3ff990bab4f71c247c640a";

      return {
        any: {
          all: function(query){
            return baseurl + "search/multi?api_key="+apikey+"&query="+query;
          }
        },
         movie: {
             searchname: function(query){
                 return baseurl + "search/movie?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/movie?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getMovieCredits: function(id) {
                 return baseurl + "movie/"+id+"/credits?api_key="+apikey;
             },
             getMovieInfo: function(id) {
                 return baseurl + "movie/"+id+"?api_key="+apikey;
             }
         },
         cast: {
             searchname: function(query) {
                 return  baseurl + "search/person?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/person?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getCastCredits: function(id) {
                 return baseurl + "person/"+id+"/movie_credits?api_key="+apikey;
             },
             getCastInfo: function(id) {
                 return baseurl + "person/"+id+"?api_key="+apikey;
             }
         },
         tv: {
             searchname: function(query){
                 return baseurl + "search/tv?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/tv?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getTvCredits: function(id) {
                 return baseurl + "tv/"+id+"/credits?api_key="+apikey;
             },
             getTvInfo: function(id) {
                 return baseurl + "tv/"+id+"?api_key="+apikey;
             }
         }
      }
    });

})();

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

(function(){
   "use strict";

    angular.module('homeCtrl', []).controller('HomeController', ['$state',function($state){
      var vm = this;
      vm.title = "Home";
      vm.sections = [
           //{order:'0', title:'Special', controller:'SpecialController', type:'special'}
           {order:'3', title:'Actors/Actresses', controller:'CastController', state:'cast', type:'cast-tab'},
           {order:'1', title:'Movie', controller:'MovieController', state:'movies', type:'movie-tab' },
           {order:'2', title:'Tv Shows', controller:'TvController', state:'tv', type:'tv-tab' }
       ];

    }]);

})();

(function(){
   "use strict";

    angular.module('weMovies')
    .controller('MovieController', ['movieServices','movieData', '$filter', '$q', function(movieServices, movieData, $filter, $q){
      var vm = this;
      vm.title = "movies";

      // Select movie
      vm.resultsLimit = 8;
      vm.selected = undefined;
      vm.selectedMovie = undefined;
      vm.showSelected = false;
      vm.selectedCredit = undefined;
      vm.showSelectedCredit = false;
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

      vm.movieSearch = function(query) {
        if(query != undefined) {
          var cleanString = query;
          cleanString = cleanString.replace("&", "and");

          return movieServices.names(cleanString).then(function (results) {
            var moviedata = results.results;
            return (moviedata.length > vm.resultsLimit ? moviedata.slice(0, vm.resultsLimit) : moviedata);  ;
          }, function (error) {
            console.log("ERROR NO RESULTS");
          });
        }
        return;
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
          vm.showBio = false;
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
      vm.viewBio = function() {
        vm.showSelectedCredit = false;
        vm.showBio = !vm.showBio;
      }

      /*Control Compare List*/
      vm.addToCompare = function(movie) {
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

          function CastVisuals (castId) {
              var profile = null;
              var movieids = [];
              for(var i=0; i < vm.compared.length; i++) {
                if(vm.compared[i].movie3 == null){
                  var found = $filter('filter')(vm.compared[i].matchedCast, {id: castId});
                  if(found != undefined && found.length > 0) {
                    // Profile
                    if(profile == null)
                      profile = found[0].profile_path;
                    // Check Movie 1
                    if(movieids.indexOf(vm.compared[i].movie1.id) < 0)
                      movieids.push(vm.compared[i].movie1.id);
                    // Check Movie 2
                    if(movieids.indexOf(vm.compared[i].movie2.id) < 0)
                      movieids.push(vm.compared[i].movie2.id);
                  }
                }
              }
              return {profile_path:profile, movies: movieids};
          }

          for(var i=0; i < vm.compared.length; i++) {
            for(var j=0; j < vm.compared[i].matchedCast.length; j++) {
              if(idList.indexOf(vm.compared[i].matchedCast[j].id) < 0) {
                idList.push(vm.compared[i].matchedCast[j].id);
              }
            }
          }

          var colorArray = randomColor({ count: idList.length + 1, luminosity: 'bright', format: 'rgb'});
          for(var i=0; i < idList.length; i++) {
            vm.comparedVisuals.push({id: idList[i], color:colorArray[i], more_info:CastVisuals(idList[i])});
          }
      }

      vm.getIdColor = function(cid) {
        var color = "rgba(0,0,0,1)";
        var found = $filter('filter')(vm.comparedVisuals, {id: cid});
        if(found != undefined && found.length != 0)
          color = found[0].color;

        return color;
      }
      vm.highlightCast = function(cast) {
        vm.highlight = cast;
      }

    }]);

})();

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

(function(){
   "use strict";

   angular.module('weTv')
   .controller('TvController', ['tvServices','tvData', '$filter', '$q', function(tvServices, tvData, $filter, $q){
     var vm = this;
     vm.title = "tv";

     // Select TV Show
     vm.resultsLimit = 8;
     vm.selected = undefined;
     vm.selectedTv = undefined;
     vm.showSelected = false;
     vm.selectedCredit = undefined;
     vm.showSelectedCredit = false;
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

     vm.tvSearch = function(query) {
       if(query != undefined) {
         var cleanString = query;
         cleanString = cleanString.replace("&", "and");

         return tvServices.names(cleanString).then(function (results) {
           var tvdata = results.results;
           return (tvdata.length > vm.resultsLimit ? tvdata.slice(0, vm.resultsLimit) : tvdata);  ;
         }, function (error) {
           console.log("ERROR NO RESULTS");
         });
       }
       return;
     }

     vm.getTvInfo = function(tvid) {
       return tvServices.info(tvid).then(function (results) {
         return results;
       }, function (error) {
         console.log("ERROR NO MOVIE INFO");
       });
     }

     vm.getTvCredits = function(tvid) {
       return tvServices.credits(tvid).then(function (results) {
         return results;
       }, function (error) {
         console.log("ERROR NO MOVIE CREDITS");
       });
     }

     vm.viewTvInfo = function(item) {
       vm.showSelected = false;
       var tvid = item.id;
       if((vm.selectedTv == undefined) || (tvid != vm.selectedTv.id)) {
         vm.showSelectedCredit = false;
         vm.selectedCredit = undefined;
         vm.getTvInfo(tvid).then(function(retResults) {
           vm.showSelected = true;
           vm.selectedTv = retResults;
         });
       }
       else {
         vm.showSelected = true;
       }
     }
     vm.viewTvCredits = function(tvid) {
       if(vm.showSelectedCredit == false){
         vm.showBio = false;
         if(vm.selectedCredit == undefined) {
           vm.getTvCredits(tvid).then(function(retResults) {
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
     vm.viewBio = function() {
       vm.showSelectedCredit = false;
       vm.showBio = !vm.showBio;
     }

     /*Control Compare List*/
     vm.addToCompare = function(tvshow) {
       if(vm.ableToCompare(tvshow)){
         vm.selectedObjects.push(tvshow);
         vm.showSelected = false;
         vm.showSelectedCredit = false;
         vm.selectedTv = undefined;
         vm.selectedCredit = undefined;
         vm.selected = undefined;
         vm.showCompare = true;
       }
     }
     vm.removeCompareTv = function(tvshow) {
       var removeIndex = vm.selectedObjects.indexOf(tvshow);
       if(removeIndex >= 0)
         vm.selectedObjects.splice(removeIndex, 1);
     }

     vm.ableToCompare = function(tvshow) {
       if(vm.selectedObjects.length < 3 && tvshow != null )
       {
         var found = $filter('filter')(vm.selectedObjects, {id: tvshow.id});
         if(found == undefined || found.length == 0)
           return true;
       }
       return false;
     }

     vm.getTvIndex = function(tvshow) {
       var index = vm.selectedObjects.indexOf(tvshow);
       if(index >= 0)
         return index;
       else
         return 0;
     }
     vm.toggleSlider = function(tvshow) {
         var tvshowIndex = vm.getTvIndex(tvshow);
         vm.slider[tvshowIndex] = !vm.slider[tvshowIndex];
     }
     vm.getSliderStatus = function(tvshow) {
       var tvshowIndex = vm.getTvIndex(tvshow);
       return vm.slider[tvshowIndex];
     }

     /*Compare Movies*/
     vm.compareSelectedTv = function() {
       vm.getCompareCasts().then(function(){
         vm.compareTvCasts();
         console.log(vm.compared);
         // Get color code for all casts members
         vm.resultsVisuals();
         console.log(vm.comparedVisuals);
       });
     }

     /*Get movie cast for each compared movie*/
     vm.getCompareCasts = function() {
       var promises = [];

       function fullCastInfo(tInfo) {
         var def = $q.defer();
         if(tvData.comparedCasts.length < 1){
           return vm.getTvCredits(tInfo.id).then(function(data){
             tvData.comparedCasts.push({tvinfo: tInfo, cast: data });
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
     vm.compareTvCasts = function() {
       var castList = tvData.comparedCasts;
       var compareResults = [];
       // compare one to one
       if(castList.length > 1){
         for(var i=0; i < castList.length; i++) {
           for(var j=i+1; j < castList.length; j++) {
             tvData.comparedResults.push({tv1: castList[i].tvinfo, tv2:castList[j].tvinfo, matchedCast:vm.compareTvs(castList[i].cast, castList[j].cast, null) });
           }
         }
       }
       // compare all 3 items
       if(castList.length == 3){
         tvData.comparedResults.push({tv1: castList[0].tvinfo, tv2:castList[1].tvinfo, tv3:castList[2].tvinfo, matchedCast:vm.compareTvs(castList[0].cast, castList[1].cast, castList[2].cast) });
       }

       vm.compared = tvData.comparedResults;
       var def = $q.defer();
       def.resolve();
       return def.promise;
     }

     /*Compare movies and return cast in each movie*/
     vm.compareTvs = function(tA, tB, tC) {
       var tvA = (tA == null ? null : tA.cast);
       var tvB = (tB == null ? null : tB.cast);
       var tvC = (tC == null ? null : tC.cast);

       var comparedCasts = [];

       if (tvA == null || tvB == null)
         return;
       // Only compare 2
       if(tvC == null) {
         for(var i=0; i < tvA.length; i++) {
           for(var j=0; j < tvB.length; j++) {
             if(tvA[i].id == tvB[j].id){
               comparedCasts.push(tvA[i]);
             }
           }
         }
       }
       else {
         for(var i=0; i < tvA.length; i++) {
           for(var j=0; j < tvB.length; j++) {
             for(var k=0; k < tvC.length; k++) {
               if((tvA[i].id == tvB[j].id) && (tvB[j].id == tvC[k].id)) {
                 comparedCasts.push(tvA[i]);
               }
             }
           }
         }
       }
       return comparedCasts;
     }

     vm.clearResults = function() {
       tvData.comparedCasts = [];
       tvData.comparedResults = [];
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

         function CastVisuals (castId) {
             var profile = null;
             var tvshowids = [];
             for(var i=0; i < vm.compared.length; i++) {
               if(vm.compared[i].tv3 == null){
                 var found = $filter('filter')(vm.compared[i].matchedCast, {id: castId});
                 if(found != undefined && found.length > 0) {
                   // Profile
                   if(profile == null)
                     profile = found[0].profile_path;
                   // Check TV Show 1
                   if(tvshowids.indexOf(vm.compared[i].tv1.id) < 0)
                     tvshowids.push(vm.compared[i].tv1.id);
                   // Check TV Show 2
                   if(tvshowids.indexOf(vm.compared[i].tv2.id) < 0)
                     tvshowids.push(vm.compared[i].tv2.id);
                 }
               }
             }
             return {profile_path:profile, tvshow: tvshowids};
         }

         for(var i=0; i < vm.compared.length; i++) {
           for(var j=0; j < vm.compared[i].matchedCast.length; j++) {
             if(idList.indexOf(vm.compared[i].matchedCast[j].id) < 0) {
               idList.push(vm.compared[i].matchedCast[j].id);
             }
           }
         }

         var colorArray = randomColor({ count: idList.length + 1, luminosity: 'bright', format: 'rgb'});
         for(var i=0; i < idList.length; i++) {
           vm.comparedVisuals.push({id: idList[i], color:colorArray[i], more_info:CastVisuals(idList[i])});
         }
     }

     vm.getIdColor = function(cid) {
       var color = "rgba(0,0,0,1)";
       var found = $filter('filter')(vm.comparedVisuals, {id: cid});
       if(found != undefined && found.length != 0)
         color = found[0].color;

       return color;
     }
     vm.highlightCast = function(cast) {
       vm.highlight = cast;
     }

    }]);

})();

(function(){
   "use strict";

    angular.module('directives').directive('navHold', ['$window', function($window) {
      return {
        restrict: 'EA',
        link: function ($scope, element, attrs) {

          angular.element($window).bind("scroll", function() {

            var topSection = angular.element(document.getElementsByClassName("page"))[0];
            var windowp = angular.element($window)[0];          

            if(windowp.pageYOffset >= topSection.offsetTop ){
              if(!element.hasClass("screenPass"))
                element.addClass("screenPass");
            }
            else {
              if(element.hasClass("screenPass")){
                element.removeClass("screenPass");
              }
            }
          });
        }
      }

    }]);

})();

(function(){
   "use strict";

    angular.module('directives').directive('randomMotion', ['$timeout', function($timeout) {
      return {
        restrict: 'EA',
        link: function ($scope, element, attrs) {
          console.log("Start Motion");
          // Randomly Set Postion & Velocity
          var maxVelocity = 100;
          var posX = Math.min(0, Math.max(20, (Math.random() * 0)));
          var posY = Math.min(0, Math.max(20, (Math.random() * 10)));
          var velX = (Math.random() * maxVelocity);
          var velY = (Math.random() * maxVelocity);
          var timestamp = null;

          var parentContainer = element[0].offsetParent;

          // Move Object
          (function tick() {
            var now = new Date().getTime();
            var borderX = parentContainer.clientWidth *.10;
            var borderY = parentContainer.clientHeight *.10;

            var maxX = parentContainer.clientWidth - borderX;
            var maxY = parentContainer.clientHeight - borderY;

            var elapsed = (timestamp || now) - now;
            timestamp = now;
            posX += elapsed * velX / 1000;
            posY += elapsed * velY / 1000;

            if (posX > maxX) {
                posX = 2 * maxX - posX;
                velX *= -1;
            }
            if (posX < 10) {
                posX = 10;
                velX *= -1;
            }
            if (posY > maxY) {
                posY = 2 * maxY - posY;
                velY *= -1;
            }
            if (posY < 10) {
                posY = 10;
                velY *= -1;
            }
            element.css({ "top": posY, "left": posX });
            // Set Position to $element top and left
            // Loop to Move object
            $timeout(tick, 30);
          })();
        }
      }
    }]);

})();

(function(){
  'use strict';
  //angular.module('directives', []);

})();

(function(){
  "use strict";
  //angular.module('weMovies', ['ui.bootstrap']);

})();

(function(){
  'use strict';

  //angular.module('services', []);

})();

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

(function(){
   "use strict";

   angular.module('weMovies')
    .service('movieServices', ['$q', '$http','api', function MovieService($q, $http, api) {
      return {
        names: function($str){
          var def = $q.defer();
          $http({
            method: 'GET',
            url: api.movie.searchname($str)
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
            url: api.movie.getMovieCredits($mid)
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
            url: api.movie.getMovieInfo($mid)
          }).then(function successCallback(response) {
            def.resolve(response.data);
          }, function errorCallback(response) {
            def.reject(response);
          });
          return def.promise;
        },
        anyItem: function($str) {
          var def = $q.defer();
          $http({
            method: 'GET',
            url: api.any.all($str)
          }).then(function successCallback(response) {
            def.resolve(response.data);
          }, function errorCallback(response) {
            def.reject(response);
          });
          return def.promise;
        }
      }
    }])
   .factory("movieData", ['$q', function($q){
     function movieCompareData() {
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

     return new movieCompareData();
   }]);


})();

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
