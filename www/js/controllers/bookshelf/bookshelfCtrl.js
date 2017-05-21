app.controller("bookshelfCtrl", ["$scope", "httpService", "curUserService", "localStorage", "Upload", "$timeout", "Popup", "fileTransferHelper", "$state", "Config", function ($scope, httpService, curUserService, localStorage, Upload, $timeout, Popup, fileTransferHelper, $state, configs) {
  function addToLocals(files) {
    for (var books = [], i = 0; i < files.length; i++)books.push({bookName: files[i].name}), localStorage.setObject("bookShelfItem", books), $scope.files.push(files[i])
  }

  function doUpload(files) {
    files && files.length && Upload.upload({
      url: configs.serverUrl + "/bookShelf/upload",
      headers: {
        "Access-Control-Allow-origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With"
      },
      data: {files: files, uid: "-1"}
    }).then(function (response) {
      $timeout(function () {
        insertBookShelf(response.data)
      })
    }, function (response) {
      response.status > 0 && ($scope.errorMsg = response.status + ": " + response.data)
    }, function (evt) {
      $scope.progress = Math.min(100, parseInt(100 * evt.loaded / evt.total))
    })
  }

  var curUser = curUserService.getCurUser(), page = 1;
  $scope.books = [], $scope.noMoreItemsAvailable = !1, $scope.files = [], $scope.viewBook = function (i, eve) {
    curUserService.getIsLogined() || (fileTransferHelper.setter($scope.files[i]), $state.go("login.bookshelf.view"))
  };
  var loadFromLocalStorage = function () {
    if (curUserService.getIsLogined()) loadByUid(curUser.uid); else {
      var locals = localStorage.getObject("bookshelfItems");
      for (var local in locals)$scope.books.push(local)
    }
  }, loadByUid = function (uid) {
    var param = {page: page, pageSize: 100};
    httpService.post("bookShelf/list/" + uid, param).success(function (data) {
      0 == data.total ? $scope.noMoreItemsAvailable = !0 : ($scope.books = [], angular.forEach(data.data, function (d) {
        httpService.post("books/" + d.booksId).success(function (book) {
          $scope.books.push(book)
        })
      })), $scope.$broadcast("scroll.infiniteScrollComplete")
    })
  };
  $scope.loadFiles = function (files) {
    if (console.log(curUserService.getIsLogined()), curUserService.getIsLogined()) doUpload(files); else {
      addToLocals(files);
      var books = localStorage.getObject("bookShelfItem");
      $scope.books = $scope.books.concat(books)
    }
  };
  var insertBookShelf = function (books) {
    var params = [];
    angular.forEach(books, function (book) {
      var bookShelf = {booksId: book.booksId, uid: curUser.uid};
      params.push(bookShelf)
    });
    var page = {data: params};
    httpService.put("bookShelf/createBatch", page).success(function (d) {
      d > 0 && (Popup.alert("导入成功!"), loadByUid(curUser.uid))
    })
  };
  loadFromLocalStorage()
}]);
