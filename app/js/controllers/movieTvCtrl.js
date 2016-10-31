(function(){
   "use strict";

    angular.module('movieTvCtrl').controller('MovieTvController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "movietv";
      /*Movie Ctrl*/
      var id1 = $stateParams.id1;
      var id2 = $stateParams.id2;
      var id3 = $stateParams.id3;

      vm.selectedMovieTv = {"id":-1,"details":{}, "credits":{}, "suggestions":{}, "display":false, "infoview":"details"};
      vm.comparisonMoviesTv = [];
      vm.resultsMovieTv = {};
      vm.resultsMovieTv.visuals = {};
      vm.resultsMovieTv.visuals.view = false;

      if(id1 != undefined && (id2 == undefined && id3 == undefined)){
        displayDetails(id1,"");
      }
      /*Functions*/
      vm.clearDetails = clearDetails;
      vm.displayDetails = displayDetails;
      vm.getAdditionalSelectedInfo = getAdditionalSelectedInfo;
      vm.addCheck = addCheck;
      vm.addItem = addItem;
      vm.compareObjects = compareObjects;
      vm.displayResultsCheck = displayResultsCheck;
      vm.isResultsViewed = isResultsViewed;
      vm.toggleResultViews = toggleResultViews;

      function toggleResultViews(id){
        var pos = -1;
        if(vm.resultsMovieTv.viewIds.length > 1){
          for(var i =0; i < vm.resultsMovieTv.viewIds.length; i++){
            if(vm.resultsMovieTv.viewIds[i] == id){
              pos = i;
            }
          }
          if(pos < 0) { vm.resultsMovieTv.viewIds.push(id); }
          else { vm.resultsMovieTv.viewIds.splice(pos, 1); }
          // Set Visuals
          setVisuals();
        }
      }

      function isResultsViewed(id) {
        for(var i =0; i < vm.resultsMovieTv.viewIds.length; i++){
          if(vm.resultsMovieTv.viewIds[i] == id){
            return true;
          }
        }
        return false;
      }

      function setVisuals() {
        // Cast
        vm.resultsMovieTv.visuals.cast = [];
        for(var i=0; i < vm.resultsMovieTv.results.cast.length; i++) {
          if(displayResultsCheck(vm.resultsMovieTv.results.cast[i].MTIDS)){  vm.resultsMovieTv.visuals.cast.push(vm.resultsMovieTv.results.cast[i]);    }
        }
        var colorArrayCast = randomColor({ count: vm.resultsMovieTv.visuals.cast.length + 1, luminosity: 'bright', format: 'rgb'});
        for(var i=0; i < vm.resultsMovieTv.visuals.cast.length; i++) { vm.resultsMovieTv.visuals.cast[i].color = colorArrayCast[i]; }

        // Crew
        vm.resultsMovieTv.visuals.crew = [];
        for(var i=0; i < vm.resultsMovieTv.results.crew.length; i++) {
          if(displayResultsCheck(vm.resultsMovieTv.results.crew[i].MTIDS)) {  vm.resultsMovieTv.visuals.crew.push(vm.resultsMovieTv.results.crew[i]); }
        }
        var colorArrayCrew = randomColor({ count: vm.resultsMovieTv.visuals.crew.length + 1, luminosity: 'bright', format: 'rgb'});
        for(var i=0; i < vm.resultsMovieTv.visuals.crew.length; i++) { vm.resultsMovieTv.visuals.crew[i].color = colorArrayCrew[i]; }
        vm.resultsMovieTv.visuals.view = true;
      }

      function displayResultsCheck(ids){
        var inAll = true;
        for(var i =0; i < vm.resultsMovieTv.viewIds.length; i++){
          var idActive = false;
          for(var j =0; j < ids.length; j++){
            if(ids[j] == vm.resultsMovieTv.viewIds[i]){idActive = true;  break; }
          }
          if(idActive == false) { inAll = false;  break; }
        }
        return inAll;
      }

      function compareObjects() {
        weInfo.compare.movieTv(vm.comparisonMoviesTv, function(res){
          vm.resultsMovieTv.results = res;
          // Set View Ids
          vm.resultsMovieTv.viewIds = [];
          for(var i=0; i < res.moviestv.length; i++){
            vm.resultsMovieTv.viewIds.push(res.moviestv[i].id);
          }
          // Set Visuals
          setVisuals();
        });
      }

      function addItem(item) {
        if(addCheck(item.id)) {
          var tmpMovieTv = {};
          tmpMovieTv.id = item.id;
          tmpMovieTv.details = item.details;
          tmpMovieTv.credits = item.credits;
          tmpMovieTv.suggestions = item.suggestions;

          vm.comparisonMoviesTv.push(tmpMovieTv);
          clearDetails();
        }
      }
      function addCheck(id){
        if(vm.comparisonMoviesTv.length >= 3){ return false;}

        for(var i=0; i < vm.comparisonMoviesTv.length; i++){
          if(vm.comparisonMoviesTv[i].id == id) {  return false;  }
        }

        return true;
      }

      function getAdditionalSelectedInfo(type, media_type){
        if(Object.keys(vm.selectedMovieTv[type]).length == 0) {
          if(type == 'credits' || type == 'suggestions') {
            if(media_type == 'movie'){
              //weInfo.search.movies.credits(vm.selectedMovieTv.id, function(results){
              weInfo.search.movies[type](vm.selectedMovieTv.id, function(results){
                vm.selectedMovieTv[type] = results;
                vm.selectedMovieTv.infoview = type
              });
            }
            else if(media_type == 'tv'){
              //weInfo.search.tv.credits(vm.selectedMovieTv.id, function(results){
              weInfo.search.tv[type](vm.selectedMovieTv.id, function(results){
                vm.selectedMovieTv[type] = results;
                vm.selectedMovieTv.infoview = type
              });
            }
          }
        }
        else {
          vm.selectedMovieTv.infoview = type
        }

      }

      function displayDetails(id, type){
        if(type == "movie"){
          weInfo.search.movies.byId(id, function(results){
            vm.selectedMovieTv.id = id;
            vm.selectedMovieTv.details = results;
            vm.selectedMovieTv.details.type = type;
            vm.selectedMovieTv.credits = {};
            vm.selectedMovieTv.suggestions = {};
            vm.selectedMovieTv.infoview = 'details';
            vm.selectedMovieTv.display = (results != null);
          });
        }
        else if(type == "tv"){
          weInfo.search.tv.byId(id, function(results){
            vm.selectedMovieTv.id = id;
            vm.selectedMovieTv.details = results;
            vm.selectedMovieTv.details.type = type;
            vm.selectedMovieTv.credits = {};
            vm.selectedMovieTv.suggestions = {};
            vm.selectedMovieTv.infoview = 'details';
            vm.selectedMovieTv.display = (results != null);
          });
        }
      }

      function clearDetails(){
        vm.selectedMovieTv.display = false;
        vm.selectedMovieTv.id = -1;
        vm.selectedMovieTv.details = {};
        vm.selectedMovieTv.credits = {};
        vm.selectedMovieTv.suggestions = {};
        vm.selectedMovieTv.infoview = 'details';
      }

      /*Header*/
      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.searchIcon = "fa-search-plus";
      vm.displayResults = { "max":15, "display":[]};
      vm.allResults = [];

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        displayDetails(item.id, item.media_type);
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
          /*weInfo.search.movies.byName(query, function(results){
            vm.allResults = results;
            vm.displayResults.display = vm.allResults.results.slice(0, vm.displayResults.max);
          });*/
          weInfo.search.movies_Tv.byName(query, function(results){
            vm.allResults = results;
            vm.displayResults.display = vm.allResults.slice(0, vm.displayResults.max);
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
