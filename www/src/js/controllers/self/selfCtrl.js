app.controller('selfCtrl', ['$scope','curUserService',function($scope,curUserService) {
   $scope.user = curUserService.getCurUser();
  $scope.darkTheme = curUserService.getDarkTheme();
  $scope.loadTheme = function(t){
    $scope.darkTheme = t;
    curUserService.setDarkTheme(t);
  }

}]);
