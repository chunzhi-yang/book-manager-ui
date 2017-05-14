app.controller('mainCtrl',['$scope','curUserService', function($scope,curUserService) {

  $scope.darkTheme = curUserService.getDarkTheme();

  $scope.logout = function(){
    console.log($scope.darkTheme);
    curUserService.doLogout();
  }
}]);
