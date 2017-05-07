app.controller('selfDiskCtrl', ['$scope','httpService','curUserService','Config',function($scope, httpService,curUserService,config) {
    curUserService.test();
    var user = curUserService.getCurUser();
    $scope.books = [{bookName:'111'},{bookName:'111'},{bookName:'111'},{bookName:'111'},{bookName:'111'},{bookName:'111'},{bookName:'111'},{bookName:'111'},{bookName:'111'},{bookName:'111'},{bookName:'111'}];
}]);
