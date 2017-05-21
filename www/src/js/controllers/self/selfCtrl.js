app.controller('selfCtrl', ['$scope','$rootScope','$timeout',function($scope,$rootScope,$timeout) {


  $scope.loadTheme = function(t){
    $rootScope.darkTheme = t;

  }
}]);
