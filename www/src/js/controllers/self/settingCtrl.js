app.controller('settingCtrl', ['$scope','httpService','curUserService','Config','$location',function($scope, $http,curUserService,config,$location) {
  var user = curUserService.getCurUser();
       $scope.usingAccount = user.userName;
       $scope.usingAvatar = config.imgPrefix + user.imgPath;
      $scope.usingUid = user.uid;
  $scope.preference = function(){

  }
  $scope.logout = function(){
    curUserService.doLogout();
  }
}]);
