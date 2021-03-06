(function () {
	"use strict";
		angular.module('dataconfig', []);
		angular.module('config', [ 'ngMaterial']);
		angular.module('services', []);
		angular.module('directives', []);
		angular.module('homeCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('movieTvCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('castCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('spotlightCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('adminCtrl', ['ui.bootstrap', 'ngAnimate']);
		/**/
    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'dataconfig', 'config', 'services', 'directives', 'homeCtrl', 'movieTvCtrl', 'castCtrl','spotlightCtrl', 'adminCtrl']);

})();
