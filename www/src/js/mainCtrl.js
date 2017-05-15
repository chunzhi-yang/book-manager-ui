app.controller('mainCtrl',['$scope','curUserService', function($scope,curUserService) {

  $scope.darkTheme = curUserService.getDarkTheme();
  $scope.isLogined = curUserService.getIsLogined();
  $scope.logout = function(){
    curUserService.doLogout();
  }
}]);
