(function(){
   "use strict";

    angular.module('movieCtrl', []).controller('MovieController', ['movieServices','MovieData', function(movieServices, MovieData){
      var vm = this;
      vm.title = "Movie";
      
    }]);

})();
