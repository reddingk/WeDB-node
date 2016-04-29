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

    angular.module('movieCtrl', []).controller('MovieController', function($scope){
      var vm = this;
      vm.title = "Movie";

    });

})();

(function(){
   "use strict";

    angular.module('specialCtrl', ['ui.bootstrap']).controller('SpecialController', function($scope){
      var vm = this;
      vm.title = "Special";

      vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana'];
      vm.selected = undefined;

    });

})();

(function(){
   "use strict";

    angular.module('tvCtrl', []).controller('TvController', function($scope){
      var vm = this;
      vm.title = "Tv";

    });

})();
