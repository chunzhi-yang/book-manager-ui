app.controller('bookstoreDetailCtrl',['$scope','httpService','$location','$stateParams','Config',function($scope,httpService,$location,$stateParams,config){
    httpService.post('books/'+$stateParams.id)
      .success(function(d){

          d.imgPath = config.imgPrefix + d.imgPath;
          $scope.book = d;
      });
}]);
