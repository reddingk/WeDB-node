(function () {
	"use strict";
		angular.module('dataconfig', []);
		angular.module('config', [ 'ngMaterial']);
		angular.module('services', []);
		angular.module('directives', []);
		angular.module('homeCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('movieTvCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('castCtrl', ['ui.bootstrap', 'ngAnimate']);
		/**/
    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'dataconfig', 'config', 'services', 'directives', 'homeCtrl', 'movieTvCtrl', 'castCtrl']);

})();

(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('weInfo', [ 'WEData', '$filter','movieServices', 'tvServices','castServices', function MCEInfo(WEData, $filter, movieServices, tvServices,castServices){
      var blogs = WEData.siteData.blogs;
      /*Needed Function */
      function getAllMovieTvCredits(item, list, callback){
        var objectMT = list[item];
        if(Object.keys(objectMT.credits).length == 0){
          if(objectMT.details.type == 'movie'){
            movieServices.credits(objectMT.id, function(res) {
              list[item].credits = res;
              if((item-1) < 0) {
                callback(list);
              }
              else {
                getAllMovieTvCredits(item-1, list, callback);
              }
            });
          }
          else if(objectMT.details.type == 'tv'){
            tvServices.credits(objectMT.id, function(res) {
              list[item].credits = res;
              if((item-1) < 0) { callback(list); }
              else { getAllMovieTvCredits(item-1, list, callback);}
            });
          }
        }
        else {
          if((item-1) < 0) { callback(list); }
          else { getAllMovieTvCredits(item-1, list, callback);}
        }
      }

      function getAllCastCrewCredits(item, list, callback){
        var objectCC = list[item];
        if(Object.keys(objectCC.credits).length == 0){
          castServices.credits(objectCC.id, function(res) {
            list[item].credits = res;
            if((item-1) < 0) {
              callback(list);
            }
            else {
              getAllCastCrewCredits(item-1, list, callback);
            }
          });
        }
        else {
          if((item-1) < 0) { callback(list); }
          else { getAllCastCrewCredits(item-1, list, callback);}
        }
      }

      return {
        blogs: {
          all: function(){
            return blogs;
          },
          latest: function() {
            return blogs[blogs.length -1];
          }
        },
        search: {
          all: function(query, callback) {
            movieServices.anyItem(query, function(res) { callback(res); } );
          },
          movies:  {
            byName: function(query, callback) {
              movieServices.names(query, function(res) { callback(res); } );
            },
            byId: function(id, callback){
              movieServices.info(id, function(res) { callback(res); } );
            },
            credits: function(id, callback){
              movieServices.credits(id, function(res) { callback(res); } );
            },
            suggestions: function(id, callback){
              movieServices.similar(id, function(res) { callback(res); } );
            },
            nowPlaying: function(page, callback){
                movieServices.now_playing(page, function(res) { callback(res); } );
            }
          },
          tv: {
            byName: function(query, callback){
              tvServices.names(query, function(res) { callback(res); } );
            },
            byId: function(id, callback){
              tvServices.info(id, function(res) { callback(res); } );
            },
            credits: function(id, callback){
              tvServices.credits(id, function(res) { callback(res); } );
            },
            suggestions: function(id, callback){
              tvServices.similar(id, function(res) { callback(res); } );
            },
            onAir: function(page, callback){
              tvServices.onAir(page, function(res) { callback(res); } );
            }
          },
          cast: {
            byName: function(query, callback){
              castServices.names(query, function(res) { callback(res); } );
            },
            byId: function(id, callback){
              castServices.details(id, function(res) { callback(res); } );
            },
            credits: function(id, callback){
              castServices.credits(id, function(res) { callback(res); } );
            },
            popular: function(page, callback){
              castServices.popular(page, function(res) { callback(res); } );
            }
          },
          movies_Tv: {
            byName: function(query, callback){
              movieServices.anyItem(query, function(res) {
                var combo = [];
                var results = res.results;
                for(var i =0; i < results.length; i++) {
                  if((results[i].media_type == "movie") || (results[i].media_type == "tv")){
                    combo.push(results[i]);
                  }
                }
                if(combo.length < 15) {
                  // Get 2nd page and add results to combo
                  movieServices.anyItemPage(query, 2, function(res2) {
                    var results2 = res2.results;
                    for(var i =0; i < results2.length; i++) {
                      if(((results2[i].media_type == "movie") || (results2[i].media_type == "tv")) && combo.length < 15){
                        combo.push(results2[i]);
                      }
                      if(combo.length == 15) { break;}
                    }
                    callback(combo);
                  });
                }
                else { callback(combo);}
              });
            }
          }
        },
        compare: {
          movieTv: function(compareList, callback){
            getAllMovieTvCredits(compareList.length-1, compareList, function(res){
              var tmpResults = {"moviestv":[], "cast":[], "crew":[], "castACrew":[]};

              for(var i=0; i < res.length; i++){
                tmpResults.moviestv.push({"id":res[i].id, "title":(res[i].details.type == 'movie'? res[i].details.title : res[i].details.name), "image_path":res[i].details.poster_path, "media_type":res[i].details.type});

                var castCrewList = res[i].credits.cast.concat(res[i].credits.crew);
                // Add Cast & Crew
                for(var j=0; j < castCrewList.length; j++){
                  var added = false;
                  for(var k=0; k < tmpResults.castACrew.length; k++){
                    if(castCrewList[j].id == tmpResults.castACrew[k].id) {
                      tmpResults.castACrew[k].MTIDS.push(res[i].id);
                      added = true;
                      break;
                    }
                  }
                  if(!added) {
                    var tmpCast = {"id":castCrewList[j].id, "name":castCrewList[j].name, "image_path":castCrewList[j].profile_path, "MTIDS":[res[i].id]};
                    tmpResults.castACrew.push(tmpCast);
                  }
                }

              }

              callback(tmpResults);
            });
          },
          cast: function(compareList, callback){
            getAllCastCrewCredits(compareList.length-1, compareList, function(res){
              var tmpResults = {"castcrew":[], "movieATv":[]};

              for(var i=0; i < res.length; i++){
                tmpResults.castcrew.push({"id":res[i].id, "name": res[i].details.name, "image_path":res[i].details.profile_path});

                var movieTvList = res[i].credits.cast.concat(res[i].credits.crew);
                // Add Cast & Crew
                for(var j=0; j < movieTvList.length; j++){
                  var added = false;
                  for(var k=0; k < tmpResults.movieATv.length; k++){
                    if(movieTvList[j].id == tmpResults.movieATv[k].id) {
                      tmpResults.movieATv[k].CCIDS.push(res[i].id);
                      added = true;
                      break;
                    }
                  }
                  if(!added) {
                    var tmpCast = {"id":movieTvList[j].id, "title":(movieTvList[j].media_type == 'movie' ? movieTvList[j].title : movieTvList[j].name), "image_path":movieTvList[j].poster_path, "CCIDS":[res[i].id]};
                    tmpResults.movieATv.push(tmpCast);
                  }
                }

              }

              callback(tmpResults);
            });
          }
        }
      }
    }])
    .factory("WEData", ['$q', '$http', function($q, $http){
     function WeInfoData() {
       var vm = this;
       vm.siteData = {
         blogs: [{"title":"From The Wild To The West", "images":["http://www.impawards.com/2016/posters/tarzan_ver3_xlg.jpg", "http://questionablefilmreview.files.wordpress.com/2013/07/7736093674_2e8414a35c_o.jpg","https://i.jeded.com/i/django-unchained.6897.jpg"], "text":"Whose headed to purchase @legendoftarzan available on blu-Ray and DVD TODAY!!! We wanted to find a #wedbconnection and we found one with one of our all time favorite actors @samuelljackson and co-star #ChristophWaltz This will be third time the pair have joined eachother for a big screen production! First in 2009 when Sam narrated for the film #IngloriousBasterds starring #BradPitt then again when the both graced the screen in the unique #QuentinTarantino film #DjangoUnchained starring the multitalented @iamjamiefoxx to their most recent action film to hit theaters @legendoftarzan a definite must see starring another one of our favorite actresses @margotrobbie as Jane and #AlexanderSkarsgard as Tarzan! With his incredible range and amazingly diverse talents we can't wait to see what @samuelljackson will do next! #SamuelLJackson #ChristophWaltz #MargotRobbie #AlexanderSkarsgard #JamieFoxx #BradPitt #IngloriousBasterds #DjangoUnchained #LegendOfTarzan #wedbconnection"}]
       };
     }

     return new WeInfoData();
    }]);

})();

