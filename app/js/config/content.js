(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('weInfo', [ 'WEData', '$filter','movieServices', function MCEInfo(WEData, $filter, movieServices){
      var demo = WEData.siteData.demo;

      return {
        demo: {
          all: function(){
            return demo;
          }
        },
        search: {
          all: function(query, callback) {
            movieServices.anyItem(query, function(res) { callback(res); } );
            //return demo;
          }
        }
      }
    }])
    .factory("WEData", ['$q', '$http', function($q, $http){
     function WeInfoData() {
       var vm = this;
       vm.siteData = {};
     }

     return new WeInfoData();
    }]);

})();
