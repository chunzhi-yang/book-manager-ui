app.controller('selfOrderCtrl', ['$scope','httpService','curUserService','Config',
  function($scope, httpService,curUserService,config) {
  curUserService.test();
  var user = curUserService.getCurUser(),page=1;
       $scope.usingAccount = user.userName;
       $scope.usingAvatar = config.imgPrefix + user.imgPath;
      $scope.usingUid = user.uid;

  var loadOrders = function() {
    var param = {uid: user.uid,page:page,pageSize:10};
    httpService.post('order/list', param).success(function (d) {
      if (d.total > 0) {
        var respBooks = d.data;
        var ids = [];
        angular.forEach(respBooks, function (e) {
            ids.push(e.booksId);
        });
        loadBooks(ids,respBooks);
      }

    });
  }
    var loadBooks = function(ids,respBooks){
      httpService.post('books/listByArray', {ids: ids.join(',')}).success(function (d1) {

        for (var i = 0; i < d1.length; i++) {
          var book = d1[i],
            bookScope = respBooks[i];
          bookScope.bookName = book.bookName;
          bookScope.imgPath = config.imgPrefix + book.imgPath;
          $scope.books.push(bookScope);
        }
        console.log($scope.books);
      });
    }
  $scope.books = [];
  loadOrders();
}]);
