app.controller('mainCtrl',['$scope','curUserService', function($scope,curUserService) {

  $scope.darkTheme = curUserService.getDarkTheme();
  $scope.isLogined = curUserService.getIsLogined();
  $scope.darkTheme = true;
  $scope.logout = function(){
    curUserService.doLogout();
  }
}]);