(function(){

  angular
    .module('config')
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
      .state('app', {
        url: "/",
        views: {
          'content':{
            templateUrl: 'views/home.html',
            controller: 'HomeController as sc'
          },
          'footer':{
            templateUrl: 'views/templates/_footer.html'
          }
        }
      })
      .state('app.movie_tv', {
        url: "movie_tv?id1&id2&id3",
        views: {
          'content@': {
            templateUrl: 'views/movie_tv.html',
            controller: 'MovieTvController as sc'
          }
        }
      })
      .state('app.cast', {
        url: "cast?id1&id2&id3",
        views: {
          'content@': {
            templateUrl: 'views/cast.html',
            controller: 'CastController as sc'
          }
        }
      })
      .state('app.construction', {
        url: "underconstruction",
        views: {
          'content@': {
            templateUrl: 'views/construction.html',
            controller: 'HomeController as sc'
          }
        }
      });



      $urlRouterProvider.otherwise('/');
      //$locationProvider.html5Mode(true);
    }]);


})();

(function(){
  'use strict';

  angular
    .module('config')
    .factory('api', function(){
      var baseurl = "https://api.themoviedb.org/3/";
      var apikey = "8af02f398b3ff990bab4f71c247c640a";

      return {
        any: {
          all: function(query){
            return baseurl + "search/multi?api_key="+apikey+"&query="+query;
          },
          page: function(query, page){
            return baseurl + "search/multi?page="+page+"&api_key="+apikey+"&query="+query;
          }
        },
         movie: {
             searchname: function(query){
                 return baseurl + "search/movie?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/movie?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getMovieCredits: function(id) {
                 return baseurl + "movie/"+id+"/credits?api_key="+apikey;
             },
             getMovieInfo: function(id) {
                 return baseurl + "movie/"+id+"?api_key="+apikey;
             },
             getSimilarMovies: function(id) {
               return baseurl + "movie/"+id+"/similar?api_key="+apikey;
             },
             getNowPlaying: function(page) {
               return baseurl + "movie/now_playing?page="+page+"&api_key="+apikey;
             },
             getPopular: function(page) {
               return baseurl + "movie/popular?page="+page+"&api_key="+apikey;
             }
         },
         cast: {
             searchname: function(query) {
                 return  baseurl + "search/person?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/person?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getCombinedCredits: function(id) {
                 return baseurl + "person/"+id+"/combined_credits?api_key="+apikey;
             },
             getCastDetails: function(id) {
                 return baseurl + "person/"+id+"?api_key="+apikey;
             },
             getPopular: function(page) {
                 return baseurl + "person/popular?page="+page+"&api_key="+apikey;
             }
         },
         tv: {
             searchname: function(query){
                 return baseurl + "search/tv?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/tv?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getTvCredits: function(id) {
                 return baseurl + "tv/"+id+"/credits?api_key="+apikey;
             },
             getTvInfo: function(id) {
                 return baseurl + "tv/"+id+"?api_key="+apikey;
             },
             getSimilarTv: function(id) {
               return baseurl + "tv/"+id+"/similar?api_key="+apikey;
             },
             getOnAir: function(page) {
               return baseurl + "tv/on_the_air?page="+page+"&api_key="+apikey;
             }
         }
      }
    });

})();

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

      function getAge(dateString, deathString){
        var today = (deathString == undefined ? new Date() : new Date(deathString));
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

    }]);

})();

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

