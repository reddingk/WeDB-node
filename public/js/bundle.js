(function () {
	"use strict";
		angular.module('weMovies', ['ui.bootstrap']);
		angular.module('directives', []);
		angular.module('services', []);

    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'directives', 'config', 'services','homeCtrl', 'specialCtrl', 'castCtrl','tvCtrl', 'weMovies']);

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
        controller: 'SpecialController as sc'
      })
      .state('movies', {
        url: "/movies",
        templateUrl: 'views/movies.html',
        controller: 'MovieController as mc'
      })
      .state('tv', {
        url: "/tv-shows",
        templateUrl: 'views/tv.html',
        controller: 'TvController as tc'
      })
      .state('cast', {
        url: "/cast",
        templateUrl: 'views/cast.html',
        controller: 'CastController as cc'
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
         cast : {
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
         tv : {
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

    angular.module('castCtrl', []).controller('CastController', function($scope){
      var vm = this;
      vm.title = "Cast";

    });

})();

(function(){
   "use strict";

    angular.module('homeCtrl', []).controller('HomeController', function($scope){
      var vm = this;
      vm.title = "Home";
      vm.sections = [
           //{order:'0', title:'Special', controller:'SpecialController', type:'special'}
           {order:'3', title:'Actors/Actresses', controller:'CastController', state:'cast', type:'cast-tab'},
           {order:'1', title:'Movie', controller:'MovieController', state:'movies', type:'movie-tab' },
           {order:'2', title:'Tv Shows', controller:'TvController', state:'tv', type:'tv-tab' }
       ];
    });

})();

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
        });

      }

      /*Get movie cast for each compared movie*/
      vm.getCompareCasts = function() {
        console.log("STEP1");

        function fullCastInfo(mInfo) {
          if(movieData.comparedCasts.length < 1){
            return vm.getMovieCredits(mInfo.id).then(function(data){
              movieData.comparedCasts.push({movieinfo: mInfo, cast: data });
            });
          }
          else { return; }
        }

        function returnList() {
          for(var i =0; i < vm.selectedObjects.length; i++) {
            fullCastInfo(vm.selectedObjects[i]);
          }
        }
        var def = $q.defer();
        def.resolve(returnList());
        console.log("STEP1-END");
        return def.promise;
      }

      /*Compare casts for each movie and return all cast members that appear in movies together*/
      vm.compareMovieCasts = function() {
        console.log("STEP2");
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
        console.log("STEP2-END");
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

    }]);

})();

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

(function(){
   "use strict";

    angular.module('tvCtrl', []).controller('TvController', function($scope){
      var vm = this;
      vm.title = "Tv";

    });

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

   //angular.module('services', [])
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

       vm.addSelectedMovie = function() {}
       vm.compareMoviesList = function () {}
       vm.compareTwoMovies = function(movieA, movieB) {}
       vm.compareAllMovies = function() {}

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
