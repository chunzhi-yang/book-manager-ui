app.controller('bookshelfCtrl',['$scope','httpService','curUserService','localStorage','Upload','$timeout','Popup','fileTransferHelper','$state','Config',
	function($scope, httpService,curUserService,localStorage,Upload,$timeout,Popup,fileTransferHelper,$state,configs) {
    curUserService.test();
    var curUser = curUserService.getCurUser(),page=1;
     $scope.books = [];
    $scope.noMoreItemsAvailable = false;
    $scope.isLogined = true;// curUserService.getIsLogined();
    $scope.files=[];

    $scope.viewBook = function(i) {
      if ($scope.isLogined) {
        fileTransferHelper.setter(i);
      } else {
        fileTransferHelper.setter($scope.files[i]);
      }
      $state.go('login.bookshelf.view');
    }
    var loadFromLocalStorage = function(){
      if($scope.isLogined){
        loadByUid(curUser.uid);
      }else{
        var locals = localStorage.getObject('bookshelfItems');
        for(var local in locals){
           $scope.books.push(local);
        }
      }
    }


    var loadByUid = function(uid){
      var param = {page:page,pageSize:100};
      httpService.post('bookShelf/list/'+uid,param).success(function(data){
        console.log(data);
        if(data.total == 0){
          $scope.noMoreItemsAvailable = true;
        }else {
          $scope.books = [];
          angular.forEach(data.data,function(d){
            httpService.post('books/'+d.booksId).success(function(book){
              $scope.books.push(book);
            });
          });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    $scope.loadFiles= function(files){
      if(!$scope.isLogined){
        addToLocals(files);
        var books = localStorage.getObject('bookShelfItem');
        $scope.books = $scope.books.concat(books);
      }else{
        doUpload(files);
      }
    }

    function addToLocals(files){
      var books = [];
      for(var i=0;i < files.length;i++) {
        books.push({bookName: files[i].name});
        localStorage.setObject('bookShelfItem', books);
      }
      $scope.files = $scope.files.concat(files);
    }
     function doUpload(files){
       if (files && files.length) {
         Upload.upload({
           url: configs.serverUrl+'/bookShelf/upload',
           data: {
             files: files
           }
         }).then(function (response) {
           $timeout(function () {
             console.log(response);
             insertBookShelf( response.data);
           });
         }, function (response) {
           if (response.status > 0) {
             $scope.errorMsg = response.status + ': ' + response.data;
           }
         }, function (evt) {
           $scope.progress =
             Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
         });
       }
     }
    var insertBookShelf = function(books){
        var params = [];
        angular.forEach(books,function(book){
          var  bookShelf = {booksId:book.booksId,uid:curUser.uid};
          params.push(bookShelf);
        });
        var page = {data:params};

        httpService.put('bookShelf/createBatch',page).success(function(d){
          console.log(d);
          if(d > 0){
            Popup.alert('导入成功!');
            loadBooksInfo();
          }
        });
    }
    var loadBooksInfo = function(){
      loadByUid(curUser.uid);
    }

    loadFromLocalStorage();
}]);
