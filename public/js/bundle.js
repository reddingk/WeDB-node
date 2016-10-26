(function () {
	"use strict";
		angular.module('dataconfig', []);
		angular.module('config', [ 'ngMaterial' ]);
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
      vm.homeImg = "imgs/siteart/Home6.jpg";

      vm.pageCards = [
        {"title": "movie", "icon":"fa-film", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"title": "tv", "icon":"fa-television", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"title": "cast", "icon":"fa-users", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      ];

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
