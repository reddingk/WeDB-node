(function(){
   "use strict";

    angular.module('specialCtrl', ['ui.bootstrap']).controller('SpecialController', function($scope){
      var vm = this;
      vm.title = "Special";

      vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana'];
      vm.selected = undefined;

    });

})();
