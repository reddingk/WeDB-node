(function(){
   "use strict";

    angular.module('specialCtrl', ['ui.bootstrap']).controller('SpecialController', [ 'movieServices','MovieData', function(movieServices, MovieData){
      var vm = this;
      vm.title = "Special";
      vm.tstmsg = "waiting";


      vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana'];
      vm.selected = undefined;

      vm.movieTest = function() {

        movieServices.names("Best Man").then(function (results) {
          vm.results = results;
          console.log("Finished Get");
          vm.tstmsg = "Got results"
        }, function (error) {
          vm.tstmsg = "ERROR: Nothing";
        });
      }

    }]);

})();
