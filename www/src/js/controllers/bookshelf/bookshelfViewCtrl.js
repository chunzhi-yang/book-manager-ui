app.controller('bookshelfViewCtrl',['$window','$scope','httpService','$ionicModal','fileTransferHelper','curUserService','Config','Popup',
	function($window,$scope, httpService,$ionicModal,fileTransferHelper,curUserService,config,Popup) {
    $scope.fontSize = '12';
    $scope.chapter = 1;
    curUserService.test();
    var curUser = curUserService.getCurUser(),
      isLogined = true//curUserService.getIsLogined(),

      ,sliceIndex=1,

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
      a.readAsText(blob,'utf-8');
    }
    $scope.loadContent = function(){

          var filePath = fileTransferHelper.getter()+"_"+$scope.chapter;
          httpService.post('app/getOneChapter',{fileName:filePath}).success(function(d){
              $scope.textContent = $scope.textContent + d;
          });

    }
    $scope.loadMore = function(){
      if(sliceIndex == total){
        readFile(bookFile.slice((sliceIndex-1)*itemSize,(sliceIndex-1)*itemSize+lastLeft),function(result){
          $scope.textContent +=  result;
        });
        $scope.noMoreItemsAvailable = true;
      }else if(sliceIndex < total){
        readFile(bookFile.slice((sliceIndex-1)*itemSize,(sliceIndex-1)*itemSize+itemSize),function(result){
          $scope.textContent =  $scope.textContent + result;

        });
      }
      sliceIndex++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    var loadChapters = function(){
      httpService.post('booksWithChapters',{fileName:fileTransferHelper.getter()}).success(function(d){
          console.log(d);
      });
    }
    if($scope.isLogined){
      loadChapters();
      $scope.loadContent();
    }else{
      $scope.loadMore();
    }
}]);
