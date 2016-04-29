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
