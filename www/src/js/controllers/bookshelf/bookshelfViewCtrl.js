app.controller('bookshelfViewCtrl',['$scope','httpService','$ionicModal','fileTransferHelper','curUserService','Config',
	function($scope, httpService,$ionicModal,fileTransferHelper,curUserService,config) {
    var curUser = curUserService.getCurUser();
    var isLogined = curUserService.getIsLogined();





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
      a.readAsText(blob);
    }
    var loadInfo = function(){
       if(isLogined){
          $scope.filePath = config.filePrefix + fileTransferHelper.getter();
       } else{
          readFile(fileTransferHelper.getter(),function(result){
            $scope.textContent = result;
          });
       }
    }
    loadInfo();

}]);
