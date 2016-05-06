(function () {
	"use strict";
		angular.module('weMovies', ['ui.bootstrap']);
		angular.module('directives', []);
		angular.module('services', []);

    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'directives', 'config', 'services','homeCtrl', 'specialCtrl', 'castCtrl','tvCtrl', 'weMovies']);

})();
