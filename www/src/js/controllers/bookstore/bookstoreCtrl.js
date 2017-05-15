app.controller('bookstoreCtrl',['$scope','httpService','$timeout','Config', function($scope, httpService,$timeout,config) {
	var page = 1,loading=false;

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
    var param = {type:$scope.book.type,page:page,pageSize:5};
    if($scope.book.bookName){
      param.bookName = $scope.book.bookName;
    }
    	httpService.post('books/list',param)
    	.success(function(d){
    		if(d.data.length == 0){
    		  $scope.noMoreItemsAvailable = true;
        }else{
          $scope.books = $scope.books.concat(d.data);
          if(page == 1){
            $scope.books = [];
            $scope.books = $scope.books.concat(d.data);
          }
          page++;
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
  $scope.book={type:0};
  $scope.noMoreItemsAvailable = false;
  $scope.search();
}]);