(function(){
   "use strict";

   angular.module('services')
    .service('castServices', ['$http','api', function CastService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.cast.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.cast.getCombinedCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        details: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.cast.getCastDetails($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        popular: function($pg, callback) {
          $http({
            method: 'GET',
            url: api.cast.getPopular($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();

(function(){
   "use strict";

   angular.module('services')
    .service('movieServices', ['$http','api', function MovieService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.movie.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getMovieCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        similar: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getSimilarMovies($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        info: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.movie.getMovieInfo($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        now_playing: function($pg,callback) {
          $http({
            method: 'GET',
            url: api.movie.getNowPlaying($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        anyItem: function($str, callback) {
          $http({
            method: 'GET',
            url: api.any.all($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        anyItemPage: function($str, $page, callback) {
          $http({
            method: 'GET',
            url: api.any.page($str, $page)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();

(function(){
   "use strict";

   angular.module('services')
    .service('tvServices', ['$http','api', function TvService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.tv.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getTvCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        similar: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getSimilarTv($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        info: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.tv.getTvInfo($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        onAir: function($pg, callback) {
          $http({
            method: 'GET',
            url: api.tv.getOnAir($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();

(function(){
   "use strict";

    angular.module('directives').directive('backImg', ['$window', function($window) {
      return {
        restrict: 'EA',
        link: function ($scope, element, attrs) {
          var url = attrs.backImg;
          element.css({'background-image': 'url(' + url +')'});
        }
      }

    }]);

})();

(function(){
   "use strict";

    angular.module('directives').directive('randomMotion', ['$timeout', function($timeout) {
      return {
        restrict: 'EA',
        link: function ($scope, element, attrs) {
          //console.log("Start Motion");
          // Randomly Set Postion & Velocity
          var maxVelocity = 100;
          var posX = Math.min(0, Math.max(20, (Math.random() * 0)));
          var posY = Math.min(0, Math.max(20, (Math.random() * 10)));
          var velX = (Math.random() * maxVelocity);
          var velY = (Math.random() * maxVelocity);
          var timestamp = null;

          var parentContainer = element[0].offsetParent;

          // Move Object
          (function tick() {
            var now = new Date().getTime();
            var borderX = parentContainer.clientWidth *.20;
            var borderY = parentContainer.clientHeight *.20;

            var maxX = parentContainer.clientWidth - borderX;
            var maxY = parentContainer.clientHeight - borderY;

            var elapsed = (timestamp || now) - now;
            timestamp = now;
            posX += elapsed * velX / 1000;
            posY += elapsed * velY / 1000;

            if (posX > maxX) {
                posX = 2 * maxX - posX;
                velX *= -1;
            }
            if (posX < 10) {
                posX = 10;
                velX *= -1;
            }
            if (posY > maxY) {
                posY = 2 * maxY - posY;
                velY *= -1;
            }
            if (posY < 10) {
                posY = 10;
                velY *= -1;
            }
            element.css({ "top": posY, "left": posX });
            // Set Position to $element top and left
            // Loop to Move object
            $timeout(tick, 30);
          })();
        }
      }
    }]);

})();


angular.module('directives')
  .directive('scrollTo', ['ScrollTo', function(ScrollTo){
    return {
      restrict : "AC",
      compile : function(){

        return function(scope, element, attr) {
          element.bind("click", function(event){
            ScrollTo.idOrName(attr.scrollTo, attr.offset);
          });
        };
      }
    };
  }])
  .service('ScrollTo', ['$window', 'ngScrollToOptions', function($window, ngScrollToOptions) {
    this.idOrName = function (idOrName, offset, focus) {//find element with the given id or name and scroll to the first element it finds
        var document = $window.document;

        if(!idOrName) {//move to top if idOrName is not provided
          $window.scrollTo(0, 0);
        }

        if(focus === undefined) { //set default action to focus element
            focus = true;
        }

        //check if an element can be found with id attribute
        var el = document.getElementById(idOrName);
        if(!el) {//check if an element can be found with name attribute if there is no such id
          el = document.getElementsByName(idOrName);

          if(el && el.length)
            el = el[0];
          else
            el = null;
        }

        if(el) { //if an element is found, scroll to the element
          if (focus) {
              el.focus();
          }

          ngScrollToOptions.handler(el, offset);
        }
        //otherwise, ignore
      }

  }])
  .provider("ngScrollToOptions", function() {
    this.options = {
      handler : function(el, offset) {
        if (offset) {
          var top = $(el).offset().top - offset;
          window.scrollTo(0, top);
        }
        else {
          el.scrollIntoView();
        }
      }
    };
    this.$get = function() {
      return this.options;
    };
    this.extend = function(options) {
      this.options = angular.extend(this.options, options);
    };
  });



//angular.module("myApp", ["ngScrollTo"]);
