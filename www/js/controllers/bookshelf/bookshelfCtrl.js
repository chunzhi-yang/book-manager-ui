app.controller("bookshelfCtrl",["$scope","httpService","curUserService","localStorage","Upload","Popup","fileTransferHelper","$state","Config",function($scope,httpService,curUserService,localStorage,Upload,Popup,fileTransferHelper,$state,configs){function addToLocals(files){for(var books=[],i=0;i<files.length;i++)books.push({bookName:files[i].name}),localStorage.setObject("bookShelfItem",books);$scope.files=$scope.files.concat(files)}function doUpload(files){files&&files.length&&Upload.upload({url:configs.serverUrl+"/bookShelf/upload",data:{files:files}}).then(function(response){$timeout(function(){insertBookShelf(response.data)})},function(response){response.status>0&&($scope.errorMsg=response.status+": "+response.data)},function(evt){$scope.progress=Math.min(100,parseInt(100*evt.loaded/evt.total))})}var curUser=curUserService.getCurUser(),page=1;$scope.books=[],$scope.noMoreItemsAvailable=!1,$scope.isLogined=curUserService.getIsLogined(),$scope.files=[],$scope.viewBook=function(i){$scope.isLogined?fileTransferHelper.setter($scope.books[i].bookName):fileTransferHelper.setter($scope.files[i]),$state.go("login.bookshelf.view")};var loadFromLocalStorage=function(){if($scope.isLogined)loadByUid(curUser.uid);else{var locals=localStorage.getObject("bookshelfItems");for(var local in locals)$scope.books.push(local)}},loadByUid=function(uid){var param={page:page,pageSize:10};httpService.post("bookShelf/list/"+uid,param,function(){0==d.data.length?$scope.noMoreItemsAvailable=!0:(page++,$scope.books=$scope.books.concat(d.data),angular.forEach($scope.books,function(d){d.imgPath=config.imgPrefix+d.imgPath,d.filePath=config.filePrefix+d.filePath})),$scope.$broadcast("scroll.infiniteScrollComplete")})};$scope.loadFiles=function(files){if($scope.files=$scope.files.concat(files),$scope.isLogined)doUpload($scope.files);else{addToLocals(files);var books=localStorage.getObject("bookShelfItem");$scope.books=$scope.books.concat(books)}};var insertBookShelf=function(fileIds){var params=[];angular.forEach(fileIds,function(fileId){var bookShelf={booksId:fileId,uid:curUser.uid};params.push(bookShelf)}),httpService.put("bookShelf/createBatch",params,function(d){d.data==fileIds.length&&(Popup.alert("导入成功!"),loadBooksInfo(fileIds))})},loadBooksInfo=function(ids){httpService.post("books/listByArray",ids,function(d){$scope.books=$scope.books.concat(d.data)})};loadFromLocalStorage()}]);