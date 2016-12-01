(function(){
   "use strict";

    angular.module('spotlightCtrl').controller('SpotlightController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "spotlight";
      vm.defaultImg = "imgs/siteart/Home7.jpg";
      /*Movie Ctrl*/
      var id = $stateParams.id;
      vm.selectedMovieTv = {"id":-1,"details":{}, "credits":{}, "suggestions":{}, "display":false, "infoview":"details"};

      if(id != undefined){
        var idList = id.split('-');
        displayDetails(idList[0],idList[1]);
      }
      /*Variables*/
      vm.spotlightObject = {};
      vm.spotlightObjects = [];
      vm.spotlightMax = 10;
      /*Spotlight Functions*/
      vm.spotlightSelected = spotlightSelected;
      vm.addItem = addItem;
      vm.displayDetails = displayDetails;

      function displayDetails(id, type){
        if(type == "movie"){
          weInfo.search.movies.byId(id, function(results){
            vm.spotlightObject.id = id;
            vm.spotlightObject.details = results;
            vm.spotlightObject.details.type = type;
            vm.spotlightObject.credits = {};
            vm.spotlightObject.suggestions = {};
            vm.spotlightObject.infoview = 'details';
            vm.spotlightObject.display = (results != null);

            if(vm.spotlightObject.details != null && vm.spotlightObject.details.backdrop_path != null){
              vm.spotlightObject.images = "http://image.tmdb.org/t/p/w500"+vm.spotlightObject.details.backdrop_path;
            }
            else {
              vm.spotlightObject.images = "http://image.tmdb.org/t/p/w500"+vm.defaultImg;
            }
            addItem(vm.spotlightObject);
            spotlightSelected();
          });
        }
        else if(type == "tv"){
          weInfo.search.tv.byId(id, function(results){
            vm.spotlightObject.id = id;
            vm.spotlightObject.details = results;
            vm.spotlightObject.details.type = type;
            vm.spotlightObject.credits = {};
            vm.spotlightObject.suggestions = {};
            vm.spotlightObject.infoview = 'details';
            vm.spotlightObject.display = (results != null);

            addItem(vm.spotlightObject);
            spotlightSelected();
          });
        }
      }

      function addItem(item) {
        var tmpObject = {};
        tmpObject.id = item.id;
        tmpObject.details = item.details;
        tmpObject.credits = item.credits;
        tmpObject.suggestions = item.suggestions;

        vm.spotlightObjects.push(tmpObject);
      }

      function spotlightSelected(){
        var itemid = 0;
        // get data
        weInfo.spotlight.getMovieTv(vm.spotlightObjects, vm.spotlightMax, function(res){
          // perform spotlight & transform results
          console.log("Get Results:");
          console.log(res);
          weInfo.spotlight.transformMovieTv(res, function(res2){
            console.log("Transform Results:");
            console.log(res2);
            // display results using vis.js
            NetworkVisuals(res2.networkResults);
            //ChordVisuals(res2.chordResults);
          });
        });
      }

      // Visuals

      //Chord Visuals
      function ChordVisuals(vizData){
        function sort(a,b){ return d3.ascending(vizData.sortOrder.indexOf(a),vizData.sortOrder.indexOf(b)); }

        var ch = viz.ch().data(vizData.data)
          .padding(.01)
          .sort(sort)
	        .innerRadius(430)
	        .outerRadius(450)
	        .duration(1000)
	        .chordOpacity(0.3)
	        .labelPadding(.03)
          .fill(function(d){ return vizData.colors[d];});

        //var width=1200, height=1100;
        var width = 100, height = 100;
        var svg = d3.select(".chord-container").append("svg").attr("height",height).attr("width",width);

        svg.append("g").attr("transform", "translate(600,550)").call(ch);
        //d3.select(self.frameElement).style("height", height+"px").style("width", width+"px");
        d3.select(self.frameElement).style("height", height+"%").style("width", width+"%");
      }
      // Network Visuals
      function NetworkVisuals(vizData){
        var network = null;
        var container = document.getElementById('network-container');
        var data = {
          nodes: vizData.nodes,
          edges: vizData.edges
        };
        var options = {
          interaction: {
            keyboard: {
              enabled: false
            },
            zoomView: false
          },
          nodes: {
            borderWidth:4,
            size:30,
    	      color: {
                highlight: {
                  border:'#F19F4D',
                  background:'#F19F4D'
                }
              }
          },
          edges: {
            color: {
              inherit: 'both',
              highlight: '#F19F4D',
              opacity: 0.5
            },
            font: {
              align: 'middle',
              color: "#ffffff",
              strokeWidth:0
            },
            length: 500,
            labelHighlightBold: true,
            selectionWidth: function (width) {return width*10;},
            smooth: {
              type: 'cubicBezier',
              forceDirection : 'horizontal'
            }
          }
        };
        network = new vis.Network(container, data, options);
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
