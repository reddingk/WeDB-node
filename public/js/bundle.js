(function () {
	"use strict";
		angular.module('dataconfig', []);
		angular.module('config', [ 'ngMaterial']);
		angular.module('directives', []);
		angular.module('homeCtrl', ['ui.bootstrap', 'ngAnimate']);
		/**/
    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'dataconfig', 'config', 'directives', 'homeCtrl']);

})();

(function(){
   "use strict";

    angular.module('homeCtrl').controller('HomeController', ['$state','weInfo','$sce', function($state, weInfo, $sce){
      var vm = this;
      vm.title = "Home";

      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;

      vm.homeImg = "imgs/siteart/Home6.jpg";
      vm.pageCards = [
        {"title": "movie", "icon":"fa-film", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"title": "tv", "icon":"fa-television", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"title": "cast", "icon":"fa-users", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      ];

      vm.latestBlog = {"img1":"http://www.impawards.com/2016/posters/tarzan_ver3_xlg.jpg", "img2":"http://questionablefilmreview.files.wordpress.com/2013/07/7736093674_2e8414a35c_o.jpg", "text":"Whose headed to purchase @legendoftarzan available on blu-Ray and DVD TODAY!!! We wanted to find a #wedbconnection and we found one with one of our all time favorite actors @samuelljackson and co-star #ChristophWaltz This will be third time the pair have joined eachother for a big screen production! First in 2009 when Sam narrated for the film #IngloriousBasterds starring #BradPitt then again when the both graced the screen in the unique #QuentinTarantino film #DjangoUnchained starring the multitalented @iamjamiefoxx to their most recent action film to hit theaters @legendoftarzan a definite must see starring another one of our favorite actresses @margotrobbie as Jane and #AlexanderSkarsgard as Tarzan! With his incredible range and amazingly diverse talents we can't wait to see what @samuelljackson will do next! #SamuelLJackson #ChristophWaltz #MargotRobbie #AlexanderSkarsgard #JamieFoxx #BradPitt #IngloriousBasterds #DjangoUnchained #LegendOfTarzan #wedbconnection"}

      /*Functions*/
      vm.toggleSearch = toggleSearch;

      function toggleSearch(control){
        if(control == "open")
        { vm.searchOpen = true; }
        else if(control == "close")
        { vm.searchOpen = false; }
        else if(control == "toggle")
        { vm.searchOpen = !vm.searchOpen; }
      }

    }]);

})();

(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('weInfo', [ 'WEData', '$filter', function MCEInfo(WEData, $filter){
      var demo = WEData.siteData.demo;


      return {
        demo: {
          all: function(){
            return demo;
          }
        }
      }
    }])
    .factory("WEData", ['$q', '$http', function($q, $http){
     function WeInfoData() {
       var vm = this;
       vm.siteData = {};
     }

     return new WeInfoData();
    }]);

})();

(function(){

  angular
    .module('config')
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
      .state('app', {
        url: "/",
        views: {
          'content':{
            templateUrl: 'views/home.html',
            controller: 'HomeController as sc'
          },
          'footer':{
            templateUrl: 'views/templates/_footer.html'
          }
        }
      })
      .state('app.construction', {
        url: "underconstruction",
        views: {
          'content@': {
            templateUrl: 'views/construction.html'
          }
        }
      })



      $urlRouterProvider.otherwise('/');
      //$locationProvider.html5Mode(true);
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

    angular.module('directives').directive('backImg', ['$window', function($window) {
      return {
        restrict: 'EA',
        link: function ($scope, element, attrs) {
          var url = attrs.backImg;
          element.css({'background-image': 'url(' + url +')'});
        }
      }

    }]);

})();
