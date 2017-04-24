(function(){
   "use strict";

    angular.module('spotlightCtrl').controller('SpotlightController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "spotlight";
      vm.defaultImg = "imgs/siteart/Home7.jpg";
      /*Variables*/
      vm.spotlightObject = {};
      vm.spotlightObjects = [];
      vm.spotlightMax = 10;
      vm.visualLoading = {"network":false, "chord":false};

      vm.defaultItem = {id: 321612, type: "movie", title:"Beauty & The Best"};

      if(vm.spotlightObject.id == undefined){
        displayDetails(vm.defaultItem.id,vm.defaultItem.type);
      }

      /*Spotlight Functions*/
      vm.spotlightSelected = spotlightSelected;
      vm.addItem = addItem;
      vm.displayDetails = displayDetails;

      function displayDetails(id, type){
        vm.spotlightObject = {};
        vm.spotlightObjects = [];
        vm.visualLoading.network = true;
        vm.visualLoading.chord = true;

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
              vm.spotlightObject.images = "";
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

            if(vm.spotlightObject.details != null && vm.spotlightObject.details.backdrop_path != null){
              vm.spotlightObject.images = "http://image.tmdb.org/t/p/w500"+vm.spotlightObject.details.backdrop_path;
            }
            else {
              vm.spotlightObject.images = "";
            }

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
          weInfo.spotlight.transformMovieTv(res, function(res2){
            // display results using vis.js
            // Display Cast Visuals
            vm.spotlightObject.creditsVisuals = res2.networkResults.nodes
            // Display Network Visuals
            NetworkVisuals(res2.networkResults);
            // Display Chord Visuals
            ChordVisuals(res2.chordResults);
          });
        });
      }

      // Visuals

      //Chord Visuals
      function ChordVisuals(vizData){
        function sort(a,b){ return d3.ascending(vizData.sortOrder.indexOf(a),vizData.sortOrder.indexOf(b)); }
        var calcWidth = document.getElementsByClassName("chord-container")[0].offsetWidth;
        var calcHeight = document.getElementsByClassName("chord-container")[0].offsetHeight;

        var chordRadius = (calcWidth < 500 ? 80 : 250);

        var ch = viz.ch().data(vizData.data)
          .padding(.01)
          .sort(sort)
          .innerRadius(chordRadius - 20)
	        .outerRadius(chordRadius)
	        .duration(1000)
	        .chordOpacity(0.3)
	        .labelPadding(.03)
          .fill(function(d){ return vizData.colors[d];});

        // remove old svg
        d3.select(".chord-container > svg").remove();
        // append new svg
        var svg = d3.select(".chord-container").append("svg");

        svg.append("g").attr("transform", "translate("+(calcWidth/2)+","+(calcHeight/2)+")").call(ch);

        d3.select(self.frameElement).style("height", (calcHeight/2)+"px").style("width", (calcWidth/2)+"px");
        // Loading visuals
        vm.visualLoading.chord = false;
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
        network.on("click", function (params) {
          //console.log(params);
        });

        vm.visualLoading.network = false;
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
