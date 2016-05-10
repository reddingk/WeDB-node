(function () {
	"use strict";
		angular.module('weMovies', ['ui.bootstrap']);
		angular.module('weSpecial', ['ui.bootstrap']);
		angular.module('weCast', ['ui.bootstrap']);
		angular.module('weTv', ['ui.bootstrap']);
		angular.module('directives', []);
		angular.module('services', []);

    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'directives', 'config', 'homeCtrl', 'weSpecial', 'weCast','weTv', 'weMovies'])
		.run(function($rootScope){
	    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
	        //change body background
	        //document.body.style.background = 'red';
	    });
	    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
	        //reset body background
					if (angular.isDefined(toState.data.bodyClass)) {
						document.body.style.backgroundPosition = "center bottom";
						document.body.style.backgroundRepeat = "no-repeat";
						document.body.style.backgroundSize = "100%";

						switch(toState.data.bodyClass) {
							case "movieBody":
								document.body.style.backgroundImage = "url('img/movie_back.png')";
								break;
							case "specialBody":
								document.body.style.backgroundImage = "url('img/special_back.png')";
								break;
							case "tvBody":
								document.body.style.backgroundImage = "url('img/tv_back.png')";
								break;
							case "castBody":
								document.body.style.backgroundImage = "url('img/cast_back.png')";
								break;
							default:
								document.body.style.background = 'white';
						}
					}
					else {
						document.body.style.background = 'white';
					}

	    });
		});

})();
