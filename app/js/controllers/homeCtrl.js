(function(){
   "use strict";

    angular.module('homeCtrl').controller('HomeController', ['$state','weInfo','$sce', function($state, weInfo, $sce){
      var vm = this;
      vm.title = "Home";

      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.displayResults = { "max":10, "display":[]};
      vm.allResults = [];

      vm.homeImg = "imgs/siteart/Home6.jpg";
      vm.pageCards = [
        {"title": "movie & tv", "class":"movie_tv", "icon":"fa-film", "img":"", "loc":"app.movie_tv","text":"Get details on Movie's and Television shows both new and old as well as find out which cast & crew have worked on which shows."},
        {"title": "cast & crew", "class":"cast", "icon":"fa-users", "img":"", "loc":"app.cast", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"title": "spotlight", "class":"spotlight", "icon":"fa-lightbulb-o", "img":"", "loc":"app.construction", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
      ];

      vm.latestBlog = weInfo.blogs.latest();

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        if(vm.title == 'movie' || vm.title == 'tv' || vm.title == 'person')
        {
          // Add
        }
        else {
          if(type == 'movie' || type == 'tv')
          {$state.go('app.movie_tv',{id1: item.id +"-"+item.media_type});}
          else if(type == 'cast')
          {$state.go('app.cast',{id1: item.id});}
        }
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
        { vm.searchOpen = true; }
        else if(control == "close")
        { vm.searchOpen = false; }
        else if(control == "toggle")
        { vm.searchOpen = !vm.searchOpen; }

        if(vm.searchOpen) {
          var navMain = $("#weNavbar");
          navMain.collapse('hide');
        }
      }

    }]);

})();
