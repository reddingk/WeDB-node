(function(){
   "use strict";

    angular.module('adminCtrl').controller('AdminController', ['$state','weInfo','$sce', function($state, weInfo, $sce){
      var vm = this;
      vm.title = "Home";

      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.displayResults = { "max":10, "display":[]};
      vm.allResults = [];

      vm.dataDisplay= {};

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        vm.dataDisplay = item;
        clearSearch();
        toggleSearch("close");
      }

      function clearSearch() {
        vm.searchQuery = "";
        vm.allResults = [];
        vm.displayResults.display = [];
      }

      function search() {
        var query = vm.searchQuery;
        if(query.length > 1){
          weInfo.search.all(query, function(results){
            vm.allResults = results;
            vm.displayResults.display = vm.allResults.results.slice(0, vm.displayResults.max);
          });
        }
      }

      function toggleSearch(control){
        if(control == "open")
        {
          vm.searchOpen = true;
        }
        else if(control == "close")
        {
          vm.searchOpen = false;
        }
        else if(control == "toggle")
        {
          vm.searchOpen = !vm.searchOpen;
        }

        if(vm.searchOpen) {
          var navMain = $("#weNavbar");
          navMain.collapse('hide');
        }        
      }

    }]);

})();
