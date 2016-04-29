(function () {
	"use strict";

    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'directives', 'config', 'services','homeCtrl', 'specialCtrl', 'castCtrl','tvCtrl', 'movieCtrl']);

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

    angular.module('movieCtrl', []).controller('MovieController', ['movieServices','MovieData', function(movieServices, MovieData){
      var vm = this;
      vm.title = "Movie";
      
    }]);

})();

(function(){
   "use strict";

    angular.module('specialCtrl', ['ui.bootstrap']).controller('SpecialController', [ 'movieServices','MovieData', function(movieServices, MovieData){
      var vm = this;
      vm.title = "Special";
      vm.tstmsg = "waiting";


      vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana'];
      vm.selected = undefined;

      vm.movieTest = function() {

        movieServices.names("Best Man").then(function (results) {
          vm.results = results;
          console.log("Finished Get");
          vm.tstmsg = "Got results"
        }, function (error) {
          vm.tstmsg = "ERROR: Nothing";
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
  angular.module('directives', []);

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

   angular.module('services', [])
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
   .factory("MovieData", ['$q', function($q){
     function movieCompareData() {
       var self = this;

       self.selectedMovies =[];
       self.selectedMoviesInfo = [];
       self.comparedMoviesInfo = [];

       self.addSeleectedMovie = function() {}
       self.compareMoviesList = function () {}
       self.compareTwoMovies = function(movieA, movieB) {}
       self.compareAllMovies = function() {}
     }

     return new movieCompareData();
   }]);


})();

(function(){
  'use strict';

  //angular.module('services', ['ngMaterial']);

})();
