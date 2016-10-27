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
        {"title": "movie", "icon":"fa-film", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"title": "tv", "icon":"fa-television", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"title": "cast", "icon":"fa-users", "img":"", "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      ];

      vm.latestBlog = {"img1":"http://www.impawards.com/2016/posters/tarzan_ver3_xlg.jpg", "img2":"http://questionablefilmreview.files.wordpress.com/2013/07/7736093674_2e8414a35c_o.jpg", "text":"Whose headed to purchase @legendoftarzan available on blu-Ray and DVD TODAY!!! We wanted to find a #wedbconnection and we found one with one of our all time favorite actors @samuelljackson and co-star #ChristophWaltz This will be third time the pair have joined eachother for a big screen production! First in 2009 when Sam narrated for the film #IngloriousBasterds starring #BradPitt then again when the both graced the screen in the unique #QuentinTarantino film #DjangoUnchained starring the multitalented @iamjamiefoxx to their most recent action film to hit theaters @legendoftarzan a definite must see starring another one of our favorite actresses @margotrobbie as Jane and #AlexanderSkarsgard as Tarzan! With his incredible range and amazingly diverse talents we can't wait to see what @samuelljackson will do next! #SamuelLJackson #ChristophWaltz #MargotRobbie #AlexanderSkarsgard #JamieFoxx #BradPitt #IngloriousBasterds #DjangoUnchained #LegendOfTarzan #wedbconnection"}

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;

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
      }

    }]);

})();
