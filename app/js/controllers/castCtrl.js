(function(){
   "use strict";

    angular.module('castCtrl').controller('CastController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "cast";
      vm.homeImg = "imgs/siteart/Cast&Crew3.jpg";
      /*Movie Ctrl*/
      var id1 = $stateParams.id1;
      var id2 = $stateParams.id2;
      var id3 = $stateParams.id3;
      var intervalId = null;
      var scrollInterval = 15;
      var mobileCheck = new RegExp('Android|webOS|iPhone|iPad|' + 'BlackBerry|Windows Phone|'  + 'Opera Mini|IEMobile|Mobile' , 'i');
      
      
      vm.selectedCast = {"id":-1,"details":{}, "credits":{}, "suggestions":{}, "display":false, "infoview":"details"};
      vm.comparisonCast = [];
      vm.resultsCast = {};
      vm.resultsCast.visuals = {};
      vm.resultsCast.visuals.view = false;
      

      if(id1 != undefined && (id2 == undefined && id3 == undefined)){
        displayDetails(id1);
      }

      /*Set Now Playing*/
      vm.extraContent = {"cast":{}};

      weInfo.search.cast.popular(1, function(results){
        vm.extraContent.cast = results;
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
      vm.removeCast = removeCast;

      vm.scrollActivate = scrollActivate;
      vm.scrollDeactivate = scrollDeactivate;
      vm.clickActivate = clickActivate;

      function clickActivate(direction, container){
        var containerObj = $("#"+container);
        if(containerObj != null){
          //containerObj.scrollLeft = containerObj.scrollLeft + (100 * direction);
          containerObj.animate({ scrollLeft: containerObj[0].scrollLeft + (250 * direction)}, "slow");
        }
      }

      function scrollActivate(direction, container){
        var containerObj = document.getElementById(container);
        if(containerObj != null && !mobileCheck.test(navigator.userAgent)){
          clearInterval(intervalId);

          intervalId = setInterval(function() {
            containerObj.scrollLeft = containerObj.scrollLeft + (scrollInterval * direction);
          }, 25);
        }
      }

      function scrollDeactivate() {
        clearInterval(intervalId);
      }

      function getAge(dateString, deathString){
        var today = (deathString == undefined || deathString == "" ? new Date() : new Date(deathString));
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))  {
            age--;
        }
        return age;
      }

      function removeCast(id){
        var removePos = -1;
        for(var i=0; i < vm.comparisonCast.length; i++){
          if(id == vm.comparisonCast[i].id){
            removePos = i;
            break;
          }
        }
        if(removePos > -1) {vm.comparisonCast.splice(removePos,1);}
      }

      function clearCompare(){
        vm.comparisonCast = [];
        vm.resultsCast = {};
        vm.resultsCast.visuals = {};
        vm.resultsCast.visuals.view = false;
      }
      function toggleResultViews(id){
        var pos = -1;
        for(var i =0; i < vm.resultsCast.viewIds.length; i++){
          if(vm.resultsCast.viewIds[i] == id){
            pos = i;
          }
        }
        if((pos < 0) && (vm.resultsCast.viewIds.length < 3)) { vm.resultsCast.viewIds.push(id); }
        else if((pos >= 0) && (vm.resultsCast.viewIds.length > 1)){ vm.resultsCast.viewIds.splice(pos, 1); }
        else { alert("You must keep atleast one Cast or Crew member selected");}
        // Set Visuals
        setVisuals();
      }

      function isResultsViewed(id) {
        for(var i =0; i < vm.resultsCast.viewIds.length; i++){
          if(vm.resultsCast.viewIds[i] == id){
            return true;
          }
        }
        return false;
      }

      function setVisuals() {
        // Cast & Crew
        vm.resultsCast.visuals.movieATv = [];
        for(var i=0; i < vm.resultsCast.results.movieATv.length; i++) {
          if(displayResultsCheck(vm.resultsCast.results.movieATv[i].CCIDS)){  vm.resultsCast.visuals.movieATv.push(vm.resultsCast.results.movieATv[i]); }
        }
        var colorArrayCast = randomColor({ count: vm.resultsCast.visuals.movieATv.length + 1, luminosity: 'bright', format: 'rgb'});
        for(var i=0; i < vm.resultsCast.visuals.movieATv.length; i++) { vm.resultsCast.visuals.movieATv[i].color = colorArrayCast[i]; }

        vm.resultsCast.visuals.view = true;
      }

      function displayResultsCheck(ids){
        var inAll = true;
        for(var i =0; i < vm.resultsCast.viewIds.length; i++){
          var idActive = false;
          for(var j =0; j < ids.length; j++){
            if(ids[j] == vm.resultsCast.viewIds[i]){idActive = true;  break; }
          }
          if(idActive == false) { inAll = false;  break; }
        }
        return inAll;
      }

      function compareObjects() {
        weInfo.compare.cast(vm.comparisonCast, function(res){
          vm.resultsCast.results = res;
          // Set View Ids
          vm.resultsCast.viewIds = [];
          for(var i=0; i < res.castcrew.length; i++){
            vm.resultsCast.viewIds.push(res.castcrew[i].id);
          }
          // Set Visuals
          setVisuals();
        });
      }

      function addItem(item) {
        if(addCheck(item.id)) {
          var tmpCast = {};
          tmpCast.id = item.id;
          tmpCast.details = item.details;
          tmpCast.credits = item.credits;
          //tmpCast.suggestions = item.suggestions;

          vm.comparisonCast.push(tmpCast);
          clearDetails();

          // If Compare has already been run re run with new item
          if(vm.resultsCast.visuals.view){
            compareObjects();
          }
        }
      }
      function addCheck(id){
        if(vm.comparisonCast.length >= 3){ return false;}

        for(var i=0; i < vm.comparisonCast.length; i++){
          if(vm.comparisonCast[i].id == id) {  return false;  }
        }
        return true;
      }

      function getAdditionalSelectedInfo(type){
        if(Object.keys(vm.selectedCast[type]).length == 0) {
          if(type == 'credits') {
            weInfo.search.cast[type](vm.selectedCast.id, function(results){
              results.cast.sort(compare);
              results.crew.sort(compare);
              vm.selectedCast[type] = results;
              vm.selectedCast.infoview = type
            });
          }
        }
        else {
          vm.selectedCast.infoview = type
        }
      }

      function displayDetails(id){
        weInfo.search.cast.byId(id, function(results){
          vm.selectedCast.id = id;
          vm.selectedCast.details = results;
          vm.selectedCast.details.age = getAge(results.birthday, results.deathday);
          vm.selectedCast.credits = {};
          vm.selectedCast.infoview = 'details';
          vm.selectedCast.display = (results != null);

          weInfo.search.cast.taggedImages(id, function(results2){
            if(results2 != null && results2.results!= undefined && results2.results.length > 0){
              vm.selectedCast.images = "http://image.tmdb.org/t/p/w500"+ results2.results[0].media.backdrop_path;
            }
            else {
              vm.selectedCast.images = "";
            }
          });
        });
      }

      function clearDetails(){
        vm.selectedCast.display = false;
        vm.selectedCast.id = -1;
        vm.selectedCast.details = {};
        vm.selectedCast.credits = {};
        vm.selectedCast.infoview = 'details';
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
        displayDetails(item.id);
        clearSearch();
        toggleSearch("close");
      }

      function clearSearch() {
        if(vm.searchQuery == ""){
          toggleSearch("close");
        }
        vm.searchQuery = "";
        vm.allResults = [];
        vm.displayResults.display = [];
      }

      function search() {
        var query = vm.searchQuery;
        if(query.length > 1){
          weInfo.search.cast.byName(query, function(results){
            vm.allResults = results.results;
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

      function compare(a,b) {
        var aItem = (a.media_type == "movie" ? a.release_date : a.first_air_date);
        var bItem = (b.media_type == "movie" ? b.release_date : b.first_air_date);

        return new Date(bItem) - new Date(aItem);        
      }

    }]);

})();
