app.controller('selfCtrl', ['$scope','curUserService',function($scope,curUserService) {
  //curUserService.test();
  $scope.user = curUserService.getCurUser();
}]);
