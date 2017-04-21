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
      .state('app.movie_tv', {
        url: "Movie-Tv?id1&id2&id3",
        views: {
          'content@': {
            templateUrl: 'views/movie_tv.html',
            controller: 'MovieTvController as sc'
          }
        }
      })
      .state('app.cast', {
        url: "Cast?id1&id2&id3",
        views: {
          'content@': {
            templateUrl: 'views/cast.html',
            controller: 'CastController as sc'
          }
        }
      })
      .state('app.spotlight', {
        url: "Spotlight?id",
        views: {
          'content@': {
            templateUrl: 'views/spotlight.html',
            controller: 'SpotlightController as sc'
          }
        }
      })
      .state('app.admin', {
        url: "admin",
        views: {
          'content@': {
            templateUrl: 'views/admin.html',
            controller: 'AdminController as sc'
          }
        }
      })
      .state('app.construction', {
        url: "underconstruction",
        views: {
          'content@': {
            templateUrl: 'views/construction.html',
            controller: 'HomeController as sc'
          }
        }
      });



      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
    }]);


})();
