app.controller('bookstoreDetailCtrl',['$scope','httpService','$location','$stateParams','Popup','Config',function($scope,httpService,$location,$stateParams,Popup,config){
    httpService.post('books/'+$stateParams.id)
      .success(function(d){

          d.imgPath = config.imgPrefix + d.imgPath;
          $scope.book = d;
      });
    $scope.addOrder= function(){
        Popup.confirm('<span class="item">购买章节数<input type="text" ng-model="chapterNums">' +
          '</span>',function(){

        },function(){

        });
    }
}]);
