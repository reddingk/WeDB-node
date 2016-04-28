angular.module('WeDBApp', [
'MainCtrl',
'TestCtrl']);

angular.module('TestCtrl', []).controller('TestController', function($scope){
  $scope.title = "Test";
});
