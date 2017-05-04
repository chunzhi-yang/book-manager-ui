app.controller('selfCtrl', ['$scope','httpService','curUserService','Config',function($scope, $http,curUserService,config) {

  $scope.user = curUserService.getCurUser();

}]);
