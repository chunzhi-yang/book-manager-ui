app.controller('selfEditCtrl',['$scope','Upload','httpService','$state','$stateParams','ionicDatePicker','$rootScope','Config',
  function($scope,Upload,httpService,$state,$stateParams,ionicDatePicker,$rootScope,configs) {
    $scope.userInfo = $rootScope.curUser;
    $scope.userInfo.birthTxt = moment( $scope.userInfo.birth).format('YYYY-MM-DD');
    $scope.items=["男","女"];
    console.log( $scope.userInfo);
    $scope.submitForm = function(){
      $scope.upload();

    }

    $scope.openDatePicker = function() {
      var dlg = {
        callback: function (val) {  //Mandatory
          if (!val) {
            console.log('Date not selected');
          } else {
            $scope.userInfo.birthTxt  = moment(val).format('YYYY-MM-DD');
            $scope.userInfo.birth  = val;
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
      httpService.post( 'user/'+ $stateParams.account)
      .success(function (data) {
        if(!data.imgPath) {
          data.imgPath = data.sex ==0?'img/thumbnail-male.png':'img/thumbnail-female.png';
        }
        $rootScope.curUser = data;
        $state.go('app.self.index');
      });
    }
    $scope.upload = function () {
      if(!$scope.file){
        var param = $scope.userInfo;
        delete param.imgPath;
        httpService.put('user/update',param).success(function(d){
          loadUser();
        });
        return;
      }
      Upload.upload({
        url: configs.serverUrl+'user/upload',
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
        httpService.post('user/update',$scope.userInfo).success(function(d){
          loadUser();

        })
        console.log('文件'+config.file.name+'上传成功');
      });
    }
  }]).directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
});
