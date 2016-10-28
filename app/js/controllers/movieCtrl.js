(function(){
   "use strict";

    angular.module('movieCtrl').controller('MovieController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "movie";
      /*Header*/
      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.displayResults = { "max":10, "display":[]};
      vm.allResults = [];

      /*Movie Ctrl*/
      var id1 = $stateParams.id1;
      var id2 = $stateParams.id2;
      var id3 = $stateParams.id3;

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;

      function clearSearch() {
        vm.searchQuery = "";
        vm.allResults = [];
        vm.displayResults.display = [];
      }

      function search() {
        var query = vm.searchQuery;
        if(query.length > 1){
          weInfo.search.movies(query, function(results){
            vm.allResults = results;
            vm.displayResults.display = vm.allResults.results.slice(0, vm.displayResults.max);
          });
        }
      }

      function toggleSearch(control){
        if(control == "open") { vm.searchOpen = true; }
        else if(control == "close") { vm.searchOpen = false; }
        else if(control == "toggle") { vm.searchOpen = !vm.searchOpen; }
      }

    }]);

})();
