app.controller('bookshelfCtrl',['$scope','httpService','$rootScope','localStorage','Upload','$timeout','Popup','fileTransferHelper','$state','Config',
	function($scope, httpService,$rootScope,localStorage,Upload,$timeout,Popup,fileTransferHelper,$state,configs) {

     $scope.curUser = $rootScope.curUser;
    var page=1;
     $scope.books = [];
    $scope.noMoreItemsAvailable = false;
    $scope.files=[];

    $scope.viewBook = function(i,eve) {
        if($rootScope.isLogined){
          return;
        }
       fileTransferHelper.setter($scope.files[i]);
      $state.go('login.bookshelf.view');
    }
    var loadFromLocalStorage = function(){
      if($rootScope.isLogined){
        loadByUid($scope.curUser.uid);
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
      if(!$rootScope.isLogined){
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
        $scope.files.push(files[i]);
      }
    }
     function doUpload(files){
       if (files && files.length) {
         Upload.upload({
           url: configs.serverUrl+'bookShelf/upload',
           headers:{
             'Access-Control-Allow-origin': '*',
             'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
             'Access-Control-Allow-Headers': 'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With',

           },
           data: {
             files: files,
             uid: '-1'
           }
         }).then(function (response) {
           $timeout(function () {

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
          var  bookShelf = {booksId:book.booksId,uid:$scope.curUser.uid};
          params.push(bookShelf);
        });
        var page = {data:params};

        httpService.createObject('bookShelf/createBatch',page).then(function(d){
          if(d.data > 0){
            Popup.alert('导入成功!');
            loadByUid($scope.curUser.uid);
          }
        });
    }

    loadFromLocalStorage();
}]);
