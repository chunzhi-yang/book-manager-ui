app.controller('selfCtrl', ['$scope','curUserService','$timeout','$ionicBackdrop',function($scope,curUserService,$timeout,$ionicBackdrop) {
   $scope.user = curUserService.getCurUser();
   $timeout(function(){
     $scope.user = curUserService.getCurUser();
   },500);
  $scope.darkTheme = curUserService.getDarkTheme();
  $scope.loadTheme = function(t){
    $scope.darkTheme = t;
    curUserService.setDarkTheme(t);
  }
}]);
