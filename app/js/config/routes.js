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
