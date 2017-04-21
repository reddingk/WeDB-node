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

      vm.homeImg = "imgs/siteart/main1.jpg";
      vm.homeSVG = "views/templates/_logoAnimation.html";

      vm.pageCards = [
        {"title": "movie & tv", "class":"movie_tv", "icon":"fa-film", "img":"imgs/siteart/Home7.jpg", "loc":"app.movie_tv","text":"Get details on Movie's and Television shows both new and old.  Also use our comparison machine to find out which cast & crew members have appeared on programs together."},
        {"title": "cast & crew", "class":"cast", "icon":"fa-users", "img":"imgs/siteart/Cast&Crew3.jpg", "loc":"app.cast", "text":"Get information on cast & crew member's content credits.  As well as get the programs that cast & crew have worked on together using our comparision machine."},
        {"title": "spotlight", "class":"spotlight", "icon":"fa-lightbulb-o", "img":"imgs/siteart/Spotlight1.jpg", "loc":"app.spotlight", "text":"Put a spotlight on a movie or tv show by finding out the connections between the cast of your spotlight."}
      ];

      vm.latestBlog = weInfo.blogs.latest();
      // Get Blog info
      vm.blogs = {"all": weInfo.blogs.all(), "displayID":0, "displayObj":{}, "displayFlg":false};

      if(vm.blogs.all.length > 0){
        weInfo.blogs.displayData(vm.blogs.all[vm.blogs.displayID].displayIds, function(res){
            vm.blogs.all[vm.blogs.displayID].displayData = res;
            var object = vm.blogs.all[vm.blogs.displayID].displayData[0];
            vm.blogs.displayObj.type = object.info.media_type;
            vm.blogs.displayObj.id = object.info.id;
            vm.blogs.displayObj.img = (object.info.media_type == 'movie' || object.info.media_type == 'tv'? object.info.poster_path : object.info.profile_path);
        });
      }

      /**/
      vm.changeBlogImg = changeBlogImg;
      vm.isBlogImgSelected = isBlogImgSelected;
      vm.selectBlogImg = selectBlogImg;

      function selectBlogImg(obj){
        if(obj.type == 'movie' || obj.type == 'tv')
        {$state.go('app.movie_tv',{id1: obj.id +"-"+obj.type});}
        else if(obj.type == 'person')
        {$state.go('app.cast',{id1: obj.id});}
      }

      function isBlogImgSelected(info){
        return (vm.blogs.displayObj.id == info.id);
      }

      function changeBlogImg(info){
        vm.blogs.displayObj.type = info.media_type;
        vm.blogs.displayObj.id = info.id;
        if(info.media_type == 'person'){
          vm.blogs.displayObj.img = info.profile_path;
        }
        else {
          vm.blogs.displayObj.img = info.poster_path;
        }
      }

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        if(type == 'movie' || type == 'tv')
        {$state.go('app.movie_tv',{id1: item.id +"-"+item.media_type});}
        else if(type == 'cast')
        {$state.go('app.cast',{id1: item.id});}
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
