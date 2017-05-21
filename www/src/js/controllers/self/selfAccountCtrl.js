app.controller('selfAccountCtrl', ['$scope','httpService','$rootScope','Config','ngDialog','Popup','$stateParams',
  function($scope, httpService,$rootScope,config,ngDialog,Popup,$stateParams) {

    $scope.user = $rootScope.curUser; 
      $scope.loadAccount = function(){
         if($stateParams.uid){
             $scope.loadLogs();
          }else{
            httpService.post('userAccount/'+$scope.user.uid).success(function(d){
                $scope.account = d;
            });
          }
      }
    $scope.openModal = function() {
      var dlg = ngDialog.open({
        template: 'charge.html',
        className: 'ngdialog-theme-default',
        height: 400,
        scope:$scope,
        controller: function() {
          $scope.changeAmount = function(d){
            $scope.amount = d;
          }
          $scope.doSubmit = function () {
           var remain = parseFloat($scope.account.remain) + parseFloat($scope.amount);
            var param = {bmUserAccountId:$scope.account.bmUserAccountId,remain:remain};
            httpService.put('userAccount/update', param).success(function (d) {
              dlg.close(d);
            });
          }
        }
      });
      dlg.closePromise.then(function(r){
        if(r.value > 0){

          Popup.alert("充值成功!",function(){
            $scope.loadAccount();
          });
        }
      });
    }
  $scope.doRefresh = function(){

    if($stateParams.uid){
      $scope.loadLogs();
    }else{
      $scope.loadAccount();
    }
    $scope.$broadcast('scroll.refreshComplete');
  }
    $scope.loadLogs= function(){
        httpService.post('accountLog/list/'+$stateParams.uid).success(function(d){
           $scope.logs = d.data;
          console.log($scope.logs);
        });
    }

   $scope.loadAccount();
}]);
