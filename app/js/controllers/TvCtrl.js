(function(){
   "use strict";

   angular.module('weTv')
   .controller('TvController', ['tvServices','tvData', '$filter', '$q', function(tvServices, tvData, $filter, $q){
     var vm = this;
     vm.title = "tv";

     // Select TV Show
     vm.resultsLimit = 8;
     vm.selected = undefined;
     vm.selectedTv = undefined;
     vm.showSelected = false;
     vm.selectedCredit = undefined;
     vm.showSelectedCredit = false;
     vm.showBio = false;

     // Compare movies
     vm.showCompare = false;
     vm.selectedObjects = [];
     vm.slider = [false, false, false];
     vm.compared = [];

     // Select Compare List
     vm.selectedList = undefined;
     vm.comparedVisuals = [];
     vm.highlight = undefined;

     vm.tvSearch = function(query) {
       if(query != undefined) {
         var cleanString = query;
         cleanString = cleanString.replace("&", "and");

         return tvServices.names(cleanString).then(function (results) {
           var tvdata = results.results;
           return (tvdata.length > vm.resultsLimit ? tvdata.slice(0, vm.resultsLimit) : tvdata);  ;
         }, function (error) {
           console.log("ERROR NO RESULTS");
         });
       }
       return;
     }

     vm.getTvInfo = function(tvid) {
       return tvServices.info(tvid).then(function (results) {
         return results;
       }, function (error) {
         console.log("ERROR NO MOVIE INFO");
       });
     }

     vm.getTvCredits = function(tvid) {
       return tvServices.credits(tvid).then(function (results) {
         return results;
       }, function (error) {
         console.log("ERROR NO MOVIE CREDITS");
       });
     }

     vm.viewTvInfo = function(item) {
       vm.showSelected = false;
       var tvid = item.id;
       if((vm.selectedTv == undefined) || (tvid != vm.selectedTv.id)) {
         vm.showSelectedCredit = false;
         vm.selectedCredit = undefined;
         vm.getTvInfo(tvid).then(function(retResults) {
           vm.showSelected = true;
           vm.selectedTv = retResults;
         });
       }
       else {
         vm.showSelected = true;
       }
     }
     vm.viewTvCredits = function(tvid) {
       if(vm.showSelectedCredit == false){
         vm.showBio = false;
         if(vm.selectedCredit == undefined) {
           vm.getTvCredits(tvid).then(function(retResults) {
             vm.selectedCredit = retResults.cast;
             vm.showSelectedCredit = true;
             console.log("Got Results");
           });
         }
         else {
           vm.showSelectedCredit = true;
           console.log("Already Had Results");
         }
       }
       else {
         vm.showSelectedCredit = false;
       }

     }
     vm.viewBio = function() {
       vm.showSelectedCredit = false;
       vm.showBio = !vm.showBio;
     }

     /*Control Compare List*/
     vm.addToCompare = function(tvshow) {
       if(vm.ableToCompare(tvshow)){
         vm.selectedObjects.push(tvshow);
         vm.showSelected = false;
         vm.showSelectedCredit = false;
         vm.selectedTv = undefined;
         vm.selectedCredit = undefined;
         vm.selected = undefined;
         vm.showCompare = true;
       }
     }
     vm.removeCompareTv = function(tvshow) {
       var removeIndex = vm.selectedObjects.indexOf(tvshow);
       if(removeIndex >= 0)
         vm.selectedObjects.splice(removeIndex, 1);
     }

     vm.ableToCompare = function(tvshow) {
       if(vm.selectedObjects.length < 3 && tvshow != null )
       {
         var found = $filter('filter')(vm.selectedObjects, {id: tvshow.id});
         if(found == undefined || found.length == 0)
           return true;
       }
       return false;
     }

     vm.getTvIndex = function(tvshow) {
       var index = vm.selectedObjects.indexOf(tvshow);
       if(index >= 0)
         return index;
       else
         return 0;
     }
     vm.toggleSlider = function(tvshow) {
         var tvshowIndex = vm.getTvIndex(tvshow);
         vm.slider[tvshowIndex] = !vm.slider[tvshowIndex];
     }
     vm.getSliderStatus = function(tvshow) {
       var tvshowIndex = vm.getTvIndex(tvshow);
       return vm.slider[tvshowIndex];
     }

     /*Compare Movies*/
     vm.compareSelectedTv = function() {
       vm.getCompareCasts().then(function(){
         vm.compareTvCasts();
         console.log(vm.compared);
         // Get color code for all casts members
         vm.resultsVisuals();
         console.log(vm.comparedVisuals);
       });
     }

     /*Get movie cast for each compared movie*/
     vm.getCompareCasts = function() {
       var promises = [];

       function fullCastInfo(tInfo) {
         var def = $q.defer();
         if(tvData.comparedCasts.length < 1){
           return vm.getTvCredits(tInfo.id).then(function(data){
             tvData.comparedCasts.push({tvinfo: tInfo, cast: data });
              def.resolve(true);
           });
         }
         return def.promise;
       }

       for(var i =0; i < vm.selectedObjects.length; i++) {
           promises.push(fullCastInfo(vm.selectedObjects[i]));
       }
       return $q.all(promises).then(function(data){
         var def = $q.defer();
         def.resolve(true);
         return def.promise;
       });
     }

     /*Compare casts for each movie and return all cast members that appear in movies together*/
     vm.compareTvCasts = function() {
       var castList = tvData.comparedCasts;
       var compareResults = [];
       // compare one to one
       if(castList.length > 1){
         for(var i=0; i < castList.length; i++) {
           for(var j=i+1; j < castList.length; j++) {
             tvData.comparedResults.push({tv1: castList[i].tvinfo, tv2:castList[j].tvinfo, matchedCast:vm.compareTvs(castList[i].cast, castList[j].cast, null) });
           }
         }
       }
       // compare all 3 items
       if(castList.length == 3){
         tvData.comparedResults.push({tv1: castList[0].tvinfo, tv2:castList[1].tvinfo, tv3:castList[2].tvinfo, matchedCast:vm.compareTvs(castList[0].cast, castList[1].cast, castList[2].cast) });
       }

       vm.compared = tvData.comparedResults;
       var def = $q.defer();
       def.resolve();
       return def.promise;
     }

     /*Compare movies and return cast in each movie*/
     vm.compareTvs = function(tA, tB, tC) {
       var tvA = (tA == null ? null : tA.cast);
       var tvB = (tB == null ? null : tB.cast);
       var tvC = (tC == null ? null : tC.cast);

       var comparedCasts = [];

       if (tvA == null || tvB == null)
         return;
       // Only compare 2
       if(tvC == null) {
         for(var i=0; i < tvA.length; i++) {
           for(var j=0; j < tvB.length; j++) {
             if(tvA[i].id == tvB[j].id){
               comparedCasts.push(tvA[i]);
             }
           }
         }
       }
       else {
         for(var i=0; i < tvA.length; i++) {
           for(var j=0; j < tvB.length; j++) {
             for(var k=0; k < tvC.length; k++) {
               if((tvA[i].id == tvB[j].id) && (tvB[j].id == tvC[k].id)) {
                 comparedCasts.push(tvA[i]);
               }
             }
           }
         }
       }
       return comparedCasts;
     }

     vm.clearResults = function() {
       tvData.comparedCasts = [];
       tvData.comparedResults = [];
       vm.compared = [];
       vm.selectedObjects = [];
       vm.comparedVisuals = [];
       vm.selectedList = undefined;
     }

     // Visuals
     vm.getListClass = function(compare) {
       if(vm.selectedList == compare)
         return "active";
       else
         return "";
     }

     vm.resultsVisuals = function() {
         var idList = [];
         vm.comparedVisuals = [];

         function CastVisuals (castId) {
             var profile = null;
             var tvshowids = [];
             for(var i=0; i < vm.compared.length; i++) {
               if(vm.compared[i].tv3 == null){
                 var found = $filter('filter')(vm.compared[i].matchedCast, {id: castId});
                 if(found != undefined && found.length > 0) {
                   // Profile
                   if(profile == null)
                     profile = found[0].profile_path;
                   // Check TV Show 1
                   if(tvshowids.indexOf(vm.compared[i].tv1.id) < 0)
                     tvshowids.push(vm.compared[i].tv1.id);
                   // Check TV Show 2
                   if(tvshowids.indexOf(vm.compared[i].tv2.id) < 0)
                     tvshowids.push(vm.compared[i].tv2.id);
                 }
               }
             }
             return {profile_path:profile, tvshow: tvshowids};
         }

         for(var i=0; i < vm.compared.length; i++) {
           for(var j=0; j < vm.compared[i].matchedCast.length; j++) {
             if(idList.indexOf(vm.compared[i].matchedCast[j].id) < 0) {
               idList.push(vm.compared[i].matchedCast[j].id);
             }
           }
         }

         var colorArray = randomColor({ count: idList.length + 1, luminosity: 'bright', format: 'rgb'});
         for(var i=0; i < idList.length; i++) {
           vm.comparedVisuals.push({id: idList[i], color:colorArray[i], more_info:CastVisuals(idList[i])});
         }
     }

     vm.getIdColor = function(cid) {
       var color = "rgba(0,0,0,1)";
       var found = $filter('filter')(vm.comparedVisuals, {id: cid});
       if(found != undefined && found.length != 0)
         color = found[0].color;

       return color;
     }
     vm.highlightCast = function(cast) {
       vm.highlight = cast;
     }

    }]);

})();
