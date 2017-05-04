app.controller('selfHistoryCtrl', ['$scope','httpService','curUserService','Config',function($scope, $http,curUserService,config) {
  curUserService.test();
  var user = curUserService.getCurUser();

}]);
