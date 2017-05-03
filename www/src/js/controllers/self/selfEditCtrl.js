app.controller('selfEditCtrl',['$scope','Upload','httpService','$state','$stateParams','$filter','curUserService','Config',
  function($scope,Upload,httpService,$state,$stateParams,$filter,curUserService,configs) {
    $scope.userInfo = curUserService.getCurUser();
    //$scope.userInfo.birth = $filter('date')($scope.userInfo.birth,'yyyy-MM-dd HH:mm:ss');
    $scope.items=["男","女"];

    $scope.submitForm = function(){
      $scope.upload();

    }
    $scope.loadFile = function(file){
        $scope.file = file;
    }
    var loadUser = function(){
      var curUserReq =  httpService.post( 'user/'+ $stateParams.account);

      curUserReq.then(function (data) {
        if (data.data != '' && data.data.imgPath != undefined) {
          data.data.imgPath = configs.imgPrefix  + data.data.imgPath;
        }
        curUserService.setCurUser(data.data);
       // $state.go('app.self.index');
      },function(error){
        console.log("下载头像失败:"+error);
      });
    }
    $scope.upload = function (fn) {
      Upload.upload({
        url: configs.serverUrl+'/user/upload',
        data: {account:$scope.userInfo.userName},
        file: $scope.file,

      }).progress(function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log( 'progress: ' + progressPercentage + '% ' +
           evt.config.file.name);

      }).error(function (data, status, headers, config) {
          console.log("上传失败");
      }).success(function (data, status, headers, config) {

        $scope.userInfo.imgPath = data;
        httpService.post('user/update',$scope.userInfo).success(function(d){
          loadUser();
          console.log(d);
        })
        console.log('文件'+config.file.name+'上传成功');
      });
    }
  }]);
