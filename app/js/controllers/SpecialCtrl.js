(function(){
   "use strict";

    //angular.module('specialCtrl', ['ui.bootstrap'])
    angular.module('weSpecial')
    .controller('SpecialController', [ 'movieServices','movieData', function(movieServices, movieData){
      var vm = this;
      vm.title = "Special";
      vm.resultsLimit = 8;
      vm.selected = undefined;

    }]);

})();
