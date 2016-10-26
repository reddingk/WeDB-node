(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('weInfo', [ 'WEData', '$filter', function MCEInfo(WEData, $filter){
      var demo = WEData.siteData.demo;


      return {
        demo: {
          all: function(){
            return demo;
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
