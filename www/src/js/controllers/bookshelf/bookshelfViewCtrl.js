app.controller('bookshelfViewCtrl',['$scope','httpService','$cordovaActionSheet','$cordovaFile','$stateParams',
	function($scope, httpService,$cordovaActionSheet,$cordovaFile,$stateParams) {



   	var options = {
    title: '你要做什么?',
    buttonLabels: ['目录', '设置','字体'],
    addCancelButtonWithLabel: '取消',
    androidEnableCancelButton: true,
    winphoneEnableCancelButton: true,
    addDestructiveButtonWithLabel: '删除这个'
  };
  $scope.getMenus=showActionSheet;
  var showActionSheet = function(){
  	$cordovaActionSheet.show(options)
	      .then(function(btnIndex) {
	        var index = btnIndex;
	      });

  }
  var readFile = function(){
  	 $cordovaFile.readAsText(cordova.file.externalRootDirectory, $stateParams.path)
      .then(function (d) {
        console.log(d);
        $scope.textContent = d;
      }, function (error) {
        // error
      });
  }
   	document.addEventListener("deviceready", function () {
   	   showActionSheet();
   	   readFile();
  }, false);

}]);
