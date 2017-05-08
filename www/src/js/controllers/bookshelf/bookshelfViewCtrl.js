app.controller('bookshelfViewCtrl',['$window','$scope','httpService','$ionicModal','fileTransferHelper','curUserService','Config',
	function($window,$scope, httpService,$ionicModal,fileTransferHelper,curUserService,config) {
    $scope.fontSize = '12';

    var curUser = curUserService.getCurUser(),
      isLogined = curUserService.getIsLogined(),

      sliceIndex=1,
      bookFile = fileTransferHelper.getter(),
      itemSize = getItemSize(),
      total = Math.ceil(bookFile.size/itemSize),
      lastLeft =  bookFile.size%itemSize;

    $scope.noMoreItemsAvailable = false;

    $scope.larger = function(){
       $scope.fontSize ++;
    }
    $scope.smaller = function(){
      $scope.fontSize --;
    }
    function getItemSize(){
      var height = $window.screen.height;
      var width = $window.screen.width;
      var pageTotal =  Math.floor(height*width/$scope.fontSize/8);
      pageTotal += (8-pageTotal%8);

      console.log(pageTotal);
      return pageTotal;
    }
    $scope.modal = $ionicModal.fromTemplateUrl('operateMenu.html', {
      scope: $scope,

    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.sideModal = $ionicModal.fromTemplateUrl('chapterPage.html', {
      scope: $scope,

    }).then(function(modal) {
      $scope.sideModal = modal;
    });



    function readFile(blob, callback) {
      var a = new FileReader();
      a.onload = function(e) {callback(e.target.result);};
      a.readAsText(blob,'UTF-8');
    }
    var loadInfo = function(){
       if(isLogined){
          $scope.filePath = config.filePrefix + fileTransferHelper.getter();

       } else{
         $scope.loadMore();
       }
    }
    $scope.loadMore = function(){
      console.log(sliceIndex);
      if(sliceIndex == total){
        readFile(bookFile.slice((sliceIndex-1)*itemSize,(sliceIndex-1)*itemSize+lastLeft),function(result){
          $scope.textContent +=  result.toString();
        });
        $scope.noMoreItemsAvailable = true;
      }else if(sliceIndex < total){
        readFile(bookFile.slice((sliceIndex-1)*itemSize,(sliceIndex-1)*itemSize+itemSize),function(result){
          $scope.textContent =  $scope.textContent + result.toString();

        });
      }
      sliceIndex++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    loadInfo();
}]);
