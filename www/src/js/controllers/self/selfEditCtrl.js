app.controller('selfEditCtrl',['$scope','Upload','httpService','$state','$stateParams','ionicDatePicker','curUserService','Config',
  function($scope,Upload,httpService,$state,$stateParams,ionicDatePicker,curUserService,configs) {
    $scope.userInfo = curUserService.getCurUser();
    $scope.userInfo.birth = moment( $scope.userInfo.birth).format('YYYY-MM-DD');
    $scope.items=["男","女"];

    $scope.submitForm = function(){
      $scope.upload();

    }

    $scope.openDatePicker = function() {
      var dlg = {
        callback: function (val) {  //Mandatory
          if (!val) {
            console.log('Date not selected');
          } else {
            $scope.userInfo.birth = moment(val).format('YYYY-MM-DD');
          }
        },
        disabledDates: [
          new Date(1437719836326),
          new Date(2016, 1, 25),
          new Date(2015, 7, 10),
          new Date('Wednesday, August 12, 2015'),
          new Date("08-14-2015"),
          new Date(1439676000000),
          new Date(1456511400000)
        ],
        from: new Date(1970, 1, 1),
        to: new Date(),
        dateFormat: 'yyyy-MM-dd',
        inputDate: new Date(),
        mondayFirst: true,
        showTodayButton: false,
        closeOnSelect: false,
        templateType: 'popup'
      }
      ionicDatePicker.openDatePicker(dlg);
    }




    $scope.loadFile = function(file){
        $scope.file = file;
    }
    var loadUser = function(){
      var curUserReq =  httpService.post( 'user/'+ $stateParams.account);

      curUserReq.then(function (data) {
        curUserService.setCurUser(data.data);
       $state.go('app.self.index');
      },function(error){
        console.log("下载头像失败:"+error);
      });
    }
    $scope.upload = function () {
      if(!$scope.file){
        httpService.put('user/update',$scope.userInfo).success(function(d){
          loadUser();
        });
        return;
      }
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

        $scope.userInfo.imgPath = configs.imgPrefix +data;
        httpService.put('user/update',$scope.userInfo).success(function(d){
          loadUser();

        })
        console.log('文件'+config.file.name+'上传成功');
      });
    }
  }]);
