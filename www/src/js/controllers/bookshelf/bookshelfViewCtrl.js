app.controller('bookshelfViewCtrl',['$window','$scope','httpService','ngDialog','fileTransferHelper',
  '$rootScope','Config','$stateParams',
	function($window,$scope, httpService,ngDialog,fileTransferHelper,$rootScope,config,$stateParams) {

    $scope.fontSize = '12';
    $scope.chapterIndex = 0;
    var colors = ['#11c1f3','#33cd5f','#ffc900','#444444','#f8f8f8'],
      sliceIndex=1;
    $scope.noMoreItemsAvailable = false;

    function getItemSize(){
      var height = $window.screen.height;
      var width = $window.screen.width;
      var pageTotal =  Math.floor(height*width/$scope.fontSize/8);
      pageTotal += (8-pageTotal%8);
      return pageTotal;
    }

    $scope.operateModal = function(){
      var dlg = ngDialog.open({
        template: 'operateMenu.html',
        scope:$scope,
        className: 'ngdialog-theme-default',
        height: 300,
        controller: function(){
          $scope.readProcess = $scope.chapterIndex/$scope.chapterLength*100;
          $scope.next = function(){
            if($scope.readProcess < 0){
              $scope.readProcess = 0;
              return;
            }
            var chapterIndex = Math.ceil($scope.readProcess*$scope.chapterLength/100+1);
             dlg.close(chapterIndex);

          }
          $scope.pre = function(){
            if($scope.readProcess < 0){
              $scope.readProcess = 0;
              return;
            }
            var chapterIndex = Math.ceil($scope.readProcess/100*$scope.chapterLength-1);
            dlg.close(chapterIndex);
          }
          $scope.openChapters = function(){
            openSideModal();
          }
          $scope.changeStyle = function(i){
            $scope.backdrop = colors[i];
          }
          $scope.larger = function(){
            if($scope.fontSize > 30){
              return;
            }
            $scope.fontSize ++;
          }
          $scope.smaller = function(){
            if($scope.fontSize < 12){
              return;
            }
            $scope.fontSize --;
          }

          $scope.changeProcess = function(i){
            var chapterIndex = i*$scope.chapterLength/100;
            dlg.close(Math.ceil(chapterIndex));
          }
        }
      });
      dlg.closePromise.then(function(r){
        if(r.value != '$document'){
           $scope.chapterIndex = r.value;
           $scope.readProcess = Math.floor($scope.chapterIndex/$scope.chapterLength*100);
           $scope.loadContent();
        }

      });
    }
    var openSideModal = function(){
      var dlg = ngDialog.open({
        template: 'chapterPage.html',
        scope:$scope,
        className: 'ngdialog-theme-default',
        height: '100%',
        controller: function(){
          $scope.changeProcess = function(i){
            dlg.close(Math.ceil(i));
          }
          dlg.closePromise.then(function(r){
            if(r.value != '$document'){
              $scope.chapterIndex = r.value;
              $scope.readProcess = $scope.chapterIndex/$scope.chapterLength*100;
              $scope.loadContent();
            }
          });
        }
      });
    }
    function readFile(blob, callback) {
      var a = new FileReader();
      a.onload = function(e) {callback(e.target.result);};
      a.readAsText(blob,'utf-8');
    }

    $scope.loadContent = function(){
        if($scope.chapterLength <= $scope.chapterIndex || $scope.chapterIndex < 0){
          return;
        }
          var fileName = $stateParams.fileName;
          var filePath =fileName.substring(0,fileName.lastIndexOf("."))+ "_"+$scope.chapterIndex+fileName.substring(fileName.lastIndexOf("."));
          httpService.post('app/getOneChapter',{fileName:filePath}).success(function(d){
              $scope.textContent = d;
          });
      $scope.loading = false;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    $scope.loadContentMore = function(){
      if($scope.chapterIndex >= $scope.chapterLength){
        $scope.noMoreItemsAvailable = true;
        return;
      }
      $scope.chapterIndex++;
      $scope.loadContent();
    }
    $scope.loadMore = function(){
      if(sliceIndex == $scope.total){
        readFile($scope.bookFile.slice((sliceIndex-1)* $scope.itemSize,(sliceIndex-1)* $scope.itemSize+ $scope.lastLeft),function(result){
          $scope.textContent +=  result;
        });
        $scope.noMoreItemsAvailable = true;
      }else if(sliceIndex <  $scope.total){
        readFile($scope.bookFile.slice((sliceIndex-1)* $scope.itemSize,(sliceIndex-1)* $scope.itemSize+ $scope.itemSize),function(result){
          $scope.textContent =  $scope.textContent + result;

        });
      }
      sliceIndex++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    var loadChapters = function(){
      $scope.loading = true;
      httpService.post('app/bookWithChapters',{fileName:$stateParams.fileName}).success(function(d){
        $scope.chapterLength = d.length;
        $scope.chapterList = d;
        angular.forEach($scope.chapterList,function(eve){
          eve.chapterName = eve.chapterName.trim();
        });
        $scope.loadContent();
      });
    }


    $scope.doRefresh = function() {
      if($scope.chapterIndex == 0){
        $scope.noMoreItemsAvailable = true;
        $scope.$broadcast('scroll.refreshComplete');
        return;
      }
      $scope.chapterIndex --;
      $scope.loadContent();
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.initCtrl = function(){
      $scope.textContent = '';
      if($rootScope.isLogined){
        loadChapters();
      }else{
        $scope.bookFile = fileTransferHelper.getter();
        $scope.itemSize = getItemSize(),
          $scope.total = Math.ceil($scope.bookFile.size/ $scope.itemSize),
          $scope.lastLeft =  $scope.bookFile.size% $scope.itemSize;
        $scope.loadMore();
      }
    }
    $scope.initCtrl();
}]);

