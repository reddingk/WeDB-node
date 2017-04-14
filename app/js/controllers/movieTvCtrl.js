(function(){
   "use strict";

    angular.module('movieTvCtrl').controller('MovieTvController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "movietv";
      vm.homeImg = "imgs/siteart/Home7.jpg";
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
        var id1List = id1.split('-');
        displayDetails(id1List[0],id1List[1]);
      }
      /*else if(id1 != undefined && (id2 != undefined || id3 != undefined)){
        var id1List = id1.split('-');
        var id2List = (id2 != undefined ? id2.split('-') : []);
        var id3List = (id3 != undefined ? id3.split('-') : []);

        if(id2List.length  == 2){ }
        if(id3List.length  == 2){ }
      }*/
      /*Set Now Playing*/
      vm.extraContent = {"movies":{}, "tv":{}};

      weInfo.search.movies.nowPlaying(1, function(results){
        vm.extraContent.movies = results;
      });
      weInfo.search.tv.onAir(1, function(results){
        vm.extraContent.tv = results;
      });

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
      vm.clearCompare = clearCompare;
      vm.removeMovieTv = removeMovieTv;


      function removeMovieTv(id){
        var removePos = -1;
        for(var i=0; i < vm.comparisonMoviesTv.length; i++){
          if(id == vm.comparisonMoviesTv[i].id){
            removePos = i;
            break;
          }
        }
        if(removePos > -1) {vm.comparisonMoviesTv.splice(removePos,1);}
      }

      function clearCompare(){
        vm.comparisonMoviesTv = [];
        vm.resultsMovieTv = {};
        vm.resultsMovieTv.visuals = {};
        vm.resultsMovieTv.visuals.view = false;
      }
      function toggleResultViews(id){
        var pos = -1;
        for(var i =0; i < vm.resultsMovieTv.viewIds.length; i++){
          if(vm.resultsMovieTv.viewIds[i] == id){
            pos = i;
          }
        }
        if((pos < 0) && (vm.resultsMovieTv.viewIds.length < 3)) { vm.resultsMovieTv.viewIds.push(id); }
        else if((pos >= 0) && (vm.resultsMovieTv.viewIds.length > 1)){ vm.resultsMovieTv.viewIds.splice(pos, 1); }
        else { alert("You must keep atleast one Movie or Tv show selected");}
        // Set Visuals
        setVisuals();
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
        // Cast & Crew
        vm.resultsMovieTv.visuals.castACrew = [];
        for(var i=0; i < vm.resultsMovieTv.results.castACrew.length; i++) {
          if(displayResultsCheck(vm.resultsMovieTv.results.castACrew[i].MTIDS)){  vm.resultsMovieTv.visuals.castACrew.push(vm.resultsMovieTv.results.castACrew[i]);    }
        }
        var colorArrayCast = randomColor({ count: vm.resultsMovieTv.visuals.castACrew.length + 1, luminosity: 'bright', format: 'rgb'});
        for(var i=0; i < vm.resultsMovieTv.visuals.castACrew.length; i++) { vm.resultsMovieTv.visuals.castACrew[i].color = colorArrayCast[i]; }

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

          // If Compare has already been run re run with new item
          if(vm.resultsMovieTv.visuals.view){
            compareObjects();
          }
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
              weInfo.search.movies[type](vm.selectedMovieTv.id, function(results){
                vm.selectedMovieTv[type] = results;
                vm.selectedMovieTv.infoview = type
              });
            }
            else if(media_type == 'tv'){
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

            if(vm.selectedMovieTv.details != null && vm.selectedMovieTv.details.backdrop_path != null){
              vm.selectedMovieTv.images = "http://image.tmdb.org/t/p/w500"+vm.selectedMovieTv.details.backdrop_path;
            }
            else {
              vm.selectedMovieTv.images = "http://image.tmdb.org/t/p/w500"+vm.homeImg;
            }
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
            weInfo.search.tv.images(id, function(results){
              if(results != null && results.backdrops.length > 0){
                vm.selectedMovieTv.images = "http://image.tmdb.org/t/p/w500"+results.backdrops[0].file_path;
              }
              else {
                vm.selectedMovieTv.images = "http://image.tmdb.org/t/p/w500"+vm.homeImg;
              }
            });
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

        if(vm.searchOpen) {
          var navMain = $("#weNavbar");
          navMain.collapse('hide');
        }
      }

    }]);

})();
