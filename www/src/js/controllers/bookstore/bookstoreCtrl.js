app.controller('bookstoreCtrl',['$scope','httpService','$timeout','Config', function($scope, httpService,$timeout,config) {
	var page = 1,loading=false,timer=null;
  $scope.book = {};
    $scope.search = function(){
    		page = 1;
      $scope.loadBooks();
    }
    $scope.changeType = function(type){
        $scope.book.type = type;
        $scope.search();
    }
  $scope.$on('stateChangeSuccess',function(){
    $scope.loadBooks();
  });
  $scope.loadBooks = function(){
      if(loading){
        return;
      }
      loading = true;
    	httpService.post('books/list',{bookName:$scope.book.bookName,type:$scope.book.type,page:page,pageSize:5})
    	.success(function(d){
    		if(d.data.length == 0){
    		  $scope.noMoreItemsAvailable = true;
        }else{
          page++;
          $scope.books = $scope.books.concat(d.data);
          angular.forEach($scope.books,function(d){
            d.imgPath = config.imgPrefix + d.imgPath;
            d.filePath = config.filePrefix + d.filePath;
          });
        }
    		loading = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    	});
    }
    $scope.books=[];
  $scope.noMoreItemsAvailable = false;
  $scope.search();
}]);
