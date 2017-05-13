app.controller('bookshelfCtrl',['$scope','httpService','curUserService','localStorage','Upload','Popup','fileTransferHelper','$state','Config',
	function($scope, httpService,curUserService,localStorage,Upload,Popup,fileTransferHelper,$state,configs) {
     var curUser = curUserService.getCurUser(),page=1;
     $scope.books = [];
    $scope.noMoreItemsAvailable = false;
    $scope.isLogined = curUserService.getIsLogined();
    $scope.files=[];
    $scope.viewBook = function(i) {
      if ($scope.isLogined) {
        fileTransferHelper.setter($scope.books[i].bookName);
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
      var param = {page:page,pageSize:10};
      httpService.post('bookShelf/list/'+uid,param,function(){
        if(d.data.length == 0){
          $scope.noMoreItemsAvailable = true;
        }else {
          page++;
          $scope.books = $scope.books.concat(d.data);
          angular.forEach($scope.books,function(d){
            d.imgPath = config.imgPrefix + d.imgPath;
            d.filePath = config.filePrefix + d.filePath;
          });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    $scope.loadFiles= function(files){
      $scope.files =$scope.files.concat(files);
      if(!$scope.isLogined){
        addToLocals(files);
        var books = localStorage.getObject('bookShelfItem');
        $scope.books = $scope.books.concat(books);
      }else{
        doUpload($scope.files);
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
    var insertBookShelf = function(fileIds){
        var params = [];
        angular.forEach(fileIds,function(fileId){
          var  bookShelf = {booksId:fileId,uid:curUser.uid};
          params.push(bookShelf);
        });

        httpService.put('bookShelf/createBatch',params,function(d){
          if(d.data == fileIds.length){
            Popup.alert('导入成功!');
            loadBooksInfo(fileIds);
          }
        });
    }
    var loadBooksInfo = function(ids){
        httpService.post('books/listByArray',ids,function(d){
          $scope.books = $scope.books.concat(d.data);
        });
    }

    loadFromLocalStorage();
}]);
