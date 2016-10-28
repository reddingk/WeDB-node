(function(){
   "use strict";

    angular.module('movieCtrl').controller('MovieController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "movie";
      /*Movie Ctrl*/
      var id1 = $stateParams.id1;
      var id2 = $stateParams.id2;
      var id3 = $stateParams.id3;

      vm.selectedMovie = {"id":-1,"details":{}, "credits":{}, "suggestions":{}, "display":false, "infoview":"details"};
      vm.comparisonMovies = [];

      if(id1 != undefined && (id2 == undefined && id3 == undefined)){
        displayDetails(id1);
      }
      /*Functions*/
      vm.clearDetails = clearDetails;
      vm.displayDetails = displayDetails;
      vm.getAdditionalSelectedInfo = getAdditionalSelectedInfo;
      vm.addItem = addItem;

      function addItem(item) {
        // DO ID check to see if it is already added
        vm.comparisonMovies.push(item);
        clearDetails();
      }

      function getAdditionalSelectedInfo(type){
        if(Object.keys(vm.selectedMovie[type]).length == 0) {
          if(type == 'credits') {
            weInfo.search.movies.credits(vm.selectedMovie.id, function(results){
              vm.selectedMovie.credits = results;
              vm.selectedMovie.infoview = type
            });
          }
          else if(type == 'suggestions') {
            weInfo.search.movies.suggestions(vm.selectedMovie.id, function(results){
              vm.selectedMovie.suggestions = results;
              vm.selectedMovie.infoview = type
            });
          }
        }
        else {
          vm.selectedMovie.infoview = type
        }

      }

      function displayDetails(id){
        weInfo.search.movies.byId(id, function(results){
          vm.selectedMovie.id = id;
          vm.selectedMovie.details = results;
          vm.selectedMovie.credits = {};
          vm.selectedMovie.suggestions = {};
          vm.selectedMovie.infoview = 'details';
          vm.selectedMovie.display = (results != null);
        });
      }
      function clearDetails(){
        vm.selectedMovie.id = -1;
        vm.selectedMovie.details = {};
        vm.selectedMovie.credits = {};
        vm.selectedMovie.suggestions = {};
        vm.selectedMovie.infoview = 'details';
        vm.selectedMovie.display = false;

      }

      /*Header*/
      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.searchIcon = "fa-search-plus";
      vm.displayResults = { "max":10, "display":[]};
      vm.allResults = [];

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        displayDetails(item.id);
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
          weInfo.search.movies.byName(query, function(results){
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
