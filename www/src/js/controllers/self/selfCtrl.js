app.controller('selfCtrl', ['$scope','curUserService',function($scope,curUserService) {

  $scope.user = curUserService.getCurUser();
}]);
