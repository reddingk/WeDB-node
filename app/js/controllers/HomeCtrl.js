(function(){
   "use strict";

    angular.module('homeCtrl', []).controller('HomeController', function($scope){
      $scope.title = "Home";
      self.sections = [
           //{order:'0', title:'Special', controller:'SpecialController', type:'special'}
           {order:'3', title:'Cast', controller:'CastController', type:'cast' },
           {order:'1', title:'Movie', controller:'MovieController', type:'movie' },
           {order:'2', title:'Tv', controller:'TvController', type:'tv' }
       ];
    });

})();
