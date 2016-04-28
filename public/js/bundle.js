(function () {
	"use strict";

    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'directives', 'config', 'homeCtrl', 'specialCtrl', 'castCtrl','tvCtrl', 'movieCtrl']);

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
        controller: 'SpecialController'
      })
      .state('movies', {
        url: "/movies",
        templateUrl: 'views/movies.html',
        controller: 'MovieController'
      })
      .state('tv', {
        url: "/tv-shows",
        templateUrl: 'views/tv.html',
        controller: 'TvController'
      })
      .state('cast', {
        url: "/cast",
        templateUrl: 'views/cast.html',
        controller: 'CastController'
      });

      $urlRouterProvider.otherwise('/');
    }]);


});

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

    angular.module('castCtrl', []).controller('CastController', function($scope){
      $scope.title = "Cast";

    });

})();

(function(){
   "use strict";

    angular.module('homeCtrl', []).controller('HomeController', function($scope){
      $scope.title = "Home";
      self.sections = [
           //{order:'0', title:'Special', controller:'SpecialController', type:'special'}
           {order:'3', title:'Cast', controller:'CastController', type:'cast' },
           {order:'1', title:'Movie', controller:'MovieController', type:'movie' },
           {order:'2', title:'Tv', controller:'TvController', type:'tv' }
       ];
    });

})();

(function(){
   "use strict";

    angular.module('movieCtrl', []).controller('MovieController', function($scope){
      $scope.title = "Movie";

    });

})();

(function(){
   "use strict";

    angular.module('specialCtrl', []).controller('SpecialController', function($scope){
      $scope.title = "Special";

    });

})();

(function(){
   "use strict";

    angular.module('tvCtrl', []).controller('TvController', function($scope){
      $scope.title = "Tv";

    });

})();
